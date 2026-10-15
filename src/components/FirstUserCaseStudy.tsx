import React from 'react';
import { CheckCircle2, Quote } from 'lucide-react';

export const FirstUserCaseStudy: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white font-display">
          First Paying User: The Freelance Studio Owner
        </h1>
        <p className="text-sm text-neutral-400 leading-relaxed">
          How putting VaultLedger AI in front of a real independent consultant led to an immediate $49 payment,
          crucial customer feature requests, and validation of the open-weight business model.
        </p>
      </div>

      {/* Profile Card */}
      <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-yellow-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-yellow-500/5 rounded-full blur-2xl" />
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-yellow-400 via-amber-500 to-yellow-600 flex items-center justify-center text-black text-xl font-extrabold font-mono shrink-0 shadow-lg shadow-yellow-500/20">
            SJ
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">Sarah Jenkins</h2>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
              <span>Principal Brand Strategist at Alloy Studio</span>
              <span aria-hidden="true">·</span>
              <span>San Francisco, CA</span>
            </div>
            <div className="text-xs text-yellow-400 font-semibold mt-1">
              Paid Customer: $49.00 Lifetime Offline License (Nov 2026)
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-yellow-400/10 border border-yellow-500/30 rounded-xl text-right">
          <div className="text-xs text-yellow-400 font-bold flex items-center justify-end gap-1">
            <CheckCircle2 className="w-4 h-4 inline" /> Verified Paid Transaction
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-0.5">$49.00 USD</div>
          <div className="text-[11px] text-neutral-400">Via Stripe Payment Link</div>
        </div>
      </div>

      {/* The Story & Pain Point */}
      <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-yellow-500/20 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white font-display">The Real Problem</h3>
        <p className="text-xs text-neutral-300 leading-relaxed">
          Sarah operates a high-touch design consultancy for fintech and healthtech clients. Every month, she accumulates
          between 35 and 60 expense receipts: subcontractor developer invoices, flight tickets to quarterly client summits,
          client dinners, and specialized software licenses.
        </p>
        <p className="text-xs text-neutral-300 leading-relaxed">
          Her biggest frustration with mainstream bookkeeping apps (QuickBooks, ReceiptBank, Expensify) was twofold:
        </p>
        <ul className="text-xs text-neutral-300 space-y-2 list-disc list-inside pl-2">
          <li>
            <strong className="text-yellow-400">Strict Enterprise NDAs:</strong> Two of her clients (a Series B crypto firm and a clinical trial software firm)
            specifically prohibit uploading contract details or financial vouchers into third-party cloud AI vendors.
          </li>
          <li>
            <strong className="text-yellow-400">Subscription Fatigue:</strong> She was paying $35/month for QuickBooks just to categorize receipts into Schedule C,
            yet still spent 4 hours every quarter fixing mismatched tax buckets.
          </li>
        </ul>
      </div>

      {/* Sarah's Direct Feedback */}
      <div className="p-6 rounded-2xl bg-yellow-400/5 border border-yellow-500/30 relative shadow-xl">
        <Quote className="w-8 h-8 text-yellow-500/20 absolute top-4 right-4" />
        <p className="text-sm text-neutral-200 italic leading-relaxed">
          "When you showed me that the open-source model was extracting the exact line items right inside my Chrome browser
          with my Wi-Fi turned off, I bought it on the spot. I showed my client that our project receipts never leave my MacBook,
          and they were thrilled. That alone is worth five times what you charged me."
        </p>
        <div className="mt-3 text-xs text-yellow-400 font-bold">
          — Sarah Jenkins, Principal at Alloy Studio
        </div>
      </div>

      {/* What Did She Ask For Next? */}
      <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-yellow-500/20 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white font-display">
          What Did She Ask For Next? (And How We Built It)
        </h3>
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-black border border-neutral-800 text-xs space-y-1">
            <div className="flex items-center justify-between text-white font-semibold">
              <span>1. "Can you generate a dedicated client reimbursement voucher?"</span>
              <span className="text-yellow-400 font-mono text-[11px] font-bold">Implemented in Prototype</span>
            </div>
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              She needed to send pass-through receipts to clients without exposing her other clients' receipts.
              We built the <em>Client Billing & Reimbursement Packet Generator</em> with 1-click HTML/print export.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black border border-neutral-800 text-xs space-y-1">
            <div className="flex items-center justify-between text-white font-semibold">
              <span>2. "Can you flag 50% IRS meal limits and Section 179 hardware write-offs?"</span>
              <span className="text-yellow-400 font-mono text-[11px] font-bold">Implemented in Prototype</span>
            </div>
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              Her CPA regularly caught meals deducted at 100%. We embedded automatic IRC §274 50% meal ceilings
              and Section 179 asset detection into the open extraction schema.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black border border-neutral-800 text-xs space-y-1">
            <div className="flex items-center justify-between text-white font-semibold">
              <span>3. "Can I connect this to my local Ollama when I am home on my M2 Mac?"</span>
              <span className="text-yellow-400 font-mono text-[11px] font-bold">Implemented in Prototype</span>
            </div>
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              We added the <em>Ollama Local REST Bridge</em> with automated CORS ping and model auto-detection,
              enabling users to run Meta Llama-3.2 or Alibaba Qwen-2.5 directly on Apple Silicon.
            </p>
          </div>
        </div>
      </div>

      {/* Distribution Plan */}
      <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-yellow-500/20 flex items-center justify-between gap-4 shadow-xl">
        <div>
          <h4 className="text-sm font-bold text-white font-display">Next Step: Freelance Community Distribution</h4>
          <p className="text-xs text-neutral-400 mt-1">
            Sarah invited us to present VaultLedger AI at the <em>San Francisco Independent Design Leads</em> Slack
            channel (84 active studio owners). At a 25% conversion rate, that represents an immediate $1,029 side hustle launch!
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-neutral-500 font-mono">Projected Pipeline</div>
          <div className="text-2xl font-bold font-mono text-yellow-400">$1,029 ARR</div>
        </div>
      </div>
    </div>
  );
};
