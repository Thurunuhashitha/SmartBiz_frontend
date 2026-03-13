import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import './register.css'

export default function Register() {
  const navigate = useNavigate()

  const [companyName, setCompanyName] = useState('')
  const [owner, setOwner] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Password strength
  const getStrength = (p) => {
    if (!p) return 0
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    return score
  }
  const strength = getStrength(password)
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthClass = ['', 'weak', 'fair', 'good', 'strong'][strength]

  const register = async () => {
    setError('')
    if (!companyName || !owner || !email || !phone || !password) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const response = await axios.post('https://smartbizapi.thurunu.me/auth/register', {
        company_name: companyName,
        owner,
        email,
        phone,
        password,
      })
      console.log('Server Response:', response.data)
      navigate('/login')
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Registration failed. Please try again.')
      } else {
        setError('Server not responding. Please try again.')
      }
    }
    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') register()
  }

  return (
    <div className="auth-wrapper">

      {/* ── Left Branding Panel ── */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo"><span>SB</span></div>
          <h1 className="auth-brand">SmartBiz</h1>
          <p className="auth-tagline">Business Management Suite</p>

          <div className="auth-steps">
            <p className="auth-steps-title">Get started in 3 easy steps</p>
            <div className="auth-step">
              <div className="auth-step-num">1</div>
              <div>
                <p className="auth-step-label">Create your account</p>
                <p className="auth-step-desc">Fill in your company details below</p>
              </div>
            </div>
            <div className="auth-step">
              <div className="auth-step-num">2</div>
              <div>
                <p className="auth-step-label">Set up your inventory</p>
                <p className="auth-step-desc">Add your products and suppliers</p>
              </div>
            </div>
            <div className="auth-step">
              <div className="auth-step-num">3</div>
              <div>
                <p className="auth-step-label">Start managing</p>
                <p className="auth-step-desc">Track sales and expenses instantly</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-decor auth-decor--1" />
        <div className="auth-decor auth-decor--2" />
      </div>

      {/* ── Right Form Panel ── */}
      <div className="auth-right">
        <div className="auth-form-box">

          <div className="auth-form-header">
            <h2 className="auth-form-title">Create your account</h2>
            <p className="auth-form-subtitle">Set up your SmartBiz business profile</p>
          </div>

          {/* Error */}
          {error && (
            <div className="auth-error">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Two-column grid for fields */}
          <div className="form-grid">

            {/* Company Name */}
            <div className="form-group form-group--full">
              <label className="form-label">Company Name</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </span>
                <input className="form-input" type="text" placeholder="e.g. ABC Trading Co." value={companyName} onChange={(e) => setCompanyName(e.target.value)} onKeyDown={handleKeyDown} />
              </div>
            </div>

            {/* Owner */}
            <div className="form-group">
              <label className="form-label">Owner Name</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input className="form-input" type="text" placeholder="Full name" value={owner} onChange={(e) => setOwner(e.target.value)} onKeyDown={handleKeyDown} />
              </div>
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </span>
                <input className="form-input" type="text" placeholder="e.g. 0771234567" value={phone} onChange={(e) => setPhone(e.target.value)} onKeyDown={handleKeyDown} />
              </div>
            </div>

            {/* Email */}
            <div className="form-group form-group--full">
              <label className="form-label">Email Address</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input className="form-input" type="email" placeholder="company@email.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyDown} />
              </div>
            </div>

            {/* Password */}
            <div className="form-group form-group--full">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  className="form-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="new-password"
                />
                <button className="input-toggle" type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                  {showPassword ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>

              {/* Password strength meter */}
              {password && (
                <div className="strength-wrap">
                  <div className="strength-bars">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`strength-bar ${strength >= i ? `strength-bar--${strengthClass}` : ''}`} />
                    ))}
                  </div>
                  <span className={`strength-label strength-label--${strengthClass}`}>{strengthLabel}</span>
                </div>
              )}
            </div>

          </div>

          {/* Submit */}
          <button className="auth-btn" onClick={register} disabled={loading}>
            {loading ? (
              <><span className="auth-spinner" />Creating account...</>
            ) : (
              <>
                Create Account
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </>
            )}
          </button>

          <p className="auth-footer-text">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in here</Link>
          </p>

        </div>
      </div>

    </div>
  )
}