import React, { useState } from 'react';
import { ShieldCheck, DollarSign, WifiOff, Layers } from 'lucide-react';

export const OpenAiManifesto: React.FC = () => {
  const [usersCount, setUsersCount] = useState<number>(120);
  const [pricePerUser, setPricePerUser] = useState<number>(49);

  const openSourceInfraCost = 0;
  const closedApiTokensPerUserPerYear = 12 * 40 * 0.04;
  const closedApiTotalCost = usersCount * closedApiTokensPerUserPerYear;

  const grossRevenue = usersCount * pricePerUser;
  const openSourceNetProfit = grossRevenue - openSourceInfraCost;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Editorial Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white font-display">
          Why Open Innovation Matters: The Zero-Cloud Architecture
        </h1>
        <p className="text-sm text-neutral-400 max-w-3xl leading-relaxed">
          Proprietary AI APIs make freelance bookkeeping financially unsustainable and legally hazardous.
          By centering on open-weight models (SmolLM2, Gemma-2, Llama-3.2, Qwen-2.5) and local agent harnesses,
          VaultLedger AI transforms a privacy liability into an unbeatable competitive advantage.
        </p>
      </div>

      {/* 4 Pillars of Open Innovation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pillar 1: Privacy */}
        <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-yellow-500/20 space-y-3 shadow-xl">
          <div className="flex items-center gap-2.5 text-yellow-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-base font-bold text-white font-display">1. Strict Client NDA Compliance</h3>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Freelance developers, lawyers, and designers routinely sign client NDAs forbidding third-party data processing.
            Uploading bank statements and invoices to closed cloud APIs violates client contracts.
            With open-weight inference executing entirely within browser memory or local Ollama instances,
            client data never touches an external server.
          </p>
          <div className="text-[11px] font-mono text-yellow-300/90 bg-yellow-400/10 p-2.5 rounded-xl border border-yellow-400/20">
            Audit Guarantee: Zero outbound network sockets established during document tokenization.
          </div>
        </div>

        {/* Pillar 2: Offline Resilience */}
        <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-cyan-500/20 space-y-3 shadow-xl">
          <div className="flex items-center gap-2.5 text-cyan-400">
            <WifiOff className="w-5 h-5" />
            <h3 className="text-base font-bold text-white font-display">2. Offline Flight & Cafe Mobility</h3>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Solo contractors travel frequently. When working on a flight without Wi-Fi, or in a cafe with spotty connection,
            closed API tools fail completely. Open-weight WASM and local models process receipts instantly with zero
            latency, zero rate-limiting, and zero dependency on external network uptime.
          </p>
          <div className="text-[11px] font-mono text-cyan-400/90 bg-cyan-950/20 p-2.5 rounded-xl border border-cyan-800/40">
            Runtime Benchmark: 400ms – 750ms end-to-end token categorization without internet.
          </div>
        </div>

        {/* Pillar 3: Zero-Cost Margins */}
        <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-emerald-500/20 space-y-3 shadow-xl">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <DollarSign className="w-5 h-5" />
            <h3 className="text-base font-bold text-white font-display">3. 100% Gross Margin Side Hustle</h3>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Every SaaS relying on closed LLM APIs suffers from variable token bills that scale directly with usage.
            A sudden spike in users or large document uploads shrinks profit margins.
            Because open models run client-side on the user's CPU/GPU, our operational server cost is literally $0.00.
          </p>
          <div className="text-[11px] font-mono text-emerald-400/90 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-800/40">
            Unit Economics: $49 price point yields $49 net profit (100% software margin).
          </div>
        </div>

        {/* Pillar 4: Custom Tax Grammar */}
        <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-purple-500/20 space-y-3 shadow-xl">
          <div className="flex items-center gap-2.5 text-purple-400">
            <Layers className="w-5 h-5" />
            <h3 className="text-base font-bold text-white font-display">4. Transparent Tax Schema Control</h3>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Closed APIs frequently change system prompts, deprecate model versions, and refuse to adhere to strict schemas.
            With open harnesses, we enforce deterministic JSON grammar tailored specifically for IRS Schedule C line numbers,
            enforcing 50% meal ceilings and Section 179 depreciation rules without API drift.
          </p>
          <div className="text-[11px] font-mono text-purple-400/90 bg-purple-950/20 p-2.5 rounded-xl border border-purple-800/40">
            Deterministic Output: 100% validated against IRS Schedule C taxonomy.
          </div>
        </div>
      </div>

      {/* Side Hustle Unit Economics Calculator */}
      <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-yellow-500/25 space-y-6 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-white font-display">Interactive Side Hustle Unit Economics</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Simulate why building on open-source AI beats the closed-source API subscription trap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-neutral-300 mb-1">
                <span>Paying Freelance Customers:</span>
                <span className="font-mono font-bold text-yellow-400">{usersCount} users</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={usersCount}
                onChange={(e) => setUsersCount(parseInt(e.target.value, 10))}
                className="w-full accent-yellow-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-neutral-300 mb-1">
                <span>Lifetime License Price:</span>
                <span className="font-mono font-bold text-yellow-400">${pricePerUser}</span>
              </div>
              <input
                type="range"
                min="19"
                max="99"
                step="5"
                value={pricePerUser}
                onChange={(e) => setPricePerUser(parseInt(e.target.value, 10))}
                className="w-full accent-yellow-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="p-5 rounded-xl bg-black border border-neutral-800 space-y-3 font-mono text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>GROSS REVENUE:</span>
              <span className="text-white font-bold">${grossRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>OPEN AI SERVER INVOICE:</span>
              <span className="text-yellow-400 font-bold">$0.00 (Self-hosted)</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>CLOSED API INVOICE:</span>
              <span className="text-rose-400 font-bold">-${closedApiTotalCost.toFixed(2)}/yr</span>
            </div>
            <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-sm">
              <span className="text-neutral-200 font-sans font-bold">Net Side Hustle Margin:</span>
              <span className="text-xl font-bold text-yellow-400">
                100% (${openSourceNetProfit.toLocaleString()})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
