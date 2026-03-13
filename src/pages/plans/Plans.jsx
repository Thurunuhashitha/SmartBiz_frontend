import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/nav/NavBar';
import './plans.css';

// ─── Icons ────────────────────────────────────────────────────────────────────

const CheckIcon = () => (
  <span className="check-icon">
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </span>
);

const IconSparkle = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

const Plans = () => {
  const [plans,         setPlans]         = useState([]);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [activating,    setActivating]    = useState(null); // tracks which plan is being activated
  const [message,       setMessage]       = useState({ type: '', text: '' });

  useEffect(() => {
    fetchPlans();
    fetchCurrentPlan();
  }, []);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/plans/getall', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const fetchCurrentPlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/plans/current', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.plan_id) {
        setCurrentPlanId(response.data.plan_id);
        // Also sync the local user object with truth
        const user = JSON.parse(localStorage.getItem('user')) || {};
        user.plan_id = response.data.plan_id;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error fetching current plan API, falling back to local storage:', error);
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.plan_id) setCurrentPlanId(user.plan_id);
    } finally {
      setLoading(false);
    }
  };

  const handleActivatePlan = async (planId) => {
    if (planId === currentPlanId) return;
    setActivating(planId);
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/plans/activate',
        { plan_id: planId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessage({ type: 'success', text: response.data.message });
      setCurrentPlanId(planId);

      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        user.plan_id = planId;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to activate plan' });
    } finally {
      setActivating(null);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <main className="main-content plans-page">
          <div className="plans-loading">
            <div className="spinner" />
            <p>Loading available plans...</p>
          </div>
        </main>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-content plans-page">

        {/* ── Page Header ── */}
        <div className="plans-header">
          <div className="plans-eyebrow">
            <IconSparkle />
            Subscription Plans
          </div>
          <h1>Choose Your Plan</h1>
          <p>Select the perfect plan to unlock more features for your business</p>
        </div>

        {/* ── Message Banner ── */}
        {message.text && (
          <div className={`message-banner ${message.type}`}>
            <span>{message.text}</span>
            <button onClick={() => setMessage({ type: '', text: '' })} aria-label="Dismiss">&times;</button>
          </div>
        )}

        {/* ── Plans Grid ── */}
        <div className="plans-grid">
          {plans.map((plan) => {
            const isActive   = currentPlanId === plan.id;
            const isLoading  = activating === plan.id;
            const features   = plan.features?.split(',').map(f => f.trim()).filter(Boolean) ?? [];
            const priceLabel = plan.stock_limit_value
              ? `${(plan.stock_limit_value / 1_000_000).toFixed(0)}M stock limit`
              : 'Unlimited';

            return (
              <div
                key={plan.id}
                className={`plan-card ${isActive ? 'plan-card--active' : ''}`}
              >
                {/* Current plan badge */}
                {isActive && (
                  <div className="current-badge">
                    <IconCheck />
                    Current Plan
                  </div>
                )}

                {/* Plan name */}
                <h3 className="plan-name">{plan.name}</h3>
                {plan.description && (
                  <p className="plan-description">{plan.description}</p>
                )}

                {/* Price */}
                <div className="plan-price-row">
                  <span className="plan-price">{priceLabel}</span>
                </div>

                {/* Features */}
                {features.length > 0 && (
                  <ul className="plan-features">
                    {features.map((feature, index) => (
                      <li key={index}>
                        <CheckIcon />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {/* CTA Button */}
                <button
                  className={`activate-btn ${isActive ? 'activate-btn--active' : 'activate-btn--default'}`}
                  onClick={() => handleActivatePlan(plan.id)}
                  disabled={isActive || isLoading}
                >
                  {isLoading ? (
                    <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />Activating...</>
                  ) : isActive ? (
                    <><IconCheck />Active Plan</>
                  ) : (
                    'Select Plan'
                  )}
                </button>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
};

export default Plans;