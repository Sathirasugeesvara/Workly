import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import './loginregi.css';
import logo from '../assets/logo.png';

const roles = [
  { key: 'user', label: 'User', icon: 'ti-user' },
  { key: 'provider', label: 'Provider', icon: 'ti-tool' },
];

export default function Register() {
  const [role, setRole] = useState('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agree) {
      setError('Please agree to the terms and conditions.');
      return;
    }

    setLoading(true);
    try {
      // TODO: replace with real registration call
      // Additional role-specific fields (e.g. business details, skills,
      // certifications for providers) can be appended here later.
      console.log('Register attempt:', { role, name, email, password });
      await new Promise((resolve) => setTimeout(resolve, 1200));
    } catch (err) {
      setError('Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left brand panel */}
      <div className="login-brand">
        <div className="brand-top">
          <img src={logo} alt="Logo" className="brand-logo" />
          <span className="brand-name">Workly</span>
        </div>

        <div className="brand-mid">
          <h2>
            Join <span>Workly</span> today
          </h2>
          <p>
            Create an account as a customer to book trusted services, or as a
            service provider to grow your business and reach more clients.
          </p>
        </div>

        <div className="floating-icons" aria-hidden="true">
          <i className="ti ti-bulb icon-float i1"></i>
          <i className="ti ti-tools icon-float i2"></i>
          <i className="ti ti-cut icon-float i3"></i>
          <i className="ti ti-screwdriver icon-float i4"></i>
          <i className="ti ti-shoe icon-float i5"></i>
          <i className="ti ti-hand-stop icon-float i6"></i>
          <i className="ti ti-helmet icon-float i7"></i>
          <i className="ti ti-mask icon-float i8"></i>
          <i className="ti ti-brush icon-float i9"></i>
          <i className="ti ti-settings icon-float i10"></i>
          <i className="ti ti-hammer icon-float i11"></i>
          <i className="ti ti-trowel icon-float i12"></i>
          <i className="ti ti-air-conditioning icon-float i13"></i>
          <i className="ti ti-bolt icon-float i14"></i>
          <i className="ti ti-droplet icon-float i15"></i>
          <i className="ti ti-wrench icon-float i16"></i>
          <i className="ti ti-plug icon-float i17"></i>
        </div>

        <div className="brand-stats">
          <div className="brand-stat">
            <strong>12k+</strong>
            <span>Service providers</span>
          </div>
          <div className="brand-stat">
            <strong>98%</strong>
            <span>Satisfaction rate</span>
          </div>
          <div className="brand-stat">
            <strong>24/7</strong>
            <span>Support</span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-form-panel">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Create account</h1>
            <p className="login-subtitle">Sign up to get started with Workly</p>
          </div>

          <div className="login-roles" role="tablist" aria-label="Register as">
            {roles.map((r) => (
              <button
                key={r.key}
                type="button"
                role="tab"
                aria-selected={role === r.key}
                className={`role-tab ${role === r.key ? 'active' : ''}`}
                onClick={() => setRole(r.key)}
              >
                <i className={`ti ${r.icon}`} aria-hidden="true"></i>
                {r.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="login-error" role="alert">
              <i className="ti ti-alert-circle" aria-hidden="true"></i>
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="name">
                {role === 'provider' ? 'Business / full name' : 'Full name'}
              </label>
              <div className="input-wrap">
                <i className="ti ti-id-badge-2" aria-hidden="true"></i>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="email">Email</label>
              <div className="input-wrap">
                <i className="ti ti-mail" aria-hidden="true"></i>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <i className="ti ti-lock" aria-hidden="true"></i>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  className="toggle-pass"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((s) => !s)}
                >
                  <i className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'}`} aria-hidden="true"></i>
                </button>
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <div className="input-wrap">
                <i className="ti ti-lock" aria-hidden="true"></i>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/*
              TODO (future update): role-specific fields go here.
              e.g. for 'provider' -> service category, NIC, certifications,
              business address, etc. for 'user' -> phone, address, etc.
            */}

            <div className="login-options terms-row">
              <label>
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                I agree to the <a href="/terms">Terms</a> &amp; <a href="/privacy">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? (
                <span className="spinner" aria-hidden="true"></span>
              ) : (
                <i className="ti ti-user-plus" aria-hidden="true"></i>
              )}
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="login-divider">or continue with</div>

          <div className="login-social">
            <button type="button" className="social-btn">
              <i className="ti ti-brand-google" aria-hidden="true"></i>
              Google
            </button>
            <button type="button" className="social-btn">
              <i className="ti ti-brand-apple" aria-hidden="true"></i>
              Apple
            </button>
          </div>

          <p className="login-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
