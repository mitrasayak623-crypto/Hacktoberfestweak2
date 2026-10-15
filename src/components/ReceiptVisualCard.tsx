import React from 'react';
import { ReceiptRecord } from '../types/ledger';
import { FileText, Monitor, Coffee, CreditCard, Sparkles } from 'lucide-react';

interface ReceiptVisualCardProps {
  receipt: ReceiptRecord;
  className?: string;
}

export const ReceiptVisualCard: React.FC<ReceiptVisualCardProps> = ({ receipt, className = '' }) => {
  const getIcon = () => {
    switch (receipt.previewType) {
      case 'receipt':
        return <Coffee className="w-5 h-5 text-amber-400" />;
      case 'invoice':
        return <FileText className="w-5 h-5 text-cyan-400" />;
      case 'hardware':
        return <Monitor className="w-5 h-5 text-purple-400" />;
      case 'subscription':
      default:
        return <CreditCard className="w-5 h-5 text-yellow-400" />;
    }
  };

  return (
    <div
      className={`relative bg-[#0F0F0F] border border-yellow-500/30 rounded-xl p-5 shadow-2xl overflow-hidden ${className}`}
    >
      {/* Metallic Gold Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600 shadow-[0_0_12px_#facc15]" />

      {/* Header */}
      <div className="flex items-start justify-between border-b border-neutral-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-black border border-yellow-500/30">
            {getIcon()}
          </div>
          <div>
            <div className="text-[11px] text-yellow-400 uppercase tracking-wider font-mono font-semibold">
              {receipt.previewType || 'Receipt Document'}
            </div>
            <h3 className="text-base font-bold text-white truncate max-w-[220px]">
              {receipt.vendor}
            </h3>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold font-mono tabular-nums text-yellow-400">
            ${receipt.amount.toFixed(2)}
          </div>
          <div className="text-[11px] text-neutral-400 font-mono">
            {receipt.currency} · {receipt.date}
          </div>
        </div>
      </div>

      {/* Simulated Document Body Lines */}
      <div className="bg-[#050505] rounded-lg p-3.5 border border-neutral-800 space-y-2 font-mono text-xs">
        <div className="flex justify-between text-neutral-400 text-[11px] border-b border-neutral-800/80 pb-1.5">
          <span>TAX CATEGORY</span>
          <span className="text-yellow-300 font-medium">{receipt.category}</span>
        </div>

        <div className="flex justify-between text-neutral-400 text-[11px]">
          <span>DEDUCTIBLE BASIS</span>
          <span className="text-emerald-400 font-bold">
            {receipt.deductiblePercentage}% (${((receipt.amount * receipt.deductiblePercentage) / 100).toFixed(2)})
          </span>
        </div>

        {receipt.invoiceNumber && (
          <div className="flex justify-between text-neutral-400 text-[11px]">
            <span>INVOICE / REF #</span>
            <span className="text-cyan-400">{receipt.invoiceNumber}</span>
          </div>
        )}

        <div className="flex justify-between text-neutral-400 text-[11px]">
          <span>ALLOCATION</span>
          <span className="text-neutral-200 truncate max-w-[160px]">{receipt.clientProject}</span>
        </div>

        <div className="flex justify-between text-neutral-400 text-[11px]">
          <span>PAYMENT METHOD</span>
          <span className="text-neutral-300">{receipt.paymentMethod}</span>
        </div>

        {receipt.notes && (
          <div className="pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400 italic">
            "{receipt.notes}"
          </div>
        )}
      </div>

      {/* Simulated Optical Barcode / Cryptographic Hash */}
      <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
        <div className="flex items-center gap-1.5 text-yellow-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Local Hash: {receipt.id.toUpperCase()}-SEALED</span>
        </div>
        <div className="tracking-widest text-neutral-400 font-mono">||| | | || ||| || |||</div>
      </div>
    </div>
  );
};
