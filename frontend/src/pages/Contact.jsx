import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Contact.css';

const contactInfo = [
  {
    icon: 'ti-map-pin',
    title: 'Our office',
    lines: ['Colombo, Western Province', 'Sri Lanka'],
  },
  {
    icon: 'ti-mail',
    title: 'Email us',
    lines: ['xenoralabs@gmail.com'],
  },
  {
    icon: 'ti-phone',
    title: 'Call us',
    lines: ['+94 78 462 7089'],
  },
  {
    icon: 'ti-clock',
    title: 'Working hours',
    lines: ['Mon – Sat: 8:00 AM – 8:00 PM', 'Sunday: Closed'],
  },
];

const socialLinks = [
  {
    icon: 'ti-brand-whatsapp',
    label: 'WhatsApp',
    handle: 'Chat with us',
    href: 'https://wa.me/94784627089',
    colorClass: 'social-whatsapp',
  },
  {
    icon: 'ti-brand-facebook',
    label: 'Facebook',
    handle: 'xenoralabs',
    href: '#',
    colorClass: 'social-facebook',
  },
  {
    icon: 'ti-brand-instagram',
    label: 'Instagram',
    handle: '@xenoralabs',
    href: '#',
    colorClass: 'social-instagram',
  },
  {
    icon: 'ti-brand-tiktok',
    label: 'TikTok',
    handle: '@xenoralabs',
    href: '#',
    colorClass: 'social-tiktok',
  },
  {
    icon: 'ti-brand-youtube',
    label: 'YouTube',
    handle: 'xenoralabs',
    href: '#',
    colorClass: 'social-youtube',
  },
  {
    icon: 'ti-mail',
    label: 'Email',
    handle: 'xenoralabs@gmail.com',
    href: 'mailto:xenoralabs@gmail.com',
    colorClass: 'social-email',
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General inquiry',
    message: '',
  });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');

    // TODO: replace with a real call to your Spring Boot API
    // fetch('/api/contact', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(form) })
    setTimeout(() => {
      setStatus('sent');
      setForm({ name: '', email: '', phone: '', subject: 'General inquiry', message: '' });
    }, 1200);
  };

  return (
    <div className="contact-page">
      <Navbar />

      {/* Header */}
      <section className="contact-header">
        <span className="contact-eyebrow">Contact us</span>
        <h1>We'd love to hear from you</h1>
        <p>
          Questions about a booking, becoming a provider, or just want to
          say hello? Reach out through any of the channels below — our team
          usually replies within a few hours.
        </p>
      </section>

      {/* Info cards */}
      <section className="contact-info-section">
        <div className="contact-info-grid">
          {contactInfo.map((item) => (
            <div className="contact-info-card" key={item.title}>
              <div className="contact-info-icon">
                <i className={`ti ${item.icon}`} aria-hidden="true"></i>
              </div>
              <h3>{item.title}</h3>
              {item.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Form + Social */}
      <section className="contact-main">
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send us a message</h2>
          <p className="contact-form-sub">
            Fill out the form and our team will get back to you as soon as possible.
          </p>

          <div className="contact-form-row">
            <div className="contact-field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="contact-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="contact-form-row">
            <div className="contact-field">
              <label htmlFor="phone">Phone number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+94 7X XXX XXXX"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div className="contact-field">
              <label htmlFor="subject">Subject</label>
              <select id="subject" name="subject" value={form.subject} onChange={handleChange}>
                <option>General inquiry</option>
                <option>Booking support</option>
                <option>Become a provider</option>
                <option>Partnership</option>
                <option>Report an issue</option>
              </select>
            </div>
          </div>

          <div className="contact-field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Tell us a bit about what you need..."
              value={form.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="contact-submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : 'Send message'}
            <i className="ti ti-send" aria-hidden="true"></i>
          </button>

          {status === 'sent' && (
            <p className="contact-form-status success">
              Thanks for reaching out — we'll get back to you shortly.
            </p>
          )}
        </form>

        <div className="contact-social">
          <h2>Connect with us</h2>
          <p className="contact-social-sub">
            Follow Workly on social media for updates, tips, and behind-the-scenes
            looks at our team and providers.
          </p>

          <div className="social-grid">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`social-card ${social.colorClass}`}
              >
                <div className="social-icon">
                  <i className={`ti ${social.icon}`} aria-hidden="true"></i>
                </div>
                <div className="social-text">
                  <h4>{social.label}</h4>
                  <span>{social.handle}</span>
                </div>
                <i className="ti ti-arrow-right social-arrow" aria-hidden="true"></i>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}