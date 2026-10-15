import React, { useState } from 'react';
import { ReceiptRecord, TaxCategory } from '../types/ledger';
import { ReceiptVisualCard } from './ReceiptVisualCard';
import { X, Check, Trash2, ShieldCheck, AlertTriangle } from 'lucide-react';

interface ReceiptDetailModalProps {
  receipt: ReceiptRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: ReceiptRecord) => void;
  onDelete: (id: string) => void;
}

export const ReceiptDetailModal: React.FC<ReceiptDetailModalProps> = ({
  receipt,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}) => {
  if (!isOpen || !receipt) return null;

  const [form, setForm] = useState<ReceiptRecord>({ ...receipt });
  const [activeTab, setActiveTab] = useState<'details' | 'raw_text' | 'audit'>('details');

  const handleSave = () => {
    onUpdate({
      ...form,
      status: 'verified',
    });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Delete receipt for ${receipt.vendor}?`)) {
      onDelete(receipt.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0A0A0A] border border-yellow-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-yellow-500/20 bg-[#121212]">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-white font-display">Expense Audit & Verification</h2>
            <span className="text-xs font-mono text-yellow-400">ID: {receipt.id}</span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-neutral-800 px-6 bg-[#080808] text-xs font-medium">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-yellow-400 text-yellow-400 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Structured Ledger Fields
          </button>
          <button
            onClick={() => setActiveTab('raw_text')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'raw_text'
                ? 'border-yellow-400 text-yellow-400 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Raw Document Text
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'audit'
                ? 'border-yellow-400 text-yellow-400 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Open AI Audit Trail
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Visual Preview Left */}
              <div className="lg:col-span-5">
                <ReceiptVisualCard receipt={form} />
                {form.flags.length > 0 && (
                  <div className="mt-4 p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Audit Notice:</span>
                    </div>
                    {form.flags.map((f, idx) => (
                      <p key={idx} className="text-amber-200/90 text-[11px]">
                        {f}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Editable Fields Right */}
              <div className="lg:col-span-7 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-neutral-400 font-medium">Merchant / Payee</label>
                    <input
                      type="text"
                      value={form.vendor}
                      onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                      className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white font-semibold mt-1 focus:border-yellow-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 font-medium">Amount ($ USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-yellow-400 font-mono tabular-nums font-bold mt-1 focus:border-yellow-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-neutral-400 font-medium">Transaction Date</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white mt-1 focus:border-yellow-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 font-medium">Invoice / Ref #</label>
                    <input
                      type="text"
                      value={form.invoiceNumber || ''}
                      onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                      placeholder="e.g. INV-90412"
                      className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white font-mono mt-1 focus:border-yellow-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-400 font-medium">Schedule C Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => {
                      const newCat = e.target.value as TaxCategory;
                      const isMeal = newCat === 'Deductible Meals (50%)';
                      setForm({
                        ...form,
                        category: newCat,
                        deductiblePercentage: isMeal ? 50 : 100,
                      });
                    }}
                    className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white mt-1 focus:border-yellow-400 focus:outline-none"
                  >
                    <option value="Advertising & Marketing">Advertising & Marketing (Line 8)</option>
                    <option value="Contract Labor">Contract Labor (Line 11)</option>
                    <option value="Office Expenses">Office Expenses (Line 18)</option>
                    <option value="Legal & Professional Services">Legal & Professional (Line 17)</option>
                    <option value="Travel">Travel (Line 24a)</option>
                    <option value="Deductible Meals (50%)">Deductible Meals 50% (Line 24b)</option>
                    <option value="Software & Cloud Subscriptions">Software & Cloud (Line 27a)</option>
                    <option value="Equipment & Tech Hardware">Equipment & Hardware (Line 13)</option>
                    <option value="Utilities & Phone">Utilities & Phone (Line 25)</option>
                    <option value="Education & Subscriptions">Education & Subscriptions</option>
                    <option value="Other Expenses">Other Expenses (Line 27a)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-neutral-400 font-medium">Client / Project</label>
                    <input
                      type="text"
                      value={form.clientProject}
                      onChange={(e) => setForm({ ...form, clientProject: e.target.value })}
                      className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white mt-1 focus:border-yellow-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 font-medium">Payment Tender</label>
                    <input
                      type="text"
                      value={form.paymentMethod}
                      onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                      className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white mt-1 focus:border-yellow-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-neutral-800">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="detailBillable"
                      checked={form.isBillableToClient}
                      onChange={(e) => setForm({ ...form, isBillableToClient: e.target.checked })}
                      className="rounded border-neutral-700 text-yellow-400 focus:ring-0"
                    />
                    <label htmlFor="detailBillable" className="text-neutral-200 font-medium cursor-pointer">
                      Pass-through Billable to Client
                    </label>
                  </div>
                  <div className="text-yellow-400 font-mono text-[11px] font-bold">
                    Deductible: {form.deductiblePercentage}% ($
                    {((form.amount * form.deductiblePercentage) / 100).toFixed(2)})
                  </div>
                </div>

                <div>
                  <label className="text-neutral-400 font-medium">Auditor Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={2}
                    className="w-full bg-black border border-neutral-800 rounded-lg p-2 text-white mt-1 focus:border-yellow-400 focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'raw_text' && (
            <div className="space-y-3">
              <div className="text-xs text-neutral-400">
                Original raw OCR/PDF text parsed on device without cloud uploads:
              </div>
              <pre className="p-4 bg-black border border-neutral-800 rounded-xl text-xs font-mono text-yellow-300/90 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {form.rawText || 'No raw text stored for this receipt.'}
              </pre>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-black border border-yellow-500/20 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="font-bold text-white">Cryptographic Privacy Assertion</span>
                  <span className="text-yellow-400 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-4 h-4" /> 100% Zero-Cloud Air-Gapped
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-neutral-300">
                  <div>
                    <span className="text-neutral-500 block text-[11px]">INFERENCE MODEL</span>
                    <span className="font-mono text-white">{form.extractionModel}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">PROCESSED TIMESTAMP</span>
                    <span className="font-mono text-white">{form.processedAt}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">DATA RESIDENCY</span>
                    <span className="text-emerald-400 font-medium">Local Browser Memory (IndexedDB)</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">CLOUD TOKENS INVOICED</span>
                    <span className="font-mono text-yellow-400 font-bold">$0.00 (Self-Hosted / Open Weights)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#0F0F0F] border border-neutral-800 rounded-xl">
                <div className="font-bold text-white mb-1">IRS Compliance Notice</div>
                <p className="text-neutral-400 leading-relaxed text-[11px]">
                  Under IRC §162 and §274, business expense deductions require documentation of
                  amount, time, place, and business purpose. VaultLedger AI timestamps each record
                  locally to satisfy IRS audit proof requirements for independent 1099 contractors.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-[#121212]">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors text-xs font-medium"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Receipt</span>
          </button>

          <div className="flex items-center gap-3">
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
              <span>Verify & Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
