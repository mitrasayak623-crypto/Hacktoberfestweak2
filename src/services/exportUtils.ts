import { ReceiptRecord, SCHEDULE_C_LINE_MAP } from '../types/ledger';

/**
 * Download a string payload as a client-side file
 */
export function triggerFileDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate QuickBooks & Xero compatible CSV
 */
export function exportToQuickBooksCsv(receipts: ReceiptRecord[]) {
  const headers = [
    'Date',
    'Payee',
    'Amount',
    'Category',
    'Schedule C Line',
    'Invoice #',
    'Client/Project',
    'Billable',
    'Payment Method',
    'Notes',
    'Audit Status',
    'Open AI Model'
  ];

  const rows = receipts.map((r) => [
    `"${r.date}"`,
    `"${r.vendor.replace(/"/g, '""')}"`,
    r.amount.toFixed(2),
    `"${r.category}"`,
    `"${SCHEDULE_C_LINE_MAP[r.category] || 'Line 27a'}"`,
    `"${r.invoiceNumber || ''}"`,
    `"${r.clientProject}"`,
    r.isBillableToClient ? 'YES' : 'NO',
    `"${r.paymentMethod}"`,
    `"${(r.notes || '').replace(/"/g, '""')}"`,
    `"${r.status}"`,
    `"${r.extractionModel}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const filename = `VaultLedger_QuickBooks_Export_${new Date().toISOString().split('T')[0]}.csv`;
  triggerFileDownload(csvContent, filename, 'text/csv;charset=utf-8;');
}

/**
 * Generate IRS Schedule C Form 1040 Tax Summary CSV
 */
export function exportScheduleCCsv(receipts: ReceiptRecord[], taxBracket: number = 0.30) {
  const map: Record<string, { line: string; gross: number; deductible: number; count: number }> = {};

  for (const r of receipts) {
    if (!map[r.category]) {
      map[r.category] = {
        line: SCHEDULE_C_LINE_MAP[r.category] || 'Line 27a',
        gross: 0,
        deductible: 0,
        count: 0,
      };
    }
    const itemDeductible = (r.amount * r.deductiblePercentage) / 100;
    map[r.category].gross += r.amount;
    map[r.category].deductible += itemDeductible;
    map[r.category].count += 1;
  }

  const headers = ['IRS Schedule C Category', 'Form 1040 Line', 'Transaction Count', 'Gross Total ($)', 'Deductible Total ($)', `Est. Tax Savings (${Math.round(taxBracket * 100)}% Bracket)`];
  const rows = Object.entries(map).map(([cat, data]) => {
    const savings = data.deductible * taxBracket;
    return [
      `"${cat}"`,
      `"${data.line}"`,
      data.count,
      data.gross.toFixed(2),
      data.deductible.toFixed(2),
      savings.toFixed(2),
    ];
  });

  const totalGross = receipts.reduce((sum, r) => sum + r.amount, 0);
  const totalDeductible = receipts.reduce((sum, r) => sum + (r.amount * r.deductiblePercentage) / 100, 0);
  const totalSavings = totalDeductible * taxBracket;

  rows.push([
    '"TOTAL SCHEDULE C EXPENSES"',
    '"All Lines"',
    receipts.length,
    totalGross.toFixed(2),
    totalDeductible.toFixed(2),
    totalSavings.toFixed(2),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const filename = `IRS_Schedule_C_Tax_Deductions_${new Date().toISOString().split('T')[0]}.csv`;
  triggerFileDownload(csvContent, filename, 'text/csv;charset=utf-8;');
}

/**
 * Generate Client Billable Expense Voucher (Printable HTML / Report)
 */
export function generateClientReimbursementReport(clientName: string, receipts: ReceiptRecord[]): string {
  const clientReceipts = receipts.filter(
    (r) => r.clientProject.toLowerCase() === clientName.toLowerCase() && r.isBillableToClient
  );

  const totalDue = clientReceipts.reduce((sum, r) => sum + r.amount, 0);
  const reportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const invoiceId = `EXP-VOUCHER-${Math.floor(100000 + Math.random() * 900000)}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Client Expense Voucher - ${clientName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; padding: 40px; max-width: 850px; margin: 0 auto; line-height: 1.5; }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
    .badge { background: #f1f5f9; padding: 4px 8px; font-size: 12px; border-radius: 4px; font-weight: 600; color: #475569; }
    h1 { margin: 0; font-size: 24px; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; margin-top: 30px; font-size: 14px; }
    th { text-align: left; padding: 10px; background: #f8fafc; border-bottom: 2px solid #cbd5e1; }
    td { padding: 12px 10px; border-bottom: 1px solid #e2e8f0; }
    .num { text-align: right; font-variant-numeric: tabular-nums; font-family: monospace; }
    .total-box { margin-top: 30px; text-align: right; padding: 20px; background: #f8fafc; border-radius: 8px; }
    .footer { margin-top: 50px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>ITEMIZED CLIENT REIMBURSEMENT VOUCHER</h1>
      <p style="margin: 4px 0; color: #64748b;">Generated via VaultLedger AI (Zero-Leak Local Audit Engine)</p>
    </div>
    <div style="text-align: right;">
      <span class="badge">${invoiceId}</span>
      <p style="margin: 4px 0; font-size: 13px;">Date: ${reportDate}</p>
    </div>
  </div>

  <div style="margin-top: 24px; display: flex; justify-content: space-between;">
    <div>
      <strong style="font-size: 12px; color: #64748b; text-transform: uppercase;">Billed To Client:</strong>
      <h3 style="margin: 4px 0;">${clientName}</h3>
      <p style="margin: 0; font-size: 13px; color: #475569;">Pass-through authorized client disbursements</p>
    </div>
    <div style="text-align: right;">
      <strong style="font-size: 12px; color: #64748b; text-transform: uppercase;">Payment Terms:</strong>
      <p style="margin: 4px 0; font-size: 14px; font-weight: 600;">Net 15 / Direct Deposit</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Vendor / Description</th>
        <th>Category</th>
        <th>Reference #</th>
        <th class="num">Amount (USD)</th>
      </tr>
    </thead>
    <tbody>
      ${clientReceipts
        .map(
          (r) => `
        <tr>
          <td>${r.date}</td>
          <td><strong>${r.vendor}</strong><br><span style="font-size: 12px; color: #64748b;">${r.notes || ''}</span></td>
          <td>${r.category}</td>
          <td>${r.invoiceNumber || '—'}</td>
          <td class="num">$${r.amount.toFixed(2)}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="total-box">
    <div style="font-size: 14px; color: #64748b;">Total Billable Expenses (${clientReceipts.length} item${clientReceipts.length === 1 ? '' : 's'})</div>
    <div style="font-size: 28px; font-weight: 700; color: #0f172a; margin-top: 4px; font-variant-numeric: tabular-nums;">
      $${totalDue.toFixed(2)} USD
    </div>
  </div>

  <div class="footer">
    <p><strong>Privacy & Compliance Seal:</strong> This report was compiled strictly on-device using local open-weight AI models. Zero financial receipt data or client identifiers were transferred to external cloud API endpoints.</p>
  </div>
</body>
</html>
  `;
}
