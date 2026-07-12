import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './components.css';
import logo from '../assets/logo.png';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(() => (localStorage.getItem('role') || 'customer').toLowerCase());
  const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem('avatarUrl') || '');

  // Re-check auth state on every route change (covers login/logout without a full reload)
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    setUserRole((localStorage.getItem('role') || 'customer').toLowerCase());
    setAvatarUrl(localStorage.getItem('avatarUrl') || '');
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;
  const closeAll = () => setOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('avatarUrl');
    setIsLoggedIn(false);
    closeAll();
    navigate('/');
  };

  // ---- Nav links differ per role, per spec ----
  let navItems = [];

  if (!isLoggedIn) {
    navItems = [
      { path: '/', label: 'Home' },
      { path: '/services', label: 'Services' },
      { path: '/providers', label: 'Find providers' },
      { path: '/about', label: 'About' },
      { path: '/contact', label: 'Contact' },
    ];
  } else if (userRole === 'provider') {
    navItems = [
      { path: '/provider/dashboard', label: 'Home' },
      { path: '/aibot', label: 'Help with AI' },
      { path: '/provider/booking-requests', label: 'Booking requests' },
      { path: '/provider/booking-history', label: 'History' },
    ];
  } else if (userRole === 'admin') {
    navItems = [
      { path: '/admin/dashboard', label: 'Home' },
      { path: '/admin/pending-verifications', label: 'Pending verifications' },
      { path: '/admin/customers', label: 'Customers' },
      { path: '/admin/providers', label: 'Providers' },
      { path: '/admin/services', label: 'Services' },
    ];
  } else {
    // customer
    navItems = [
      { path: '/customer/dashboard', label: 'Home' },//constructing..........................................................................................
      { path: '/services', label: 'Services' },
      { path: '/providers', label: 'Providers' },
      { path: '/aibot', label: 'Chat with AI' },
      { path: '/history', label: 'Booking History' },//constructing..........................................................................................
    ];
  }

  const Avatar = ({ className = 'nav-avatar' }) =>
    avatarUrl ? (
      <img src={avatarUrl} alt="Profile" className={`${className}-img`} />
    ) : (
      <span className={`${className}-empty`}>
        <i className="ti ti-user" aria-hidden="true"></i>
      </span>
    );

  return (
    <header className="navbar">
      <Link to="/" className="nav-brand">
        <img src={logo} alt="Workly" className="nav-logo" />
        <span className="nav-brand-name">Workly</span>
      </Link>

      <nav className={`nav-links ${open ? 'open' : ''}`}>
        {navItems.map((item, i) => (
          <Link
            key={`${item.path}-${item.label}-${i}`}
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
            <Link to="/profile/me" className="nav-user-item" onClick={closeAll}>
              <Avatar className="nav-avatar-sm" />
              Profile
            </Link>
            <button className="nav-user-item nav-logout" onClick={handleLogout}>
              <i className="ti ti-logout" aria-hidden="true"></i>
              Logout
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
          <>
            <Link to="/profile/me" className="nav-avatar-link" aria-label="My profile">
              <Avatar />
            </Link>
            <button className="nav-btn nav-btn-logout" onClick={handleLogout}>
              <i className="ti ti-logout" aria-hidden="true"></i>
              Logout
            </button>
          </>
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
