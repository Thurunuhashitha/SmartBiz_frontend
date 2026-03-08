import React, { useState } from 'react'
import './company.css'

export default function Company() {
  const token = localStorage.getItem('token')

  const [id, setId] = useState('')
  const [company_name, setCompany_name] = useState('')
  const [owner, setOwner] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [companies, setCompanies] = useState([])
  const [activeSection, setActiveSection] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const resetForm = () => {
    setId(''); setCompany_name(''); setOwner(''); setEmail(''); setPhone('')
  }

  const toggleSection = (section) =>
    setActiveSection((prev) => (prev === section ? null : section))

  // ── API Calls ──────────────────────────────
  const getAll = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/admin/getallcompanies', {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) setCompanies(data)
      else showToast(data.message || 'Failed to fetch companies', 'error')
    } catch { showToast('Failed to fetch companies', 'error') }
    setLoading(false)
  }

  const edit = async () => {
    if (!id) return showToast('Enter a Company ID', 'error')
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:3000/admin/updatecompany/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ company_name, owner, email, phone }),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Company updated successfully')
        // update table row if visible
        setCompanies((prev) =>
          prev.map((c) =>
            String(c.id) === String(id)
              ? { ...c, company_name, owner, email, phone }
              : c
          )
        )
        resetForm(); setActiveSection(null)
      } else showToast(data.message || 'Failed to update company', 'error')
    } catch { showToast('Failed to update company', 'error') }
    setLoading(false)
  }

  const deleteCompany = async () => {
    if (!id) return showToast('Enter a Company ID', 'error')
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:3000/admin/deletecompany/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Company deleted successfully')
        setCompanies((prev) => prev.filter((c) => String(c.id) !== String(id)))
        resetForm(); setActiveSection(null)
      } else showToast(data.message || 'Failed to delete company', 'error')
    } catch { showToast('Failed to delete company', 'error') }
    setLoading(false)
  }

  const getInitials = (n) =>
    n ? n.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() : '?'

  return (
    <div className="admin-wrapper">

      {/* Toast */}
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          <span className="toast-icon">{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.msg}
        </div>
      )}

      {/* ── Admin Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <div className="admin-logo">SB</div>
          <div>
            <p className="admin-logo-title">SmartBiz</p>
            <p className="admin-logo-sub">Admin Panel</p>
          </div>
        </div>

        <div className="admin-badge">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Super Admin
        </div>

        <nav className="admin-nav">
          <button className="admin-nav-item admin-nav-item--active">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Companies
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-avatar">AD</div>
          <div>
            <p className="admin-user-name">Admin</p>
            <p className="admin-user-role">admin@gmail.com</p>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="admin-main">

        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Company Management</h1>
            <p className="page-subtitle">View and manage all registered companies</p>
          </div>
          <button className="btn btn--outline" onClick={getAll}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
            </svg>
            Refresh Companies
          </button>
        </div>

        {/* Stats row */}
        {companies.length > 0 && (
          <div className="admin-stats">
            <div className="stat-card">
              <div className="stat-icon stat-icon--teal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </svg>
              </div>
              <div>
                <p className="stat-label">Total Companies</p>
                <p className="stat-value">{companies.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="action-bar">
          <button className={`btn btn--outline${activeSection === 'edit' ? ' active' : ''}`} onClick={() => toggleSection('edit')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Company
          </button>
          <button className={`btn btn--danger-outline${activeSection === 'delete' ? ' active' : ''}`} onClick={() => toggleSection('delete')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            Delete Company
          </button>
        </div>

        {/* ── Edit Panel ── */}
        {activeSection === 'edit' && (
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Edit Company</h2>
              <button className="panel-close" onClick={() => setActiveSection(null)}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-group form-group--full">
                <label className="form-label">Company ID <span className="form-required">*</span></label>
                <input className="form-input" type="number" placeholder="Enter company ID" value={id} onChange={(e) => setId(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input className="form-input" placeholder="Company name" value={company_name} onChange={(e) => setCompany_name(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Owner</label>
                <input className="form-input" placeholder="Owner name" value={owner} onChange={(e) => setOwner(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="company@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            <div className="panel-actions">
              <button className="btn btn--ghost" onClick={() => { resetForm(); setActiveSection(null) }}>Cancel</button>
              <button className="btn btn--primary" onClick={edit} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* ── Delete Panel ── */}
        {activeSection === 'delete' && (
          <div className="panel panel--danger">
            <div className="panel-header">
              <h2 className="panel-title">Delete Company</h2>
              <button className="panel-close" onClick={() => setActiveSection(null)}>✕</button>
            </div>
            <p className="panel-warning">
              ⚠️ This will permanently delete the company and all associated data. This cannot be undone.
            </p>
            <div className="form-inline">
              <input className="form-input" type="number" placeholder="Enter Company ID to delete" value={id} onChange={(e) => setId(e.target.value)} />
              <button className="btn btn--danger" onClick={deleteCompany} disabled={loading}>
                {loading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        )}

        {/* ── Loading ── */}
        {loading && companies.length === 0 && (
          <div className="loading-state">
            <div className="spinner" />
            <span>Loading companies...</span>
          </div>
        )}

        {/* ── Companies Table ── */}
        {companies.length > 0 && (
          <div className="table-card">
            <div className="table-card-header">
              <h2 className="table-card-title">
                Registered Companies
                <span className="table-badge">{companies.length}</span>
              </h2>
              <button className="btn btn--ghost btn--sm" onClick={() => setCompanies([])}>Clear</button>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Company</th>
                    <th>Owner</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((c) => (
                    <tr key={c.id}>
                      <td><span className="id-badge">#{c.id}</span></td>
                      <td>
                        <div className="company-cell">
                          <div className="company-avatar">{getInitials(c.company_name)}</div>
                          <span className="company-name">{c.company_name}</span>
                        </div>
                      </td>
                      <td>{c.owner}</td>
                      <td>
                        <a className="contact-link" href={`mailto:${c.email}`}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                          </svg>
                          {c.email}
                        </a>
                      </td>
                      <td>
                        <a className="contact-link" href={`tel:${c.phone}`}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                          </svg>
                          {c.phone}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && companies.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <p className="empty-title">No companies loaded</p>
            <p className="empty-sub">Click "Refresh Companies" to load all registered companies</p>
            <button className="btn btn--primary" onClick={getAll}>Load Companies</button>
          </div>
        )}

      </main>
    </div>
  )
}