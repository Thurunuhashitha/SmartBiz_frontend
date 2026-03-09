import React, { useState } from "react";
import NavBar from "../../components/nav/NavBar";
import "./expense.css";

export default function ExpenseCRUD() {
  const token = localStorage.getItem("token");

  const [activeSection, setActiveSection] = useState(null);
  const [id, setId] = useState("");
  const [expense, setExpense] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [profitSummary, setProfitSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleSection = (section) =>
    setActiveSection((prev) => (prev === section ? null : section));

  const resetForm = () => {
    setId(""); setExpense(""); setAmount(""); setDate("");
  };

  // ── API Calls ──────────────────────────────
  const createExpense = async () => {
    if (!expense || !amount || !date) return showToast("Please fill all fields", "error");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/expense/createExpense", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ expense, amount, date }),
      });
      const data = await res.json();
      if (res.ok) { showToast("Expense created successfully"); resetForm(); setActiveSection(null); }
      else showToast(data.error || "Failed to create expense", "error");
    } catch { showToast("Error creating expense", "error"); }
    setLoading(false);
  };

  const getAllExpenses = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/expense/getAllExpenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setExpenses(data);
    } catch { showToast("Error fetching expenses", "error"); }
    setLoading(false);
  };

  const getProfitSummary = async () => {
    try {
      const res = await fetch("http://localhost:3000/expense/getProfitSummary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setProfitSummary(data);
    } catch { console.error("Error fetching profit summary"); }
  };

  React.useEffect(() => {
    getProfitSummary();
  }, []);

  const getExpenseById = async () => {
    if (!id) return showToast("Enter expense ID", "error");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/expense/getExpenseById/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setExpenses([data]);
      else showToast(data.error || "Expense not found", "error");
    } catch { showToast("Error fetching expense", "error"); }
    setLoading(false);
  };

  const updateExpense = async () => {
    if (!id) return showToast("Enter expense ID", "error");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/expense/updateExpense/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ expense, amount, date }),
      });
      const data = await res.json();
      if (res.ok) { showToast("Expense updated successfully"); resetForm(); setActiveSection(null); }
      else showToast(data.error || "Failed to update expense", "error");
    } catch { showToast("Error updating expense", "error"); }
    setLoading(false);
  };

  const deleteExpense = async () => {
    if (!id) return showToast("Enter expense ID", "error");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/expense/deleteExpense/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Expense deleted successfully");
        setExpenses((prev) => prev.filter((e) => String(e.eID) !== String(id)));
        setId(""); setActiveSection(null);
      } else showToast(data.error || "Failed to delete expense", "error");
    } catch { showToast("Error deleting expense", "error"); }
    setLoading(false);
  };

  // ── Summary calculations ───────────────────
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const highestExpense = expenses.length
    ? expenses.reduce((max, e) => Number(e.amount) > Number(max.amount) ? e : max, expenses[0])
    : null;
  const thisMonth = expenses.filter((e) => {
    const d = new Date(e.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonth.reduce((sum, e) => sum + Number(e.amount), 0);

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
            <h1 className="page-title">Expenses Management</h1>
            <p className="page-subtitle">Track and control your business expenses</p>
          </div>
          <button className="btn btn--primary" onClick={() => toggleSection("create")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Expense
          </button>
        </div>

        {/* ── Business Profit Dashboard ── */}
        {profitSummary && (
          <div className="profit-dashboard">
            <h2 className="dashboard-title">Business Profit Overview</h2>
            <div className="summary-row">
              <div className="summary-card">
                <div className="summary-icon summary-icon--teal">💰</div>
                <div>
                  <p className="summary-label">Total Revenue (Sales)</p>
                  <p className="summary-value text-success">LKR {profitSummary.revenue.toLocaleString()}</p>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon summary-icon--orange">📦</div>
                <div>
                  <p className="summary-label">Cost of Goods (Suppliers)</p>
                  <p className="summary-value text-danger">LKR {profitSummary.supplierCosts.toLocaleString()}</p>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon summary-icon--red">🧾</div>
                <div>
                  <p className="summary-label">Operating Expenses</p>
                  <p className="summary-value text-danger">LKR {profitSummary.otherExpenses.toLocaleString()}</p>
                </div>
              </div>
              <div className="summary-card highlight-profit">
                <div className="summary-icon summary-icon--purple">📈</div>
                <div>
                  <p className="summary-label">Net Profit</p>
                  <p className={`summary-value ${profitSummary.netProfit >= 0 ? "text-success" : "text-danger"}`}>
                    LKR {profitSummary.netProfit.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <br />
          </div>
        )}

        {/* Summary Cards */}
        {expenses.length > 0 && (
          <div className="summary-row">
            <div className="summary-card">
              <div className="summary-icon summary-icon--red">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <line x1="2" y1="10" x2="22" y2="10"/>
                </svg>
              </div>
              <div>
                <p className="summary-label">Total Expenses</p>
                <p className="summary-value">LKR {totalExpenses.toLocaleString()}</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon summary-icon--orange">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div>
                <p className="summary-label">This Month</p>
                <p className="summary-value">LKR {thisMonthTotal.toLocaleString()}</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon summary-icon--amber">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
              <div>
                <p className="summary-label">Highest Expense</p>
                <p className="summary-value">
                  {highestExpense ? `LKR ${Number(highestExpense.amount).toLocaleString()}` : "—"}
                </p>
                {highestExpense && (
                  <p className="summary-sub">{highestExpense.expense}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="action-bar">
          <button className="btn btn--outline" onClick={getAllExpenses}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            All Expenses
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
              <h2 className="panel-title">Add New Expense</h2>
              <button className="panel-close" onClick={() => setActiveSection(null)}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-group form-group--full">
                <label className="form-label">Expense Name</label>
                <input className="form-input" placeholder="e.g. Office Rent, Utility Bill" value={expense} onChange={(e) => setExpense(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Amount (LKR)</label>
                <input className="form-input" type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
            <div className="panel-actions">
              <button className="btn btn--ghost" onClick={() => { resetForm(); setActiveSection(null); }}>Cancel</button>
              <button className="btn btn--primary" onClick={createExpense} disabled={loading}>
                {loading ? "Creating..." : "Add Expense"}
              </button>
            </div>
          </div>
        )}

        {/* ── Search by ID Panel ── */}
        {activeSection === "getById" && (
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Search Expense by ID</h2>
              <button className="panel-close" onClick={() => setActiveSection(null)}>✕</button>
            </div>
            <div className="form-inline">
              <input className="form-input" type="number" placeholder="Enter Expense ID" value={id} onChange={(e) => setId(e.target.value)} />
              <button className="btn btn--primary" onClick={getExpenseById} disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        )}

        {/* ── Update Panel ── */}
        {activeSection === "update" && (
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Update Expense</h2>
              <button className="panel-close" onClick={() => setActiveSection(null)}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-group form-group--full">
                <label className="form-label">Expense ID <span className="form-required">*</span></label>
                <input className="form-input" type="number" placeholder="Enter ID to update" value={id} onChange={(e) => setId(e.target.value)} />
              </div>
              <div className="form-group form-group--full">
                <label className="form-label">Expense Name</label>
                <input className="form-input" placeholder="Expense name" value={expense} onChange={(e) => setExpense(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Amount (LKR)</label>
                <input className="form-input" type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
            <div className="panel-actions">
              <button className="btn btn--ghost" onClick={() => { resetForm(); setActiveSection(null); }}>Cancel</button>
              <button className="btn btn--primary" onClick={updateExpense} disabled={loading}>
                {loading ? "Updating..." : "Confirm Update"}
              </button>
            </div>
          </div>
        )}

        {/* ── Delete Panel ── */}
        {activeSection === "delete" && (
          <div className="panel panel--danger">
            <div className="panel-header">
              <h2 className="panel-title">Delete Expense</h2>
              <button className="panel-close" onClick={() => setActiveSection(null)}>✕</button>
            </div>
            <p className="panel-warning">This action is permanent and cannot be undone.</p>
            <div className="form-inline">
              <input className="form-input" type="number" placeholder="Enter Expense ID to delete" value={id} onChange={(e) => setId(e.target.value)} />
              <button className="btn btn--danger" onClick={deleteExpense} disabled={loading}>
                {loading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        )}

        {/* ── Loading ── */}
        {loading && expenses.length === 0 && (
          <div className="loading-state">
            <div className="spinner" />
            <span>Loading expenses...</span>
          </div>
        )}

        {/* ── Expenses Table ── */}
        {expenses.length > 0 && (
          <div className="table-card">
            <div className="table-card-header">
              <h2 className="table-card-title">
                Expense Records
                <span className="table-badge">{expenses.length}</span>
              </h2>
              <button className="btn btn--ghost btn--sm" onClick={() => setExpenses([])}>Clear</button>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Expense</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((e) => {
                    const pct = totalExpenses > 0
                      ? Math.round((Number(e.amount) / totalExpenses) * 100)
                      : 0;
                    return (
                      <tr key={e.eID}>
                        <td><span className="id-badge">#{e.eID}</span></td>
                        <td><span className="expense-name">{e.expense}</span></td>
                        <td><span className="expense-amount">LKR {Number(e.amount).toLocaleString()}</span></td>
                        <td>{new Date(e.date).toLocaleDateString("en-GB")}</td>
                        <td>
                          <div className="pct-bar-wrap">
                            <div className="pct-bar">
                              <div className="pct-bar-fill" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="pct-label">{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}