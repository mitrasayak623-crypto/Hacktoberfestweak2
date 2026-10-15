import React, { useState, useMemo } from 'react';
import { ReceiptRecord } from '../types/ledger';
import { generateClientReimbursementReport, triggerFileDownload } from '../services/exportUtils';
import {
  FileText,
  Printer,
  Download,
  Building,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClientBillingPacketsProps {
  receipts: ReceiptRecord[];
}

export const ClientBillingPackets: React.FC<ClientBillingPacketsProps> = ({ receipts }) => {
  const clients = useMemo(() => {
    const map: Record<string, { total: number; count: number; items: ReceiptRecord[] }> = {};

    for (const r of receipts) {
      if (r.clientProject && r.clientProject !== 'Internal Operations') {
        if (!map[r.clientProject]) {
          map[r.clientProject] = { total: 0, count: 0, items: [] };
        }
        map[r.clientProject].items.push(r);
        if (r.isBillableToClient) {
          map[r.clientProject].total += r.amount;
          map[r.clientProject].count += 1;
        }
      }
    }

    return Object.entries(map).map(([name, data]) => ({
      name,
      totalBillable: data.total,
      billableCount: data.count,
      totalItems: data.items.length,
      items: data.items,
    }));
  }, [receipts]);

  const [selectedClientName, setSelectedClientName] = useState<string>(
    clients.length > 0 ? clients[0].name : 'Acme Corp Rebranding'
  );

  const activeClient = useMemo(
    () => clients.find((c) => c.name === selectedClientName) || clients[0],
    [clients, selectedClientName]
  );

  const handleDownloadVoucher = () => {
    if (!activeClient) return;
    const htmlReport = generateClientReimbursementReport(activeClient.name, receipts);
    const filename = `Expense_Voucher_${activeClient.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    triggerFileDownload(htmlReport, filename, 'text/html;charset=utf-8;');
    confetti({ particleCount: 30, spread: 60, colors: ['#FACC15', '#06B6D4', '#FFFFFF'] });
  };

  const handlePrintVoucher = () => {
    if (!activeClient) return;
    const htmlReport = generateClientReimbursementReport(activeClient.name, receipts);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlReport);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  if (!activeClient) {
    return (
      <div className="p-12 text-center text-neutral-400">
        No client projects found. Ingest receipts and assign them to a client to generate billing packets.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-yellow-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-display">
            Client Billing & Reimbursement Vouchers
          </h2>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1 font-mono">
            <span>Pass-Through Client Disbursements</span>
            <span aria-hidden="true">·</span>
            <span className="text-yellow-400">Isolated Client Audit Vaults</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintVoucher}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-200 bg-[#141414] hover:bg-neutral-800 border border-neutral-700/60 rounded-xl transition-colors"
          >
            <Printer className="w-4 h-4 text-neutral-400" />
            <span>Print Voucher</span>
          </button>
          <button
            onClick={handleDownloadVoucher}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Voucher HTML</span>
          </button>
        </div>
      </div>

      {/* Client Selector Segmented Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {clients.map((c) => (
          <button
            key={c.name}
            onClick={() => setSelectedClientName(c.name)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap flex items-center gap-2 ${
              selectedClientName === c.name
                ? 'bg-yellow-400 text-black border-yellow-400 shadow-md font-bold'
                : 'bg-[#0A0A0A] border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>{c.name}</span>
            <span className={`font-mono ml-1 ${selectedClientName === c.name ? 'text-black' : 'text-yellow-400'}`}>
              ${c.totalBillable.toFixed(2)}
            </span>
          </button>
        ))}
      </div>

      {/* Main Split Layout: Client Summary + Receipt Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Summary Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-yellow-500/20 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="text-xs text-neutral-400 font-medium">Selected Account</span>
              <span className="text-xs font-mono text-yellow-400 font-bold uppercase">Active Client</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white font-display">{activeClient.name}</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Authorized pass-through business disbursements awaiting client reimbursement invoice.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black border border-neutral-800 space-y-3 font-mono text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>BILLABLE ITEMS</span>
                <span className="text-white font-bold">{activeClient.billableCount}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>REIMBURSEMENT TOTAL</span>
                <span className="text-2xl font-bold text-yellow-400 tabular-nums">
                  ${activeClient.totalBillable.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={handleDownloadVoucher}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl text-xs transition-colors shadow-md"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Client Invoice Packet</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Itemized Roster */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-yellow-500/20 bg-[#0A0A0A] overflow-hidden shadow-xl">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-[#121212]">
              <div className="text-sm font-bold text-white font-display">Itemized Disbursements</div>
              <div className="text-xs text-neutral-400 font-mono">
                {activeClient.items.length} Total Client Receipts
              </div>
            </div>

            <div className="divide-y divide-neutral-800/60">
              {activeClient.items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex items-center justify-between hover:bg-yellow-500/5 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{item.vendor}</span>
                      {item.isBillableToClient ? (
                        <span className="text-[11px] text-yellow-400 font-semibold">· Billable</span>
                      ) : (
                        <span className="text-[11px] text-neutral-500">· Non-billable internal</span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-400 flex items-center gap-2 font-mono">
                      <span>{item.date}</span>
                      <span>·</span>
                      <span>{item.category}</span>
                      {item.invoiceNumber && (
                        <>
                          <span>·</span>
                          <span className="text-cyan-400">#{item.invoiceNumber}</span>
                        </>
                      )}
                    </div>
                    {item.notes && (
                      <div className="text-[11px] text-neutral-500 italic max-w-md truncate">
                        "{item.notes}"
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold font-mono tabular-nums text-white">
                      ${item.amount.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-neutral-500 font-mono">
                      {item.paymentMethod}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
