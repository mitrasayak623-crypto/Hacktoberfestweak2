export type TaxCategory =
  | 'Advertising & Marketing'
  | 'Contract Labor'
  | 'Office Expenses'
  | 'Legal & Professional Services'
  | 'Travel'
  | 'Deductible Meals (50%)'
  | 'Software & Cloud Subscriptions'
  | 'Equipment & Tech Hardware'
  | 'Utilities & Phone'
  | 'Education & Subscriptions'
  | 'Other Expenses';

export type ReceiptStatus = 'verified' | 'needs_review' | 'flagged';

export interface LineItem {
  description: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice: number;
}

export interface ReceiptRecord {
  id: string;
  filename: string;
  vendor: string;
  invoiceNumber?: string;
  date: string;
  amount: number;
  currency: string;
  taxAmount: number;
  category: TaxCategory;
  isDeductible: boolean;
  deductiblePercentage: number; // e.g. 100 or 50
  clientProject: string;
  isBillableToClient: boolean;
  paymentMethod: string;
  notes: string;
  rawText: string;
  status: ReceiptStatus;
  confidenceScore: number; // 0 - 100
  flags: string[];
  extractionModel: string; // e.g. "SmolLM2-1.7B (Local)", "Llama-3.2-3B (Ollama)", "Gemma-2-2B (WASM)"
  processedAt: string;
  hasVisualPreview: boolean;
  previewType?: 'receipt' | 'invoice' | 'subscription' | 'hardware';
}

export interface ClientSummary {
  name: string;
  totalBillable: number;
  receiptCount: number;
  lastExpenseDate: string;
}

export interface ScheduleCBreakdown {
  category: TaxCategory;
  scheduleCLine: string;
  totalAmount: number;
  deductibleAmount: number;
  count: number;
}

export interface OpenAiEngineConfig {
  backend: 'browser_wasm' | 'ollama_local' | 'edge_rule_harness';
  ollamaUrl: string;
  ollamaModel: string;
  temperature: number;
  systemPrompt: string;
}

export const SCHEDULE_C_LINE_MAP: Record<TaxCategory, string> = {
  'Advertising & Marketing': 'Line 8 - Advertising',
  'Contract Labor': 'Line 11 - Contract labor',
  'Office Expenses': 'Line 18 - Office expense',
  'Legal & Professional Services': 'Line 17 - Legal and professional services',
  'Travel': 'Line 24a - Travel',
  'Deductible Meals (50%)': 'Line 24b - Deductible meals (50% limit)',
  'Software & Cloud Subscriptions': 'Line 27a - Other expenses: Software/SaaS',
  'Equipment & Tech Hardware': 'Line 13 - Depreciation and Section 179',
  'Utilities & Phone': 'Line 25 - Utilities',
  'Education & Subscriptions': 'Line 27a - Other expenses: Professional education',
  'Other Expenses': 'Line 27a - Other expenses',
};
