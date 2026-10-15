import React, { useState, useMemo } from 'react';
import { ReceiptRecord, SCHEDULE_C_LINE_MAP, TaxCategory } from '../types/ledger';
import { exportScheduleCCsv } from '../services/exportUtils';
import { Download, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScheduleCTaxSummaryProps {
  receipts: ReceiptRecord[];
}

export const ScheduleCTaxSummary: React.FC<ScheduleCTaxSummaryProps> = ({ receipts }) => {
  const [taxBracketPercent, setTaxBracketPercent] = useState<number>(30);

  const categoryBreakdown = useMemo(() => {
    const map: Record<
      TaxCategory,
      { line: string; gross: number; deductible: number; count: number }
    > = {
      'Advertising & Marketing': { line: 'Line 8 - Advertising', gross: 0, deductible: 0, count: 0 },
      'Contract Labor': { line: 'Line 11 - Contract labor', gross: 0, deductible: 0, count: 0 },
      'Office Expenses': { line: 'Line 18 - Office expense', gross: 0, deductible: 0, count: 0 },
      'Legal & Professional Services': { line: 'Line 17 - Legal & professional', gross: 0, deductible: 0, count: 0 },
      'Travel': { line: 'Line 24a - Travel', gross: 0, deductible: 0, count: 0 },
      'Deductible Meals (50%)': { line: 'Line 24b - Meals 50% limit', gross: 0, deductible: 0, count: 0 },
      'Software & Cloud Subscriptions': { line: 'Line 27a - Software & SaaS', gross: 0, deductible: 0, count: 0 },
      'Equipment & Tech Hardware': { line: 'Line 13 - Depreciation / Section 179', gross: 0, deductible: 0, count: 0 },
      'Utilities & Phone': { line: 'Line 25 - Utilities', gross: 0, deductible: 0, count: 0 },
      'Education & Subscriptions': { line: 'Line 27a - Professional education', gross: 0, deductible: 0, count: 0 },
      'Other Expenses': { line: 'Line 27a - Other expenses', gross: 0, deductible: 0, count: 0 },
    };

    for (const r of receipts) {
      if (map[r.category]) {
        const itemDeductible = (r.amount * r.deductiblePercentage) / 100;
        map[r.category].gross += r.amount;
        map[r.category].deductible += itemDeductible;
        map[r.category].count += 1;
      }
    }

    return Object.entries(map)
      .map(([cat, data]) => ({
        category: cat as TaxCategory,
        line: data.line,
        gross: data.gross,
        deductible: data.deductible,
        count: data.count,
      }))
      .filter((item) => item.count > 0 || item.gross > 0);
  }, [receipts]);

  const totalGross = useMemo(() => receipts.reduce((sum, r) => sum + r.amount, 0), [receipts]);
  const totalDeductible = useMemo(
    () => receipts.reduce((sum, r) => sum + (r.amount * r.deductiblePercentage) / 100, 0),
    [receipts]
  );
  const estimatedTaxSavings = useMemo(
    () => totalDeductible * (taxBracketPercent / 100),
    [totalDeductible, taxBracketPercent]
  );

  const handleExport = () => {
    exportScheduleCCsv(receipts, taxBracketPercent / 100);
    confetti({ particleCount: 30, spread: 60, colors: ['#FACC15', '#10B981', '#FFFFFF'] });
  };

  return (
    <div className="space-y-6">
      {/* Hero / Header Card */}
      <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-yellow-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl" />
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-display">
            IRS Form 1040 Schedule C Deduction Ledger
          </h2>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1 font-mono">
            <span>Sole Proprietorship & Freelancer Tax Return</span>
            <span aria-hidden="true">·</span>
            <span className="text-yellow-400">Mapped via Open Models</span>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 rounded-xl transition-all whitespace-nowrap shadow-md cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Schedule C CSV</span>
        </button>
      </div>

      {/* Tax Bracket & Total Savings Simulator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#0A0A0A] border border-yellow-500/20 shadow-lg">
          <div className="text-xs text-neutral-400 font-medium">Gross Business Outlay</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
            ${totalGross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Total receipts ingested this tax year
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0A0A0A] border border-emerald-500/20 shadow-lg">
          <div className="text-xs text-neutral-400 font-medium">Total Deductible Basis</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
            ${totalDeductible.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            After applying IRC §274 50% meal limits
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0F0F0F] border border-yellow-500/30 shadow-lg">
          <div className="flex items-center justify-between text-xs text-yellow-400 font-bold">
            <span>Est. Tax Dollars Shielded</span>
            <span className="font-mono">{taxBracketPercent}% Bracket</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-yellow-300 mt-1">
            ${estimatedTaxSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          {/* Slider */}
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
              <span>Effective Tax Rate:</span>
              <span className="text-yellow-400 font-bold">{taxBracketPercent}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="45"
              step="1"
              value={taxBracketPercent}
              onChange={(e) => setTaxBracketPercent(parseInt(e.target.value, 10))}
              className="w-full accent-yellow-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Schedule C Breakdown Table */}
      <div className="rounded-xl border border-yellow-500/20 bg-[#0A0A0A] overflow-hidden shadow-xl">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-[#121212]">
          <div className="text-sm font-bold text-white font-display">Line-by-Line Form 1040 Allocation</div>
          <div className="text-xs text-neutral-400 font-mono">
            {categoryBreakdown.length} Active Expense Categories
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-[#080808] text-neutral-400 font-medium">
                <th className="py-3 px-4">Official Form 1040 Line</th>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4 text-center">Receipt Count</th>
                <th className="py-3 px-4 text-right">Gross Spend</th>
                <th className="py-3 px-4 text-right">Deductible Allowed</th>
                <th className="py-3 px-4 text-right">Est. Tax Shield</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {categoryBreakdown.map((item, idx) => {
                const shield = item.deductible * (taxBracketPercent / 100);
                return (
                  <tr key={idx} className="hover:bg-yellow-500/5 transition-colors">
                    <td className="py-3 px-4 font-mono text-yellow-400 font-semibold whitespace-nowrap">
                      {item.line}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">{item.category}</td>
                    <td className="py-3 px-4 text-center font-mono tabular-nums text-neutral-400">
                      {item.count}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-neutral-300">
                      ${item.gross.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-400 font-bold">
                      ${item.deductible.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-yellow-300 font-bold">
                      ${shield.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-yellow-500/30 bg-[#121212] font-semibold text-xs">
                <td className="py-3.5 px-4 text-white font-mono" colSpan={2}>
                  TOTAL SCHEDULE C DEDUCTIONS
                </td>
                <td className="py-3.5 px-4 text-center font-mono tabular-nums text-white">
                  {receipts.length}
                </td>
                <td className="py-3.5 px-4 text-right font-mono tabular-nums text-neutral-300">
                  ${totalGross.toFixed(2)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono tabular-nums text-emerald-400 font-bold">
                  ${totalDeductible.toFixed(2)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono tabular-nums text-yellow-400 font-bold">
                  ${estimatedTaxSavings.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Tax Audit Rigor Note */}
      <div className="p-4 rounded-xl bg-[#0A0A0A] border border-yellow-500/20 flex items-start gap-3 text-xs text-neutral-400">
        <ShieldCheck className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-white">Audit Proof Safeguard:</strong> Every parsed line item
          maintains an immutable local reference to its source receipt and extraction trace. In the
          event of an IRS or CPA inquiry, the raw receipt slips, merchant tax identifiers, and
          dates can be exported immediately as an unredacted audit binder.
        </div>
      </div>
    </div>
  );
};
