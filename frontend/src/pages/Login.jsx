import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './loginregi.css';
import logo from '../assets/logo.png';
import { loginUser } from '../services/authService';
import { useEffect } from "react";

const roles = [
  { key: 'customer', label: 'User', icon: 'ti-user' },
  { key: 'provider', label: 'Provider', icon: 'ti-tool' },
  { key: 'admin', label: 'Admin', icon: 'ti-shield-lock' },
];

export default function Login() {

  const navigate = useNavigate();

  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const message = sessionStorage.getItem("sessionExpired");

    if (message) {

        setError(message);

        sessionStorage.removeItem("sessionExpired");

    }

}, []);

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");

    if (!email || !password) {
        setError("Please enter your email and password.");
        return;
    }

    setLoading(true);

    try {

        const userRole =
            role === "customer"
                ? "CUSTOMER"
                : role === "provider"
                ? "PROVIDER"
                : "ADMIN";

        const response = await loginUser({

            email: email,
            password: password,
            role: userRole

        });

        // Save JWT
        localStorage.setItem("token", response.data.token);

        // Save logged in user role
        localStorage.setItem("role", userRole);

        alert(response.data.message);

        switch (role) {

    case "customer":
        navigate("/customer/dashboard");
        break;

    case "provider":
        navigate("/provider/dashboard");
        break;

    case "admin":
        navigate("/admin/dashboard");
        break;

    default:
        navigate("/");
}

    } catch (error) {

        setError(
            error.response?.data?.message ||
            "Invalid Email or Password"
        );

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
            Home services, <span>handled.</span>
          </h2>
          <p>
            Connect with trusted professionals, manage requests, and keep
            every job on track — all in one place.
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
            <h1 className="login-title">Welcome back</h1>
            <p className="login-subtitle">Sign in to your account to continue</p>
          </div>

          <div className="login-roles" role="tablist" aria-label="Login as">
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
                  autoComplete="current-password"
                  style={{ paddingRight: '40px' }}
                />
                <button
  type="button"
  className="toggle-pass"
  aria-label={showPassword ? 'Hide password' : 'Show password'}
  onClick={() => setShowPassword((s) => !s)}
>
  {showPassword ? 'Hide' : 'Show'}
</button>
              </div>
            </div>

            <div className="login-options">
              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? (
                <span className="spinner" aria-hidden="true"></span>
              ) : (
                <i className="ti ti-login-2" aria-hidden="true"></i>
              )}
              {loading ? 'Signing in...' : 'Sign in'}
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
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
