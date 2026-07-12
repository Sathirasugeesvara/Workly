import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Careers.css';

const perks = [
  { icon: 'ti-home-2', title: 'Remote-friendly', desc: 'Work from wherever you\'re most productive, with flexible hours.' },
  { icon: 'ti-trending-up', title: 'Real ownership', desc: 'Small team, big impact — your work ships fast and matters.' },
  { icon: 'ti-heart-handshake', title: 'Health cover', desc: 'Comprehensive medical coverage for you and your family.' },
  { icon: 'ti-calendar-off', title: 'Paid time off', desc: 'Generous leave policy so you can actually switch off and rest.' },
  { icon: 'ti-school', title: 'Learning budget', desc: 'Annual budget for courses, books, and conferences.' },
  { icon: 'ti-users-group', title: 'Small, sharp team', desc: 'Work directly with founders — no layers, no red tape.' },
];

const openRoles = [
  { title: 'Senior Backend Engineer (Spring Boot)', team: 'Engineering', location: 'Colombo · Hybrid', type: 'Full-time' },
  { title: 'Frontend Engineer (React)', team: 'Engineering', location: 'Remote · Sri Lanka', type: 'Full-time' },
  { title: 'Product Designer', team: 'Design', location: 'Colombo · Hybrid', type: 'Full-time' },
  { title: 'Customer Success Associate', team: 'Operations', location: 'Colombo · On-site', type: 'Full-time' },
  { title: 'Growth Marketing Intern', team: 'Marketing', location: 'Remote · Sri Lanka', type: 'Internship' },
];

const values = [
  { icon: 'ti-target-arrow', title: 'Move with purpose', desc: 'We ship quickly and iterate based on real feedback from real users.' },
  { icon: 'ti-shield-check', title: 'Earn trust', desc: 'Every decision we make should make Workly more trustworthy, not less.' },
  { icon: 'ti-bulb', title: 'Stay curious', desc: 'The best ideas come from questioning how things are usually done.' },
];

export default function Careers() {
  return (
    <div className="careers-page">
      <Navbar />

      {/* Header */}
      <section className="careers-header">
        <span className="careers-eyebrow">Careers at Workly</span>
        <h1>Help us build the future of home services.</h1>
        <p>
          We're a small team on a mission to make it effortless to find
          trustworthy help around the house — and to help skilled
          professionals build a better livelihood doing it.
        </p>
      </section>

      {/* Values */}
      <section className="careers-values">
        <div className="careers-section-header">
          <span className="careers-section-eyebrow">How we work</span>
          <h2>What it's like to work here</h2>
        </div>
        <div className="careers-values-grid">
          {values.map((v) => (
            <div className="careers-value-card" key={v.title}>
              <div className="careers-value-icon">
                <i className={`ti ${v.icon}`} aria-hidden="true"></i>
              </div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="careers-perks">
        <div className="careers-section-header">
          <span className="careers-section-eyebrow">Perks & benefits</span>
          <h2>Taken care of, so you can do your best work</h2>
        </div>
        <div className="careers-perks-grid">
          {perks.map((p) => (
            <div className="careers-perk-card" key={p.title}>
              <div className="careers-perk-icon">
                <i className={`ti ${p.icon}`} aria-hidden="true"></i>
              </div>
              <div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Open roles */}
      <section className="careers-roles">
        <div className="careers-section-header">
          <span className="careers-section-eyebrow">Open positions</span>
          <h2>Current openings</h2>
          <p>Don't see a role that fits? Reach out anyway — we're always happy to talk.</p>
        </div>
        <div className="careers-roles-list">
          {openRoles.map((role) => (
            <div className="careers-role-card" key={role.title}>
              <div className="careers-role-main">
                <h3>{role.title}</h3>
                <div className="careers-role-meta">
                  <span><i className="ti ti-briefcase" aria-hidden="true"></i> {role.team}</span>
                  <span><i className="ti ti-map-pin" aria-hidden="true"></i> {role.location}</span>
                  <span className="careers-role-type">{role.type}</span>
                </div>
              </div>
              <a href="mailto:careers@workly.example.com" className="careers-apply-btn">
                Apply
                <i className="ti ti-arrow-right" aria-hidden="true"></i>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="careers-cta">
        <h2>
          Don't see the right role? <span>Say hi anyway.</span>
        </h2>
        <p>We're always interested in meeting people who care about doing great work.</p>
        <a href="mailto:careers@workly.example.com" className="careers-btn careers-btn-primary">
          <i className="ti ti-mail" aria-hidden="true"></i>
          careers@workly.example.com
        </a>
      </section>

      <Footer />
    </div>
  );
}
