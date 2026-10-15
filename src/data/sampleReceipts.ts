import { ReceiptRecord } from '../types/ledger';

export const INITIAL_RECEIPTS: ReceiptRecord[] = [
  {
    id: 'rcpt-101',
    filename: 'adobe_creative_cloud_nov2026.pdf',
    vendor: 'Adobe Systems Inc.',
    invoiceNumber: 'ADB-994218-US',
    date: '2026-11-04',
    amount: 54.99,
    currency: 'USD',
    taxAmount: 4.54,
    category: 'Software & Cloud Subscriptions',
    isDeductible: true,
    deductiblePercentage: 100,
    clientProject: 'Internal Operations',
    isBillableToClient: false,
    paymentMethod: 'Visa •••• 4092',
    notes: 'Monthly Creative Cloud All Apps subscription for design client deliverables',
    rawText: `ADOBE SYSTEMS SOFTWARE IRELAND LIMITED
Tax Invoice / Receipt: ADB-994218-US
Date: November 04, 2026
Sold To: Sayak Mitra / Independent Design
Item: Creative Cloud All Apps (1 Month)
Subtotal: $50.45
Tax (US State Tax): $4.54
Total Charged: $54.99 USD
Paid with Visa ending in 4092`,
    status: 'verified',
    confidenceScore: 98,
    flags: [],
    extractionModel: 'SmolLM2-1.7B (Local Open Engine)',
    processedAt: '2026-11-04T14:32:00Z',
    hasVisualPreview: true,
    previewType: 'subscription',
  },
  {
    id: 'rcpt-102',
    filename: 'osteria_client_dinner.jpg',
    vendor: 'Osteria Del Corso',
    invoiceNumber: 'CHK-8012',
    date: '2026-11-08',
    amount: 142.50,
    currency: 'USD',
    taxAmount: 11.88,
    category: 'Deductible Meals (50%)',
    isDeductible: true,
    deductiblePercentage: 50,
    clientProject: 'Acme Corp Rebranding',
    isBillableToClient: true,
    paymentMethod: 'Amex •••• 1004',
    notes: 'Dinner with VP Product (Sarah Chen) discussing Q1 UX sprint roadmap',
    rawText: `OSTERIA DEL CORSO - DOWNTOWN
Table: 14 | Server: Marcus | Guest Count: 2
Date: 11/08/2026 8:15 PM
1x Burrata Pugliese - $22.00
1x Pappardelle Cinghiale - $34.00
1x Branzino al Forno - $42.00
2x San Pellegrino - $16.00
Subtotal: $114.00
Tax: $11.88
Tip (15%): $16.62
TOTAL: $142.50
Card: AMEX 1004 - Approved`,
    status: 'needs_review',
    confidenceScore: 94,
    flags: ['50% deduction limit applied (IRS Rule)', 'Marked billable to Acme Corp'],
    extractionModel: 'SmolLM2-1.7B (Local Open Engine)',
    processedAt: '2026-11-08T22:04:12Z',
    hasVisualPreview: true,
    previewType: 'receipt',
  },
  {
    id: 'rcpt-103',
    filename: 'subcontractor_dev_inv_044.txt',
    vendor: 'Elena Rostova (Frontend Eng)',
    invoiceNumber: 'INV-2026-044',
    date: '2026-11-10',
    amount: 1450.00,
    currency: 'USD',
    taxAmount: 0.00,
    category: 'Contract Labor',
    isDeductible: true,
    deductiblePercentage: 100,
    clientProject: 'Acme Corp Rebranding',
    isBillableToClient: true,
    paymentMethod: 'ACH Direct Transfer',
    notes: 'Subcontracted React performance optimization and accessible modal work (29 hrs @ $50/hr)',
    rawText: `INVOICE #INV-2026-044
From: Elena Rostova (Independent Contractor, W-9 on file)
To: Sayak Studio LLC
Date: Nov 10, 2026
Services: Acme Corp Rebrand Web Component Library
Hours: 29.0 @ $50.00/hr
Balance Due: $1,450.00 USD
Payment Terms: Net 15 via ACH`,
    status: 'verified',
    confidenceScore: 99,
    flags: ['Schedule C Line 11 (Contract Labor) - W-9 recorded'],
    extractionModel: 'Llama-3.2-3B (Local Open Weights)',
    processedAt: '2026-11-10T10:15:00Z',
    hasVisualPreview: true,
    previewType: 'invoice',
  },
  {
    id: 'rcpt-104',
    filename: 'micro_center_4k_display.jpg',
    vendor: 'Micro Center Electronics #042',
    invoiceNumber: 'MC-77402-A',
    date: '2026-11-12',
    amount: 429.99,
    currency: 'USD',
    taxAmount: 35.47,
    category: 'Equipment & Tech Hardware',
    isDeductible: true,
    deductiblePercentage: 100,
    clientProject: 'Internal Operations',
    isBillableToClient: false,
    paymentMethod: 'Apple Pay (Mastercard •••• 8820)',
    notes: 'Dell Ultrasharp 27" 4K USB-C monitor for dual-screen freelance workstation',
    rawText: `MICRO CENTER - STORE #042
Transaction: 8840291 | Cashier: Dave
Date: 11/12/2026 14:48
SKU: 684210 DELL U2723QE 4K IPS - $394.52
Tax: $35.47
Total Tendered: $429.99
Card Type: MC Apple Pay
Section 179 Eligible Equipment`,
    status: 'verified',
    confidenceScore: 96,
    flags: ['Eligible for Section 179 first-year write-off'],
    extractionModel: 'SmolLM2-1.7B (Local Open Engine)',
    processedAt: '2026-11-12T16:10:00Z',
    hasVisualPreview: true,
    previewType: 'hardware',
  },
  {
    id: 'rcpt-105',
    filename: 'uber_client_onsite_sprint.txt',
    vendor: 'Uber Technologies, Inc.',
    invoiceNumber: 'UBR-TRIP-9982',
    date: '2026-11-14',
    amount: 38.40,
    currency: 'USD',
    taxAmount: 2.10,
    category: 'Travel',
    isDeductible: true,
    deductiblePercentage: 100,
    clientProject: 'Fintech Mobile App',
    isBillableToClient: true,
    paymentMethod: 'Visa •••• 4092',
    notes: 'Transit to client headquarters for executive design critique',
    rawText: `UBER TRIP RECEIPT
Trip ID: UBR-TRIP-9982
Date: Nov 14, 2026 09:12 AM
Pickup: Home Office, SOMA
Dropoff: 450 Mission St (Fintech Client HQ)
Trip Fare: $32.00
Tolls / Surcharge: $4.30
Tax: $2.10
Total: $38.40 USD
Payment: Visa •••• 4092`,
    status: 'verified',
    confidenceScore: 97,
    flags: ['Marked billable to Fintech Mobile App'],
    extractionModel: 'SmolLM2-1.7B (Local Open Engine)',
    processedAt: '2026-11-14T09:45:00Z',
    hasVisualPreview: true,
    previewType: 'receipt',
  },
  {
    id: 'rcpt-106',
    filename: 'github_copilot_enterprise.pdf',
    vendor: 'GitHub, Inc.',
    invoiceNumber: 'GH-88319-B',
    date: '2026-11-15',
    amount: 19.00,
    currency: 'USD',
    taxAmount: 0.00,
    category: 'Software & Cloud Subscriptions',
    isDeductible: true,
    deductiblePercentage: 100,
    clientProject: 'Internal Operations',
    isBillableToClient: false,
    paymentMethod: 'Visa •••• 4092',
    notes: 'GitHub Copilot coding assistant for client web builds',
    rawText: `GITHUB, INC. - RECEIPT
Invoice: GH-88319-B
Customer: Sayak Studio
Date: 2026-11-15
Plan: GitHub Copilot Individual ($19.00/mo)
Total: $19.00 USD
Status: Paid in full`,
    status: 'verified',
    confidenceScore: 99,
    flags: [],
    extractionModel: 'SmolLM2-1.7B (Local Open Engine)',
    processedAt: '2026-11-15T08:00:00Z',
    hasVisualPreview: true,
    previewType: 'subscription',
  }
];

