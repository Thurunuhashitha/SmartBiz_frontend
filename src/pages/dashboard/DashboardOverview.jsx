import React, { useState, useEffect } from "react";
import NavBar from "../../components/nav/NavBar";
import "./dashboard.css";

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconCustomers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconSuppliers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="2"/>
    <path d="M16 8h4l3 3v5h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const IconProducts = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const IconExpenses = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);

const IconRefresh = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6M1 20v-6h6"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

const IconError = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard = ({ value, label, icon, variant, footer }) => (
  <div className={`stat-card stat-card--${variant}`}>
    <div className="stat-card-top">
      <p className="stat-label">{label}</p>
      <div className={`stat-icon stat-icon--${variant}`}>{icon}</div>
    </div>
    <h3 className="stat-value">{value}</h3>
    {footer && <p className="stat-footer">{footer}</p>}
  </div>
);

const ProfitCard = ({ emoji, label, value, valueClass, highlight }) => (
  <div className={`profit-card ${highlight ? "profit-card--highlight" : ""}`}>
    <div className="profit-emoji">{emoji}</div>
    <div>
      <p className="profit-label">{label}</p>
      <p className={`profit-value ${valueClass}`}>
        LKR {Number(value).toLocaleString()}
      </p>
    </div>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardOverview() {
  const token = localStorage.getItem("token");
  const [stats,   setStats]   = useState(null);
  const [report,  setReport]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, reportRes] = await Promise.all([
        fetch("https://smartbizapi.thurunu.me/dashboard/getStats",       { headers: { Authorization: `Bearer ${token}` } }),
        fetch("https://smartbizapi.thurunu.me/dashboard/getSalesReport", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const statsData  = await statsRes.json();
      const reportData = await reportRes.json();

      if (statsRes.ok && reportRes.ok) {
        setStats(statsData);
        setReport(reportData);
      } else {
        setError(statsData.error || reportData.error || "Failed to fetch dashboard data");
      }
    } catch {
      setError("Error connecting to server");
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // ── Loading ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="page-wrapper">
        <NavBar />
        <main className="main-content dashboard-page">
          <div className="loading-container">
            <div className="spinner" />
            <p>Loading business insights...</p>
          </div>
        </main>
      </div>
    );
  }

  // ── Derived values ───────────────────────────────────────────────────────

  const p           = stats?.profitSummary;
  const netPositive = p && p.netProfit >= 0;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="page-wrapper">
      <NavBar />

      <main className="main-content dashboard-page">

        {/* ── Page header ── */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard Overview</h1>
            <p className="page-subtitle">Real-time business performance and statistics</p>
          </div>
          <button className="btn btn--outline" onClick={fetchData}>
            <IconRefresh />
            Refresh
          </button>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="error-banner">
            <IconError />
            {error}
          </div>
        )}

        {stats && (
          <>
            {/* ── Quick stats ── */}
            <div className="dashboard-grid">
              <StatCard value={stats.customers}    label="Total Customers" icon={<IconCustomers />} variant="blue"   footer="Registered accounts"          />
              <StatCard value={stats.suppliers}    label="Total Suppliers" icon={<IconSuppliers />} variant="orange" footer="Active supplier relationships" />
              <StatCard value={stats.products}     label="Total Products"  icon={<IconProducts />}  variant="purple" footer="Items in inventory"            />
              <StatCard value={stats.expensesCount} label="Total Expenses" icon={<IconExpenses />}  variant="red"    footer="Recorded transactions"         />
            </div>

            {/* ── Profit overview ── */}
            <div className="table-card" style={{ marginBottom: 20 }}>
              <div className="table-card-header">
                <h2 className="table-card-title">
                  Business Profit Overview
                  <span className={`table-badge ${netPositive ? "" : "table-badge--danger"}`}>
                    {netPositive ? "▲ Profitable" : "▼ Net Loss"}
                  </span>
                </h2>
              </div>
              <div style={{ padding: "20px" }}>
                <div className="profit-grid">
                  <ProfitCard emoji="💰" label="Total Revenue (Sales)"      value={p.revenue}       valueClass="profit-value--positive" />
                  <ProfitCard emoji="📦" label="Cost of Goods (Suppliers)"  value={p.supplierCosts} valueClass="profit-value--negative" />
                  <ProfitCard emoji="🧾" label="Operating Expenses"         value={p.otherExpenses} valueClass="profit-value--negative" />
                  <ProfitCard
                    emoji="📈"
                    label="Net Profit"
                    value={p.netProfit}
                    valueClass={netPositive ? "profit-value--highlight-pos" : "profit-value--highlight-neg"}
                    highlight
                  />
                </div>
              </div>
            </div>

            {/* ── Sales Reports ── */}
            {report && (
              <div className="reports-section">
                <div className="section-header">
                  <h2 className="section-title">Sales Reports &amp; Summaries</h2>
                </div>

                <div className="reports-grid">

                  {/* Recent Sales */}
                  <div className="table-card report-card">
                    <div className="table-card-header">
                      <h2 className="table-card-title">
                        Recent Sales
                        <span className="table-badge">{report.recentSales?.length ?? 0}</span>
                      </h2>
                    </div>
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Customer</th>
                            <th>Product</th>
                            <th>Total</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {report.recentSales?.map((sale) => (
                            <tr key={sale.cID}>
                              <td>{sale.customer_name}</td>
                              <td><span className="expense-name">{sale.product}</span></td>
                              <td className="total-cell">LKR {(sale.quantity * sale.unit_price).toLocaleString()}</td>
                              <td className="date-cell">{new Date(sale.sale_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Top Selling Products */}
                  <div className="table-card report-card">
                    <div className="table-card-header">
                      <h2 className="table-card-title">
                        Top Selling Products
                        <span className="table-badge">{report.topProducts?.length ?? 0}</span>
                      </h2>
                    </div>
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th>Qty Sold</th>
                            <th>Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {report.topProducts?.map((prod, idx) => (
                            <tr key={idx}>
                              <td>
                                <span className={`rank-badge rank-badge--${idx + 1}`}>
                                  {idx + 1}
                                </span>
                              </td>
                              <td><span className="expense-name">{prod.product}</span></td>
                              <td>{Number(prod.total_quantity).toLocaleString()}</td>
                              <td className="revenue-cell">LKR {Number(prod.total_revenue).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}