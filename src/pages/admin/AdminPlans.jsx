import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';
import './adminPlans.css';

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({ name: '', stock_limit_value: '', features: '', is_active: true });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/plans/getall', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlans(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (editingId) {
        await axios.put(`http://localhost:3000/plans/update/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: 'Plan updated successfully' });
      } else {
        await axios.post('http://localhost:3000/plans/create', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: 'Plan created successfully' });
      }
      setFormData({ name: '', stock_limit_value: '', features: '', is_active: true });
      setEditingId(null);
      fetchPlans();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Operation failed' });
    }
  };

  const handleEdit = (plan) => {
    setEditingId(plan.id);
    setFormData({
      name: plan.name,
      stock_limit_value: plan.stock_limit_value || '',
      features: plan.features || '',
      is_active: !!plan.is_active
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3000/plans/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Plan deleted successfully' });
      fetchPlans();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Delete failed' });
    }
  };

  return (
    <div className="page-wrapper">
      <AdminSidebar />
      <main className="main-content">
        <div className="admin-plans-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Manage Pricing Plans</h1>
              <p className="page-subtitle">Create and edit system-wide subscription tiers</p>
            </div>
          </div>

          {message.text && (
            <div className={`message-banner ${message.type}`}>
              {message.text}
              <button onClick={() => setMessage({ type: '', text: '' })}>&times;</button>
            </div>
          )}

          <div className="admin-form-card">
            <h3>{editingId ? 'Edit Plan' : 'Create New Plan'}</h3>
            <form onSubmit={handleSubmit} className="admin-plan-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Plan Name</label>
                  <input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="e.g. Pro Plan"
                  />
                </div>
                <div className="form-group">
                  <label>Stock Limit (Total Value)</label>
                  <input 
                    name="stock_limit_value" 
                    type="number" 
                    value={formData.stock_limit_value} 
                    onChange={handleInputChange} 
                    placeholder="e.g. 5000000 (Empty for unlimited)"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Features (Comma separated)</label>
                  <textarea 
                    name="features" 
                    value={formData.features} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Basic Access, 24/7 Support, AI Tools"
                  />
                </div>
                <div className="form-group checkbox">
                  <label>
                    <input 
                      name="is_active" 
                      type="checkbox" 
                      checked={formData.is_active} 
                      onChange={handleInputChange} 
                    />
                    Active Plan
                  </label>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn--primary">
                  {editingId ? 'Update Plan' : 'Create Plan'}
                </button>
                {editingId && (
                  <button type="button" className="btn btn--ghost" onClick={() => {
                    setEditingId(null);
                    setFormData({ name: '', stock_limit_value: '', features: '', is_active: true });
                  }}>Cancel Edit</button>
                )}
              </div>
            </form>
          </div>

          <div className="plans-list-card">
            <h3>Existing Plans</h3>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Limit</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map(plan => (
                    <tr key={plan.id}>
                      <td>#{plan.id}</td>
                      <td><strong>{plan.name}</strong></td>
                      <td>{plan.stock_limit_value ? `$${Number(plan.stock_limit_value).toLocaleString()}` : 'Unlimited'}</td>
                      <td>
                        <span className={`status-pill ${plan.is_active ? 'active' : 'inactive'}`}>
                          {plan.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => handleEdit(plan)} className="action-btn edit" title="Edit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
                          </button>
                          <button onClick={() => handleDelete(plan.id)} className="action-btn delete" title="Delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPlans;
