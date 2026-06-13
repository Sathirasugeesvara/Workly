import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './components.css';
import logo from '../assets/logo.png';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/providers', label: 'Find providers' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

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
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}

        <div className="nav-actions-mobile">
          <Link to="/login" className="nav-btn nav-btn-outline" onClick={() => setOpen(false)}>
            Sign in
          </Link>
          <Link to="/register" className="nav-btn nav-btn-solid" onClick={() => setOpen(false)}>
            Get started
          </Link>
        </div>
      </nav>

      <div className="nav-actions">
        <Link to="/login" className="nav-btn nav-btn-outline">
          Sign in
        </Link>
        <Link to="/register" className="nav-btn nav-btn-solid">
          Get started
        </Link>
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
