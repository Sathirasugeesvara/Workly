import React from 'react';
import { Link } from 'react-router-dom';
import './components.css';
import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-brand-top">
            <img src={logo} alt="Workly" className="footer-logo" />
            <span className="footer-brand-name">Workly</span>
          </div>
          <p className="footer-tagline">
            Connecting homeowners with trusted, verified service
            professionals — book, manage, and track every job in one place.
          </p>
          <div className="footer-socials">
            <a href="#" className="footer-social-btn" aria-label="Facebook">
              <i className="ti ti-brand-facebook" aria-hidden="true"></i>
            </a>
            <a href="#" className="footer-social-btn" aria-label="Instagram">
              <i className="ti ti-brand-instagram" aria-hidden="true"></i>
            </a>
            <a href="#" className="footer-social-btn" aria-label="X (Twitter)">
              <i className="ti ti-brand-x" aria-hidden="true"></i>
            </a>
            <a href="#" className="footer-social-btn" aria-label="LinkedIn">
              <i className="ti ti-brand-linkedin" aria-hidden="true"></i>
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>For users</h4>
          <ul>
            <li><Link to="/services">Browse services</Link></li>
            <li><Link to="/how-it-works">How it works</Link></li>
            <li><Link to="/register">Become a provider</Link></li>
            <li><Link to="/help">Help center</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Get in touch</h4>
          <ul className="footer-contact">
            <li>
              <i className="ti ti-map-pin" aria-hidden="true"></i>
              <span>Colombo, Western Province, Sri Lanka</span>
            </li>
            <li>
              <i className="ti ti-mail" aria-hidden="true"></i>
              <span>xenoralabs@gmail.com</span>
            </li>
            <li>
              <i className="ti ti-phone" aria-hidden="true"></i>
              <span>+94 784627089</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Workly. All rights reserved.</span>
        <div className="footer-bottom-links">
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/cookies">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
