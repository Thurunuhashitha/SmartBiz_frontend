import React, { useState } from "react";
import NavBar from "../../components/nav/NavBar";
import "../../styles/global.css";
import "./customer.css";

export default function CustomerCRUD() {
  const token = localStorage.getItem("token");

  // ── States ──────────────────────────────
  const [activeSection, setActiveSection] = useState(null);
  const [id, setId] = useState("");
  const [customer_name, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit_price, setUnitPrice] = useState("");
  const [sale_date, setSaleDate] = useState("");
  const [customers, setCustomers] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // ── Toast ──────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleSection = (section) => {
    setActiveSection((prev) => (prev === section ? null : section));
    if (section === "create" || section === "update") {
      fetchAvailableProducts();
    }
  };

  const resetForm = () => {
    setId("");
    setCustomerName("");
    setPhone("");
    setEmail("");
    setProduct("");
    setQuantity("");
    setUnitPrice("");
    setSaleDate("");
  };

  // ── API Calls ──────────────────────────────
  const fetchAvailableProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/product/getAvailableProducts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setAvailableProducts(data);
    } catch {
      showToast("Error fetching available products", "error");
    }
  };

  const createCustomer = async () => {
    if (!customer_name || !phone || !email || !product || !quantity || !unit_price )
      return showToast("Please fill all fields", "error");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/customer/createCustomer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ customer_name, phone, email, product, quantity, unit_price, sale_date }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Customer created successfully");
        resetForm();
        setActiveSection(null);
      } else showToast(data.error || "Failed to create customer", "error");
    } catch {
      showToast("Error creating customer", "error");
    }
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
    } catch {
      showToast("Error fetching customers", "error");
    }
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
    } catch {
      showToast("Error fetching customer", "error");
    }
    setLoading(false);
  };

  const updateCustomer = async () => {
    if (!id) return showToast("Enter customer ID", "error");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/customer/updateCustomer/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ customer_name, phone, email, product, quantity, unit_price, sale_date }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Customer updated successfully");
        resetForm();
        setActiveSection(null);
      } else showToast(data.error || "Failed to update customer", "error");
    } catch {
      showToast("Error updating customer", "error");
    }
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
        setId("");
        setActiveSection(null);
      } else showToast(data.error || "Failed to delete customer", "error");
    } catch {
      showToast("Error deleting customer", "error");
    }
    setLoading(false);
  };

  const getInitials = (n) =>
    n ? n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() : "?";

  const handleProductChange = (e) => {
    const selectedProductName = e.target.value;
    setProduct(selectedProductName);
    
    const selectedProd = availableProducts.find(p => p.product_name === selectedProductName);
    if (selectedProd) {
      setUnitPrice(selectedProd.unit_price);
    }
  };

  // ── JSX ──────────────────────────────
  return (
    <div className="page-wrapper">
      <NavBar />

      <main className="main-content">
        {toast && (
          <div className={`toast toast--${toast.type}`}>
            <span className="toast-icon">{toast.type === "success" ? "✓" : "✕"}</span>
            {toast.msg}
          </div>
        )}

        <div className="page-header">
          <div>
            <h1 className="page-title">Customer Management</h1>
            <p className="page-subtitle">View and manage your customer records</p>
          </div>
          <button className="btn btn--primary" onClick={() => toggleSection("create")}>
            + Add Customer
          </button>
        </div>

        <div className="action-bar">
          <button className="btn btn--outline" onClick={getAllCustomers}>All Customers</button>
          <button className={`btn btn--outline${activeSection === "getById" ? " active" : ""}`} onClick={() => toggleSection("getById")}>Search by ID</button>
          <button className={`btn btn--outline${activeSection === "update" ? " active" : ""}`} onClick={() => toggleSection("update")}>Update</button>
          <button className={`btn btn--danger-outline${activeSection === "delete" ? " active" : ""}`} onClick={() => toggleSection("delete")}>Delete</button>
        </div>

        {/* ── Create Panel ── */}
        {activeSection === "create" && (
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Add New Customer</h2>
              <button className="panel-close" onClick={() => { resetForm(); setActiveSection(null); }}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-group form-group--full">
                <label className="form-label">Customer Name <span className="form-required">*</span></label>
                <input className="form-input" value={customer_name} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. John Silva" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone <span className="form-required">*</span></label>
                <input className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94 77 000 0000" />
              </div>
              <div className="form-group">
                <label className="form-label">Email <span className="form-required">*</span></label>
                <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Product <span className="form-required">*</span></label>
                <select 
                  className="form-input" 
                  value={product} 
                  onChange={handleProductChange}
                >
                  <option value="">Select a product</option>
                  {availableProducts.map(p => (
                    <option key={p.pID} value={p.product_name}>
                      {p.product_name} ({p.current_stock} in stock)
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Quantity <span className="form-required">*</span></label>
                <input className="form-input" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Unit Price <span className="form-required">*</span></label>
                <input className="form-input" type="number" step="0.01" value={unit_price} onChange={(e) => setUnitPrice(e.target.value)} placeholder="0.00" />
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
              <button className="panel-close" onClick={() => { setId(""); setActiveSection(null); }}>✕</button>
            </div>
            <div className="form-inline">
              <input
                className="form-input"
                type="number"
                placeholder="Enter Customer ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
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
              <button className="panel-close" onClick={() => { resetForm(); setActiveSection(null); }}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-group form-group--full">
                <label className="form-label">Customer ID <span className="form-required">*</span></label>
                <input className="form-input" type="number" placeholder="Enter ID to update" value={id} onChange={(e) => setId(e.target.value)} />
              </div>
              <div className="form-group form-group--full">
                <label className="form-label">Customer Name</label>
                <input className="form-input" value={customer_name} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. John Silva" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94 77 000 0000" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Product</label>
                <select 
                  className="form-input" 
                  value={product} 
                  onChange={handleProductChange}
                >
                  <option value="">Select a product</option>
                  {availableProducts.map(p => (
                    <option key={p.pID} value={p.product_name}>
                      {p.product_name} ({p.current_stock} in stock)
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input className="form-input" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Unit Price</label>
                <input className="form-input" type="number" step="0.01" value={unit_price} onChange={(e) => setUnitPrice(e.target.value)} placeholder="0.00" />
              </div> 
            </div>
            <div className="panel-actions">
              <button className="btn btn--ghost" onClick={() => { resetForm(); setActiveSection(null); }}>Cancel</button>
              <button className="btn btn--primary" onClick={updateCustomer} disabled={loading}>
                {loading ? "Updating..." : "Update Customer"}
              </button>
            </div>
          </div>
        )}

        {/* ── Delete Panel ── */}
        {activeSection === "delete" && (
          <div className="panel panel--danger">
            <div className="panel-header">
              <h2 className="panel-title">Delete Customer</h2>
              <button className="panel-close" onClick={() => { setId(""); setActiveSection(null); }}>✕</button>
            </div>
            <p className="panel-warning">⚠ This action is permanent and cannot be undone.</p>
            <div className="form-inline">
              <input
                className="form-input"
                type="number"
                placeholder="Enter Customer ID to delete"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
              <button className="btn btn--danger" onClick={deleteCustomer} disabled={loading}>
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && customers.length === 0 && (
          <div className="loading-state">
            <div className="spinner" />
            Loading customers...
          </div>
        )}

        {/* ── Customer Table ── */}
        {customers.length > 0 && (
          <div className="table-card">
            <div className="table-card-header">
              <h3 className="table-card-title">
                Customers
                <span className="table-badge">{customers.length}</span>
              </h3>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Sale Date</th>
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
                          <div className="customer-avatar">{getInitials(c.customer_name)}</div>
                          <span className="customer-name">{c.customer_name}</span>
                        </div>
                      </td>
                      <td><span className="product-tag">📦 {c.product}</span></td>
                      <td>{c.quantity}</td>
                      <td>${Number(c.unit_price).toFixed(2)}</td>
                      <td>{c.sale_date ? new Date(c.sale_date).toLocaleDateString() : "—"}</td>
                      <td><a className="contact-link" href={`tel:${c.phone}`}>📞 {c.phone}</a></td>
                      <td><a className="contact-link" href={`mailto:${c.email}`}>✉ {c.email}</a></td>
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