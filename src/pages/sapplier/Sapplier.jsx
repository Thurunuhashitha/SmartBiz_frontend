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
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [supplyDate, setSupplyDate] = useState("");
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
    setId(""); setName(""); setProduct(""); setQuantity("");
    setPrice(""); setPhone(""); setSupplyDate("");
  };

  // ── API Calls ──────────────────────────────
  const createSupplier = async () => {
    if (!name || !product || !phone || !quantity || !price )
      return showToast("Please fill all fields", "error");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/supplier/createSupplier", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, product, quantity, price, phone  }),
      });
      const data = await res.json();
      if (res.ok) { showToast("Supplier created successfully"); resetForm(); setActiveSection(null); }
      else {
        showToast(data.message || data.error || "Failed to create supplier", "error");
      }
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
        body: JSON.stringify({ name, product, quantity, price, phone }),
      });
      const data = await res.json();
      if (res.ok) { showToast("Supplier updated successfully"); resetForm(); setActiveSection(null); }
      else showToast(data.error || "Failed to update supplier", "error");
    } catch { showToast("Error updating supplier", "error"); }
    setLoading(false);
  };

  const deleteSupplier = async () => {
    if (!id) return showToast("Enter supplier ID", "error");
    handleDeleteSupplier(id);
    setId(""); 
    setActiveSection(null);
  };

  const handleDeleteSupplier = async (supplierId) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/supplier/deleteSupplier/${supplierId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Supplier deleted successfully");
        setSuppliers((prev) => prev.filter((s) => String(s.sID) !== String(supplierId)));
      } else {
        showToast(data.error || "Failed to delete supplier", "error");
      }
    } catch (err) {
      console.error("Delete supplier network error:", err);
      showToast("Network error: Could not reach server", "error");
    }
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
            + Add Supplier
          </button>
        </div>

        {/* Action Bar */}
        <div className="action-bar">
          <button className="btn btn--outline" onClick={getAllSuppliers}>
            All Suppliers
          </button>
          <button
            className={`btn btn--outline${activeSection === "getById" ? " active" : ""}`}
            onClick={() => toggleSection("getById")}
          >
            Search by ID
          </button>
          <button
            className={`btn btn--outline${activeSection === "update" ? " active" : ""}`}
            onClick={() => toggleSection("update")}
          >
            Update
          </button>
          <button
            className={`btn btn--danger-outline${activeSection === "delete" ? " active" : ""}`}
            onClick={() => toggleSection("delete")}
          >
            Delete
          </button>
        </div>

        {/* ── Create Panel ── */}
        {activeSection === "create" && (
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Add New Supplier</h2>
              <button className="panel-close" onClick={() => { resetForm(); setActiveSection(null); }}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Supplier Name</label>
                <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. ABC Traders" />
              </div>
              <div className="form-group">
                <label className="form-label">Product</label>
                <input className="form-input" value={product} onChange={e => setProduct(e.target.value)} placeholder="e.g. Rice" />
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input className="form-input" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Price</label>
                <input className="form-input" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+94 77 000 0000" />
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
              <button className="panel-close" onClick={() => { setId(""); setActiveSection(null); }}>✕</button>
            </div>
            <div className="form-inline">
              <input
                className="form-input"
                value={id}
                onChange={e => setId(e.target.value)}
                placeholder="Enter Supplier ID"
              />
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
              <button className="panel-close" onClick={() => { resetForm(); setActiveSection(null); }}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-group form-group--full">
                <label className="form-label">Supplier ID <span className="form-required">*</span></label>
                <input className="form-input" value={id} onChange={e => setId(e.target.value)} placeholder="Enter ID to update" />
              </div>
              <div className="form-group">
                <label className="form-label">Supplier Name</label>
                <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. ABC Traders" />
              </div>
              <div className="form-group">
                <label className="form-label">Product</label>
                <input className="form-input" value={product} onChange={e => setProduct(e.target.value)} placeholder="e.g. Rice" />
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input className="form-input" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Price</label>
                <input className="form-input" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+94 77 000 0000" />
              </div> 
            </div>
            <div className="panel-actions">
              <button className="btn btn--ghost" onClick={() => { resetForm(); setActiveSection(null); }}>Cancel</button>
              <button className="btn btn--primary" onClick={updateSupplier} disabled={loading}>
                {loading ? "Updating..." : "Update Supplier"}
              </button>
            </div>
          </div>
        )}

        {/* ── Delete Panel ── */}
        {activeSection === "delete" && (
          <div className="panel panel--danger">
            <div className="panel-header">
              <h2 className="panel-title">Delete Supplier</h2>
              <button className="panel-close" onClick={() => { setId(""); setActiveSection(null); }}>✕</button>
            </div>
            <p className="panel-warning">⚠ This action is permanent and cannot be undone.</p>
            <div className="form-inline">
              <input
                className="form-input"
                value={id}
                onChange={e => setId(e.target.value)}
                placeholder="Enter Supplier ID to delete"
              />
              <button className="btn btn--danger" onClick={deleteSupplier} disabled={loading}>
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}

        {/* ── Suppliers Table ── */}
        {loading && suppliers.length === 0 && (
          <div className="loading-state">
            <div className="spinner" />
            Loading suppliers...
          </div>
        )}

        {suppliers.length > 0 && (
          <div className="table-card">
            <div className="table-card-header">
              <h3 className="table-card-title">
                Suppliers
                <span className="table-badge">{suppliers.length}</span>
              </h3>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Supplier</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Phone</th>
                    <th>Supply Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map(s => (
                    <tr key={s.sID}>
                      <td><span className="id-badge">#{s.sID}</span></td>
                      <td>
                        <div className="supplier-cell">
                          <div className="supplier-avatar">{getInitials(s.name)}</div>
                          <span className="supplier-name">{s.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="product-tag">📦 {s.product}</span>
                      </td>
                      <td>{s.quantity}</td>
                      <td>${Number(s.price).toFixed(2)}</td>
                      <td>
                        <a className="contact-link" href={`tel:${s.phone}`}>📞 {s.phone}</a>
                      </td>
                      <td>{s.supply_date ? new Date(s.supply_date).toLocaleDateString() : "—"}</td>
                      <td>
                        <button 
                          className="btn btn--danger btn--sm" 
                          onClick={() => handleDeleteSupplier(s.sID)}
                          title="Delete Supplier"
                        >
                          Delete
                        </button>
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