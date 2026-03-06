import { useState, useRef } from "react";

const GROQ_API_KEY   = process.env.REACT_APP_GROQ_API_KEY;
const TAVILY_API_KEY = process.env.REACT_APP_TAVILY_API_KEY;

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0f; --surface: #111118; --surface2: #1a1a24;
    --border: #2a2a3a; --accent: #00e5ff; --accent3: #a855f7;
    --text: #e8e8f0; --muted: #6b6b8a;
    --real: #00d68f; --fake: #ff3d6b; --uncertain: #ffb547;
  }
  body { background: var(--bg); }
  .app { min-height: 100vh; background: var(--bg); font-family: 'Syne', sans-serif; color: var(--text); position: relative; overflow-x: hidden; }
  .grid-bg { position: fixed; inset: 0; background-image: linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px); background-size: 40px 40px; pointer-events: none; z-index: 0; }
  .header { position: relative; z-index: 10; padding: 20px 40px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: rgba(10,10,15,0.9); backdrop-filter: blur(20px); }
  .logo { display: flex; align-items: center; gap: 12px; }
  .logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, var(--accent), var(--accent3)); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .logo-text { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
  .logo-text span { color: var(--accent); }
  .live-badge { display: flex; align-items: center; gap: 6px; font-family: 'IBM Plex Mono', monospace; font-size: 10px; padding: 5px 12px; border: 1px solid var(--real); color: var(--real); border-radius: 20px; letter-spacing: 1px; }
  .live-dot { width: 6px; height: 6px; background: var(--real); border-radius: 50%; animation: pulse 1.5s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.4)} }
  .main { position: relative; z-index: 10; max-width: 860px; margin: 0 auto; padding: 56px 24px 80px; }
  .hero { text-align: center; margin-bottom: 48px; }
  .hero h1 { font-size: clamp(34px,6vw,60px); font-weight: 800; line-height: 1.05; letter-spacing: -2px; margin-bottom: 14px; }
  .highlight { background: linear-gradient(90deg, var(--accent), var(--accent3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .hero p { color: var(--muted); font-size: 15px; max-width: 520px; margin: 0 auto; line-height: 1.6; }
  .pill { display: inline-flex; align-items: center; gap: 6px; background: rgba(0,214,143,0.1); border: 1px solid rgba(0,214,143,0.3); border-radius: 20px; padding: 5px 14px; font-size: 12px; color: var(--real); font-family: 'IBM Plex Mono', monospace; margin-bottom: 20px; }

  /* Tabs */
  .input-section { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: border-color 0.2s; }
  .input-section:focus-within { border-color: var(--accent); box-shadow: 0 0 0 1px rgba(0,229,255,0.1); }
  .tabs { display: flex; border-bottom: 1px solid var(--border); }
  .tab { flex: 1; padding: 13px 8px; background: none; border: none; color: var(--muted); font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 5px; }
  .tab.active { color: var(--accent); background: rgba(0,229,255,0.05); border-bottom: 2px solid var(--accent); }
  .tab:hover:not(.active) { color: var(--text); background: rgba(255,255,255,0.02); }
  .input-body { padding: 24px; }
  textarea, input[type="text"] { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-family: 'IBM Plex Mono', monospace; font-size: 13px; padding: 16px; resize: none; outline: none; transition: border-color 0.2s; line-height: 1.6; }
  textarea { height: 150px; }
  textarea:focus, input[type="text"]:focus { border-color: var(--accent); }
  .input-row { display: flex; gap: 10px; }
  .input-row input { flex: 1; height: 48px; }
  .btn { padding: 13px 28px; background: var(--accent); color: #0a0a0f; border: none; border-radius: 10px; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; white-space: nowrap; }
  .btn:hover:not(:disabled) { background: #33eaff; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,229,255,0.3); }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .btn-full { width: 100%; margin-top: 14px; }

  /* Image Upload */
  .drop-zone { border: 2px dashed var(--border); border-radius: 12px; padding: 40px 24px; text-align: center; cursor: pointer; transition: all 0.2s; background: var(--surface2); position: relative; }
  .drop-zone:hover, .drop-zone.drag-over { border-color: var(--accent); background: rgba(0,229,255,0.04); }
  .drop-zone input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .drop-icon { font-size: 40px; margin-bottom: 12px; }
  .drop-title { font-size: 16px; font-weight: 700; margin-bottom: 6px; }
  .drop-sub { font-size: 12px; color: var(--muted); font-family: 'IBM Plex Mono', monospace; }
  .drop-formats { display: flex; gap: 6px; justify-content: center; margin-top: 12px; }
  .fmt-badge { font-size: 10px; padding: 3px 8px; border: 1px solid var(--border); border-radius: 4px; color: var(--muted); font-family: 'IBM Plex Mono', monospace; }

  /* Image Preview */
  .img-preview-wrap { position: relative; margin-top: 16px; border-radius: 10px; overflow: hidden; border: 1px solid var(--border); }
  .img-preview { width: 100%; max-height: 320px; object-fit: contain; background: var(--surface2); display: block; }
  .img-remove { position: absolute; top: 10px; right: 10px; width: 28px; height: 28px; background: rgba(255,61,107,0.9); border: none; border-radius: 50%; color: white; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; }
  .img-remove:hover { transform: scale(1.1); }
  .img-info { padding: 10px 14px; background: var(--surface2); border-top: 1px solid var(--border); display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--muted); font-family: 'IBM Plex Mono', monospace; }
  .img-name { color: var(--text); font-weight: 600; }

  /* OCR Result */
  .ocr-box { margin-top: 12px; background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 14px; }
  .ocr-label { font-size: 10px; color: var(--accent); font-family: 'IBM Plex Mono', monospace; letter-spacing: 1.5px; margin-bottom: 8px; text-transform: uppercase; }
  .ocr-text { font-size: 13px; color: var(--text); line-height: 1.6; font-family: 'IBM Plex Mono', monospace; max-height: 120px; overflow-y: auto; }

  /* Progress */
  .progress-box { margin-top: 28px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 28px 32px; }
  .progress-title { font-size: 11px; color: var(--muted); font-family: 'IBM Plex Mono', monospace; letter-spacing: 1.5px; margin-bottom: 20px; }
  .step-list { display: flex; flex-direction: column; gap: 12px; }
  .step-row { display: flex; align-items: center; gap: 14px; font-size: 13px; }
  .step-ico { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }
  .step-ico.done   { background: rgba(0,214,143,0.15); color: var(--real); }
  .step-ico.active { background: rgba(0,229,255,0.15); color: var(--accent); animation: blink 1s infinite; }
  .step-ico.pending{ background: var(--surface2); color: var(--muted); }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .step-lbl.done   { color: var(--text); }
  .step-lbl.active { color: var(--accent); }
  .step-lbl.pending{ color: var(--muted); }

  /* Result */
  .result { margin-top: 28px; border-radius: 16px; overflow: hidden; border: 1px solid var(--border); animation: up 0.4s ease; }
  @keyframes up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .banner { padding: 26px 30px; display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
  .banner.real     { background: linear-gradient(135deg,rgba(0,214,143,.15),rgba(0,214,143,.04)); border-bottom:1px solid rgba(0,214,143,.2); }
  .banner.fake     { background: linear-gradient(135deg,rgba(255,61,107,.15),rgba(255,61,107,.04)); border-bottom:1px solid rgba(255,61,107,.2); }
  .banner.uncertain{ background: linear-gradient(135deg,rgba(255,181,71,.15),rgba(255,181,71,.04)); border-bottom:1px solid rgba(255,181,71,.2); }
  .v-icon { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
  .real .v-icon     { background: rgba(0,214,143,.15); }
  .fake .v-icon     { background: rgba(255,61,107,.15); }
  .uncertain .v-icon{ background: rgba(255,181,71,.15); }
  .v-label { font-size: 11px; font-family: 'IBM Plex Mono', monospace; letter-spacing: 2px; opacity:.6; margin-bottom:4px; }
  .v-title { font-size: 26px; font-weight: 800; letter-spacing:-.5px; }
  .real .v-title     { color: var(--real); }
  .fake .v-title     { color: var(--fake); }
  .uncertain .v-title{ color: var(--uncertain); }
  .ring-wrap { margin-left: auto; text-align: right; }
  .ring-lbl { font-size: 10px; color: var(--muted); font-family: 'IBM Plex Mono', monospace; letter-spacing:1px; margin-bottom:6px; }
  .ring { position: relative; width: 68px; height: 68px; margin-left: auto; }
  .ring svg { transform: rotate(-90deg); }
  .ring-num { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; font-family: 'IBM Plex Mono', monospace; }
  .body { background: var(--surface); padding: 26px 30px; }
  .summary { font-size: 14px; line-height: 1.75; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--border); }
  .grid4 { display: grid; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); gap: 10px; margin-bottom: 24px; }
  .sig-card { background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 14px; }
  .sig-lbl { font-size: 10px; color: var(--muted); letter-spacing: 1.5px; font-family: 'IBM Plex Mono', monospace; margin-bottom: 8px; text-transform: uppercase; }
  .bar-bg { background: var(--border); border-radius: 4px; height: 5px; overflow: hidden; margin-bottom: 6px; }
  .bar { height: 100%; border-radius: 4px; }
  .sig-val { font-size: 17px; font-weight: 700; }
  .sec-title { font-size: 11px; color: var(--muted); letter-spacing: 1.5px; font-family: 'IBM Plex Mono', monospace; margin-bottom: 10px; text-transform: uppercase; }
  .flag { display: flex; align-items: flex-start; gap: 10px; padding: 10px 14px; background: var(--surface2); border-radius: 8px; margin-bottom: 8px; font-size: 13px; line-height: 1.5; }
  .dot { width: 7px; height: 7px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
  .dot.red    { background: var(--fake); }
  .dot.yellow { background: var(--uncertain); }
  .dot.green  { background: var(--real); }
  .sources-box { margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border); }
  .source-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 14px; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 8px; text-decoration: none; transition: border-color 0.2s; }
  .source-item:hover { border-color: var(--accent); }
  .source-title { font-size: 13px; color: var(--text); font-weight: 600; margin-bottom: 3px; }
  .source-url   { font-size: 11px; color: var(--accent); font-family: 'IBM Plex Mono', monospace; }
  .source-snippet { font-size: 12px; color: var(--muted); margin-top: 4px; line-height: 1.5; }
  .source-num { width: 22px; height: 22px; border-radius: 50%; background: rgba(0,229,255,0.1); border: 1px solid rgba(0,229,255,0.2); color: var(--accent); font-size: 11px; font-family: 'IBM Plex Mono', monospace; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
  .err  { margin-top: 16px; padding: 16px 20px; background: rgba(255,61,107,.08); border: 1px solid rgba(255,61,107,.25); border-radius: 10px; font-size: 13px; color: var(--fake); font-family: 'IBM Plex Mono', monospace; line-height: 1.6; white-space: pre-wrap; }
  .warn { margin-top: 16px; padding: 18px 20px; background: rgba(255,181,71,.08); border: 1px solid rgba(255,181,71,.25); border-radius: 10px; font-size: 13px; color: var(--uncertain); font-family: 'IBM Plex Mono', monospace; line-height: 1.8; }
  @media(max-width:600px){
    .header{padding:16px 20px;}
    .main{padding:36px 16px 60px;}
    .body{padding:18px;}
    .banner{padding:18px;}
    .tab{font-size:11px; padding:12px 4px;}
  }
`;

const Ring = ({ value, color }) => {
  const r = 27, c = 2 * Math.PI * r;
  return (
    <div className="ring">
      <svg width="68" height="68" viewBox="0 0 68 68">
        <circle cx="34" cy="34" r={r} fill="none" stroke="#2a2a3a" strokeWidth="5" />
        <circle cx="34" cy="34" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${(value / 100) * c} ${c}`} strokeLinecap="round" />
      </svg>
      <div className="ring-num" style={{ color }}>{value}%</div>
    </div>
  );
};

const SIG_LABELS = { source_credibility:"Source Credibility", factual_accuracy:"Factual Accuracy", emotional_language:"Emotional Language", logical_consistency:"Logical Consistency" };
const SIG_COLORS = { source_credibility:"var(--accent)", factual_accuracy:"var(--real)", emotional_language:"var(--fake)", logical_consistency:"var(--accent3)" };
const V_COLOR    = { REAL:"var(--real)", FAKE:"var(--fake)", UNCERTAIN:"var(--uncertain)" };
const V_CLASS    = { REAL:"real", FAKE:"fake", UNCERTAIN:"uncertain" };
const V_EMOJI    = { REAL:"✓", FAKE:"✗", UNCERTAIN:"?" };

// Convert file to base64
const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload  = () => resolve(reader.result.split(",")[1]);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

export default function App() {
  const [tab, setTab]           = useState("text");
  const [text, setText]         = useState("");
  const [url, setUrl]           = useState("");
  const [image, setImage]       = useState(null);      // { file, preview, base64 }
  const [extractedText, setExtractedText] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [step, setStep]         = useState(-1);
  const [steps, setSteps]       = useState([]);
  const [result, setResult]     = useState(null);
  const [sources, setSources]   = useState([]);
  const [error, setError]       = useState(null);
  const fileRef = useRef();

  // ── Image Handling ──────────────────────────────────────────────────────────
  const handleImageFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPG, PNG, WEBP, GIF).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image too large. Please use an image under 10MB.");
      return;
    }
    const preview = URL.createObjectURL(file);
    const base64  = await toBase64(file);
    setImage({ file, preview, base64, type: file.type });
    setExtractedText("");
    setResult(null);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  };

  const removeImage = () => {
    setImage(null);
    setExtractedText("");
    setResult(null);
  };

  // ── Extract text from image using Groq vision ───────────────────────────────
  const extractTextFromImage = async (base64, mimeType) => {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",  // Groq vision model
        max_tokens: 1024,
        messages: [{
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64}` }
            },
            {
              type: "text",
              text: "Extract ALL text visible in this image exactly as it appears. Include headlines, body text, captions, usernames, dates, and any other text. Return only the extracted text, nothing else."
            }
          ]
        }]
      })
    });
    if (!res.ok) {
      const e = await res.json();
      throw new Error("Vision error: " + (e?.error?.message || res.status));
    }
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || "";
  };

  // ── Main analyze function ───────────────────────────────────────────────────
  const analyze = async () => {
    if (!GROQ_API_KEY || !TAVILY_API_KEY) {
      setError("⚠ Missing API keys.\n\nAdd to .env:\nREACT_APP_GROQ_API_KEY=gsk_...\nREACT_APP_TAVILY_API_KEY=tvly_...\n\nThen restart: npm start");
      return;
    }

    const isImage = tab === "image";
    const content = tab === "text" ? text.trim() : tab === "url" ? url.trim() : "";

    if (!isImage && !content) return;
    if (isImage && !image) return;

    setLoading(true); setResult(null); setError(null); setSources([]); setStep(0);

    // Build steps based on mode
    const stepList = isImage
      ? [
          { id: "ocr",     label: "🖼️ Reading text from image with AI vision..." },
          { id: "tavily",  label: "🌐 Searching live web with extracted text..." },
          { id: "fetch",   label: "📰 Fetching results from fact-checkers..." },
          { id: "groq",    label: "🤖 Analyzing with Groq AI + live data..." },
          { id: "verdict", label: "⚖️ Generating final verdict..." },
        ]
      : [
          { id: "tavily",  label: "🌐 Searching the live web with Tavily..." },
          { id: "fetch",   label: "📰 Fetching results from fact-checkers..." },
          { id: "groq",    label: "🤖 Sending live data to Groq AI..." },
          { id: "signals", label: "📊 Computing credibility signals..." },
          { id: "verdict", label: "⚖️ Generating final verdict..." },
        ];
    setSteps(stepList);

    try {
      let newsContent = content;
      let currentStep = 0;
      setStep(currentStep);

      // ── IMAGE MODE: extract text first ──────────────────────────────────────
      if (isImage) {
        const extracted = await extractTextFromImage(image.base64, image.type);
        if (!extracted || extracted.trim().length < 10) {
          throw new Error("Could not extract readable text from this image. Please try a clearer image or paste the text manually.");
        }
        setExtractedText(extracted);
        newsContent = extracted;
        currentStep = 1;
        setStep(currentStep);
      }

      // ── TAVILY LIVE SEARCH ─────────────────────────────────────────────────
      const searchQuery = newsContent.length > 200 ? newsContent.slice(0, 200) : newsContent;

      const tavilyRes = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: TAVILY_API_KEY,
          query: searchQuery,
          search_depth: "advanced",
          include_answer: true,
          include_domains: [
            "snopes.com","politifact.com","reuters.com",
            "bbc.com","apnews.com","factcheck.org",
            "afpfactcheck.com","altnews.in","boomlive.in",
            "thequint.com","ndtv.com","thehindu.com"
          ],
          max_results: 6
        })
      });

      currentStep++;
      setStep(currentStep);

      if (!tavilyRes.ok) {
        const e = await tavilyRes.json();
        throw new Error("Tavily error: " + (e?.detail || e?.message || tavilyRes.status));
      }

      const tavilyData    = await tavilyRes.json();
      const searchResults = tavilyData?.results || [];
      const tavilyAnswer  = tavilyData?.answer  || "";
      setSources(searchResults);

      const searchContext = searchResults.map((r, i) =>
        `[Source ${i + 1}] ${r.title}\nURL: ${r.url}\nSnippet: ${r.content}`
      ).join("\n\n");

      // ── GROQ ANALYSIS ──────────────────────────────────────────────────────
      currentStep++;
      setStep(currentStep);

      const today  = new Date().toDateString();
      const source = isImage ? "screenshot/image" : tab === "url" ? "URL/headline" : "article text";

      const prompt = `You are a professional news fact-checker. Today is ${today}.

The user submitted a ${source} for fact-checking.
${isImage ? `\nThis content was extracted from an uploaded image using AI vision.\n` : ""}

LIVE WEB SEARCH ANSWER (from Tavily):
${tavilyAnswer || "No direct answer found."}

LIVE SEARCH RESULTS:
${searchContext || "No search results found."}

NEWS CONTENT TO VERIFY:
"""
${newsContent}
"""

Based ONLY on the live search results, give your verdict:
- REAL: if results confirm the news
- FAKE: if results contradict or debunk it
- UNCERTAIN: if results are mixed or insufficient

Respond ONLY with valid JSON (no markdown, no code fences):
{
  "verdict": "REAL" or "FAKE" or "UNCERTAIN",
  "confidence": <0-100>,
  "summary": "<2-3 sentences explaining verdict based on live search results>",
  "signals": {
    "source_credibility": <0-100>,
    "factual_accuracy": <0-100>,
    "emotional_language": <0-100>,
    "logical_consistency": <0-100>
  },
  "flags": [
    { "type": "red",    "text": "<specific concern from search results>" },
    { "type": "yellow", "text": "<something uncertain>" },
    { "type": "green",  "text": "<something supporting credibility>" }
  ]
}`;

      currentStep++;
      setStep(currentStep);

      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.1,
          max_tokens: 1024,
          messages: [
            { role: "system", content: "You are an expert news fact-checker. Respond only with valid JSON. Never use markdown or code fences." },
            { role: "user",   content: prompt }
          ]
        })
      });

      if (!groqRes.ok) {
        const e = await groqRes.json();
        throw new Error("Groq error: " + (e?.error?.message || groqRes.status));
      }

      const groqData = await groqRes.json();
      const raw      = groqData?.choices?.[0]?.message?.content || "";
      const clean    = raw.replace(/```json|```/gi, "").trim();
      const match    = clean.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Could not parse AI response. Please try again.");

      setStep(stepList.length);
      setResult(JSON.parse(match[0]));

    } catch (e) {
      setError("Analysis failed: " + (e.message || "Unknown error. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const vc  = result?.verdict || "UNCERTAIN";
  const col = V_COLOR[vc] || "var(--uncertain)";
  const canAnalyze = !loading && (
    (tab === "text"  && text.trim()) ||
    (tab === "url"   && url.trim())  ||
    (tab === "image" && image)
  );

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="grid-bg" />

        <header className="header">
          <div className="logo">
            <div className="logo-icon">🔍</div>
            <div className="logo-text">Truth<span>Lens</span></div>
          </div>
          <div className="live-badge"><div className="live-dot" />TAVILY + GROQ · LIVE</div>
        </header>

        <main className="main">
          <div className="hero">
            <div className="pill">🌐 Live web search + AI vision — text, URLs & images</div>
            <h1>Stop Reading<br /><span className="highlight">Fake News</span></h1>
            <p>Paste text, enter a URL, or <strong>upload a screenshot</strong>. We search the web live and cross-reference real fact-checkers for an accurate verdict.</p>
          </div>

          <div className="input-section">
            <div className="tabs">
              <button className={`tab ${tab === "text"  ? "active" : ""}`} onClick={() => setTab("text")}>📝 Text</button>
              <button className={`tab ${tab === "url"   ? "active" : ""}`} onClick={() => setTab("url")}>🔗 URL</button>
              <button className={`tab ${tab === "image" ? "active" : ""}`} onClick={() => setTab("image")}>🖼️ Image</button>
            </div>

            <div className="input-body">
              {/* TEXT TAB */}
              {tab === "text" && (<>
                <textarea
                  placeholder="Paste a news article, headline, or social media post here..."
                  value={text}
                  onChange={e => setText(e.target.value)}
                />
                <button className="btn btn-full" onClick={analyze} disabled={!canAnalyze}>
                  {loading ? "Analyzing..." : "⚡ Fact-Check with Live Search"}
                </button>
              </>)}

              {/* URL TAB */}
              {tab === "url" && (
                <div className="input-row">
                  <input type="text" placeholder="Paste a URL or headline to analyze..." value={url} onChange={e => setUrl(e.target.value)} />
                  <button className="btn" onClick={analyze} disabled={!canAnalyze}>{loading ? "..." : "⚡ Analyze"}</button>
                </div>
              )}

              {/* IMAGE TAB */}
              {tab === "image" && (<>
                {!image ? (
                  <div
                    className={`drop-zone ${dragOver ? "drag-over" : ""}`}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={e => { if (e.target.files[0]) handleImageFile(e.target.files[0]); }}
                    />
                    <div className="drop-icon">🖼️</div>
                    <div className="drop-title">Drop image here or click to upload</div>
                    <div className="drop-sub">Screenshot of news, social media post, WhatsApp forward</div>
                    <div className="drop-formats">
                      {["JPG","PNG","WEBP","GIF"].map(f => <span className="fmt-badge" key={f}>{f}</span>)}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="img-preview-wrap">
                      <img className="img-preview" src={image.preview} alt="uploaded" />
                      <button className="img-remove" onClick={removeImage}>✕</button>
                    </div>
                    <div className="img-info">
                      <span>📎</span>
                      <span className="img-name">{image.file.name}</span>
                      <span>·</span>
                      <span>{(image.file.size / 1024).toFixed(0)} KB</span>
                    </div>
                    {extractedText && (
                      <div className="ocr-box">
                        <div className="ocr-label">✦ Text extracted from image</div>
                        <div className="ocr-text">{extractedText}</div>
                      </div>
                    )}
                    <button className="btn btn-full" onClick={analyze} disabled={!canAnalyze}>
                      {loading ? "Analyzing image..." : "⚡ Fact-Check This Image"}
                    </button>
                  </>
                )}
              </>)}
            </div>
          </div>

          {(!GROQ_API_KEY || !TAVILY_API_KEY) && (
            <div className="warn">
              ⚠ Missing API keys. Add both to your .env file:<br />
              <strong>REACT_APP_GROQ_API_KEY=gsk_...</strong><br />
              <strong>REACT_APP_TAVILY_API_KEY=tvly_...</strong><br />
              Then restart: <strong>npm start</strong>
            </div>
          )}

          {loading && steps.length > 0 && (
            <div className="progress-box">
              <div className="progress-title">LIVE FACT-CHECK IN PROGRESS</div>
              <div className="step-list">
                {steps.map((s, i) => {
                  const st = i < step ? "done" : i === step ? "active" : "pending";
                  return (
                    <div className="step-row" key={s.id}>
                      <div className={`step-ico ${st}`}>{st === "done" ? "✓" : st === "active" ? "◉" : "○"}</div>
                      <span className={`step-lbl ${st}`}>{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {error && <div className="err">{error}</div>}

          {result && (
            <div className="result">
              <div className={`banner ${V_CLASS[vc] || "uncertain"}`}>
                <div className="v-icon">{V_EMOJI[vc]}</div>
                <div>
                  <div className="v-label">VERDICT — LIVE WEB DATA</div>
                  <div className="v-title">{vc}</div>
                </div>
                <div className="ring-wrap">
                  <div className="ring-lbl">CONFIDENCE</div>
                  <Ring value={result.confidence || 0} color={col} />
                </div>
              </div>

              <div className="body">
                <p className="summary">{result.summary}</p>

                <div className="grid4">
                  {Object.entries(result.signals || {}).map(([k, v]) => (
                    <div className="sig-card" key={k}>
                      <div className="sig-lbl">{SIG_LABELS[k] || k}</div>
                      <div className="bar-bg"><div className="bar" style={{ width: `${v}%`, background: SIG_COLORS[k] }} /></div>
                      <div className="sig-val" style={{ color: SIG_COLORS[k] }}>{v}<span style={{ fontSize: 11, opacity: .5 }}>/100</span></div>
                    </div>
                  ))}
                </div>

                <div className="sec-title">Key Findings</div>
                {(result.flags || []).map((f, i) => (
                  <div className="flag" key={i}>
                    <div className={`dot ${f.type}`} /><span>{f.text}</span>
                  </div>
                ))}

                {sources.length > 0 && (
                  <div className="sources-box">
                    <div className="sec-title">🌐 Live Sources Checked ({sources.length})</div>
                    {sources.map((s, i) => (
                      <a className="source-item" key={i} href={s.url} target="_blank" rel="noreferrer">
                        <div className="source-num">{i + 1}</div>
                        <div>
                          <div className="source-title">{s.title}</div>
                          <div className="source-url">{new URL(s.url).hostname}</div>
                          {s.content && <div className="source-snippet">{s.content.slice(0, 120)}...</div>}
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}