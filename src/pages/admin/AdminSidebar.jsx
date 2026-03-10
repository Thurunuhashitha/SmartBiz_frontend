import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
    const location = useLocation();

    const navItems = [
        {
            to: '/admin/dashboard',
            label: 'Dashboard',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
            )
        },
        {
            to: '/company',
            label: 'Companies',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
            )
        }
    ];

    return (
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
                {navItems.map((item) => (
                    <Link 
                        key={item.to} 
                        to={item.to} 
                        className={`admin-nav-item ${location.pathname === item.to ? 'admin-nav-item--active' : ''}`}
                    >
                        {item.icon}
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="admin-sidebar-footer">
                <div className="admin-avatar">AD</div>
                <div>
                    <p className="admin-user-name">Admin</p>
                    <p className="admin-user-role">admin@gmail.com</p>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
