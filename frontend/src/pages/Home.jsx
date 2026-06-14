import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageSlider from '../components/ImageSlider';
import './Home.css';

const services = [
  { icon: 'ti-bulb', title: 'Electrical', desc: 'Wiring, repairs & installs' },
  { icon: 'ti-droplet', title: 'Plumbing', desc: 'Leaks, pipes & fittings' },
  { icon: 'ti-air-conditioning', title: 'Repair', desc: 'Service & maintenance' },
  { icon: 'ti-brush', title: 'Painting', desc: 'Interior & exterior' },
  { icon: 'ti-hammer', title: 'Carpentry', desc: 'Furniture & fittings' },
  { icon: 'ti-tools', title: 'General repair', desc: 'Home fix-ups' },
  { icon: 'ti-spray', title: 'Cleaning', desc: 'Deep & regular cleaning' },
  { icon: 'ti-building-warehouse', title: 'Masonry', desc: 'Tiling & construction' },
];

const steps = [
  {
    icon: 'ti-search',
    title: 'Find a service',
    desc: 'Browse categories or search for the exact service you need near you.',
  },
  {
    icon: 'ti-calendar-event',
    title: 'Book a slot',
    desc: 'Pick a verified provider and choose a date and time that works for you.',
  },
  {
    icon: 'ti-tool',
    title: 'Get the job done',
    desc: 'A trusted professional arrives and completes the work to your satisfaction.',
  },
  {
    icon: 'ti-star',
    title: 'Rate & review',
    desc: 'Share your experience to help other users and reward great service.',
  },
];

const heroSlides = [
  {
    image: '/heroimages/hero-1.jpg',
    title: 'Electrical repair',
    detail: 'Booked for tomorrow, 10:00 AM — Kandy',
  },
  {
    image: '/heroimages/hero-2.jpg',
    title: 'House painting',
    detail: 'Booked for tomorrow, 9:30 AM — Kandy',
  },
  {
    image: '/heroimages/hero-3.jpg',
    title: 'Car repair service',
    detail: 'Booked for tomorrow, 2:00 PM — Kandy',
  },
  {
    image: '/heroimages/hero-4.jpg',
    title: 'Garden maintenance',
    detail: 'Booked for tomorrow, 8:00 AM — Kandy',
  },
  {
    image: '/heroimages/hero-5.jpg',
    title: 'AC repair & service',
    detail: 'Booked for tomorrow, 11:00 AM — Kandy',
  },
  {
    image: '/heroimages/hero-6.jpg',
    title: 'Plumbing repair',
    detail: 'Booked for tomorrow, 3:00 PM — Kandy',
  },
];

const heroImages = heroSlides.map((slide) => slide.image);

const whyImages = [
  '/whyimages/why-1.jpg',
  '/whyimages/why-2.jpg',
  '/whyimages/why-3.jpg',
  '/whyimages/why-4.jpg',
  '/whyimages/why-5.jpg',
  '/whyimages/why-6.jpg',
];

const whyItems = [
  {
    icon: 'ti-shield-check',
    title: 'Verified professionals',
    desc: 'Every provider is background-checked and reviewed before joining Workly.',
  },
  {
    icon: 'ti-clock',
    title: 'On-time, every time',
    desc: 'Real-time booking and tracking keeps your schedule on point.',
  },
  {
    icon: 'ti-receipt',
    title: 'Transparent pricing',
    desc: 'See upfront estimates with no hidden fees before you confirm a booking.',
  },
  {
    icon: 'ti-headset',
    title: '24/7 support',
    desc: 'Our team is always available to help with any issue, big or small.',
  },
];

export default function Home() {
  const [heroSlide, setHeroSlide] = useState(0);

  return (
    <div className="home">
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="hero-slider">
          <ImageSlider images={heroImages} interval={4000} onChange={setHeroSlide} />
        </div>
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <span className="hero-badge">
            <i className="ti ti-sparkles" aria-hidden="true"></i>
            Trusted by 12,000+ professionals
          </span>
          <h1>
            Home services, <span>handled.</span>
          </h1>
          <p>
            Workly connects you with verified electricians, plumbers,
            cleaners and more — book trusted help in minutes and get every
            job done right.
          </p>
          <div className="hero-actions">
            <Link to="/services" className="btn btn-primary">
              <i className="ti ti-search" aria-hidden="true"></i>
              Find a service
            </Link>
            <Link to="/register" className="btn btn-outline">
              Become a provider
            </Link>
          </div>
          <div className="hero-trust">
            <div>
              <strong>12k+</strong>
              <span>Service providers</span>
            </div>
            <div>
              <strong>50k+</strong>
              <span>Jobs completed</span>
            </div>
            <div>
              <strong>4.8/5</strong>
              <span>Average rating</span>
            </div>
          </div>
        </div>

        <div className="hero-card">
          <span className="hero-card-tag">
            <i className="ti ti-circle-check" aria-hidden="true"></i>
            Verified provider
          </span>
          <h3>{heroSlides[heroSlide].title}</h3>
          <p>{heroSlides[heroSlide].detail}</p>
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="section-header">
          <span className="section-eyebrow">How it works</span>
          <h2>Get help in four simple steps</h2>
          <p>
            From finding the right professional to getting the job done,
            Workly makes the whole process simple and stress-free.
          </p>
        </div>
        <div className="steps-grid">
          {steps.map((step, i) => (
            <div className="step-card" key={step.title}>
              <span className="step-number">{String(i + 1).padStart(2, '0')}</span>
              <div className="step-icon">
                <i className={`ti ${step.icon}`} aria-hidden="true"></i>
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="section section-tinted">
        <div className="section-header">
          <span className="section-eyebrow">Our services</span>
          <h2>Whatever you need, we've got you covered</h2>
          <p>
            Explore our most requested categories or search to find a
            specialist for your specific job.
          </p>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <Link to="/services" className="service-card" key={service.title}>
              <div className="service-icon">
                <i className={`ti ${service.icon}`} aria-hidden="true"></i>
              </div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <span className="service-link">
                Explore <i className="ti ti-arrow-right" aria-hidden="true"></i>
              </span>
            </Link>
          ))}

          <Link to="/services" className="service-card service-card-more">
            <span>View all services</span>
            <i className="ti ti-arrow-right" aria-hidden="true"></i>
          </Link>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section">
        <div className="why-grid">
          <div className="why-visual">
            <ImageSlider images={whyImages} interval={4000} />
          </div>
          <div>
            <span className="section-eyebrow">Why Workly</span>
            <h2 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 24px', color: '#0a0a0a' }}>
              Built for trust, speed and quality
            </h2>
            <div className="why-list">
              {whyItems.map((item) => (
                <div className="why-item" key={item.title}>
                  <div className="why-item-icon">
                    <i className={`ti ${item.icon}`} aria-hidden="true"></i>
                  </div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>
          Ready to get started with <span>Workly?</span>
        </h2>
        <p>
          Join thousands of users and providers building a better home
          service experience.
        </p>
        <div className="cta-actions">
          <Link to="/register" className="btn btn-primary">
            <i className="ti ti-user-plus" aria-hidden="true"></i>
            Create an account
          </Link>
          <Link to="/services" className="btn btn-cta-outline">
            Browse services
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}