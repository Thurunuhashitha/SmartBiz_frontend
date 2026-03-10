import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import AdminSidebar from './AdminSidebar';
import './AdminCommon.css';
import './AdminDashboard.css';

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconRefresh = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6M1 20v-6h6"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0f172a', border: '1px solid #1e293b',
      borderRadius: 10, padding: '10px 14px', fontSize: 12,
    }}>
      <p style={{ color: '#94a3b8', margin: '0 0 6px 0', fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: '2px 0', fontWeight: 600 }}>
          {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, variant, footer }) => (
  <div className={`stat-card stat-card--${variant}`}>
    <div className="stat-card-top">
      <p className="stat-label">{label}</p>
      <div className={`stat-icon stat-icon--${variant}`}>{icon}</div>
    </div>
    <p className="stat-value">{value}</p>
    {footer && <p className="stat-footer">{footer}</p>}
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const [stats,    setStats]    = useState(null);
  const [logs,     setLogs]     = useState([]);
  const [aiUsage,  setAiUsage]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  const token = localStorage.getItem('token');
  const api   = axios.create({
    baseURL: 'http://localhost:3000/admin',
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, logsRes, aiRes] = await Promise.all([
        api.get('/system-stats'),
        api.get('/logs'),
        api.get('/ai-usage'),
      ]);
      setStats(statsRes.data);
      setLogs(logsRes.data);
      setAiUsage(aiRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ── Loading ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner" />
        Loading dashboard...
      </div>
    );
  }

  // ── Chart data ───────────────────────────────────────────────────────────

  const aiTrendData = aiUsage
    .reduce((acc, curr) => {
      const date = new Date(curr.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      const existing = acc.find(item => item.date === date);
      if (existing) {
        existing.requests += 1;
        existing.tokens   += (curr.prompt_tokens + curr.completion_tokens);
      } else {
        acc.push({ date, requests: 1, tokens: curr.prompt_tokens + curr.completion_tokens });
      }
      return acc;
    }, [])
    .reverse()
    .slice(0, 7);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="admin-wrapper">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-dashboard-content">

          {/* ── Header ── */}
          <header className="admin-header">
            <div className="admin-header-left">
              <h1>Command Center</h1>
              <p>Real-time insights and system monitoring</p>
            </div>
            <button className="header-refresh-btn" onClick={fetchData}>
              <IconRefresh />
              Refresh
            </button>
          </header>

          {/* ── Stat cards ── */}
          <div className="stats-grid">
            <StatCard
              icon="🏢"
              label="Registered Companies"
              value={(stats?.totalCompanies  || 0).toLocaleString()}
              variant="companies"
              footer="All-time registrations"
            />
            <StatCard
              icon="👥"
              label="Total Users"
              value={(stats?.totalUsers || 0).toLocaleString()}
              variant="users"
              footer="Across all companies"
            />
            <StatCard
              icon="💰"
              label="Total Revenue"
              value={`$${parseFloat(stats?.totalRevenue || 0).toLocaleString()}`}
              variant="revenue"
              footer="Lifetime earnings"
            />
            <StatCard
              icon="🤖"
              label="AI Requests"
              value={(stats?.aiRequests || 0).toLocaleString()}
              variant="ai"
              footer="Total API calls made"
            />
          </div>

          {/* ── Charts ── */}
          <div className="charts-grid">

            {/* AI Usage Trend */}
            <div className="chart-card">
              <div className="chart-card-header">
                <h3>AI Usage — Last 7 Days</h3>
                <div className="chart-legends">
                  <span className="chart-legend-dot chart-legend-dot--teal">Requests</span>
                  <span className="chart-legend-dot chart-legend-dot--indigo">Tokens</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={aiTrendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="requests"
                    stroke="#14b8a6"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#14b8a6', strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="tokens"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Active Companies */}
            <div className="chart-card">
              <div className="chart-card-header">
                <h3>Active Companies</h3>
              </div>
              <div className="active-companies-card">
                <div className="active-companies-ring">
                  <div className="active-ring-bg">
                    <div className="active-ring-inner">
                      <span className="big-number">{stats?.activeCompanies || 0}</span>
                    </div>
                  </div>
                </div>
                <p className="active-label">Companies engaged with the platform</p>
                <span className="active-period-badge">📅 Last 30 days</span>
              </div>
            </div>

          </div>

          {/* ── Activity Logs ── */}
          <div className="logs-section">
            <div className="logs-header">
              <h3>
                System Activity Logs
                <span className="logs-count-badge">{logs.length} entries</span>
              </h3>
            </div>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Method</th>
                    <th>Path</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.log_id}>
                      <td className="ts-cell">
                        {new Date(log.timestamp).toLocaleString('en-GB', {
                          day: '2-digit', month: 'short',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                      <td>
                        <span className={`method-badge ${log.method.toLowerCase()}`}>
                          {log.method}
                        </span>
                      </td>
                      <td className="path-cell" title={log.path}>{log.path}</td>
                      <td className="company-cell">{log.company_id || '—'}</td>
                      <td>
                        <span className={`status-badge s${log.status_code}`}>
                          {log.status_code}
                        </span>
                      </td>
                      <td className="ip-cell">{log.ip_address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;