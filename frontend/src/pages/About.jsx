import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './About.css';

const stats = [
  { value: '12k+', label: 'Verified providers' },
  { value: '50k+', label: 'Jobs completed' },
  { value: '4.8/5', label: 'Average rating' },
  { value: '24/7', label: 'Customer support' },
];

const values = [
  {
    icon: 'ti-shield-check',
    title: 'Trust & safety',
    desc: 'Every provider on Workly goes through identity verification and background checks before they can accept a job.',
  },
  {
    icon: 'ti-award',
    title: 'Quality first',
    desc: 'We hold every professional to a high standard, backed by real reviews from real customers after every job.',
  },
  {
    icon: 'ti-bolt',
    title: 'Fast & reliable',
    desc: 'Real-time booking, live tracking, and clear scheduling mean no more waiting around for a "maybe tomorrow."',
  },
  {
    icon: 'ti-users',
    title: 'Community first',
    desc: 'We invest in the professionals who power Workly, helping them grow their business and reach more customers.',
  },
];

const team = [
  { name: 'Sathira Sugeesvara', role: 'Founder & CEO' },
  { name: 'Himansith Wickramasinghe', role: 'Co-Founder & CTO' },
  { name: '#### ####', role: 'Head of Operations' },
  { name: '#### ########', role: 'Head of Customer Success' },
];

export default function About() {
  return (
    <div className="about-page">
      <Navbar />

      {/* Header */}
      <section className="about-header">
        <span className="about-eyebrow">About Workly</span>
        <h1>Making home services simple, for everyone.</h1>
        <p>
          Workly connects homeowners with verified, skilled professionals for
          everything from electrical repairs to deep cleaning — and helps
          independent tradespeople grow their business with steady, reliable
          work.
        </p>
      </section>

      {/* Stats */}
      <section className="about-stats">
        {stats.map((stat) => (
          <div className="about-stat" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Mission */}
      <section className="about-mission">
        <div className="about-mission-visual">
          <img
            src="/aboutimages/mission-image.jpg"
            alt="Workly mission"
            className="about-mission-image"
          />
        </div>
        <div className="about-mission-content">
          <span className="about-section-eyebrow">Our mission</span>
          <h2>Bringing trust back to home services</h2>
          <p>
            Finding a reliable electrician, plumber, or cleaner shouldn't mean
            asking five different group chats and hoping for the best. Workly
            was built to take the guesswork out of hiring home service
            professionals — every provider on our platform is verified, rated,
            and ready to work.
          </p>
          <p>
            On the other side, thousands of skilled tradespeople struggle to
            find consistent work outside their existing customer base. Workly
            gives them a steady stream of bookings, a platform to showcase
            their reviews, and the tools to manage their schedule — without the
            overhead of running their own marketing.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="about-section-header">
          <span className="about-section-eyebrow">What we stand for</span>
          <h2>The values behind every booking</h2>
        </div>
        <div className="about-values-grid">
          {values.map((value) => (
            <div className="about-value-card" key={value.title}>
              <div className="about-value-icon">
                <i className={`ti ${value.icon}`} aria-hidden="true"></i>
              </div>
              <h3>{value.title}</h3>
              <p>{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="about-team">
        <div className="about-section-header">
          <span className="about-section-eyebrow">Our team</span>
          <h2>The people building Workly</h2>
          <p>
            A small, focused team working to make home services easier for
            everyone — from the customers who book, to the professionals who
            show up and do great work.
          </p>
        </div>
        <div className="about-team-grid">
          {team.map((member) => (
            <div className="about-team-card" key={member.name}>
              <div className="about-team-avatar">
                {member.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <h3>{member.name}</h3>
              <span>{member.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h2>
          Ready to experience <span>Workly?</span>
        </h2>
        <p>
          Whether you need a job done or you're looking for steady work as a
          professional, Workly makes it simple to get started.
        </p>
        <div className="about-cta-actions">
          <Link to="/services" className="about-btn about-btn-primary">
            <i className="ti ti-search" aria-hidden="true"></i>
            Find a service
          </Link>
          <Link to="/register" className="about-btn about-btn-outline">
            Become a provider
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}