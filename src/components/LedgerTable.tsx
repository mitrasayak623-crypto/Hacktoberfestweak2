import React, { useState, useMemo } from 'react';
import { ReceiptRecord } from '../types/ledger';
import {
  Search,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  FileCode,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { exportToQuickBooksCsv, exportScheduleCCsv } from '../services/exportUtils';
import confetti from 'canvas-confetti';

interface LedgerTableProps {
  receipts: ReceiptRecord[];
  onSelectReceipt: (receipt: ReceiptRecord) => void;
  onVerifyAll: () => void;
  onOpenIngest: () => void;
}

export const LedgerTable: React.FC<LedgerTableProps> = ({
  receipts,
  onSelectReceipt,
  onVerifyAll,
  onOpenIngest,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<'date' | 'amount' | 'vendor'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  // Filtered and sorted records
  const filteredReceipts = useMemo(() => {
    return receipts
      .filter((r) => {
        const matchesSearch =
          r.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.clientProject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (r.invoiceNumber && r.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
          r.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
        const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];
        if (sortField === 'amount') {
          return sortAsc ? valA - valB : valB - valA;
        }
        if (sortAsc) {
          return String(valA).localeCompare(String(valB));
        }
        return String(valB).localeCompare(String(valA));
      });
  }, [receipts, searchQuery, selectedCategory, selectedStatus, sortField, sortAsc]);

  // Aggregate metrics
  const totalGross = useMemo(() => receipts.reduce((sum, r) => sum + r.amount, 0), [receipts]);
  const totalDeductible = useMemo(
    () => receipts.reduce((sum, r) => sum + (r.amount * r.deductiblePercentage) / 100, 0),
    [receipts]
  );
  const pendingReviewCount = useMemo(
    () => receipts.filter((r) => r.status === 'needs_review').length,
    [receipts]
  );
  const billableCount = useMemo(
    () => receipts.filter((r) => r.isBillableToClient).length,
    [receipts]
  );

  const handleExportQuickBooks = () => {
    exportToQuickBooksCsv(filteredReceipts);
    confetti({ particleCount: 30, spread: 60, colors: ['#FACC15', '#EAB308', '#FFFFFF'] });
  };

  const handleExportScheduleC = () => {
    exportScheduleCCsv(filteredReceipts);
    confetti({ particleCount: 30, spread: 60, colors: ['#FACC15', '#10B981', '#06B6D4'] });
  };

  const toggleSort = (field: 'date' | 'amount' | 'vendor') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Colorful badge helper for tax categories
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Deductible Meals (50%)':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Contract Labor':
        return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'Software & Cloud Subscriptions':
        return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      case 'Equipment & Tech Hardware':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Travel':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Advertising & Marketing':
        return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default:
        return 'text-neutral-300 bg-neutral-800 border-neutral-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* 4-Metric High-Density KPI Strip with Colorful Accents */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Yellow/Gold Gross */}
        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-yellow-500/20 shadow-lg relative overflow-hidden group hover:border-yellow-500/40 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl group-hover:bg-yellow-500/10 transition-colors" />
          <div className="text-xs text-neutral-400 font-medium">Total Gross Expenses</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-yellow-400 mt-1">
            ${totalGross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">
            {receipts.length} total receipts recorded
          </div>
        </div>

        {/* Metric 2: Vivid Emerald Deductible */}
        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-emerald-500/20 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
          <div className="text-xs text-neutral-400 font-medium">Deductible Tax Basis</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
            ${totalDeductible.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-500/80 mt-0.5">
            Est. ${(totalDeductible * 0.3).toFixed(2)} tax liability reduction
          </div>
        </div>

        {/* Metric 3: Amber Coral Review Count */}
        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-amber-500/20 shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />
          <div className="text-xs text-neutral-400 font-medium">Pending Auditor Review</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-400 mt-1">
            {pendingReviewCount}
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">
            {pendingReviewCount === 0 ? 'All receipts verified' : 'Flags require attention'}
          </div>
        </div>

        {/* Metric 4: Cyber Cyan Reimbursable */}
        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-cyan-500/20 shadow-lg relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors" />
          <div className="text-xs text-neutral-400 font-medium">Client Reimbursables</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-cyan-400 mt-1">
            {billableCount} items
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">
            Segregated client pass-throughs
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters, & Actions */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-xl bg-[#0A0A0A] border border-yellow-500/20">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendor, project, invoice #..."
              className="w-full bg-[#121212] border border-neutral-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#121212] border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-yellow-400 truncate max-w-[180px]"
          >
            <option value="all">All Tax Categories</option>
            <option value="Advertising & Marketing">Advertising & Marketing</option>
            <option value="Contract Labor">Contract Labor</option>
            <option value="Office Expenses">Office Expenses</option>
            <option value="Legal & Professional Services">Legal & Professional</option>
            <option value="Travel">Travel</option>
            <option value="Deductible Meals (50%)">Meals (50%)</option>
            <option value="Software & Cloud Subscriptions">Software & Cloud</option>
            <option value="Equipment & Tech Hardware">Equipment & Hardware</option>
          </select>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#121212] rounded-lg border border-neutral-800">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                selectedStatus === 'all'
                  ? 'bg-yellow-400 text-black font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatus('needs_review')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                selectedStatus === 'needs_review'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Needs Review
            </button>
            <button
              onClick={() => setSelectedStatus('verified')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                selectedStatus === 'verified'
                  ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Verified
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {pendingReviewCount > 0 && (
            <button
              onClick={onVerifyAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-black bg-yellow-400 hover:bg-yellow-300 rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Verify All</span>
            </button>
          )}

          <button
            onClick={handleExportQuickBooks}
            title="Download QuickBooks / Xero CSV"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-[#141414] hover:bg-neutral-800 border border-yellow-500/20 rounded-lg transition-colors whitespace-nowrap hover:border-yellow-400/40"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-yellow-400" />
            <span>QuickBooks CSV</span>
          </button>

          <button
            onClick={handleExportScheduleC}
            title="Download Schedule C Form Summary"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-[#141414] hover:bg-neutral-800 border border-yellow-500/20 rounded-lg transition-colors whitespace-nowrap hover:border-yellow-400/40"
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>Schedule C Tax CSV</span>
          </button>
        </div>
      </div>

      {/* High Density Table Container */}
      <div className="rounded-xl border border-yellow-500/20 bg-[#0A0A0A] overflow-hidden shadow-xl">
        {filteredReceipts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="text-neutral-400 text-sm">No expenses matched your search or filters.</div>
            <div className="text-xs text-neutral-500">
              Clear your active filters or ingest a new document.
            </div>
            <button
              onClick={onOpenIngest}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-lg text-xs transition-colors"
            >
              Log First Entry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-yellow-500/20 bg-[#121212] text-neutral-400 font-medium select-none">
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-yellow-400 transition-colors"
                    onClick={() => toggleSort('date')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Date</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-yellow-400 transition-colors"
                    onClick={() => toggleSort('vendor')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Merchant / Vendor</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4">IRS Schedule C Line</th>
                  <th className="py-3 px-4">Allocation / Project</th>
                  <th
                    className="py-3 px-4 text-right cursor-pointer hover:text-yellow-400 transition-colors"
                    onClick={() => toggleSort('amount')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Total Amount</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">Deductible</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Open AI Trace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredReceipts.map((r) => {
                  const deductibleVal = (r.amount * r.deductiblePercentage) / 100;
                  return (
                    <tr
                      key={r.id}
                      onClick={() => onSelectReceipt(r)}
                      className="hover:bg-yellow-500/5 cursor-pointer transition-colors group"
                    >
                      {/* Date */}
                      <td className="py-3 px-4 text-neutral-300 font-mono tabular-nums whitespace-nowrap">
                        {r.date}
                      </td>

                      {/* Vendor */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white group-hover:text-yellow-400 transition-colors truncate max-w-[200px]">
                          {r.vendor}
                        </div>
                        {r.invoiceNumber && (
                          <div className="text-[11px] text-neutral-500 font-mono truncate">
                            #{r.invoiceNumber}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${getCategoryColor(r.category)} truncate max-w-[190px]`}>
                          {r.category}
                        </span>
                        <div className="text-[10px] text-neutral-500 mt-0.5">
                          {r.deductiblePercentage === 50 ? '50% Meal Rule' : '100% Write-off'}
                        </div>
                      </td>

                      {/* Project / Billable */}
                      <td className="py-3 px-4">
                        <div className="text-neutral-300 truncate max-w-[160px]">
                          {r.clientProject}
                        </div>
                        {r.isBillableToClient && (
                          <div className="text-[11px] text-cyan-400 font-medium">
                            • Client Billable
                          </div>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-white whitespace-nowrap">
                        ${r.amount.toFixed(2)}
                      </td>

                      {/* Deductible */}
                      <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-emerald-400 whitespace-nowrap">
                        ${deductibleVal.toFixed(2)}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {r.status === 'verified' ? (
                          <span className="text-[11px] text-emerald-400 font-medium inline-flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-400 font-medium inline-flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Review
                          </span>
                        )}
                      </td>

                      {/* Model Trace */}
                      <td className="py-3 px-4 text-right text-neutral-400 text-[11px] font-mono whitespace-nowrap">
                        <span className="text-neutral-300">{r.extractionModel.split(' ')[0]}</span>
                        <span className="text-neutral-600"> · </span>
                        <span className="text-yellow-400 font-semibold">{r.confidenceScore}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
