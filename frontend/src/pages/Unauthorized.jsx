import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Unauthorized.css';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="unauth-page">
      <div className="unauth-glow" aria-hidden="true"></div>

      <div className="unauth-card">
        <div className="unauth-icon">
          <i className="ti ti-lock-square-rounded" aria-hidden="true"></i>
        </div>

        <span className="unauth-code">403</span>
        <h1>Access denied</h1>
        <p>
          You don't have permission to view this page. If you think this is a
          mistake, try signing in with a different account.
        </p>

        <div className="unauth-actions">
          <Link to="/" className="unauth-btn unauth-btn-primary">
            <i className="ti ti-home" aria-hidden="true"></i>
            Back to home
          </Link>
          <button
            type="button"
            className="unauth-btn unauth-btn-ghost"
            onClick={() => navigate(-1)}
          >
            <i className="ti ti-arrow-left" aria-hidden="true"></i>
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
