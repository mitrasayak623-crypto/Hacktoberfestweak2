import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Copy, Check, Globe, ExternalLink } from 'lucide-react';
import { ReceiptRecord } from '../types/ledger';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  modelUsed?: string;
  timestamp: string;
  sources?: { title: string; uri: string }[];
  searchGrounded?: boolean;
}

interface GeminiChatbotProps {
  receipts: ReceiptRecord[];
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({ receipts, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: `Hello! I am your **VaultLedger AI CPA & Tax Strategist**, enhanced with **Google Search Grounding**.
I have live access to current IRS tax rulings, standard mileage rates, Schedule C deduction ceilings, and your active ledger of ${receipts.length} receipts. Ask me anything!`,
      modelUsed: 'gemini-3.8-flash',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-4-argon'>('gemini-3.8-flash');
  const [selectedRole, setSelectedRole] = useState<'cpa' | 'tax_audit' | 'pricing'>('cpa');
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const buildLedgerSummary = () => {
    const totalGross = receipts.reduce((sum, r) => sum + r.amount, 0);
    const totalDeductible = receipts.reduce((sum, r) => sum + (r.amount * r.deductiblePercentage) / 100, 0);
    const itemsPreview = receipts
      .map(
        (r) =>
          `- ${r.date} | ${r.vendor} | $${r.amount} (${r.category}) | Deductible: ${r.deductiblePercentage}% | Client: ${r.clientProject} | Billable: ${r.isBillableToClient}`
      )
      .join('\n');

    return `Total Receipts: ${receipts.length}\nGross Spend: $${totalGross.toFixed(2)}\nDeductible Basis: $${totalDeductible.toFixed(2)}\n\nItems Roster:\n${itemsPreview}`;
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history,
          model: selectedModel,
          role: selectedRole,
          ledgerContext: buildLedgerSummary(),
          useSearchGrounding,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: data.reply,
          modelUsed: data.modelUsed || selectedModel,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: data.sources || [],
          searchGrounded: data.searchGrounded,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const errorMsg: Message = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: `⚠️ **API Notice:** ${data.error || 'Failed to connect to Gemini API'}. If running locally, check that GEMINI_API_KEY is available in your secrets panel.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: `⚠️ Network error: ${err.message}. Please check your connection.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#070D1A] border border-blue-500/30 rounded-2xl max-w-3xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-yellow-400/20">
        {/* Header with Role & Model Selection */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-500/20 bg-[#0A1326]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-yellow-400 text-black shadow-md shadow-yellow-400/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-display">Gemini Financial Strategist</h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {selectedModel}
                </span>
                {useSearchGrounding && (
                  <span className="text-[10px] font-mono flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-400/15 text-yellow-300 border border-yellow-400/30">
                    <Globe className="w-3 h-3" />
                    Google Search Grounded
                  </span>
                )}
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">
                Multi-Turn Reasoning · Direct Ledger & Web Awareness
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as any)}
              className="bg-black/70 border border-blue-500/30 rounded-lg px-2.5 py-1 text-xs text-yellow-300 font-mono focus:outline-none focus:border-yellow-400"
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash (Search Grounded)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast)</option>
              <option value="gemini-4-argon">gemini-4-argon (Complex)</option>
            </select>

            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Role & Grounding Selector Strip */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-[#050A14] border-b border-blue-900/30 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Advisor Persona:</span>
            <button
              onClick={() => setSelectedRole('cpa')}
              className={`px-3 py-1 rounded-lg transition-colors text-xs ${
                selectedRole === 'cpa'
                  ? 'bg-yellow-400 text-black font-bold'
                  : 'text-neutral-300 hover:text-white bg-blue-950/40 border border-blue-900/40'
              }`}
            >
              Senior CPA & Schedule C
            </button>
            <button
              onClick={() => setSelectedRole('tax_audit')}
              className={`px-3 py-1 rounded-lg transition-colors text-xs ${
                selectedRole === 'tax_audit'
                  ? 'bg-yellow-400 text-black font-bold'
                  : 'text-neutral-300 hover:text-white bg-blue-950/40 border border-blue-900/40'
              }`}
            >
              IRS Audit Inspector
            </button>
            <button
              onClick={() => setSelectedRole('pricing')}
              className={`px-3 py-1 rounded-lg transition-colors text-xs ${
                selectedRole === 'pricing'
                  ? 'bg-yellow-400 text-black font-bold'
                  : 'text-neutral-300 hover:text-white bg-blue-950/40 border border-blue-900/40'
              }`}
            >
              Client Billing Strategist
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="groundingToggle"
              checked={useSearchGrounding}
              onChange={(e) => setUseSearchGrounding(e.target.checked)}
              className="rounded border-blue-500 text-yellow-400 focus:ring-0"
            />
            <label htmlFor="groundingToggle" className="text-neutral-300 text-[11px] cursor-pointer flex items-center gap-1">
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>Search Grounding</span>
            </label>
          </div>
        </div>

        {/* Scrollable Message Thread */}
        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-yellow-400" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 relative group shadow-md ${
                  m.role === 'user'
                    ? 'bg-yellow-400 text-black font-semibold'
                    : 'bg-[#0E1A33] border border-blue-500/25 text-neutral-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                {/* Google Search Grounding Sources */}
                {m.sources && m.sources.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-blue-800/40 space-y-1">
                    <div className="text-[10px] font-mono text-cyan-300 flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      <span>Google Search Grounded Citations:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {m.sources.slice(0, 3).map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/30 text-[10px] text-blue-200 hover:text-yellow-300 transition-colors truncate max-w-[240px]"
                        >
                          <span className="truncate">{src.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`flex items-center justify-between text-[10px] font-mono pt-1 ${
                    m.role === 'user' ? 'text-black/60' : 'text-neutral-500'
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {m.modelUsed && <span>Model: {m.modelUsed}</span>}
                </div>

                {m.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(m.id, m.text)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-yellow-400 transition-opacity"
                    title="Copy response"
                  >
                    {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-yellow-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0 mt-0.5 text-white">
                  <User className="w-4 h-4 text-neutral-300" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3.5 items-center">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="bg-[#0E1A33] border border-blue-500/30 rounded-2xl p-3 px-4 flex items-center gap-2 text-xs text-neutral-300 font-mono">
                <div className="w-3.5 h-3.5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                <span>Gemini is synthesizing tax guidelines with Google Search...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompt Shortcuts */}
        <div className="px-6 py-2 bg-[#050A14] border-t border-blue-900/30 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-neutral-500 shrink-0">Live Queries:</span>
          <button
            onClick={() => handleSend('What are the latest 2026 IRS standard business mileage rates and Schedule C travel rules?')}
            className="px-2.5 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900/50 border border-blue-800/40 text-blue-200 whitespace-nowrap"
          >
            🚗 2026 Mileage Rates
          </button>
          <button
            onClick={() => handleSend('What is the current Section 179 equipment expense deduction limit for tech hardware in 2026?')}
            className="px-2.5 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900/50 border border-blue-800/40 text-blue-200 whitespace-nowrap"
          >
            💻 Section 179 Limits
          </button>
          <button
            onClick={() => handleSend('Check my loaded receipts for 50% meal limitations and summarize billable client expenses.')}
            className="px-2.5 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900/50 border border-blue-800/40 text-blue-200 whitespace-nowrap"
          >
            📊 Audit Loaded Receipts
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#0A1326] border-t border-blue-500/20 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about IRS deductions, 1099 rules, or search recent tax limits..."
            className="flex-1 bg-black/70 border border-blue-500/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 text-black font-bold rounded-xl transition-colors shadow-md shadow-yellow-400/20 cursor-pointer"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
