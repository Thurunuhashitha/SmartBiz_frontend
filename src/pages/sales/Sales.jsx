import React, { useState, useEffect } from "react";
import NavBar from "../../components/nav/NavBar";
import "../../styles/global.css";
import "./sales.css";

export default function SalesPage() {
  const token = localStorage.getItem("token");

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://smartbizapi.thurunu.me/customer/getAllCustomers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setSales(data);
      else showToast(data.error || "Failed to fetch sales", "error");
    } catch {
      showToast("Error fetching sales data", "error");
    }
    setLoading(false);
  };

  // ── Fetch on mount ───────────────────────────
  useEffect(() => {
    fetchSales();
  }, []);

  // ── Calculations ─────────────────────────────
  const totalRevenue = sales.reduce(
    (sum, s) => sum + Number(s.unit_price) * Number(s.quantity), 0
  );

  const totalSales = sales.length;

  const bestSellingProduct = (() => {
    if (!sales.length) return "—";
    const counts = {};
    sales.forEach((s) => {
      counts[s.product] = (counts[s.product] || 0) + Number(s.quantity);
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  })();

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
            <h1 className="page-title">Sales Overview</h1>
            <p className="page-subtitle">Sales records from customer transactions</p>
          </div>
          <button className="btn btn--primary" onClick={fetchSales} disabled={loading}>
            {loading ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>

        {/* ── Summary Cards ── */}
        {sales.length > 0 && (
          <div className="sales-summary-row">
            <div className="sales-summary-card">
              <div className="sales-summary-icon sales-summary-icon--teal">💰</div>
              <div>
                <p className="sales-summary-label">Total Revenue</p>
                <p className="sales-summary-value">LKR {totalRevenue.toLocaleString()}</p>
              </div>
            </div>
            <div className="sales-summary-card">
              <div className="sales-summary-icon sales-summary-icon--blue">🧾</div>
              <div>
                <p className="sales-summary-label">Total Sales</p>
                <p className="sales-summary-value">{totalSales} records</p>
              </div>
            </div>
            <div className="sales-summary-card">
              <div className="sales-summary-icon sales-summary-icon--purple">🏆</div>
              <div>
                <p className="sales-summary-label">Best Selling Product</p>
                <p className="sales-summary-value sales-summary-value--product">{bestSellingProduct}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && sales.length === 0 && (
          <div className="loading-state">
            <div className="spinner" />
            Loading sales data...
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
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th>Sale Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s) => (
                    <tr key={s.cID}>
                      <td><span className="id-badge">#{s.cID}</span></td>
                      <td>
                        <span className="product-tag">📦 {s.product}</span>
                      </td>
                      <td>
                        <span className="qty-badge">{s.quantity} units</span>
                      </td>
                      <td>
                        <span className="unit-price">
                          LKR {Number(s.unit_price).toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span className="sale-total">
                          LKR {(Number(s.unit_price) * Number(s.quantity)).toLocaleString()}
                        </span>
                      </td>
                      <td>
                        {s.sale_date
                          ? new Date(s.sale_date).toLocaleDateString("en-GB", {
                              day: "2-digit", month: "short", year: "numeric",
                            })
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-total-row">
                    <td colSpan="4" className="table-total-label">Total Revenue</td>
                    <td colSpan="2" className="table-total-value">
                      LKR {totalRevenue.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && sales.length === 0 && (
          <div className="empty-state">
            <p className="empty-state-icon">🧾</p>
            <p className="empty-state-title">No sales records found</p>
            <p className="empty-state-sub">Sales are recorded automatically when customers are added.</p>
          </div>
        )}

      </main>
    </div>
  );
}