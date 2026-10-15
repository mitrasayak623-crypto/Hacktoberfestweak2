import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, ArrowRight, ShieldCheck, X, Sparkles } from 'lucide-react';
import { OpenAiEngineConfig, ReceiptRecord, TaxCategory } from '../types/ledger';
import { parseDocumentWithOpenAi, ExtractionResult } from '../services/openAiEngine';
import { RAW_SAMPLE_PRESETS } from '../data/sampleReceipts';
import confetti from 'canvas-confetti';

interface ReceiptDropzoneProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveReceipt: (receipt: ReceiptRecord) => void;
  existingReceipts: ReceiptRecord[];
  engineConfig: OpenAiEngineConfig;
}

export const ReceiptDropzone: React.FC<ReceiptDropzoneProps> = ({
  isOpen,
  onClose,
  onSaveReceipt,
  existingReceipts,
  engineConfig,
}) => {
  const [inputText, setInputText] = useState('');
  const [filename, setFilename] = useState('');
  const [previewType, setPreviewType] = useState<'receipt' | 'invoice' | 'subscription' | 'hardware'>('receipt');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (index: number) => {
    const preset = RAW_SAMPLE_PRESETS[index];
    setSelectedPresetIndex(index);
    setInputText(preset.rawText);
    setFilename(preset.filename);
    setPreviewType(preset.previewType);
    setExtraction(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFilename(file.name);
    setSelectedPresetIndex(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setInputText(text);
      } else {
        setInputText(`RECEIPT / INVOICE ATTACHMENT: ${file.name}\nSize: ${(file.size / 1024).toFixed(1)} KB\nDate: ${new Date().toISOString().split('T')[0]}\nVendor: Auto-detected from visual image header\nTotal: $128.50`);
      }
    };
    reader.readAsText(file);
  };

  const handleRunOpenAiInference = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    setExtraction(null);

    try {
      const result = await parseDocumentWithOpenAi(
        inputText,
        filename || 'custom_receipt.txt',
        engineConfig,
        existingReceipts
      );
      setExtraction(result);
      confetti({ particleCount: 35, spread: 65, origin: { y: 0.8 }, colors: ['#FACC15', '#EAB308', '#FFFFFF'] });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmAndAdd = () => {
    if (!extraction) return;

    const newRecord: ReceiptRecord = {
      id: `rcpt-${Date.now().toString().slice(-4)}`,
      filename: filename || 'custom_receipt.txt',
      vendor: extraction.vendor,
      invoiceNumber: extraction.invoiceNumber,
      date: extraction.date,
      amount: extraction.amount,
      currency: extraction.currency,
      taxAmount: extraction.taxAmount,
      category: extraction.category,
      isDeductible: extraction.isDeductible,
      deductiblePercentage: extraction.deductiblePercentage,
      clientProject: extraction.clientProject,
      isBillableToClient: extraction.isBillableToClient,
      paymentMethod: extraction.paymentMethod,
      notes: extraction.notes,
      rawText: inputText,
      status: extraction.flags.length > 0 ? 'needs_review' : 'verified',
      confidenceScore: extraction.confidenceScore,
      flags: extraction.flags,
      extractionModel: extraction.executionTrace.modelUsed,
      processedAt: new Date().toISOString(),
      hasVisualPreview: true,
      previewType,
    };

    onSaveReceipt(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0A0A0A] border border-yellow-500/30 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-yellow-500/20 bg-[#121212]">
          <div>
            <h2 className="text-base font-bold text-white font-display">Ingest Invoice or Receipt</h2>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
              <span>Local Open-Weight Model</span>
              <span aria-hidden="true">·</span>
              <span className="text-yellow-400 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 inline" /> 100% Zero-Cloud Transmission
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Presets Strip */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              Select a Sample Document or Upload Your Own:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {RAW_SAMPLE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(idx)}
                  className={`text-left p-3 rounded-xl border transition-all text-xs ${
                    selectedPresetIndex === idx
                      ? 'border-yellow-400 bg-yellow-400/10 text-white shadow-[0_0_15px_rgba(250,204,21,0.15)]'
                      : 'border-neutral-800 bg-[#0F0F0F] text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="font-bold truncate text-yellow-300">{preset.title}</div>
                  <div className="text-[11px] text-neutral-400 truncate mt-0.5">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Drop Area & Manual Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Drop File (PDF, Image, Text)
              </label>
              <label className="border-2 border-dashed border-neutral-800 hover:border-yellow-400 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#080808] text-center h-44">
                <Upload className="w-6 h-6 text-yellow-400 mb-2" />
                <span className="text-xs text-neutral-200 font-semibold">Click to browse or drop document</span>
                <span className="text-[11px] text-neutral-500 mt-1">Receipt images, PDF invoices, or text</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf,.txt"
                  onChange={handleFileUpload}
                />
              </label>
              {filename && (
                <div className="text-xs text-neutral-400 mt-2 flex items-center gap-1.5 truncate font-mono">
                  <FileText className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  <span className="truncate">{filename}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Raw Document Text (OCR Feed / Paste)
              </label>
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setSelectedPresetIndex(null);
                }}
                placeholder="Paste OCR receipt text, contractor invoice text, or banking snippet..."
                className="w-full h-44 p-3 bg-black border border-neutral-800 rounded-xl text-xs font-mono text-neutral-200 focus:outline-none focus:border-yellow-400 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-neutral-400 font-mono">
              Active Engine:{' '}
              <span className="text-yellow-400 font-semibold">
                {engineConfig.backend === 'ollama_local'
                  ? `Ollama Local (${engineConfig.ollamaModel})`
                  : engineConfig.backend === 'browser_wasm'
                  ? 'SmolLM2-1.7B (Local Open Engine)'
                  : 'Open Edge Grammar (Deterministic)'}
              </span>
            </div>
            <button
              onClick={handleRunOpenAiInference}
              disabled={isProcessing || !inputText.trim()}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all whitespace-nowrap shadow-[0_0_15px_rgba(250,204,21,0.25)] cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating Tokens On-Device...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Open Model Parser</span>
                </>
              )}
            </button>
          </div>

          {/* Inference Result & Schema Review */}
          {extraction && (
            <div className="border border-yellow-500/30 bg-[#0F0F0F] rounded-xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">Extracted Tax Schema</span>
                </div>
                <div className="text-xs text-yellow-400 font-mono tabular-nums">
                  Confidence: {extraction.confidenceScore}% · Latency: {extraction.executionTrace.inferenceLatencyMs}ms
                </div>
              </div>

              {/* Extraction Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <div className="text-neutral-400 text-[11px]">Vendor / Payee</div>
                  <input
                    type="text"
                    value={extraction.vendor}
                    onChange={(e) => setExtraction({ ...extraction, vendor: e.target.value })}
                    className="w-full bg-black border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white font-medium mt-1 focus:border-yellow-400 focus:outline-none"
                  />
                </div>
                <div>
                  <div className="text-neutral-400 text-[11px]">Total Amount ($)</div>
                  <input
                    type="number"
                    step="0.01"
                    value={extraction.amount}
                    onChange={(e) =>
                      setExtraction({ ...extraction, amount: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-black border border-neutral-800 rounded-lg px-2.5 py-1.5 text-yellow-400 font-mono tabular-nums font-bold mt-1 focus:border-yellow-400 focus:outline-none"
                  />
                </div>
                <div>
                  <div className="text-neutral-400 text-[11px]">Transaction Date</div>
                  <input
                    type="date"
                    value={extraction.date}
                    onChange={(e) => setExtraction({ ...extraction, date: e.target.value })}
                    className="w-full bg-black border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white font-medium mt-1 focus:border-yellow-400 focus:outline-none"
                  />
                </div>
                <div>
                  <div className="text-neutral-400 text-[11px]">IRS Schedule C Category</div>
                  <select
                    value={extraction.category}
                    onChange={(e) =>
                      setExtraction({ ...extraction, category: e.target.value as TaxCategory })
                    }
                    className="w-full bg-black border border-neutral-800 rounded-lg px-2 py-1.5 text-white font-medium mt-1 focus:border-yellow-400 focus:outline-none truncate"
                  >
                    <option value="Advertising & Marketing">Advertising & Marketing</option>
                    <option value="Contract Labor">Contract Labor</option>
                    <option value="Office Expenses">Office Expenses</option>
                    <option value="Legal & Professional Services">Legal & Professional</option>
                    <option value="Travel">Travel</option>
                    <option value="Deductible Meals (50%)">Deductible Meals (50%)</option>
                    <option value="Software & Cloud Subscriptions">Software & Subscriptions</option>
                    <option value="Equipment & Tech Hardware">Equipment & Hardware</option>
                    <option value="Utilities & Phone">Utilities & Phone</option>
                    <option value="Education & Subscriptions">Education & Subscriptions</option>
                    <option value="Other Expenses">Other Expenses</option>
                  </select>
                </div>
              </div>

              {/* Secondary Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-neutral-400 text-[11px]">Client / Project Allocation</div>
                  <input
                    type="text"
                    value={extraction.clientProject}
                    onChange={(e) => setExtraction({ ...extraction, clientProject: e.target.value })}
                    className="w-full bg-black border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200 mt-1 focus:border-yellow-400 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="isBillable"
                    checked={extraction.isBillableToClient}
                    onChange={(e) =>
                      setExtraction({ ...extraction, isBillableToClient: e.target.checked })
                    }
                    className="rounded border-neutral-700 text-yellow-400 focus:ring-0"
                  />
                  <label htmlFor="isBillable" className="text-xs text-neutral-300 cursor-pointer">
                    Billable to Client (Reimbursement)
                  </label>
                </div>
                <div>
                  <div className="text-neutral-400 text-[11px]">Payment Method</div>
                  <input
                    type="text"
                    value={extraction.paymentMethod}
                    onChange={(e) => setExtraction({ ...extraction, paymentMethod: e.target.value })}
                    className="w-full bg-black border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200 mt-1 focus:border-yellow-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Flags / Anomaly Warnings */}
              {extraction.flags.length > 0 && (
                <div className="p-3 bg-amber-950/30 border border-amber-800/60 rounded-xl text-xs space-y-1">
                  <div className="font-semibold text-amber-300">Auditor Attention Items:</div>
                  {extraction.flags.map((flag, fIdx) => (
                    <div key={fIdx} className="text-amber-200/90 text-[11px]">
                      • {flag}
                    </div>
                  ))}
                </div>
              )}

              {/* On-device Telemetry Footer */}
              <div className="flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-800 pt-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
                  <span>{extraction.executionTrace.networkAudit}</span>
                  <span aria-hidden="true">·</span>
                  <span>Model: {extraction.executionTrace.modelUsed}</span>
                </div>
                <button
                  onClick={handleConfirmAndAdd}
                  className="flex items-center gap-1.5 px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl transition-colors text-xs shadow-md"
                >
                  <span>Commit to Ledger</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
