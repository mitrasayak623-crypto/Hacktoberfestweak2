import React from 'react';
import { Plus, ShieldCheck, Cpu, MessageSquare, Radio, Box, LogIn, LogOut, CloudCheck } from 'lucide-react';
import { User } from 'firebase/auth';

interface TopBarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenIngest: () => void;
  onOpenEngineSettings: () => void;
  onOpenChat: () => void;
  onOpenVoice: () => void;
  engineName: string;
  currentUser: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onTabChange,
  onOpenIngest,
  onOpenEngineSettings,
  onOpenChat,
  onOpenVoice,
  engineName,
  currentUser,
  onSignIn,
  onSignOut,
}) => {
  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-blue-500/25 bg-[#050A16]/90 backdrop-blur-md sticky top-0 z-40 shadow-xl">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onTabChange('ledger');
          }}
          className="text-xl font-extrabold tracking-tight font-display text-white hover:text-yellow-400 transition-colors flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-yellow-400 inline-block shadow-[0_0_12px_#facc15]" />
          <span className="gold-gradient-text">VAULTLEDGER</span>
          <span className="text-[10px] font-mono font-bold text-yellow-300 px-1.5 py-0.5 rounded border border-yellow-400/40 bg-yellow-400/10">
            PRO
          </span>
        </a>

        <button
          onClick={onOpenEngineSettings}
          title="Open AI Engine & Privacy Config"
          className="hidden xl:flex items-center gap-1.5 text-xs text-neutral-400 hover:text-yellow-400 transition-colors border border-blue-500/25 px-2.5 py-1 rounded-xl bg-blue-950/40"
        >
          <Cpu className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-mono text-[11px] truncate max-w-[130px]">{engineName.split(' ')[0]}</span>
          <span className="text-blue-800">·</span>
          <ShieldCheck className="w-3 h-3 text-cyan-400" />
          <span className="text-[11px] text-cyan-300 font-medium">Air-Gapped</span>
        </button>
      </div>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-neutral-300 font-sans">
        <button
          onClick={() => onTabChange('vault-3d')}
          className={`flex items-center gap-1.5 hover:text-yellow-400 transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'vault-3d' ? 'text-yellow-400 font-bold border-b-2 border-yellow-400 pb-1' : ''
          }`}
        >
          <Box className="w-3.5 h-3.5 text-cyan-400" />
          <span>3D Vault</span>
        </button>
        <button
          onClick={() => onTabChange('ledger')}
          className={`hover:text-yellow-400 transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'ledger' ? 'text-yellow-400 font-bold border-b-2 border-yellow-400 pb-1' : ''
          }`}
        >
          Expense Ledger
        </button>
        <button
          onClick={() => onTabChange('tax')}
          className={`hover:text-yellow-400 transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'tax' ? 'text-yellow-400 font-bold border-b-2 border-yellow-400 pb-1' : ''
          }`}
        >
          Schedule C Taxes
        </button>
        <button
          onClick={() => onTabChange('reimbursements')}
          className={`hover:text-yellow-400 transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'reimbursements' ? 'text-yellow-400 font-bold border-b-2 border-yellow-400 pb-1' : ''
          }`}
        >
          Client Billing
        </button>
        <button
          onClick={() => onTabChange('open-manifesto')}
          className={`hover:text-yellow-400 transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'open-manifesto' ? 'text-yellow-400 font-bold border-b-2 border-yellow-400 pb-1' : ''
          }`}
        >
          Why Open AI
        </button>
        <button
          onClick={() => onTabChange('first-user')}
          className={`hover:text-yellow-400 transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'first-user' ? 'text-yellow-400 font-bold border-b-2 border-yellow-400 pb-1' : ''
          }`}
        >
          Case Study
        </button>
      </nav>

      {/* Zone 3: Interactive AI Tools, Google Auth & Primary Action */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Gemini Live Voice Conversation Trigger */}
        <button
          onClick={onOpenVoice}
          title="Open Gemini 3.8 Live Voice Assistant"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-yellow-300 bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/30 rounded-xl transition-all"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse text-yellow-400" />
          <span className="hidden sm:inline">Live Voice</span>
        </button>

        {/* Gemini Chatbot Trigger with Search Grounding */}
        <button
          onClick={onOpenChat}
          title="Open Multi-Turn Gemini CPA Chat"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-200 bg-blue-950/60 hover:bg-blue-900/50 border border-blue-500/30 rounded-xl transition-all"
        >
          <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">AI CPA Chat</span>
        </button>

        {/* Firebase Authentication & Google Sign-in */}
        {currentUser ? (
          <div className="flex items-center gap-2 p-1 pl-2 bg-blue-950/40 border border-blue-500/30 rounded-xl">
            <div className="flex items-center gap-1 text-[11px] text-cyan-300 font-mono hidden md:flex">
              <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Synced</span>
            </div>
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'User'}
                className="w-6 h-6 rounded-full border border-yellow-400/50"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-yellow-400 text-black text-xs font-bold flex items-center justify-center">
                {currentUser.displayName ? currentUser.displayName[0] : 'U'}
              </div>
            )}
            <button
              onClick={onSignOut}
              title="Sign Out of Firebase"
              className="p-1 hover:text-red-400 text-neutral-400 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onSignIn}
            title="Sign in with Google to sync to Firestore"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-200 bg-blue-950/50 hover:bg-blue-900/50 border border-blue-500/30 rounded-xl transition-all"
          >
            <LogIn className="w-3.5 h-3.5 text-yellow-400" />
            <span className="hidden md:inline">Google Sign In</span>
          </button>
        )}

        {/* Primary Action Button */}
        <button
          onClick={onOpenIngest}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 rounded-xl transition-all whitespace-nowrap shrink-0 shadow-[0_0_20px_rgba(250,204,21,0.3)] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Ingest Document</span>
        </button>
      </div>
    </header>
  );
};
