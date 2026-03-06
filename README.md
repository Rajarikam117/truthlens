# 🔍 TruthLens — AI-Powered Fake News Detector

> Stop reading fake news. TruthLens searches the live web, cross-references real fact-checkers, and delivers an instant credibility verdict on any news article, URL, or image.

![TruthLens](https://img.shields.io/badge/TruthLens-Fake%20News%20Detector-00e5ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Groq](https://img.shields.io/badge/Groq-LLaMA%203-ff6b35?style=for-the-badge)
![Tavily](https://img.shields.io/badge/Tavily-Live%20Search-00d68f?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-a855f7?style=for-the-badge)

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting API Keys](#getting-api-keys)
- [Installation & Setup](#installation--setup)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About the Project

TruthLens was built out of frustration with the flood of fake news and misleading articles on social media and news platforms. Instead of relying on AI training data alone (which goes stale), TruthLens:

1. **Searches the live web in real time** using Tavily Search API
2. **Fetches results from trusted fact-checkers** like Snopes, PolitiFact, Reuters, BBC, AltNews, BoomLive
3. **Sends the live results to Groq AI** (LLaMA 3.3 70B) for analysis
4. **Delivers a verdict** — REAL, FAKE, or UNCERTAIN — with a confidence score and clickable sources

This means every analysis is based on **current, real-world data** — not outdated training data.

---

## ✨ Features

- 📝 **Text Analysis** — Paste any news article, headline, or social media post
- 🔗 **URL Analysis** — Enter any news URL or headline to fact-check
- 🖼️ **Image Analysis** — Upload screenshots of news, WhatsApp forwards, or social media posts
- 🌐 **Live Web Search** — Tavily searches the web in real time before every verdict
- 📰 **Fact-Checker Integration** — Cross-references Snopes, PolitiFact, Reuters, BBC, AltNews, BoomLive
- 📊 **Credibility Signals** — 4 scored dimensions: Source Credibility, Factual Accuracy, Emotional Language, Logical Consistency
- 🔎 **Clickable Sources** — See exactly which live sources were consulted
- ⚡ **Fast** — Powered by Groq (fastest AI inference available)
- 🆓 **Free** — Both Groq and Tavily have generous free tiers
- 🌍 **Works in India** — No region restrictions unlike Google Gemini

---

## ⚙️ How It Works

```
User Input (Text / URL / Image)
            │
            ▼
  ┌─────────────────────┐
  │  IMAGE MODE ONLY    │
  │  Groq Vision AI     │
  │  extracts text from │
  │  the image          │
  └────────┬────────────┘
           │
           ▼
  ┌─────────────────────┐
  │   Tavily Search     │
  │   Searches live web │
  │   in real time      │
  │   (6 trusted sites) │
  └────────┬────────────┘
           │
           ▼
  ┌─────────────────────┐
  │   Groq AI           │
  │   LLaMA 3.3 70B     │
  │   Analyzes news +   │
  │   live search data  │
  └────────┬────────────┘
           │
           ▼
  Verdict: REAL / FAKE / UNCERTAIN
  Confidence Score (0-100%)
  4 Credibility Signal Scores
  Key Findings
  Clickable Live Sources
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 | UI framework |
| **Styling** | CSS-in-JS | Custom dark theme |
| **AI Model** | Groq — LLaMA 3.3 70B | News credibility analysis |
| **AI Vision** | Groq — LLaMA 4 Scout | Extract text from images |
| **Live Search** | Tavily Search API | Real-time web search |
| **Fact Sources** | Snopes, PolitiFact, Reuters, BBC, AltNews, BoomLive | Credibility cross-reference |
| **Deployment** | Vercel | Hosting & CI/CD |

---

## 📦 Prerequisites

Make sure you have these installed before starting:

- **Node.js** v18 or higher — [Download here](https://nodejs.org)
- **npm** v9 or higher (comes with Node.js)
- **VS Code** (recommended) — [Download here](https://code.visualstudio.com)
- **Git** — [Download here](https://git-scm.com)

Check your versions:
```bash
node -v    # should show v18.x.x or higher
npm -v     # should show v9.x.x or higher
git --version
```

---

## 🔑 Getting API Keys

You need **2 free API keys**. Both are completely free with no credit card required.

### 1. Groq API Key (Free)

Groq powers the AI analysis. It's free with 14,400 requests/day.

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up with your Google account
3. Click **"API Keys"** in the left sidebar
4. Click **"Create API Key"**
5. Name it `TruthLens`
6. Copy the key — it starts with `gsk_...`

### 2. Tavily API Key (Free)

Tavily powers the live web search. It's free with 1,000 searches/month.

1. Go to [app.tavily.com](https://app.tavily.com)
2. Sign up with your Google account
3. Your API key is shown on the dashboard
4. Copy the key — it starts with `tvly_...`

---

## 🚀 Installation & Setup

Follow these steps exactly to get TruthLens running locally.

### Step 1 — Clone or Create the Project

**Option A: Clone from GitHub** (if you've already pushed it)
```bash
git clone https://github.com/Rajarikam117/truthlens.git
cd truthlens
```

**Option B: Create fresh with Create React App**
```bash
npx create-react-app truthlens
cd truthlens
```

### Step 2 — Open in VS Code
```bash
code .
```

### Step 3 — Clean the src/ folder

Delete these default files inside `src/`:
```
App.css
App.test.js
logo.svg
reportWebVitals.js
setupTests.js
```

Keep only:
```
src/
├── App.jsx    ← rename App.js to App.jsx
└── index.js
```

### Step 4 — Add the App Code

Replace everything inside `src/App.jsx` with the TruthLens component code.

Replace everything inside `src/index.js` with:
```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

### Step 5 — Create the .env File

In the **root** of your project (same level as `package.json`, NOT inside `src/`), create a file called `.env`:

```
REACT_APP_GROQ_API_KEY=gsk_your_groq_key_here
REACT_APP_TAVILY_API_KEY=tvly_your_tavily_key_here
```

> ⚠️ **Never share this file or commit it to GitHub. Your API keys are private.**

### Step 6 — Protect Your Keys

Make sure `.env` is listed in `.gitignore`. Open `.gitignore` and confirm this line exists:
```
.env
```

### Step 7 — Install Dependencies
```bash
npm install
```

---

## ▶️ Running the Project

### Development Mode
```bash
npm start
```
Opens at **http://localhost:3000** in your browser. The page auto-reloads when you make changes.

### Production Build
```bash
npm run build
```
Creates an optimized build in the `build/` folder ready for deployment.

---

## 📁 Project Structure

```
truthlens/
│
├── public/                  # Static files (don't modify)
│   ├── index.html           # HTML shell
│   ├── favicon.ico          # Browser tab icon
│   └── manifest.json        # PWA metadata
│
├── src/                     # Source code
│   ├── App.jsx              # ← Main TruthLens component (all logic here)
│   └── index.js             # React entry point
│   |__ index.css
|
├── .env                     # 🔐 API keys (never commit this)
├── .gitignore               # Git ignore rules
├── package.json             # Project dependencies & scripts
├── package-lock.json        # Locked dependency versions
└── README.md                # This file
```

---

## 🔐 Environment Variables

| Variable | Description | Where to Get |
|---|---|---|
| `REACT_APP_GROQ_API_KEY` | Groq AI API key for LLaMA 3 analysis | [console.groq.com](https://console.groq.com) |
| `REACT_APP_TAVILY_API_KEY` | Tavily API key for live web search | [app.tavily.com](https://app.tavily.com) |

> All React environment variables **must** start with `REACT_APP_` — otherwise React won't expose them to the frontend.

> After editing `.env`, you must **restart** the dev server (`Ctrl+C` then `npm start`) for changes to take effect.

---

## 🌐 Deployment

### Deploy to Vercel (Recommended — Free)

#### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/Rajarikam117/truthlens.git
git branch -M main
git push -u origin main
```

#### Step 2 — Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"Add New Project"**
4. Import your `truthlens` repository
5. Click **"Deploy"** (Vercel auto-detects React)

#### Step 3 — Add Environment Variables on Vercel
1. Go to your project → **Settings** → **Environment Variables**
2. Add both keys:
   - `REACT_APP_GROQ_API_KEY` = your Groq key
   - `REACT_APP_TAVILY_API_KEY` = your Tavily key
3. Click **Save**
4. Go to **Deployments** → **Redeploy**

Your app is now live at `https://truthlens.vercel.app` 🎉

#### Auto-Deploy on Every Push
After setup, every `git push` automatically redeploys:
```bash
git add .
git commit -m "update feature"
git push
```

---

## 🗺️ Roadmap

- [x] Text article analysis
- [x] URL / headline analysis
- [x] Image / screenshot analysis
- [x] Live web search with Tavily
- [x] Fact-checker cross-reference
- [x] Credibility signal scoring
- [x] Clickable live sources
- [ ] Browser extension (Chrome/Firefox)
- [ ] Social media feed scanner (Twitter/X, Reddit)
- [ ] WhatsApp bot integration
- [ ] Multi-language support (Hindi, Telugu, Tamil)
- [ ] User dashboard with analysis history
- [ ] Public REST API for developers
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## ❓ Troubleshooting

| Problem | Solution |
|---|---|
| `Module not found: logo.svg` | Old code in App.jsx — replace entire file with TruthLens code |
| `API key not found` | Check `.env` file exists at root, has `REACT_APP_` prefix, restart `npm start` |
| `Quota exceeded` (Gemini) | Switch to Groq — no region restrictions |
| `Analysis failed` | Check both API keys are valid and `.env` is saved |
| CORS error in browser | Need Express proxy backend — raise an issue |
| Vercel deploy works but API fails | Add environment variables in Vercel Settings and redeploy |

---

## 📄 License

This project is licensed under the MIT License — feel free to use, modify, and distribute it.

---

## 🙏 Acknowledgements

- [Groq](https://groq.com) — Ultra-fast AI inference
- [Tavily](https://tavily.com) — AI-optimized search API
- [Meta LLaMA](https://llama.meta.com) — Open source AI model
- [Snopes](https://snopes.com), [PolitiFact](https://politifact.com), [Reuters Fact Check](https://reuters.com/fact-check), [AltNews](https://altnews.in), [BoomLive](https://boomlive.in) — Fact-checking sources

---

<div align="center">
  Built with ❤️ to fight misinformation
  <br/>
  <strong>TruthLens — Because Truth Matters</strong>
</div>