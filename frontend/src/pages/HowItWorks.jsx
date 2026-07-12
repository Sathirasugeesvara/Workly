import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './HowItWorks.css';

const customerSteps = [
  { icon: 'ti-search', title: 'Search for a service', desc: 'Browse categories like electrical, plumbing, cleaning, or search for exactly what you need.' },
  { icon: 'ti-users', title: 'Compare providers', desc: 'See verified profiles with ratings, reviews, jobs completed, and upfront pricing before you choose.' },
  { icon: 'ti-calendar-event', title: 'Book a time slot', desc: 'Pick a date and time that works for you and send a request to your chosen provider.' },
  { icon: 'ti-bell', title: 'Get confirmed', desc: 'The provider accepts your request and you get notified with the confirmed booking details.' },
  { icon: 'ti-tool', title: 'Job gets done', desc: 'Your provider arrives and completes the work — track everything from your dashboard.' },
  { icon: 'ti-star', title: 'Rate the experience', desc: 'Leave a rating and review to help other customers and reward great service.' },
];

const providerSteps = [
  { icon: 'ti-user-plus', title: 'Create your profile', desc: 'Sign up, add your skills, service area, and pricing to build a profile customers can trust.' },
  { icon: 'ti-shield-check', title: 'Get verified', desc: 'Our team reviews your application and documents before your profile goes live to customers.' },
  { icon: 'ti-inbox', title: 'Receive requests', desc: 'Get notified whenever a customer sends a booking request that matches your services.' },
  { icon: 'ti-check', title: 'Accept or decline', desc: 'Review the request details and accept the jobs that fit your schedule.' },
  { icon: 'ti-briefcase', title: 'Complete the job', desc: 'Do great work and mark the job complete once you\'re done on-site.' },
  { icon: 'ti-cash', title: 'Get paid & grow', desc: 'Track your earnings, collect reviews, and build a steady stream of repeat customers.' },
];

const faqs = [
  { q: 'How are providers verified?', a: 'Every provider submits identity documents and proof of experience, which our team manually reviews before their profile is approved and made visible to customers.' },
  { q: 'What if I need to cancel a booking?', a: 'You can cancel a pending or accepted booking from your booking history at any time before the job starts, no questions asked.' },
  { q: 'How much does it cost to use Workly?', a: 'Browsing and booking as a customer is free. Providers pay a small service fee only on completed, paid jobs — there are no upfront or listing fees.' },
  { q: 'What areas does Workly cover?', a: 'We currently operate across major cities in Sri Lanka including Colombo, Kandy, Galle, Negombo, and Gampaha, with more areas being added regularly.' },
];

export default function HowItWorks() {
  const [tab, setTab] = useState('customer');
  const [openFaq, setOpenFaq] = useState(null);
  const steps = tab === 'customer' ? customerSteps : providerSteps;

  return (
    <div className="hiw-page">
      <Navbar />

      {/* Header */}
      <section className="hiw-header">
        <span className="hiw-eyebrow">How Workly works</span>
        <h1>Simple for customers. Rewarding for providers.</h1>
        <p>
          Whether you need a job done or you're looking to grow your business,
          here's exactly how Workly works from start to finish.
        </p>

        <div className="hiw-tabs">
          <button
            className={`hiw-tab ${tab === 'customer' ? 'active' : ''}`}
            onClick={() => setTab('customer')}
          >
            <i className="ti ti-user" aria-hidden="true"></i>
            I'm a customer
          </button>
          <button
            className={`hiw-tab ${tab === 'provider' ? 'active' : ''}`}
            onClick={() => setTab('provider')}
          >
            <i className="ti ti-tool" aria-hidden="true"></i>
            I'm a provider
          </button>
        </div>
      </section>

      {/* Steps */}
      <section className="hiw-steps">
        <div className="hiw-steps-list">
          {steps.map((step, i) => (
            <div className="hiw-step" key={step.title}>
              <div className="hiw-step-marker">
                <span className="hiw-step-number">{i + 1}</span>
                {i < steps.length - 1 && <span className="hiw-step-line"></span>}
              </div>
              <div className="hiw-step-content">
                <div className="hiw-step-icon">
                  <i className={`ti ${step.icon}`} aria-hidden="true"></i>
                </div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="hiw-faq">
        <div className="hiw-section-header">
          <span className="hiw-section-eyebrow">Common questions</span>
          <h2>Frequently asked questions</h2>
        </div>
        <div className="hiw-faq-list">
          {faqs.map((faq, i) => (
            <div className="hiw-faq-item" key={faq.q}>
              <button
                className="hiw-faq-question"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {faq.q}
                <i className={`ti ti-chevron-down ${openFaq === i ? 'rotated' : ''}`} aria-hidden="true"></i>
              </button>
              {openFaq === i && <p className="hiw-faq-answer">{faq.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="hiw-cta">
        <h2>
          Ready to get <span>started?</span>
        </h2>
        <p>Book your first service or start receiving job requests today.</p>
        <div className="hiw-cta-actions">
          <Link to="/services" className="hiw-btn hiw-btn-primary">
            <i className="ti ti-search" aria-hidden="true"></i>
            Find a service
          </Link>
          <Link to="/register" className="hiw-btn hiw-btn-outline">
            Become a provider
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
