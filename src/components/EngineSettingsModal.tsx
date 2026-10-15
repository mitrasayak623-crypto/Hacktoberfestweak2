import React, { useState } from 'react';
import { OpenAiEngineConfig } from '../types/ledger';
import { testOllamaConnection } from '../services/openAiEngine';
import { ShieldCheck, Cpu, RefreshCw, X, Check, Terminal } from 'lucide-react';

interface EngineSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: OpenAiEngineConfig;
  onSaveConfig: (cfg: OpenAiEngineConfig) => void;
}

export const EngineSettingsModal: React.FC<EngineSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  if (!isOpen) return null;

  const [localConfig, setLocalConfig] = useState<OpenAiEngineConfig>({ ...config });
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean;
    models: string[];
    message: string;
  } | null>(null);

  const handleTestOllama = async () => {
    setTestingConnection(true);
    setConnectionStatus(null);
    try {
      const res = await testOllamaConnection(localConfig.ollamaUrl);
      setConnectionStatus(res);
      if (res.connected && res.models.length > 0 && !res.models.includes(localConfig.ollamaModel)) {
        setLocalConfig({ ...localConfig, ollamaModel: res.models[0] });
      }
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSave = () => {
    onSaveConfig(localConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0A0A0A] border border-yellow-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-yellow-500/20 bg-[#121212]">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-yellow-400" />
            <h2 className="text-base font-bold text-white font-display">Open AI Engine Configuration</h2>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Backend Selection */}
          <div>
            <label className="text-neutral-300 font-bold mb-2 block">
              Active Inference Architecture:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setLocalConfig({ ...localConfig, backend: 'browser_wasm' })}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  localConfig.backend === 'browser_wasm'
                    ? 'border-yellow-400 bg-yellow-400/10 text-white shadow-[0_0_15px_rgba(250,204,21,0.15)]'
                    : 'border-neutral-800 bg-[#0F0F0F] text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="font-bold text-yellow-300">In-Browser WASM</div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  SmolLM2-1.7B / Gemma 2B via WebGPU. Zero setup.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLocalConfig({ ...localConfig, backend: 'ollama_local' })}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  localConfig.backend === 'ollama_local'
                    ? 'border-yellow-400 bg-yellow-400/10 text-white shadow-[0_0_15px_rgba(250,204,21,0.15)]'
                    : 'border-neutral-800 bg-[#0F0F0F] text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="font-bold text-yellow-300">Ollama Local Bridge</div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  Connect to local daemon (Llama-3.2, Qwen-2.5, DeepSeek).
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLocalConfig({ ...localConfig, backend: 'edge_rule_harness' })}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  localConfig.backend === 'edge_rule_harness'
                    ? 'border-yellow-400 bg-yellow-400/10 text-white shadow-[0_0_15px_rgba(250,204,21,0.15)]'
                    : 'border-neutral-800 bg-[#0F0F0F] text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="font-bold text-yellow-300">Edge Rule Grammar</div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  Deterministic instant parser with zero battery drain.
                </div>
              </button>
            </div>
          </div>

          {/* Ollama Config Details */}
          {localConfig.backend === 'ollama_local' && (
            <div className="p-4 bg-black border border-neutral-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-200">Local Daemon REST Parameters</span>
                <button
                  type="button"
                  onClick={handleTestOllama}
                  disabled={testingConnection}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-yellow-400 border border-yellow-500/40 rounded-lg hover:bg-yellow-500/10 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${testingConnection ? 'animate-spin' : ''}`} />
                  <span>Test Local Connection</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 text-[11px]">Daemon URL</label>
                  <input
                    type="text"
                    value={localConfig.ollamaUrl}
                    onChange={(e) => setLocalConfig({ ...localConfig, ollamaUrl: e.target.value })}
                    className="w-full bg-[#121212] border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white font-mono mt-1 focus:border-yellow-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 text-[11px]">Model Identifier</label>
                  <input
                    type="text"
                    value={localConfig.ollamaModel}
                    onChange={(e) =>
                      setLocalConfig({ ...localConfig, ollamaModel: e.target.value })
                    }
                    placeholder="e.g. llama3.2:3b, qwen2.5:3b"
                    className="w-full bg-[#121212] border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white font-mono mt-1 focus:border-yellow-400 focus:outline-none"
                  />
                </div>
              </div>

              {connectionStatus && (
                <div
                  className={`p-3 rounded-lg border text-[11px] ${
                    connectionStatus.connected
                      ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300'
                      : 'bg-amber-950/30 border-amber-800 text-amber-300'
                  }`}
                >
                  {connectionStatus.message}
                </div>
              )}

              <div className="p-3 bg-[#121212] rounded-xl border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
                <div className="flex items-center gap-1 text-neutral-300 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Terminal Quickstart:</span>
                </div>
                <pre className="text-yellow-400 font-mono bg-black p-2 rounded-lg">
                  OLLAMA_ORIGINS="*" ollama run llama3.2:3b
                </pre>
              </div>
            </div>
          )}

          {/* Open Schema & System Prompt */}
          <div>
            <label className="text-neutral-300 font-bold mb-1 block">
              Open Extraction Schema & Prompt Harness:
            </label>
            <div className="text-[11px] text-neutral-400 mb-2">
              Unlike closed APIs where prompts are locked behind proprietary system cards, open
              models give you 100% control over the IRS categorization rules and tax extraction schema.
            </div>
            <textarea
              value={localConfig.systemPrompt}
              onChange={(e) => setLocalConfig({ ...localConfig, systemPrompt: e.target.value })}
              rows={5}
              className="w-full bg-black border border-neutral-800 rounded-xl p-2.5 text-neutral-300 font-mono text-[11px] focus:border-yellow-400 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Privacy & Cost Comparison Matrix */}
          <div className="p-4 bg-black border border-yellow-500/20 rounded-xl space-y-3">
            <div className="font-bold text-white flex items-center gap-1.5 font-display">
              <ShieldCheck className="w-4 h-4 text-yellow-400" />
              <span>The Open Innovation Advantage: Unit Economics & Privacy</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 rounded-xl bg-yellow-400/10 border border-yellow-500/30">
                <div className="font-bold text-yellow-300">VaultLedger (Open Weights)</div>
                <div className="text-neutral-200 mt-1">• $0.00 / receipt inference cost</div>
                <div className="text-neutral-200">• Client NDA 100% compliant</div>
                <div className="text-neutral-200">• Works offline / on airplanes</div>
                <div className="text-neutral-200">• No API key or credit card needed</div>
              </div>
              <div className="p-3 rounded-xl bg-[#141414] border border-neutral-800">
                <div className="font-bold text-neutral-400">Closed SaaS Cloud APIs</div>
                <div className="text-neutral-500 mt-1">• $0.03 - $0.08 per parsed page</div>
                <div className="text-neutral-500">• Financial data sent to cloud servers</div>
                <div className="text-neutral-500">• Fails with zero internet</div>
                <div className="text-neutral-500">• $20 - $50/mo recurring toll</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-800 bg-[#121212]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-neutral-400 hover:text-white transition-colors text-xs font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl transition-colors text-xs shadow-md"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Apply Engine Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
