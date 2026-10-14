import { useState } from "react";
import "./index.css";

const verdictStyles = {
  SUPPORTED: { label: "Supported", color: "#53d6a6", icon: "✓" },
  CONTRADICTED: { label: "Contradicted", color: "#ff6b78", icon: "!" },
  MIXED: { label: "Mixed evidence", color: "#f5c46b", icon: "±" },
  UNVERIFIED: { label: "Unverified", color: "#9ca3af", icon: "?" }
};

function normalizeUrl(value) {
  const trimmed = value.trim();
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const url = new URL(candidate);
  if (!["http:", "https:"].includes(url.protocol) || !url.hostname.includes(".") || url.username || url.password) {
    throw new Error("Enter a valid public website URL, such as https://example.com/article.");
  }
  return url.href;
}

function ClaimCard({ item, index }) {
  const style = verdictStyles[item.verdict] || verdictStyles.UNVERIFIED;
  return <article className="claim-card">
    <div className="claim-heading">
      <span className="claim-index">{String(index + 1).padStart(2, "0")}</span>
      <span className="claim-verdict" style={{ color: style.color, borderColor: `${style.color}55` }}>
        {style.icon} {style.label}
      </span>
      <span className="claim-confidence">{item.confidence}% assessment confidence</span>
    </div>
    <h3>{item.claim}</h3>
    <p className="claim-explanation">{item.explanation}</p>
    {!!item.sources?.filter(s => s.used).length && <div className="evidence-list">
      <p className="mini-label">EVIDENCE USED</p>
      {item.sources.filter(s => s.used).map((source, i) => <a key={source.url || i} className="evidence-link" href={source.url} target="_blank" rel="noreferrer">
        <span className="external-mark">↗</span><span><strong>{source.title}</strong><small>{source.url}</small></span>
      </a>)}
    </div>}
    {!!item.sources?.length && <details className="all-sources">
      <summary>View all {item.sources.length} search results</summary>
      {item.sources.map((source, i) => <a key={source.url || i} href={source.url} target="_blank" rel="noreferrer" className="source-snippet">
        <strong>{source.title}</strong><span>{source.content}</span><small>{source.url}</small>
      </a>)}
    </details>}
  </article>;
}

export default function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function analyze(event) {
    event.preventDefault();
    setError("");
    setResult(null);
    let normalized;
    try { normalized = normalizeUrl(url); }
    catch (e) { setError(e.message); return; }
    setLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalized })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `Analysis failed (HTTP ${response.status}).`);
      setResult(data);
    } catch (e) {
      setError(e.message || "Could not analyze this website.");
    } finally { setLoading(false); }
  }

  const total = result?.claims?.length || 0;
  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="/" aria-label="TruthLens home"><span className="brand-mark">T</span><span>truth<span className="brand-accent">lens</span></span></a>
      <div className="topbar-status"><span className="status-dot" /> WEBSITE VERIFICATION</div>
    </header>
    <main className="main-content">
      <section className="hero">
        <p className="eyebrow"><span>01</span> READ BEYOND THE HEADLINE</p>
        <h1>Trust the evidence.<br/><span>Not just the website.</span></h1>
        <p className="hero-copy">Analyze a webpage, extract its factual claims, and compare them with independent sources across the live web.</p>
      </section>

      <form className="url-panel" onSubmit={analyze}>
        <label htmlFor="website-url">WEBSITE URL</label>
        <div className="url-field">
          <span className="url-icon">↗</span>
          <input id="website-url" type="text" inputMode="url" autoComplete="url" placeholder="https://example.com/news/article" value={url} onChange={e => setUrl(e.target.value)} required maxLength={2048} disabled={loading}/>
          <button type="submit" disabled={loading || !url.trim()}>{loading ? <><span className="spinner"/> Checking</> : <>Analyze website <span>→</span></>}</button>
        </div>
        <div className="input-foot"><span>↳ Supports public HTML webpages</span><span>Evidence-first · Source-linked · No image uploads</span></div>
      </form>

      {loading && <section className="loading-panel" aria-live="polite">
        <div className="loader-ring"/><div><h2>Examining the page</h2><p>Extracting factual claims, finding independent evidence, and comparing sources. This can take a little while.</p></div>
      </section>}
      {error && <div className="error-panel" role="alert"><span>!</span><div><strong>Analysis could not be completed</strong><p>{error}</p><small>Some websites block automated access or require a login. Try a public article URL.</small></div></div>}

      {result && <section className="report" aria-live="polite">
        <div className="report-top">
          <div><p className="eyebrow">WEBSITE ANALYSIS REPORT</p><h2>{result.article?.title || "Analysis report"}</h2><a href={result.article?.url} target="_blank" rel="noreferrer" className="article-url">{result.article?.url} ↗</a></div>
          <div className="overall-badge"><span>ASSESSMENT</span><strong>{result.overall}</strong></div>
        </div>
        {result.article?.excerpt && <p className="article-excerpt">{result.article.excerpt}</p>}
        <p className="report-summary">{result.pageSummary}</p>
        <div className="metric-grid">
          {[
            ["Supported", result.counts?.SUPPORTED || 0, "#53d6a6"],
            ["Contradicted", result.counts?.CONTRADICTED || 0, "#ff6b78"],
            ["Mixed", result.counts?.MIXED || 0, "#f5c46b"],
            ["Unverified", result.counts?.UNVERIFIED || 0, "#9ca3af"]
          ].map(([label, value, color]) => <div className="metric" key={label}><span style={{ color }}>{label}</span><strong>{value}</strong></div>)}
        </div>
        <div className="section-heading"><div><p className="eyebrow">CLAIM-BY-CLAIM</p><h2>What the evidence says</h2></div><span>{total} claims checked</span></div>
        <div className="claims-list">{result.claims?.map((item, i) => <ClaimCard key={item.claim + i} item={item} index={i}/>)}</div>
        <div className="sources-summary"><p className="eyebrow">INDEPENDENT SOURCES</p><h2>{result.sources?.length || 0} unique sources found</h2>
          {result.sources?.map((source, i) => <a className="global-source" key={source.url || i} href={source.url} target="_blank" rel="noreferrer"><span className="source-number">{String(i + 1).padStart(2, "0")}</span><span><strong>{source.title}</strong><small>{source.url}</small></span><span className="source-arrow">↗</span></a>)}
        </div>
        <p className="disclaimer">{result.disclaimer}</p>
      </section>}

      <section className="how-section"><p className="eyebrow">HOW IT WORKS</p><div className="how-grid">
        <div><span>01</span><h3>Read the webpage</h3><p>Extract article text and metadata from a public URL.</p></div>
        <div><span>02</span><h3>Find evidence</h3><p>Search for independent information related to each claim.</p></div>
        <div><span>03</span><h3>Compare & explain</h3><p>Show a claim-level assessment and links to the sources used.</p></div>
      </div></section>
      <footer className="footer"><a className="brand" href="/"><span className="brand-mark">T</span><span>truth<span className="brand-accent">lens</span></span></a><span>AI-assisted website verification · Inspect sources before relying on a verdict.</span></footer>
    </main>
  </div>;
}
