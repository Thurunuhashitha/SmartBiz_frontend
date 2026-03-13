import React, { useState } from "react";
import NavBar from "../../components/nav/NavBar";
import "./aiInsights.css";

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconChart = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
  </svg>
);

const IconMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconChat = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const IconSparkle = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
  </svg>
);

const IconCopy = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);

const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

const IconInfo = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
  </svg>
);

// ─── Config ───────────────────────────────────────────────────────────────────

const TABS = [
  { id: "report",    label: "Performance Report", icon: <IconChart /> },
  { id: "email",     label: "Email Generator",    icon: <IconMail />  },
  { id: "marketing", label: "Marketing Writer",   icon: <IconChat />  },
];

const PANEL_META = {
  report:    { title: "Performance Report", desc: "Get a natural language summary of your sales and expenses." },
  email:     { title: "Email Generator",    desc: "Draft polished follow-ups or complaint resolutions instantly." },
  marketing: { title: "Marketing Writer",   desc: "Create engaging posts for your products across platforms." },
};

const LOADING_TEXT = {
  report:    "Analyzing your business data...",
  email:     "Crafting your email...",
  marketing: "Writing your post...",
};

// ─── Component ────────────────────────────────────────────────────────────────

const AiInsights = () => {
  const [activeTab, setActiveTab] = useState("report");
  const [loading,   setLoading]   = useState(false);
  const [result,    setResult]    = useState("");
  const [copied,    setCopied]    = useState(false);
  const token = localStorage.getItem("token");

  const [reportTimeframe,  setReportTimeframe]  = useState("Last Month");
  const [emailDetails,     setEmailDetails]     = useState({ name: "", context: "", type: "follow-up" });
  const [marketingDetails, setMarketingDetails] = useState({ platform: "Facebook", details: "", tone: "Professional & Catchy" });

  const switchTab = (id) => { setActiveTab(id); setResult(""); };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── API calls ──────────────────────────────────────────────────────────────

  const generateReport = async () => {
    setLoading(true); setResult("");
    try {
      const [salesRes, expenseRes] = await Promise.all([
        fetch("https://smartbizapi.thurunu.me/customer/getAllCustomers", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("https://smartbizapi.thurunu.me/expense/getAllExpenses",   { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const salesData   = await salesRes.json();
      const expenseData = await expenseRes.json();
      const aiRes  = await fetch("https://smartbizapi.thurunu.me/ai/report", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ timeframe: reportTimeframe, salesData: salesData.slice(0, 50), expenseData: expenseData.slice(0, 50) }),
      });
      const aiData = await aiRes.json();
      setResult(aiRes.ok ? aiData.result : `Error: ${aiData.error || "Failed to generate report"}`);
    } catch { setResult("Error connecting to server. Please ensure backend is running."); }
    setLoading(false);
  };

  const generateEmail = async () => {
    if (!emailDetails.name || !emailDetails.context) { alert("Please fill in customer name and context."); return; }
    setLoading(true); setResult("");
    try {
      const res  = await fetch("https://smartbizapi.thurunu.me/ai/email", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ customerName: emailDetails.name, context: emailDetails.context, type: emailDetails.type }),
      });
      const data = await res.json();
      setResult(res.ok ? data.result : `Error: ${data.error}`);
    } catch { setResult("Error connecting to server."); }
    setLoading(false);
  };

  const generateMarketing = async () => {
    if (!marketingDetails.details) { alert("Please provide product details."); return; }
    setLoading(true); setResult("");
    try {
      const res  = await fetch("https://smartbizapi.thurunu.me/ai/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ platform: marketingDetails.platform, productDetails: marketingDetails.details, tone: marketingDetails.tone }),
      });
      const data = await res.json();
      setResult(res.ok ? data.result : `Error: ${data.error}`);
    } catch { setResult("Error connecting to server."); }
    setLoading(false);
  };

  const handleGenerate =
    activeTab === "report"    ? generateReport    :
    activeTab === "email"     ? generateEmail     :
    generateMarketing;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="page-wrapper">
      <NavBar />

      {/* main-content picks up margin-left: var(--sidebar-width) from global.css */}
      <main className="main-content ai-insights">

        {/* Page header — uses global .page-header / .page-title / .page-subtitle */}
        <div className="page-header">
          <div>
            <h1 className="page-title">AI Insights &amp; Assistant</h1>
            <p className="page-subtitle">Powered by AI to help you manage and grow your business.</p>
          </div>
          <div className="ai-status-badge">
            <span className="status-dot" />
            AI Engine Online
          </div>
        </div>

        {/* Tab bar */}
        <div className="ai-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`ai-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => switchTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Two-column grid */}
        <div className="ai-body">

          {/* ── Left: input panel — uses global .panel ── */}
          <div className="panel" style={{ marginBottom: 0 }}>
            <div className="ai-panel-header">
              <div className="panel-icon"><IconSparkle /></div>
              <div>
                <h2>{PANEL_META[activeTab].title}</h2>
                <p>{PANEL_META[activeTab].desc}</p>
              </div>
            </div>

            {/* Report form */}
            {activeTab === "report" && (
              <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
                <div className="form-group">
                  <label className="form-label">Select Timeframe</label>
                  <select
                    className="form-input"
                    value={reportTimeframe}
                    onChange={(e) => setReportTimeframe(e.target.value)}
                  >
                    <option>Last 7 Days</option>
                    <option>Last Month</option>
                    <option>Last Quarter</option>
                    <option>Year to Date</option>
                  </select>
                </div>
                <div className="tag-pill">
                  <IconInfo />
                  Pulls live sales &amp; expense records from your account
                </div>
              </div>
            )}

            {/* Email form */}
            {activeTab === "email" && (
              <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
                <div className="form-group">
                  <label className="form-label">Customer Name <span className="form-required">*</span></label>
                  <input
                    className="form-input"
                    placeholder="e.g. John Doe"
                    value={emailDetails.name}
                    onChange={(e) => setEmailDetails({ ...emailDetails, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Type</label>
                  <select
                    className="form-input"
                    value={emailDetails.type}
                    onChange={(e) => setEmailDetails({ ...emailDetails, type: e.target.value })}
                  >
                    <option value="follow-up">Follow-up</option>
                    <option value="complaint">Complaint Resolution</option>
                    <option value="appreciation">Customer Appreciation</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Context / Message Details <span className="form-required">*</span></label>
                  <textarea
                    className="ai-textarea"
                    placeholder="Briefly describe the situation or what you want to communicate..."
                    value={emailDetails.context}
                    onChange={(e) => setEmailDetails({ ...emailDetails, context: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Marketing form */}
            {activeTab === "marketing" && (
              <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
                <div className="form-group">
                  <label className="form-label">Target Platform</label>
                  <select
                    className="form-input"
                    value={marketingDetails.platform}
                    onChange={(e) => setMarketingDetails({ ...marketingDetails, platform: e.target.value })}
                  >
                    <option>Facebook</option>
                    <option>Instagram</option>
                    <option>Twitter / X</option>
                    <option>LinkedIn</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Desired Tone</label>
                  <select
                    className="form-input"
                    value={marketingDetails.tone}
                    onChange={(e) => setMarketingDetails({ ...marketingDetails, tone: e.target.value })}
                  >
                    <option>Professional &amp; Catchy</option>
                    <option>Excited &amp; Bold</option>
                    <option>Hurry / Limited Time</option>
                    <option>Witty &amp; Fun</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Product / Sale Details <span className="form-required">*</span></label>
                  <textarea
                    className="ai-textarea"
                    placeholder="e.g. New arrival of wireless headphones, 20% discount this weekend..."
                    value={marketingDetails.details}
                    onChange={(e) => setMarketingDetails({ ...marketingDetails, details: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Generate button */}
            <button
              className={`btn-generate ${loading ? "loading" : ""}`}
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading
                ? <><div className="ai-spin" />{LOADING_TEXT[activeTab]}</>
                : <><IconSparkle />Generate with AI</>
              }
            </button>
          </div>

          {/* ── Right: result panel ── */}
          <div className="ai-result-panel">
            <div className="result-panel-header">
              <div className="result-panel-title">
                <span />
                Output
              </div>
              {result && (
                <button className={`btn-copy ${copied ? "copied" : ""}`} onClick={handleCopy}>
                  {copied ? <><IconCheck />Copied</> : <><IconCopy />Copy text</>}
                </button>
              )}
            </div>

            <div className="result-body">
              {loading ? (
                <div className="result-loading">
                  <div className="loading-bars">
                    {[1,2,3,4,5].map((i) => <div key={i} className="loading-bar" />)}
                  </div>
                  <div>
                    <strong>Consulting AI</strong>
                    <p>{LOADING_TEXT[activeTab]}</p>
                  </div>
                  <div className="skeleton-lines">
                    {[1,2,3,4,5,6].map((i) => <div key={i} className="skeleton-line" />)}
                  </div>
                </div>
              ) : result ? (
                <p className="result-text">{result}</p>
              ) : (
                <div className="result-empty">
                  <div className="result-empty-icon">
                    <IconSparkle />
                  </div>
                  <p>Fill in the form and click generate to see results here.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AiInsights;