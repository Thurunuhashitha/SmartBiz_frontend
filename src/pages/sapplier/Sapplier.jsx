import React, { useState } from "react";
import NavBar from "../../components/nav/NavBar";
import "../../styles/global.css";
import "./supplier.css";

export default function SupplierCRUD() {
  const token = localStorage.getItem("token");

  const [activeSection, setActiveSection] = useState(null);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [product, setProduct] = useState("");
  const [phone, setPhone] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleSection = (section) =>
    setActiveSection((prev) => (prev === section ? null : section));

  const resetForm = () => {
    setId(""); setName(""); setProduct(""); setPhone("");
  };

  // ── API Calls ──────────────────────────────
  const createSupplier = async () => {
    if (!name || !product || !phone) return showToast("Please fill all fields", "error");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/supplier/createSupplier", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, product, phone }),
      });
      const data = await res.json();
      if (res.ok) { showToast("Supplier created successfully"); resetForm(); setActiveSection(null); }
      else showToast(data.error || "Failed to create supplier", "error");
    } catch { showToast("Error creating supplier", "error"); }
    setLoading(false);
  };

  const getAllSuppliers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/supplier/getAllSuppliers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSuppliers(data);
    } catch { showToast("Error fetching suppliers", "error"); }
    setLoading(false);
  };

  const getSupplierById = async () => {
    if (!id) return showToast("Enter supplier ID", "error");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/supplier/getSupplierById/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setSuppliers([data]);
      else showToast(data.error || "Supplier not found", "error");
    } catch { showToast("Error fetching supplier", "error"); }
    setLoading(false);
  };

  const updateSupplier = async () => {
    if (!id) return showToast("Enter supplier ID", "error");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/supplier/updateSupplier/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, product, phone }),
      });
      const data = await res.json();
      if (res.ok) { showToast("Supplier updated successfully"); resetForm(); setActiveSection(null); }
      else showToast(data.error || "Failed to update supplier", "error");
    } catch { showToast("Error updating supplier", "error"); }
    setLoading(false);
  };

  const deleteSupplier = async () => {
    if (!id) return showToast("Enter supplier ID", "error");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/supplier/deleteSupplier/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Supplier deleted successfully");
        setSuppliers((prev) => prev.filter((s) => String(s.sID) !== String(id)));
        setId(""); setActiveSection(null);
      } else showToast(data.error || "Failed to delete supplier", "error");
    } catch { showToast("Error deleting supplier", "error"); }
    setLoading(false);
  };

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
            <h1 className="page-title">Supplier Management</h1>
            <p className="page-subtitle">Manage your suppliers and their products</p>
          </div>
          <button className="btn btn--primary" onClick={() => toggleSection("create")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Supplier
          </button>
        </div>

        {/* Action Bar */}
        <div className="action-bar">
          <button className="btn btn--outline" onClick={getAllSuppliers}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="2"/>
              <path d="M16 8h4l3 3v5h-7V8z"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            All Suppliers
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
              <h2 className="panel-title">Add New Supplier</h2>
              <button className="panel-close" onClick={() => setActiveSection(null)}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Supplier Name</label>
                <input className="form-input" placeholder="e.g. ABC Trading Co." value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Product Supplied</label>
                <input className="form-input" placeholder="e.g. Electronics" value={product} onChange={(e) => setProduct(e.target.value)} />
              </div>
              <div className="form-group form-group--full">
                <label className="form-label">Phone Number</label>
                <input className="form-input" placeholder="e.g. 0112345678" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            <div className="panel-actions">
              <button className="btn btn--ghost" onClick={() => { resetForm(); setActiveSection(null); }}>Cancel</button>
              <button className="btn btn--primary" onClick={createSupplier} disabled={loading}>
                {loading ? "Creating..." : "Create Supplier"}
              </button>
            </div>
          </div>
        )}

        {/* ── Search by ID Panel ── */}
        {activeSection === "getById" && (
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Search Supplier by ID</h2>
              <button className="panel-close" onClick={() => setActiveSection(null)}>✕</button>
            </div>
            <div className="form-inline">
              <input className="form-input" type="number" placeholder="Enter Supplier ID" value={id} onChange={(e) => setId(e.target.value)} />
              <button className="btn btn--primary" onClick={getSupplierById} disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        )}

        {/* ── Update Panel ── */}
        {activeSection === "update" && (
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Update Supplier</h2>
              <button className="panel-close" onClick={() => setActiveSection(null)}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-group form-group--full">
                <label className="form-label">Supplier ID <span className="form-required">*</span></label>
                <input className="form-input" type="number" placeholder="Enter ID to update" value={id} onChange={(e) => setId(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Supplier Name</label>
                <input className="form-input" placeholder="Supplier name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Product Supplied</label>
                <input className="form-input" placeholder="Product" value={product} onChange={(e) => setProduct(e.target.value)} />
              </div>
              <div className="form-group form-group--full">
                <label className="form-label">Phone Number</label>
                <input className="form-input" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            <div className="panel-actions">
              <button className="btn btn--ghost" onClick={() => { resetForm(); setActiveSection(null); }}>Cancel</button>
              <button className="btn btn--primary" onClick={updateSupplier} disabled={loading}>
                {loading ? "Updating..." : "Confirm Update"}
              </button>
            </div>
          </div>
        )}

        {/* ── Delete Panel ── */}
        {activeSection === "delete" && (
          <div className="panel panel--danger">
            <div className="panel-header">
              <h2 className="panel-title">Delete Supplier</h2>
              <button className="panel-close" onClick={() => setActiveSection(null)}>✕</button>
            </div>
            <p className="panel-warning">This action is permanent and cannot be undone.</p>
            <div className="form-inline">
              <input className="form-input" type="number" placeholder="Enter Supplier ID to delete" value={id} onChange={(e) => setId(e.target.value)} />
              <button className="btn btn--danger" onClick={deleteSupplier} disabled={loading}>
                {loading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        )}

        {/* ── Loading ── */}
        {loading && suppliers.length === 0 && (
          <div className="loading-state">
            <div className="spinner" />
            <span>Loading suppliers...</span>
          </div>
        )}

        {/* ── Suppliers Table ── */}
        {suppliers.length > 0 && (
          <div className="table-card">
            <div className="table-card-header">
              <h2 className="table-card-title">
                Suppliers
                <span className="table-badge">{suppliers.length}</span>
              </h2>
              <button className="btn btn--ghost btn--sm" onClick={() => setSuppliers([])}>Clear</button>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Supplier</th>
                    <th>Product</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((s) => (
                    <tr key={s.sID}>
                      <td><span className="id-badge">#{s.sID}</span></td>
                      <td>
                        <div className="supplier-cell">
                          <div className="supplier-avatar">{getInitials(s.name)}</div>
                          <span className="supplier-name">{s.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="product-tag">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                          </svg>
                          {s.product}
                        </span>
                      </td>
                      <td>
                        <a className="contact-link" href={`tel:${s.phone}`}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                          </svg>
                          {s.phone}
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