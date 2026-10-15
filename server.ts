import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '15mb' }));

// Server-side Google GenAI initialization
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Multi-turn Gemini Chat Endpoint with Google Search Grounding
app.post('/api/chat', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is available in server environment.',
      });
    }

    const {
      message,
      history = [],
      model = 'gemini-3.8-flash',
      role = 'cpa',
      ledgerContext = '',
      useSearchGrounding = true,
    } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let systemInstruction = `You are VaultLedger AI's Chief Financial Advisor and Certified Public Accountant (CPA).
You provide ultra-accurate, up-to-date IRS Schedule C deduction advice, freelance tax strategies, invoice auditing tips, and client billing guidelines.
When appropriate, use the Google Search tool to look up current tax year IRS limits, standard mileage rates, Section 179 phaseouts, or local state tax laws.
Format your responses with clean typography, bullet points, and authoritative clarity.`;

    if (role === 'tax_audit') {
      systemInstruction = `You are a forensic freelance tax auditor.
You scrutinize receipts, verify IRC §274 50% meal limitations, verify Section 179 equipment deductions, check 1099-NEC thresholds, and cite current tax rulings.`;
    } else if (role === 'pricing') {
      systemInstruction = `You are an elite freelance pricing and client billing strategist.
You advise independent contractors on billable pass-through disbursements, client expense reimbursement agreements, and contract terms.`;
    }

    if (ledgerContext) {
      systemInstruction += `\n\nActive Freelance Ledger Context:\n${ledgerContext}`;
    }

    // Map history to GenAI contents format
    const contents: any[] = [];
    for (const item of history) {
      if (item.text) {
        contents.push({
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: item.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    let selectedModel = model;
    if (!['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-4-argon'].includes(selectedModel)) {
      selectedModel = 'gemini-3.8-flash';
    }

    // Configure tools: Google Search Grounding enabled for gemini-3.8-flash
    const config: any = {
      systemInstruction,
      temperature: 0.3,
    };

    if (useSearchGrounding && selectedModel === 'gemini-3.8-flash') {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config,
    });

    const reply = response.text || 'I analyzed your query but have no further details.';

    // Extract Google Search grounding metadata & citations
    const searchChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = searchChunks
      .filter((c: any) => c.web?.uri && c.web?.title)
      .map((c: any) => ({
        title: c.web.title,
        uri: c.web.uri,
      }));

    res.json({
      reply,
      modelUsed: selectedModel,
      sources: webSources,
      searchGrounded: webSources.length > 0,
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to process chat query with Gemini',
    });
  }
});

// 2. Real-Time Voice Conversation Endpoint (Unary TTS + Audio Synthesis)
app.post('/api/voice-query', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key is not configured' });
    }

    const { query, voice = 'Zephyr', ledgerContext = '' } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query text is required' });
    }

    const answerResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `User asked via Voice: "${query}".
Active Ledger Info: ${ledgerContext || 'No receipts currently loaded'}.
Answer in 1 to 2 spoken sentences maximum as VaultLedger Voice Advisor. Be conversational, natural, crisp, and authoritative.`,
    });

    const spokenText = answerResponse.text?.trim() || 'Your expense records are verified and secure.';

    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: spokenText,
              speechMetadata: {
                style: 'Clear, modern, professional financial advisor',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice as any },
          },
        },
      },
    });

    const audioBase64 = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    res.json({
      transcript: spokenText,
      audioBase64: audioBase64 || null,
      audioUrl: audioBase64 ? `data:audio/wav;base64,${audioBase64}` : null,
    });
  } catch (err: any) {
    console.error('Voice query error:', err);
    res.status(500).json({ error: err?.message || 'Voice synthesis error' });
  }
});

// 3. Real-Time Gemini Live API WebSocket Bridge (`gemini-3.8-live`)
const wss = new WebSocketServer({ server, path: '/api/live-ws' });

wss.on('connection', async (clientWs: WebSocket) => {
  if (!ai) {
    clientWs.send(
      JSON.stringify({
        error: 'Gemini API is not configured on the server. Live API requires GEMINI_API_KEY.',
      })
    );
    clientWs.close();
    return;
  }

  let liveSession: any = null;

  try {
    liveSession = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        systemInstruction:
          'You are VaultLedger Voice, an ultra-fast real-time voice financial assistant for freelancers. Speak in concise, natural, friendly sentences.',
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ audio }));
          }
          if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
      },
    });

    clientWs.on('message', (data: any) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio && liveSession) {
          liveSession.sendRealtimeInput({
            audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        }
      } catch (e) {
        console.error('Error sending audio to Gemini Live:', e);
      }
    });

    clientWs.on('close', () => {
      if (liveSession) {
        try {
          liveSession.close();
        } catch {
          // ignore
        }
      }
    });
  } catch (err: any) {
    console.error('Live connect error:', err);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({ error: err?.message || 'Failed to connect to Gemini Live' }));
      clientWs.close();
    }
  }
});

// Setup Vite in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(port, '0.0.0.0', () => {
    console.log(`VaultLedger Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
