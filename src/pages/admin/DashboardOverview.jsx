import React, { useState, useEffect } from "react";
import NavBar from "../../components/nav/NavBar";
import "./dashboard.css";

export default function DashboardOverview() {
  const token = localStorage.getItem("token");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/dashboard/getStats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      } else {
        setError(data.error || "Failed to fetch dashboard stats");
      }
    } catch (err) {
      setError("Error connecting to server");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper">
        <NavBar />
        <main className="main-content">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading business insights...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <NavBar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard Overview</h1>
            <p className="page-subtitle">Real-time business performance and statistics</p>
          </div>
          <button className="btn btn--outline" onClick={fetchStats}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Refresh Data
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {stats && (
          <>
            {/* Quick Stats Grid */}
            <div className="dashboard-grid">
              <div className="stat-card">
                <div className="stat-icon stat-icon--blue">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{stats.customers}</h3>
                  <p className="stat-label">Total Customers</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon stat-icon--orange">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{stats.suppliers}</h3>
                  <p className="stat-label">Total Suppliers</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon stat-icon--purple">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{stats.products}</h3>
                  <p className="stat-label">Total Products</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon stat-icon--red">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{stats.expensesCount}</h3>
                  <p className="stat-label">Total Expenses</p>
                </div>
              </div>
            </div>

            {/* Profit Dashboard Section */}
            <div className="profit-dashboard-container">
              <div className="profit-dashboard">
                <h2 className="dashboard-title">Business Profit Overview</h2>
                <div className="summary-row">
                  <div className="summary-card">
                    <div className="summary-icon summary-icon--teal">💰</div>
                    <div>
                      <p className="summary-label">Total Revenue (Sales)</p>
                      <p className="summary-value text-success">LKR {stats.profitSummary.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-icon summary-icon--orange">📦</div>
                    <div>
                      <p className="summary-label">Cost of Goods (Suppliers)</p>
                      <p className="summary-value text-danger">LKR {stats.profitSummary.supplierCosts.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-icon summary-icon--red">🧾</div>
                    <div>
                      <p className="summary-label">Operating Expenses</p>
                      <p className="summary-value text-danger">LKR {stats.profitSummary.otherExpenses.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="summary-card highlight-profit">
                    <div className="summary-icon summary-icon--purple">📈</div>
                    <div>
                      <p className="summary-label">Net Profit</p>
                      <p className={`summary-value ${stats.profitSummary.netProfit >= 0 ? "text-success" : "text-danger"}`}>
                        LKR {stats.profitSummary.netProfit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