export const RAW_SAMPLE_PRESETS = [
  {
    title: 'Cafe Client Breakfast ($38.20)',
    description: 'Meeting with prospect, 50% IRS meal deduction',
    filename: 'blue_bottle_client_breakfast.txt',
    previewType: 'receipt' as const,
    rawText: `BLUE BOTTLE COFFEE - MINT PLAZA
Order #4812 | Register 2
Date: 11/16/2026 09:40 AM
1x Avocado Toast Tartine - $14.50
1x Hayes Valley Espresso - $4.75
1x New Orleans Iced Coffee - $6.25
1x Almond Croissant - $5.50
Subtotal: $31.00
Sales Tax: $2.72
Tip: $4.48
TOTAL CHARGE: $38.20
Tender: Visa Ending in 4092
Client: Sarah / Rebrand Discovery`,
  },
  {
    title: 'Figma Professional Plan ($15.00)',
    description: 'Monthly UI design software subscription',
    filename: 'figma_monthly_subscription.txt',
    previewType: 'subscription' as const,
    rawText: `FIGMA INC. INVOICE #FIG-910482
Date: Nov 16, 2026
Billed To: Sayak Mitra (Freelance Designer)
Description: Figma Professional Plan (1 Editor Seat)
Billing Period: Nov 16, 2026 - Dec 16, 2026
Amount: $15.00 USD
Sales Tax: $0.00
Total: $15.00
Paid via Stripe Mastercard •••• 8820`,
  },
  {
    title: 'Subcontractor Copywriter ($680.00)',
    description: '1099 Contract labor invoice for Fintech App',
    filename: 'copywriter_invoice_inv104.txt',
    previewType: 'invoice' as const,
    rawText: `STUDIO VERSE / LIAM CHEN COPYWRITING
INVOICE #: SV-2026-104
Date: November 15, 2026
Bill To: Sayak Studio
Project: Fintech Mobile App - Onboarding UX Copy & Microcopy
Scope: 4 App Screen flows + 2 email drip templates
Total Due: $680.00 USD
Payment Method: Wire / Venmo Business
Tax ID / SSN on file for 1099-NEC`,
  },
  {
    title: 'Keychron Mechanical Keyboard ($119.00)',
    description: 'Workstation hardware equipment',
    filename: 'keychron_order_receipt.txt',
    previewType: 'hardware' as const,
    rawText: `KEYCHRON ONLINE STORE
Order #KC-88401
Date: 11/14/2026
Item: Keychron Q1 Pro Wireless Mechanical Keyboard (Brown Switches)
Price: $109.00
Shipping: $0.00 (Free Ground)
Tax: $10.00
Order Total: $119.00
Paid with PayPal`,
  },
  {
    title: '⚠️ Duplicate Check Test Receipt ($54.99)',
    description: 'Duplicate test to verify local anomaly detection',
    filename: 'adobe_duplicate_receipt.pdf',
    previewType: 'subscription' as const,
    rawText: `ADOBE SYSTEMS SOFTWARE IRELAND LIMITED
Tax Invoice / Receipt: ADB-994218-US
Date: November 04, 2026
Sold To: Sayak Mitra / Independent Design
Item: Creative Cloud All Apps (1 Month)
Subtotal: $50.45
Tax: $4.54
Total Charged: $54.99 USD
Paid with Visa ending in 4092`,
  }
];
