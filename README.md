<div align="center">

# 🔐 VaultLedger AI
<img width="2940" height="1660" alt="image" src="https://github.com/user-attachments/assets/8f854702-0cc7-4afb-85f1-8d2f1559212e" />


### Zero-leak, local-first bookkeeping and invoice sorting for freelancers

*Your books. Your device. Your data.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit-D4AF37?style=for-the-badge&logo=vercel&logoColor=black)](https://hacktoberfestweak2.vercel.app/)
[![Open-Weight AI](https://img.shields.io/badge/AI-Open--Weight%20Models-000000?style=for-the-badge&labelColor=D4AF37)](#-how-the-ai-works)
[![Local First](https://img.shields.io/badge/Privacy-Local--First-000000?style=for-the-badge&labelColor=D4AF37)](#-privacy-first-by-design)
[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-2026-000000?style=for-the-badge&labelColor=D4AF37)](https://dev.to/challenges/hacktoberfest-week2-2026-10-12)

**[Live Demo](https://hacktoberfestweak2.vercel.app/)** · **[Features](#-features)** · **[Getting Started](#-getting-started)** · **[Roadmap](#-roadmap)** · **[Contributing](#-contributing)**

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Live Deployment](#-live-deployment)
- [The Problem](#-the-problem)
- [Features](#-features)
- [Privacy First by Design](#-privacy-first-by-design)
- [How the AI Works](#-how-the-ai-works)
- [Tech Stack](#-tech-stack)
- [How It Works](#-how-it-works)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [Why Open Innovation Matters](#-why-open-innovation-matters)
- [Contributing](#-contributing)
- [Acknowledgements](#-acknowledgements)

---

## 🌟 About

**VaultLedger AI** is a bookkeeping and invoice sorter built for freelancers, designers, developers, writers, and consultants who want the speed of AI without handing their clients' financial data to a third-party cloud.

Drop in invoices and receipts. An **open-weight AI model** reads them, extracts the key details, categorises each one, and builds a clean, organised ledger, all with your data staying on your own device.

The app is wrapped in a premium **black-and-gold interface** with an interactive **3D vault**, because managing money should feel secure and look good.

> Built for the [Hacktoberfest Open-Source AI Challenge, Week 2: Side Hustle](https://dev.to/challenges/hacktoberfest-week2-2026-10-12).

---

## 🌐 Live Deployment

VaultLedger AI is deployed and ready to try right now. No installation needed.

<div align="center">

### 👉 [**https://hacktoberfestweak2.vercel.app/**](https://hacktoberfestweak2.vercel.app/) 👈

[![Open Live App](https://img.shields.io/badge/Open%20Live%20App-Click%20Here-D4AF37?style=for-the-badge&logo=vercel&logoColor=black)](https://hacktoberfestweak2.vercel.app/)

</div>

---

## 🎯 The Problem

Freelancers deal with sensitive financial information every day: client names, payment amounts, tax details, and bank references. The usual options all have drawbacks:

| Option | The catch |
|---|---|
| **Manual spreadsheets** | Slow, tedious, and easy to get wrong at tax time |
| **Cloud AI bookkeeping tools** | Your invoices are uploaded to someone else's servers |
| **Doing nothing** | Receipts pile up and tax season becomes a scramble |

For freelancers working under client NDAs, uploading invoices to a third-party service can also be a contractual risk. VaultLedger AI is built so that risk doesn't exist.

---

## ✨ Features

### 🧾 Smart Invoice Sorting
- Upload invoices and receipts and let the AI extract vendor, date, amount, and tax details
- Automatic categorisation into income, expenses, and tax-deductible items
- Client-wise organisation so you can see who you earned from and what you spent

### 📒 Clean, Organised Ledger
- A structured ledger generated from your documents
- Running totals and summaries at a glance
- Easy to review, correct, and keep up to date

### 🔒 Zero-Leak Privacy
- Local-first architecture: your documents and ledger stay on your device
- Core sorting powered by an open-weight model you can inspect and control
- No required account and no required cloud upload

### 🏦 Interactive 3D Vault
- A black-and-gold 3D vault interface that makes your financial overview feel secure and tangible
- Responsive, premium design built for both desktop and mobile

### ⚡ Optional Live Intelligence
- Opt-in Gemini integration for users who want faster responses and accept the trade-off
- The core experience works without it

---

## 🛡 Privacy First by Design

Privacy is the foundation of this project, not an afterthought.

- **Local-first:** your financial data is processed and stored on your device.
- **Open and inspectable:** the core AI is an open-weight model, so you can verify how your data is handled instead of trusting a promise.
- **Opt-in cloud:** any cloud-powered feature is optional and clearly separated from the core workflow.
- **No lock-in:** your data stays yours and can be exported.

---

## 🧠 How the AI Works

VaultLedger AI is built around an **open-weight model** that runs under your control.

1. **Read:** the model reads the text of an uploaded invoice or receipt.
2. **Extract:** it pulls out the key fields: vendor, date, amount, tax.
3. **Classify:** it assigns a category (income, expense, deductible, and so on) and a client.
4. **Record:** the result is written to your local ledger.

**Model used:** `[your open-weight model name]`, run via `[your inference method, e.g. Ollama / llama.cpp / hosted open-weight endpoint]`

Because the model is open-weight, you can swap it for a newer or better one without rebuilding the app.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **AI core** | Open-weight model (`gemini`) |
| **Optional AI layer** | Google Gemini (opt-in) |
| **Frontend** | Web app with an interactive 3D vault, designed in Google Stitch and built in Google AI Studio |
| **Backend** | Invoice-processing and ledger logic, built with Claude |
| **Storage** | Local-first (on-device) |
| **Deployment** | Vercel |
| **Research** | Perplexity |

---

## 🔄 How It Works

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Upload     │ →  │   Extract    │ →  │   Classify   │ →  │    Ledger    │
│ invoice or   │    │ vendor, date │    │ category and │    │ totals and   │
│ receipt      │    │ amount, tax  │    │ client       │    │ 3D vault view│
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                  all processed locally by an open-weight model
```

---

## 🚀 Getting Started

### Try it instantly

No setup needed. Open the live demo:

👉 **https://hacktoberfestweak2.vercel.app/**

### Run it locally

**Installation**

```bash
# 1. Clone the repository
git clone https://github.com/[your-username]/[your-repo].git

# 2. Move into the project folder
cd [your-repo]

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

**Environment variables (optional)**

Only needed if you want the optional Gemini layer. The core app works without it.

```bash
# .env
GEMINI_API_KEY=your_key_here
```

> ⚠️ Never commit your `.env` file or API keys to the repository.

---

## 🖥 Usage

1. **Open the app** and enter the vault.
2. **Upload** one or more invoices or receipts.
3. **Review** the extracted details and categories the AI suggests.
4. **Correct** anything that looks off.
5. **Browse** your ledger, totals, and client breakdown.

---

## 📁 Project Structure

> Update this section to match your actual folders.

```
[your-repo]/
├── src/              # Application source code
│   ├── components/   # UI and 3D vault components
│   ├── lib/          # Invoice parsing and ledger logic
│   └── styles/       # Black-and-gold theme
├── public/           # Static assets
├── .env.example      # Example environment variables
└── README.md
```

---

## 🗺 Roadmap

- [x] Invoice upload and AI-powered extraction
- [x] Automatic categorisation and ledger
- [x] Interactive 3D vault interface
- [x] Live demo deployment
- [ ] Export to CSV and PDF
- [ ] Tax-season summary reports
- [ ] Multi-currency support
- [ ] Recurring invoice and subscription detection
- [ ] Fully offline desktop build
- [ ] Support for more open-weight models

Have an idea? [Open an issue](../../issues) and let's talk.

---

## 🌍 Why Open Innovation Matters

A bookkeeping tool is only as trustworthy as its handling of your data.

With a closed API, every invoice goes through someone else's servers, under terms you can't audit and can't change. **Open-weight models made this project's core promise possible: your financial data never has to leave your device.**

- 🔍 **Verifiable privacy:** you can inspect and control the model.
- 💸 **No per-call costs:** local inference doesn't bill per invoice, which protects freelancer margins.
- 🔄 **No lock-in:** swap in a better open model whenever one appears.
- 🤝 **Safe for client work:** usable under NDAs without breaking agreements.

For a financial tool, that's the difference between "trust us" and "check for yourself."

---

## 🤝 Contributing

Contributions are welcome, and this repo is a good fit for Hacktoberfest.

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m "Add your feature"`
4. **Push** to your branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

Good first contributions:
- Improving invoice field extraction accuracy
- Adding support for new invoice layouts
- UI and accessibility improvements
- Documentation and translations

---

## 🙏 Acknowledgements

- The open-source AI community, for the open-weight models that make local-first AI possible
- [DEV](https://dev.to/) and [Major League Hacking](https://mlh.io/), for running the Hacktoberfest Open-Source AI Challenge
- Google Stitch and Google AI Studio, for the frontend design and build
- Claude, for backend development
- Perplexity, for research

---

<div align="center">

**Built with 🖤 and ✨ for freelancers who value their privacy.**

⭐ If you find this project useful, please consider giving it a star!

</div>
