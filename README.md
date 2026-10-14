# TruthLens — Website Credibility & Claim Verification

TruthLens analyzes **public webpages only**. Submit an HTTP(S) URL to extract the article, identify checkable factual claims, search for independent evidence, and review a claim-by-claim report with source links.

> TruthLens is an AI-assisted research tool, not an authority that can definitively declare a website true or false. Verify important claims against the linked sources.

## What it does

- Accepts a public website URL (no standalone text or image uploads).
- Extracts readable article content and basic metadata.
- Identifies up to six checkable factual claims.
- Searches the live web for each claim using Tavily.
- Uses Groq to classify each claim as **Supported**, **Contradicted**, **Mixed evidence**, or **Unverified**.
- Shows explanation, assessment confidence, and the evidence links used.

A lack of evidence is reported as **Unverified**, not automatically false. The overall result summarizes checked claims; it is not a site-wide trust score.

## Stack

- React 19 + Create React App
- Node.js + Express API
- Mozilla Readability + JSDOM for article extraction
- Tavily Search API for evidence retrieval
- Groq API for claim extraction and evidence assessment

## Requirements

- Node.js 18 or newer
- npm
- API keys from [Groq Console](https://console.groq.com/keys) and [Tavily](https://app.tavily.com/)

## Run locally

```bash
git clone https://github.com/Rajarikam117/truthlens.git
cd truthlens
npm install
cp .env.example .env
```

Edit `.env` with your own keys (never commit real keys):

```env
GROQ_API_KEY=gsk_your_key_here
TAVILY_API_KEY=tvly_your_key_here
# Optional: override the default model after checking availability in your Groq account
GROQ_MODEL=openai/gpt-oss-120b
PORT=3001
```

Open two terminals:

Terminal 1 — backend:
```bash
npm run api
```

Terminal 2 — frontend:
```bash
npm start
```

The React dev server proxies `/api` calls to `http://localhost:3001`. Check `http://localhost:3001/api/health` to see whether the backend is running.

## Deployment

Deploy the React UI and Express API to a host that supports Node.js (for example, a single service on Render). Configure `GROQ_API_KEY`, `TAVILY_API_KEY`, and optionally `GROQ_MODEL` in the host's secret/environment settings. Do **not** put provider keys in `REACT_APP_*` variables: frontend variables are bundled into browser JavaScript and are not secret.

For a production deployment, serve the built React static files from Express or host the frontend separately and configure an exact allowed origin. Add persistent storage and user authentication only if needed.

## Security notes

- API keys are read only by the backend.
- The API applies basic rate limiting and request-size limits.
- URL fetching permits only HTTP/HTTPS, validates DNS results, blocks common private/local IP ranges, checks redirects, caps HTML at 2 MB, and uses timeouts.
- This is a baseline, not a substitute for a production SSRF review. DNS rebinding and unusual IPv6 forms require stronger network-level egress controls in production.
- Only analyze pages you are allowed to access. Some websites block automated fetching or require a login.

## Limitations

- JavaScript-heavy, paywalled, authenticated, and non-HTML pages may not be readable.
- Search snippets may be incomplete, stale, or lack context.
- Search results and models can be wrong. Assessment confidence is not the probability that a claim is true.
- This version does not support images, screenshots, file uploads, or checking free-form pasted text.

## License

MIT
