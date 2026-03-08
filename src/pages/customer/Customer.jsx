import React, { useState } from "react";
import NavBar from "../../components/nav/NavBar";
import "./customer.css";

export default function CustomerCRUD() {
  const token = localStorage.getItem("token");

  const [activeSection, setActiveSection] = useState(null);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleSection = (section) =>
    setActiveSection((prev) => (prev === section ? null : section));

  const resetForm = () => {
    setId(""); setName(""); setPhone(""); setEmail("");
  };

  // ── API Calls ──────────────────────────────
  const createCustomer = async () => {
    if (!name || !phone || !email) return showToast("Please fill all fields", "error");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/customer/createCustomer", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, phone, email }),
      });
      const data = await res.json();
      if (res.ok) { showToast("Customer created successfully"); resetForm(); setActiveSection(null); }
      else showToast(data.error || "Failed to create customer", "error");
    } catch { showToast("Error creating customer", "error"); }
    setLoading(false);
  };

  const getAllCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/customer/getAllCustomers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCustomers(data);
    } catch { showToast("Error fetching customers", "error"); }
    setLoading(false);
  };

  const getCustomerById = async () => {
    if (!id) return showToast("Enter customer ID", "error");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/customer/getCustomerById/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setCustomers([data]);
      else showToast(data.error || "Customer not found", "error");
    } catch { showToast("Error fetching customer", "error"); }
    setLoading(false);
  };

  const updateCustomer = async () => {
    if (!id) return showToast("Enter customer ID", "error");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/customer/updateCustomer/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, phone, email }),
      });
      const data = await res.json();
      if (res.ok) { showToast("Customer updated successfully"); resetForm(); setActiveSection(null); }
      else showToast(data.error || "Failed to update customer", "error");
    } catch { showToast("Error updating customer", "error"); }
    setLoading(false);
  };

  const deleteCustomer = async () => {
    if (!id) return showToast("Enter customer ID", "error");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/customer/deleteCustomer/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Customer deleted successfully");
        setCustomers((prev) => prev.filter((c) => String(c.cID) !== String(id)));
        setId(""); setActiveSection(null);
      } else showToast(data.error || "Failed to delete customer", "error");
    } catch { showToast("Error deleting customer", "error"); }
    setLoading(false);
  };

  // Generate avatar initials
  const getInitials = (n) =>
    n ? n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() : "?";

  return (
    <div className="page-wrapper">
      <NavBar />

      <main className="main-content">

        {/* Toast */}
        {toast && (
          <div className={`toast toast--${toast.type}`}>
            <span className="toast-icon">{toast.type === "success" ? "✓" : "✕"}</span>
            {toast.msg}
          </div>
        )}

        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Customer Management</h1>
            <p className="page-subtitle">View and manage your customer records</p>
          </div>
          <button className="btn btn--primary" onClick={() => toggleSection("create")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Customer
          </button>
        </div>

        {/* Action Bar */}
        <div className="action-bar">
          <button className="btn btn--outline" onClick={getAllCustomers}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            All Customers
          </button>
          <button className={`btn btn--outline${activeSection === "getById" ? " active" : ""}`} onClick={() => toggleSection("getById")}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Search by ID
          </button>
          <button className={`btn btn--outline${activeSection === "update" ? " active" : ""}`} onClick={() => toggleSection("update")}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Update
          </button>
          <button className={`btn btn--danger-outline${activeSection === "delete" ? " active" : ""}`} onClick={() => toggleSection("delete")}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            Delete
          </button>
        </div>

        {/* ── Create Panel ── */}
        {activeSection === "create" && (
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Add New Customer</h2>
              <button className="panel-close" onClick={() => setActiveSection(null)}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-group form-group--full">
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="e.g. John Silva" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" placeholder="e.g. 0771234567" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="e.g. john@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="panel-actions">
              <button className="btn btn--ghost" onClick={() => { resetForm(); setActiveSection(null); }}>Cancel</button>
              <button className="btn btn--primary" onClick={createCustomer} disabled={loading}>
                {loading ? "Creating..." : "Create Customer"}
              </button>
            </div>
          </div>
        )}

        {/* ── Search by ID Panel ── */}
        {activeSection === "getById" && (
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Search Customer by ID</h2>
              <button className="panel-close" onClick={() => setActiveSection(null)}>✕</button>
            </div>
            <div className="form-inline">
              <input className="form-input" type="number" placeholder="Enter Customer ID" value={id} onChange={(e) => setId(e.target.value)} />
              <button className="btn btn--primary" onClick={getCustomerById} disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        )}

        {/* ── Update Panel ── */}
        {activeSection === "update" && (
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Update Customer</h2>
              <button className="panel-close" onClick={() => setActiveSection(null)}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-group form-group--full">
                <label className="form-label">Customer ID <span className="form-required">*</span></label>
                <input className="form-input" type="number" placeholder="Enter ID to update" value={id} onChange={(e) => setId(e.target.value)} />
              </div>
              <div className="form-group form-group--full">
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="panel-actions">
              <button className="btn btn--ghost" onClick={() => { resetForm(); setActiveSection(null); }}>Cancel</button>
              <button className="btn btn--primary" onClick={updateCustomer} disabled={loading}>
                {loading ? "Updating..." : "Confirm Update"}
              </button>
            </div>
          </div>
        )}

        {/* ── Delete Panel ── */}
        {activeSection === "delete" && (
          <div className="panel panel--danger">
            <div className="panel-header">
              <h2 className="panel-title">Delete Customer</h2>
              <button className="panel-close" onClick={() => setActiveSection(null)}>✕</button>
            </div>
            <p className="panel-warning">This action is permanent and cannot be undone.</p>
            <div className="form-inline">
              <input className="form-input" type="number" placeholder="Enter Customer ID to delete" value={id} onChange={(e) => setId(e.target.value)} />
              <button className="btn btn--danger" onClick={deleteCustomer} disabled={loading}>
                {loading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        )}

        {/* ── Loading ── */}
        {loading && customers.length === 0 && (
          <div className="loading-state">
            <div className="spinner" />
            <span>Loading customers...</span>
          </div>
        )}

        {/* ── Customer Table ── */}
        {customers.length > 0 && (
          <div className="table-card">
            <div className="table-card-header">
              <h2 className="table-card-title">
                Customers
                <span className="table-badge">{customers.length}</span>
              </h2>
              <button className="btn btn--ghost btn--sm" onClick={() => setCustomers([])}>Clear</button>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.cID}>
                      <td><span className="id-badge">#{c.cID}</span></td>
                      <td>
                        <div className="customer-cell">
                          <div className="customer-avatar">{getInitials(c.name)}</div>
                          <span className="customer-name">{c.name}</span>
                        </div>
                      </td>
                      <td>
                        <a className="contact-link" href={`tel:${c.phone}`}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                          </svg>
                          {c.phone}
                        </a>
                      </td>
                      <td>
                        <a className="contact-link" href={`mailto:${c.email}`}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                          </svg>
                          {c.email}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}