import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './navbar.css'

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    to: '/ProductStock',
    label: 'Products & Stock',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
  },
  {
    to: '/customer',
    label: 'Customers',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    to: '/supplier',
    label: 'Suppliers',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    to: '/sales',
    label: 'Sales',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    to: '/expenses',
    label: 'Expenses',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
  },
  {
    to: '/ai-insights',
    label: 'AI Insights',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10H12V2z"/>
        <path d="M12 2a10 10 0 0 1 10 10h-7.5l-3.5 3.5-3.5-3.5H2"/>
        <circle cx="12" cy="12" r="3"/>
        <path d="m19 8-2 2"/>
        <path d="m14 5-1 2"/>
        <path d="m21 13-2-1"/>
      </svg>
    ),
  },
]

export default function NavBar() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`sb-wrapper${collapsed ? ' collapsed' : ''}`}>

      {/* Header / Brand */}
      <div className="sb-header">
        <div className="sb-brand">
          <div className="sb-logo">SB</div>
          <div className="sb-brand-text">
            <span className="sb-title">SmartBiz</span>
            <span className="sb-subtitle">Business Suite</span>
          </div>
        </div>
        <button
          className="sb-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {collapsed
              ? <polyline points="9 18 15 12 9 6" />
              : <polyline points="15 18 9 12 15 6" />
            }
          </svg>
        </button>
      </div>

      {/* Nav Links */}
      <nav className="sb-nav">
        <span className="sb-section-label">Management</span>
        {navItems.map((item) => {
          const isActive = location.pathname === item.to
          return (
            <div className="sb-link-wrap" key={item.to}>
              <Link to={item.to} className={`sb-link${isActive ? ' active' : ''}`}>
                <span className="sb-icon">{item.icon}</span>
                <span className="sb-label">{item.label}</span>
              </Link>
              <span className="sb-tooltip">{item.label}</span>
            </div>
          )
        })}
      </nav>

      {/* Footer / User */}
      <Link to="/login">
      <div className="sb-footer">
        <div className="sb-user">
          <div className="sb-avatar">AD</div>
          <div className="sb-user-info">
            <span className="sb-user-name">Admin</span>
            <span className="sb-user-role">Business Owner</span>
          </div>
        </div>
      </div>
      </Link>

    </aside>
  )
}