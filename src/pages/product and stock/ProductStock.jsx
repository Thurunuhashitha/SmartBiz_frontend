import React, { useState } from "react";
import NavBar from "../../components/nav/NavBar";
import "../../styles/global.css";
import "./product.css";

export default function ProductCRUD() {
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch all products for stock view ──────
  const getAllStock = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://smartbizapi.thurunu.me/product/getAllProducts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setProducts(data);
      else showToast(data.error || "Failed to fetch stock data", "error");
    } catch {
      showToast("Error fetching stock data", "error");
    }
    setLoading(false);
  };

  // ── Stock value per row: price × quantity ───
  const getStockValue = (p) => Number(p.unit_price) * Number(p.current_stock);

  // ── Grand total ─────────────────────────────
  const totalStockValue = products.reduce(
    (sum, p) => sum + getStockValue(p), 0
  );

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
            <h1 className="page-title">Products & Stock</h1>
            <p className="page-subtitle">View stock levels and values from supplier records</p>
          </div>
          <button className="btn btn--primary" onClick={getAllStock} disabled={loading}>
            {loading ? "Loading..." : "Load Stock"}
          </button>
        </div>

        {/* Loading State */}
        {loading && products.length === 0 && (
          <div className="loading-state">
            <div className="spinner" />
            Loading stock data...
          </div>
        )}

        {/* ── Stock Table ── */}
        {products.length > 0 && (
          <div className="table-card">
            <div className="table-card-header">
              <h2 className="table-card-title">
                Stock Overview
                <span className="table-badge">{products.length} items</span>
              </h2>
              <button className="btn btn--ghost btn--sm" onClick={() => setProducts([])}>Clear</button>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Current Stock</th>
                    <th>Unit Price</th>
                    <th>Stock Value</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.pID}>
                      <td><span className="id-badge">#{p.pID}</span></td>
                      <td>
                        <span className="product-tag">📦 {p.product_name}</span>
                      </td>
                      <td>
                        <span className={`stock-badge ${
                          Number(p.current_stock) <= 10
                            ? "stock-badge--low"
                            : Number(p.current_stock) <= 50
                            ? "stock-badge--mid"
                            : "stock-badge--ok"
                        }`}>
                          {p.current_stock} units
                        </span>
                      </td>
                      <td><span className="price">LKR {Number(p.unit_price).toLocaleString()}</span></td>
                      <td>
                        <span className="stock-value">
                          LKR {getStockValue(p).toLocaleString()}
                        </span>
                      </td>
                      <td>
                        {p.created_at
                          ? new Date(p.created_at).toLocaleDateString("en-GB")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-total-row">
                    <td colSpan="4" className="table-total-label">
                      Total Stock Value (price × quantity)
                    </td>
                    <td className="table-total-value" colSpan="2">
                      LKR {totalStockValue.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="empty-state">
            <p className="empty-state-icon">📦</p>
            <p className="empty-state-title">No stock records found</p>
            <p className="empty-state-sub">Stock is updated automatically when suppliers are added.</p>
          </div>
        )}

      </main>
    </div>
  );
}