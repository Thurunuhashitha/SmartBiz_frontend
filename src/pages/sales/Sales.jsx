import React, { useState } from "react";
import NavBar from "../../components/nav/NavBar";
import "./sales.css";

export default function SalesCRUD() {
  const token = localStorage.getItem("token");

  const [activeSection, setActiveSection] = useState(null);
  const [id, setId] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [customer, setCustomer] = useState("");
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleSection = (section) =>
    setActiveSection((prev) => (prev === section ? null : section));

  const resetForm = () => {
    setId(""); setProduct(""); setQuantity("");
    setPrice(""); setDate(""); setCustomer("");
  };

  // ── API Calls ──────────────────────────────
  const createSale = async () => {
    if (!product || !quantity || !price || !date || !customer)
      return showToast("Please fill all fields", "error");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/sales/createSale", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ product, quantity, price, date, customer }),
      });
      const data = await res.json();
      if (res.ok) { showToast("Sale created successfully"); resetForm(); setActiveSection(null); }
      else showToast(data.error || "Failed to create sale", "error");
    } catch { showToast("Error creating sale", "error"); }
    setLoading(false);
  };

  const getAllSales = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/sales/getAllSales", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSales(data);
    } catch { showToast("Error fetching sales", "error"); }
    setLoading(false);
  };

  const getSaleById = async () => {
    if (!id) return showToast("Enter sale ID", "error");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/sales/getSaleById/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setSales([data]);
      else showToast(data.error || "Sale not found", "error");
    } catch { showToast("Error fetching sale", "error"); }
    setLoading(false);
  };

  const updateSale = async () => {
    if (!id) return showToast("Enter sale ID", "error");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/sales/updateSale/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ product, quantity, price, date, customer }),
      });
      const data = await res.json();
      if (res.ok) { showToast("Sale updated successfully"); resetForm(); setActiveSection(null); }
      else showToast(data.error || "Failed to update sale", "error");
    } catch { showToast("Error updating sale", "error"); }
    setLoading(false);
  };

  const deleteSale = async () => {
    if (!id) return showToast("Enter sale ID", "error");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/sales/deleteSale/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Sale deleted successfully");
        setSales((prev) => prev.filter((s) => String(s.sID) !== String(id)));
        setId(""); setActiveSection(null);
      } else showToast(data.error || "Failed to delete sale", "error");
    } catch { showToast("Error deleting sale", "error"); }
    setLoading(false);
  };

  // Total revenue from displayed sales
  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.price) * Number(s.quantity), 0);

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
            <h1 className="page-title">Sales Management</h1>
            <p className="page-subtitle">Track and manage your sales records</p>
          </div>
          <button className="btn btn--primary" onClick={() => toggleSection("create")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Sale
          </button>
        </div>

        {/* Summary Cards — shown when sales are loaded */}
        {sales.length > 0 && (
          <div className="summary-row">
            <div className="summary-card">
              <div className="summary-icon summary-icon--teal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div>
                <p className="summary-label">Total Revenue</p>
                <p className="summary-value">LKR {totalRevenue.toLocaleString()}</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon summary-icon--blue">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <div>
                <p className="summary-label">Total Sales</p>
                <p className="summary-value">{sales.length} records</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon summary-icon--purple">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                </svg>
              </div>
              <div>
                <p className="summary-label">Avg. Sale Value</p>
                <p className="summary-value">
                  LKR {sales.length ? Math.round(totalRevenue / sales.length).toLocaleString() : 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="action-bar">
          <button className="btn btn--outline" onClick={getAllSales}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            All Sales
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
              <h2 className="panel-title">New Sale Record</h2>
              <button className="panel-close" onClick={() => setActiveSection(null)}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Product</label>
                <input className="form-input" placeholder="e.g. Wireless Mouse" value={product} onChange={(e) => setProduct(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Customer</label>
                <input className="form-input" placeholder="Customer name" value={customer} onChange={(e) => setCustomer(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input className="form-input" type="number" placeholder="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Unit Price (LKR)</label>
                <input className="form-input" type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div className="form-group form-group--full">
                <label className="form-label">Date</label>
                <input className="form-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
            {/* Live total preview */}
            {price && quantity && (
              <div className="total-preview">
                <span>Total</span>
                <span className="total-preview-value">LKR {(Number(price) * Number(quantity)).toLocaleString()}</span>
              </div>
            )}
            <div className="panel-actions">
              <button className="btn btn--ghost" onClick={() => { resetForm(); setActiveSection(null); }}>Cancel</button>
              <button className="btn btn--primary" onClick={createSale} disabled={loading}>
                {loading ? "Creating..." : "Create Sale"}
              </button>
            </div>
          </div>
        )}

        {/* ── Search by ID Panel ── */}
        {activeSection === "getById" && (
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Search Sale by ID</h2>
              <button className="panel-close" onClick={() => setActiveSection(null)}>✕</button>
            </div>
            <div className="form-inline">
              <input className="form-input" type="number" placeholder="Enter Sale ID" value={id} onChange={(e) => setId(e.target.value)} />
              <button className="btn btn--primary" onClick={getSaleById} disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        )}

        {/* ── Update Panel ── */}
        {activeSection === "update" && (
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Update Sale</h2>
              <button className="panel-close" onClick={() => setActiveSection(null)}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-group form-group--full">
                <label className="form-label">Sale ID <span className="form-required">*</span></label>
                <input className="form-input" type="number" placeholder="Enter ID to update" value={id} onChange={(e) => setId(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Product</label>
                <input className="form-input" placeholder="Product name" value={product} onChange={(e) => setProduct(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Customer</label>
                <input className="form-input" placeholder="Customer name" value={customer} onChange={(e) => setCustomer(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input className="form-input" type="number" placeholder="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Unit Price (LKR)</label>
                <input className="form-input" type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div className="form-group form-group--full">
                <label className="form-label">Date</label>
                <input className="form-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
            <div className="panel-actions">
              <button className="btn btn--ghost" onClick={() => { resetForm(); setActiveSection(null); }}>Cancel</button>
              <button className="btn btn--primary" onClick={updateSale} disabled={loading}>
                {loading ? "Updating..." : "Confirm Update"}
              </button>
            </div>
          </div>
        )}

        {/* ── Delete Panel ── */}
        {activeSection === "delete" && (
          <div className="panel panel--danger">
            <div className="panel-header">
              <h2 className="panel-title">Delete Sale</h2>
              <button className="panel-close" onClick={() => setActiveSection(null)}>✕</button>
            </div>
            <p className="panel-warning">This action is permanent and cannot be undone.</p>
            <div className="form-inline">
              <input className="form-input" type="number" placeholder="Enter Sale ID to delete" value={id} onChange={(e) => setId(e.target.value)} />
              <button className="btn btn--danger" onClick={deleteSale} disabled={loading}>
                {loading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        )}

        {/* ── Loading ── */}
        {loading && sales.length === 0 && (
          <div className="loading-state">
            <div className="spinner" />
            <span>Loading sales...</span>
          </div>
        )}

        {/* ── Sales Table ── */}
        {sales.length > 0 && (
          <div className="table-card">
            <div className="table-card-header">
              <h2 className="table-card-title">
                Sales Records
                <span className="table-badge">{sales.length}</span>
              </h2>
              <button className="btn btn--ghost btn--sm" onClick={() => setSales([])}>Clear</button>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Customer</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s) => (
                    <tr key={s.sID}>
                      <td><span className="id-badge">#{s.sID}</span></td>
                      <td><span className="sale-product">{s.product}</span></td>
                      <td>{s.customer}</td>
                      <td><span className="qty-badge">{s.quantity}</span></td>
                      <td>LKR {Number(s.price).toLocaleString()}</td>
                      <td><span className="sale-total">LKR {(Number(s.price) * Number(s.quantity)).toLocaleString()}</span></td>
                      <td>{new Date(s.date).toLocaleDateString("en-GB")}</td>
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