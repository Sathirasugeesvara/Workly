import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './components.css';
import logo from '../assets/logo.png';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  // TODO: hook these up to your real auth state (context/hook)
  const isLoggedIn = false;
  const userRole = 'customer'; // 'customer' | 'provider'

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/providers', label: 'Find providers' },
    { path: '/aibot', label: 'Help with AI' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const userMenuItems = userRole === 'provider'
    ? [
        { path: '/dashboard', label: 'Dashboard', icon: 'ti-layout-dashboard' },
        { path: '/job-history', label: 'Job History', icon: 'ti-history' },
        { path: '/reviews', label: 'Reviews', icon: 'ti-message-2' },
      ]
    : [
        { path: '/dashboard', label: 'Dashboard', icon: 'ti-layout-dashboard' },
        { path: '/booking-history', label: 'Booking History', icon: 'ti-history' },
        { path: '/reviews', label: 'My Reviews', icon: 'ti-message-2' },
      ];

  const closeAll = () => {
    setOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <header className="navbar">
      <Link to="/" className="nav-brand">
        <img src={logo} alt="Workly" className="nav-logo" />
        <span className="nav-brand-name">Workly</span>
      </Link>

      <nav className={`nav-links ${open ? 'open' : ''}`}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={isActive(item.path) ? 'active' : ''}
            onClick={closeAll}
          >
            {item.label}
          </Link>
        ))}

        {!isLoggedIn ? (
          <div className="nav-actions-mobile">
            <Link to="/login" className="nav-btn nav-btn-outline" onClick={closeAll}>
              Sign in
            </Link>
            <Link to="/register" className="nav-btn nav-btn-solid" onClick={closeAll}>
              Get started
            </Link>
          </div>
        ) : (
          <div className="nav-user-mobile">
            {userMenuItems.map((item) => (
              <Link key={item.path} to={item.path} className="nav-user-item" onClick={closeAll}>
                <i className={`ti ${item.icon}`} aria-hidden="true"></i>
                {item.label}
              </Link>
            ))}
            <button className="nav-user-item nav-logout" onClick={closeAll}>
              <i className="ti ti-logout" aria-hidden="true"></i>
              Log out
            </button>
          </div>
        )}
      </nav>

      <div className="nav-actions">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="nav-btn nav-btn-outline">
              Sign in
            </Link>
            <Link to="/register" className="nav-btn nav-btn-solid">
              Get started
            </Link>
          </>
        ) : (
          <div className="nav-user">
            <button
              className="nav-user-trigger"
              onClick={() => setUserMenuOpen((o) => !o)}
              aria-label="Account menu"
            >
              <span className="nav-user-avatar">U</span>
              <i className={`ti ti-chevron-down nav-user-caret ${userMenuOpen ? 'rotated' : ''}`} aria-hidden="true"></i>
            </button>

            {userMenuOpen && (
              <div className="nav-user-dropdown">
                {userMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="nav-dropdown-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <i className={`ti ${item.icon}`} aria-hidden="true"></i>
                    {item.label}
                  </Link>
                ))}
                <div className="nav-dropdown-divider"></div>
                <button className="nav-dropdown-item nav-logout" onClick={() => setUserMenuOpen(false)}>
                  <i className="ti ti-logout" aria-hidden="true"></i>
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        className="nav-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((o) => !o)}
      >
        <i className={`ti ${open ? 'ti-x' : 'ti-menu-2'}`} aria-hidden="true"></i>
      </button>
    </header>
  );
}