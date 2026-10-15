import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, X, Shield, Radio, Play, Pause } from 'lucide-react';
import { ReceiptRecord } from '../types/ledger';

interface GeminiVoiceConversationProps {
  receipts: ReceiptRecord[];
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiVoiceConversation: React.FC<GeminiVoiceConversationProps> = ({
  receipts,
  isOpen,
  onClose,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<'Zephyr' | 'Kore' | 'Puck' | 'Fenrir'>('Zephyr');
  const [transcriptHistory, setTranscriptHistory] = useState<
    { sender: 'user' | 'gemini'; text: string; audioUrl?: string }[]
  >([
    {
      sender: 'gemini',
      text: "I'm listening. Ask me about your business deductions, client expenses, or Schedule C tax breakdown in real time.",
    },
  ]);

  const [simulatedQuery, setSimulatedQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

  const buildLedgerContext = () => {
    const total = receipts.reduce((sum, r) => sum + r.amount, 0);
    const deductible = receipts.reduce((sum, r) => sum + (r.amount * r.deductiblePercentage) / 100, 0);
    return `Active Ledger: ${receipts.length} receipts, $${total.toFixed(2)} total spend, $${deductible.toFixed(2)} deductible. Clients: Acme Corp, Fintech Mobile App.`;
  };

  const handleSendVoiceQuery = async (queryText: string) => {
    if (!queryText.trim() || isProcessing) return;

    setIsProcessing(true);
    setTranscriptHistory((prev) => [...prev, { sender: 'user', text: queryText }]);

    try {
      const res = await fetch('/api/voice-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          voice: selectedVoice,
          ledgerContext: buildLedgerContext(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setTranscriptHistory((prev) => [
          ...prev,
          {
            sender: 'gemini',
            text: data.transcript,
            audioUrl: data.audioUrl,
          },
        ]);

        if (data.audioUrl) {
          if (currentAudioRef.current) {
            currentAudioRef.current.pause();
          }
          const audio = new Audio(data.audioUrl);
          currentAudioRef.current = audio;
          setIsSpeaking(true);
          audio.onended = () => setIsSpeaking(false);
          audio.onerror = () => setIsSpeaking(false);
          audio.play();
        }
      } else {
        setTranscriptHistory((prev) => [
          ...prev,
          {
            sender: 'gemini',
            text: `⚠️ Voice API Notice: ${data.error || 'Could not synthesize voice response'}.`,
          },
        ]);
      }
    } catch (err: any) {
      setTranscriptHistory((prev) => [
        ...prev,
        {
          sender: 'gemini',
          text: `⚠️ Network error: ${err.message}`,
        },
      ]);
    } finally {
      setIsProcessing(false);
      setSimulatedQuery('');
    }
  };

  const handleStartMic = () => {
    // Check speech recognition or prompt
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      setIsRecording(true);

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setIsRecording(false);
        handleSendVoiceQuery(text);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } else {
      // Fallback
      handleSendVoiceQuery('Summarize my highest business tax deductions for this quarter');
    }
  };

  const stopAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0A0A0A] border border-yellow-500/30 rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-yellow-500/20 bg-[#121212]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-400 text-black animate-pulse">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-display">Gemini 3.8 Live Voice Advisor</h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
                  gemini-3.8-live
                </span>
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">
                Real-Time Audio Streaming · Voice Synthesis
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value as any)}
              className="bg-black border border-yellow-500/30 rounded-lg px-2.5 py-1 text-xs text-yellow-300 font-mono focus:outline-none"
            >
              <option value="Zephyr">Voice: Zephyr (Modern)</option>
              <option value="Kore">Voice: Kore (Natural)</option>
              <option value="Puck">Voice: Puck (Dynamic)</option>
              <option value="Fenrir">Voice: Fenrir (Deep)</option>
            </select>

            <button
              onClick={() => {
                stopAudio();
                onClose();
              }}
              className="text-neutral-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visualizer & Mic Area */}
        <div className="p-8 flex flex-col items-center justify-center bg-gradient-to-b from-[#121212] to-[#0A0A0A] border-b border-neutral-800 space-y-6">
          {/* Animated Waveform */}
          <div className="flex items-center justify-center gap-1.5 h-16">
            {[40, 75, 95, 60, 85, 30, 90, 65, 45, 80, 55, 90, 40].map((height, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-150 ${
                  isSpeaking
                    ? 'bg-yellow-400 shadow-[0_0_10px_#facc15]'
                    : isRecording
                    ? 'bg-red-500 shadow-[0_0_10px_#ef4444]'
                    : 'bg-neutral-800'
                }`}
                style={{
                  height: isSpeaking || isRecording ? `${Math.max(12, (height * (Math.sin(Date.now() / 200 + i) + 1.2)) / 2)}px` : '12px',
                }}
              />
            ))}
          </div>

          {/* Big Mic Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleStartMic}
              disabled={isProcessing}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${
                isRecording
                  ? 'bg-red-500 text-white ring-4 ring-red-500/30 animate-pulse'
                  : 'bg-yellow-400 hover:bg-yellow-300 text-black ring-4 ring-yellow-400/20'
              }`}
            >
              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
          </div>

          <div className="text-center">
            <div className="text-sm font-semibold text-white">
              {isRecording
                ? 'Listening to your voice...'
                : isSpeaking
                ? 'Gemini Live Speaking...'
                : isProcessing
                ? 'Synthesizing voice response...'
                : 'Tap to speak with Gemini Live'}
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              Natural bidirectional voice conversation powered by gemini-3.8-live
            </div>
          </div>
        </div>

        {/* Spoken Query Presets */}
        <div className="px-6 py-3 bg-[#080808] border-b border-neutral-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-neutral-500 shrink-0">Sample Voice Prompts:</span>
          <button
            onClick={() => handleSendVoiceQuery('What is my total Schedule C deduction for this year?')}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 whitespace-nowrap"
          >
            "What is my Schedule C deduction?"
          </button>
          <button
            onClick={() => handleSendVoiceQuery('Did you detect any duplicate receipts or audit risks?')}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 whitespace-nowrap"
          >
            "Any audit risks or duplicate receipts?"
          </button>
          <button
            onClick={() => handleSendVoiceQuery('How much money can I bill Acme Corp for reimbursement?')}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 whitespace-nowrap"
          >
            "How much can I invoice Acme Corp?"
          </button>
        </div>

        {/* Spoken Transcript Thread */}
        <div className="p-6 max-h-56 overflow-y-auto space-y-3 text-xs">
          {transcriptHistory.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl ${
                item.sender === 'user'
                  ? 'bg-neutral-900 border border-neutral-800 text-neutral-200 ml-8'
                  : 'bg-yellow-400/10 border border-yellow-500/20 text-yellow-200 mr-8'
              }`}
            >
              <div className="font-semibold text-[11px] mb-1 font-mono uppercase text-neutral-400">
                {item.sender === 'user' ? 'You' : 'Gemini Live'}
              </div>
              <div>{item.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
