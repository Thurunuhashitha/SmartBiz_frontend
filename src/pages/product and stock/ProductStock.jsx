import React, { useState } from "react";
import NavBar from "../../components/nav/NavBar";
import "./product.css";

export default function ProductCRUD() {
  const token = localStorage.getItem("token");

  const [activeSection, setActiveSection] = useState(null);
  const [id, setId] = useState("");
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [supplier, setSupplier] = useState("");
  const [date_added, setDateAdded] = useState("");
  const [allProducts, setAllProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleSection = (section) =>
    setActiveSection((prev) => (prev === section ? null : section));

  const resetForm = () => {
    setId(""); setProduct(""); setPrice("");
    setStock(""); setSupplier(""); setDateAdded("");
  };

  const totalStockValue = allProducts.reduce(
    (sum, p) => sum + Number(p.price) * Number(p.stock), 0
  );

  // ── API Calls ──────────────────────────────────────
  const addProduct = async () => {
    if (!product || !price || !stock || !supplier || !date_added)
      return showToast("Please fill all fields", "error");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/product/createProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ product, price: Number(price), stock: Number(stock), supplier, date_added }),
      });
      const data = await res.json();
      if (res.ok) { showToast("Product added successfully"); resetForm(); setActiveSection(null); }
      else showToast(data.error || "Failed to add product", "error");
    } catch { showToast("Failed to add product", "error"); }
    setLoading(false);
  };

  const getAllProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/product/getAllProducts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok || !data.error) {
        setAllProducts(data);
      }
      else showToast(data.error || "Failed to fetch products", "error");
    } catch { showToast("Failed to fetch products", "error"); }
    setLoading(false);
  };

  const getProductById = async () => {
    if (!id) return showToast("Enter product ID", "error");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/product/getProductById/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setAllProducts([data]);
      else showToast(data.error || "Product not found", "error");
    } catch { showToast("Failed to fetch product", "error"); }
    setLoading(false);
  };

  const updateProduct = async () => {
    if (!id) return showToast("Enter product ID", "error");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/product/updateProduct/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ product, price: Number(price), stock: Number(stock), supplier, date_added }),
      });
      const data = await res.json();
      if (res.ok) { showToast("Product updated successfully"); resetForm(); setActiveSection(null); }
      else showToast(data.error || "Failed to update product", "error");
    } catch { showToast("Failed to update product", "error"); }
    setLoading(false);
  };

  const deleteProduct = async () => {
    if (!id) return showToast("Enter product ID", "error");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/product/deleteProduct/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Product deleted successfully");
        setId(""); setActiveSection(null);
        setAllProducts((prev) => prev.filter((p) => String(p.pID) !== String(id)));
      } else showToast(data.error || "Failed to delete product", "error");
    } catch { showToast("Failed to delete product", "error"); }
    setLoading(false);
  };

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
            <h1 className="page-title">Products & Stock</h1>
            <p className="page-subtitle">Manage your product inventory</p>
          </div>
          <button className="btn btn--primary" onClick={() => toggleSection("add")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Product
          </button>
        </div>

        {/* Action Buttons */}
        <div className="action-bar">
          <button className="btn btn--outline" onClick={getAllProducts}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            All Products
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
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            Delete
          </button>
        </div>

        {/* ── Panels ── */}

        {/* Add Product */}
        {activeSection === "add" && (
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Add New Product</h2>
              <button className="panel-close" onClick={() => setActiveSection(null)}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input className="form-input" placeholder="e.g. Wireless Mouse" value={product} onChange={(e) => setProduct(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Price (LKR)</label>
                <input className="form-input" type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input className="form-input" type="number" placeholder="0" value={stock} onChange={(e) => setStock(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Supplier</label>
                <input className="form-input" placeholder="Supplier name" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Date Added</label>
                <input className="form-input" type="date" value={date_added} onChange={(e) => setDateAdded(e.target.value)} />
              </div>
            </div>
            <div className="panel-actions">
              <button className="btn btn--ghost" onClick={() => { resetForm(); setActiveSection(null); }}>Cancel</button>
              <button className="btn btn--primary" onClick={addProduct} disabled={loading}>
                {loading ? "Adding..." : "Add Product"}
              </button>
            </div>
          </div>
        )}

        {/* Search by ID */}
        {activeSection === "getById" && (
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Search Product by ID</h2>
              <button className="panel-close" onClick={() => setActiveSection(null)}>✕</button>
            </div>
            <div className="form-inline">
              <input className="form-input" type="number" placeholder="Enter Product ID" value={id} onChange={(e) => setId(e.target.value)} />
              <button className="btn btn--primary" onClick={getProductById} disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        )}

        {/* Update */}
        {activeSection === "update" && (
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Update Product</h2>
              <button className="panel-close" onClick={() => setActiveSection(null)}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-group form-group--full">
                <label className="form-label">Product ID <span className="form-required">*</span></label>
                <input className="form-input" type="number" placeholder="Enter ID to update" value={id} onChange={(e) => setId(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input className="form-input" placeholder="Product name" value={product} onChange={(e) => setProduct(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Price (LKR)</label>
                <input className="form-input" type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input className="form-input" type="number" placeholder="0" value={stock} onChange={(e) => setStock(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Supplier</label>
                <input className="form-input" placeholder="Supplier name" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Date Added</label>
                <input className="form-input" type="date" value={date_added} onChange={(e) => setDateAdded(e.target.value)} />
              </div>
            </div>
            <div className="panel-actions">
              <button className="btn btn--ghost" onClick={() => { resetForm(); setActiveSection(null); }}>Cancel</button>
              <button className="btn btn--primary" onClick={updateProduct} disabled={loading}>
                {loading ? "Updating..." : "Confirm Update"}
              </button>
            </div>
          </div>
        )}

        {/* Delete */}
        {activeSection === "delete" && (
          <div className="panel panel--danger">
            <div className="panel-header">
              <h2 className="panel-title">Delete Product</h2>
              <button className="panel-close" onClick={() => setActiveSection(null)}>✕</button>
            </div>
            <p className="panel-warning">This action cannot be undone. The product will be permanently removed.</p>
            <div className="form-inline">
              <input className="form-input" type="number" placeholder="Enter Product ID to delete" value={id} onChange={(e) => setId(e.target.value)} />
              <button className="btn btn--danger" onClick={deleteProduct} disabled={loading}>
                {loading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        )}

        {/* ── Loading ── */}
        {loading && allProducts.length === 0 && (
          <div className="loading-state">
            <div className="spinner" />
            <span>Loading products...</span>
          </div>
        )}


        {/* ── Products Table ── */}
        {allProducts.length > 0 && (
          <div className="table-card">
            <div className="table-card-header">
              <h2 className="table-card-title">
                Products
                <span className="table-badge">{allProducts.length}</span>
              </h2>
              <button className="btn btn--ghost btn--sm" onClick={() => setAllProducts([])}>Clear</button>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Stock Value</th>
                    <th>Supplier</th>
                    <th>Date Added</th>
                  </tr>
                </thead>
                <tbody>
                  {allProducts.map((p) => (
                    <tr key={p.pID}>
                      <td><span className="id-badge">#{p.pID}</span></td>
                      <td><span className="product-name">{p.product}</span></td>
                      <td><span className="price">LKR {Number(p.price).toLocaleString()}</span></td>
                      <td>
                        <span className={`stock-badge ${Number(p.stock) <= 10 ? "stock-badge--low" : Number(p.stock) <= 50 ? "stock-badge--mid" : "stock-badge--ok"}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td>
                        <span className="stock-value">
                          LKR {(Number(p.stock) * Number(p.price)).toLocaleString()}
                        </span>
                      </td>
                      <td>{p.supplier}</td>
                      <td>{new Date(p.date_added).toLocaleDateString("en-GB")}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-total-row">
                    <td colSpan="4" className="table-total-label">Total Stock Value</td>
                    <td className="table-total-value" colSpan="3">
                      LKR {totalStockValue.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}