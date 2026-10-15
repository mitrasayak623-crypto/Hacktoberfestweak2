/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_RECEIPTS } from './data/sampleReceipts';
import { OpenAiEngineConfig, ReceiptRecord } from './types/ledger';
import { DEFAULT_OPEN_SYSTEM_PROMPT } from './services/openAiEngine';
import { TopBar } from './components/TopBar';
import { LedgerTable } from './components/LedgerTable';
import { ScheduleCTaxSummary } from './components/ScheduleCTaxSummary';
import { ClientBillingPackets } from './components/ClientBillingPackets';
import { OpenAiManifesto } from './components/OpenAiManifesto';
import { FirstUserCaseStudy } from './components/FirstUserCaseStudy';
import { Vault3DScene } from './components/Vault3DScene';
import { GeminiChatbot } from './components/GeminiChatbot';
import { GeminiVoiceConversation } from './components/GeminiVoiceConversation';
import { ReceiptDropzone } from './components/ReceiptDropzone';
import { ReceiptDetailModal } from './components/ReceiptDetailModal';
import { EngineSettingsModal } from './components/EngineSettingsModal';
import { auth } from './firebase/config';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  saveReceiptToFirestore,
  deleteReceiptFromFirestore,
  subscribeToUserReceipts,
  syncAllReceiptsToFirestore,
} from './firebase/receiptSync';
import confetti from 'canvas-confetti';

export default function App() {
  const [receipts, setReceipts] = useState<ReceiptRecord[]>(INITIAL_RECEIPTS);
  const [currentTab, setCurrentTab] = useState<string>('ledger');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Engine Configuration
  const [engineConfig, setEngineConfig] = useState<OpenAiEngineConfig>({
    backend: 'browser_wasm',
    ollamaUrl: 'http://localhost:11434',
    ollamaModel: 'llama3.2:3b',
    temperature: 0.1,
    systemPrompt: DEFAULT_OPEN_SYSTEM_PROMPT,
  });

  // Modal states
  const [isIngestOpen, setIsIngestOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptRecord | null>(null);

  // 1. Firebase Authentication Listener & Firestore Real-Time Sync
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Upload initial sample receipts to Firestore if first time
        syncAllReceiptsToFirestore(user.uid, receipts);
        // Subscribe to live Firestore receipts
        const unsubscribeFirestore = subscribeToUserReceipts(user.uid, (firestoreReceipts) => {
          if (firestoreReceipts.length > 0) {
            setReceipts(firestoreReceipts);
          }
        });
        return () => unsubscribeFirestore();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      confetti({
        particleCount: 40,
        spread: 60,
        colors: ['#FACC15', '#3B82F6', '#10B981'],
      });
    } catch (err: any) {
      console.error('Firebase Auth sign in error:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error('Firebase Auth sign out error:', err);
    }
  };

  // Handlers with Firestore Persistence
  const handleSaveNewReceipt = (newRecord: ReceiptRecord) => {
    setReceipts((prev) => [newRecord, ...prev]);
    if (currentUser) {
      saveReceiptToFirestore(currentUser.uid, newRecord);
    }
  };

  const handleUpdateReceipt = (updated: ReceiptRecord) => {
    setReceipts((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    if (currentUser) {
      saveReceiptToFirestore(currentUser.uid, updated);
    }
  };

  const handleDeleteReceipt = (id: string) => {
    setReceipts((prev) => prev.filter((r) => r.id !== id));
    if (currentUser) {
      deleteReceiptFromFirestore(currentUser.uid, id);
    }
  };

  const handleVerifyAll = () => {
    const verified = receipts.map((r) =>
      r.status === 'needs_review' ? { ...r, status: 'verified' as const } : r
    );
    setReceipts(verified);
    if (currentUser) {
      syncAllReceiptsToFirestore(currentUser.uid, verified);
    }
    confetti({
      particleCount: 45,
      spread: 70,
      colors: ['#FACC15', '#EAB308', '#FFFFFF', '#10B981'],
    });
  };

  const getEngineDisplayLabel = () => {
    if (engineConfig.backend === 'ollama_local') {
      return `Ollama (${engineConfig.ollamaModel})`;
    }
    if (engineConfig.backend === 'browser_wasm') {
      return 'SmolLM2-1.7B (Local WASM)';
    }
    return 'Open Edge Grammar';
  };

  return (
    <div className="min-h-screen text-[#F3F4F6] flex flex-col font-sans selection:bg-yellow-400 selection:text-black">
      {/* Top Bar with Google Auth, AI Tools, and Brand */}
      <TopBar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenIngest={() => setIsIngestOpen(true)}
        onOpenEngineSettings={() => setIsSettingsOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenVoice={() => setIsVoiceOpen(true)}
        engineName={getEngineDisplayLabel()}
        currentUser={currentUser}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        {currentTab === 'vault-3d' && <Vault3DScene />}

        {currentTab === 'ledger' && (
          <LedgerTable
            receipts={receipts}
            onSelectReceipt={(r) => setSelectedReceipt(r)}
            onVerifyAll={handleVerifyAll}
            onOpenIngest={() => setIsIngestOpen(true)}
          />
        )}

        {currentTab === 'tax' && <ScheduleCTaxSummary receipts={receipts} />}

        {currentTab === 'reimbursements' && <ClientBillingPackets receipts={receipts} />}

        {currentTab === 'open-manifesto' && <OpenAiManifesto />}

        {currentTab === 'first-user' && <FirstUserCaseStudy />}
      </main>

      {/* Ingest Receipt / Invoice Modal */}
      <ReceiptDropzone
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
        onSaveReceipt={handleSaveNewReceipt}
        existingReceipts={receipts}
        engineConfig={engineConfig}
      />

      {/* Receipt Detail & Audit Drawer/Modal */}
      <ReceiptDetailModal
        receipt={selectedReceipt}
        isOpen={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
        onUpdate={handleUpdateReceipt}
        onDelete={handleDeleteReceipt}
      />

      {/* Open AI Engine Settings Modal */}
      <EngineSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={engineConfig}
        onSaveConfig={setEngineConfig}
      />

      {/* Multi-turn Gemini Chatbot with Google Search Grounding */}
      <GeminiChatbot
        receipts={receipts}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Real-time Gemini 3.8 Live Voice Advisor */}
      <GeminiVoiceConversation
        receipts={receipts}
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
      />

      {/* Quiet Luxury Footer */}
      <footer className="border-t border-blue-900/30 px-6 py-4 text-center text-xs text-neutral-400 font-mono">
        VaultLedger AI · Sovereign Zero-Cloud Bookkeeper & Three.js Vault · Firestore Synced & Google Search Grounded
      </footer>
    </div>
  );
}
