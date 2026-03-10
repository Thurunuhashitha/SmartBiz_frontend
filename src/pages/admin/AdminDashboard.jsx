import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import AdminSidebar from './AdminSidebar';
import './AdminCommon.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [aiUsage, setAiUsage] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get token from localStorage (assuming it's stored there after login)
  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: 'http://localhost:3000/admin',
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, logsRes, aiRes] = await Promise.all([
          api.get('/system-stats'),
          api.get('/logs'),
          api.get('/ai-usage')
        ]);
        setStats(statsRes.data);
        setLogs(logsRes.data);
        setAiUsage(aiRes.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="admin-loading">Loading Dashboard...</div>;

  // Prepare data for AI Usage Trend Chart
  const aiTrendData = aiUsage.reduce((acc, curr) => {
    const date = new Date(curr.created_at).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.requests += 1;
      existing.tokens += (curr.prompt_tokens + curr.completion_tokens);
    } else {
      acc.push({ date, requests: 1, tokens: (curr.prompt_tokens + curr.completion_tokens) });
    }
    return acc;
  }, []).reverse().slice(0, 7); // Last 7 days

  return (
    <div className="admin-wrapper">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-dashboard-content">
          <header className="admin-header">
            <h1>Admin Command Center</h1>
            <p>Real-time insights and system monitoring</p>
          </header>

          {/* Summary Cards */}
          <div className="stats-grid">
            <div className="stat-card premium-shadow">
              <div className="stat-icon companies-icon">🏢</div>
              <div className="stat-content">
                <h3>Registered Companies</h3>
                <p className="stat-value">{stats?.totalCompanies || 0}</p>
              </div>
            </div>
            <div className="stat-card premium-shadow">
              <div className="stat-icon users-icon">👥</div>
              <div className="stat-content">
                <h3>Total Users</h3>
                <p className="stat-value">{stats?.totalUsers || 0}</p>
              </div>
            </div>
            <div className="stat-card premium-shadow">
              <div className="stat-icon revenue-icon">💰</div>
              <div className="stat-content">
                <h3>Total Revenue</h3>
                <p className="stat-value">${parseFloat(stats?.totalRevenue || 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="stat-card premium-shadow">
              <div className="stat-icon ai-icon">🤖</div>
              <div className="stat-content">
                <h3>AI Requests</h3>
                <p className="stat-value">{stats?.aiRequests || 0}</p>
              </div>
            </div>
          </div>

          <div className="charts-grid">
            {/* AI Usage Trend */}
            <div className="chart-card premium-shadow">
              <h3>AI Usage Trends (Last 7 Days)</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={aiTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="requests" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="tokens" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Feature Popularity or other metric can go here */}
            <div className="chart-card premium-shadow">
              <h3>Active Companies (Last 30 Days)</h3>
              <div className="active-chart-placeholder">
                 <div className="big-number">{stats?.activeCompanies || 0}</div>
                 <p>Companies engaged with the platform recently</p>
              </div>
            </div>
          </div>

          {/* Activity Logs Table */}
          <div className="logs-section premium-shadow">
            <h3>System Activity Logs</h3>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Method</th>
                    <th>Path</th>
                    <th>Company ID</th>
                    <th>Status</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.log_id}>
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                      <td><span className={`method-badge ${log.method.toLowerCase()}`}>{log.method}</span></td>
                      <td>{log.path}</td>
                      <td>{log.company_id || 'N/A'}</td>
                      <td><span className={`status-badge s${log.status_code}`}>{log.status_code}</span></td>
                      <td>{log.ip_address}</td>
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
