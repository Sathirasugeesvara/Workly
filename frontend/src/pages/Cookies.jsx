import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './TermsPrivacyCookies.css';

const sections = [
  { id: 'what', title: '1. What are cookies' },
  { id: 'how', title: '2. How we use cookies' },
  { id: 'types', title: '3. Types of cookies we use' },
  { id: 'third-party', title: '4. Third-party cookies' },
  { id: 'managing', title: '5. Managing your preferences' },
  { id: 'changes', title: '6. Changes to this policy' },
  { id: 'contact', title: '7. Contact us' },
];

export default function Cookies() {
  return (
    <div className="legal-page">
      <Navbar />

      <section className="legal-header">
        <span className="legal-eyebrow">Legal</span>
        <h1>Cookie Policy</h1>
        <p className="legal-updated">Last updated: June 14, 2026</p>
      </section>

      <div className="legal-body">
        <aside className="legal-toc">
          <h4>On this page</h4>
          <ul>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.title}</a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="legal-content">
          <p className="legal-intro">
            This Cookie Policy explains how Workly uses cookies and similar
            tracking technologies when you visit our website or use our
            applications. It should be read alongside our{' '}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>

          <section id="what">
            <h2>1. What are cookies</h2>
            <p>
              Cookies are small text files that are placed on your device when
              you visit a website. They are widely used to make websites work
              more efficiently, remember your preferences, and provide
              information to the site owners.
            </p>
          </section>

          <section id="how">
            <h2>2. How we use cookies</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Keep you signed in between visits</li>
              <li>Remember your preferences, such as language or location</li>
              <li>Understand how you use the Platform so we can improve it</li>
              <li>Measure the effectiveness of our features and content</li>
              <li>Help keep your account and the Platform secure</li>
            </ul>
          </section>

          <section id="types">
            <h2>3. Types of cookies we use</h2>
            <ul>
              <li><strong>Essential cookies:</strong> required for the Platform to function, such as keeping you logged in and securing your session. These cannot be switched off.</li>
              <li><strong>Performance cookies:</strong> help us understand how visitors interact with the Platform by collecting anonymous usage data.</li>
              <li><strong>Functional cookies:</strong> remember choices you make, such as your preferred location or display settings, to provide a more personalized experience.</li>
              <li><strong>Targeting cookies:</strong> may be used to deliver content or promotions that are more relevant to you and your interests.</li>
            </ul>
          </section>

          <section id="third-party">
            <h2>4. Third-party cookies</h2>
            <p>
              Some cookies on Workly are set by third-party services we use,
              such as analytics providers and payment processors. These third
              parties may use cookies to collect information about your activity
              across different websites in accordance with their own privacy
              policies.
            </p>
          </section>

          <section id="managing">
            <h2>5. Managing your preferences</h2>
            <p>
              Most web browsers allow you to control cookies through their
              settings, including blocking or deleting cookies. Please note
              that if you disable essential cookies, some parts of Workly may
              not function properly, such as staying signed in or completing a
              booking.
            </p>
            <p>
              You can typically find cookie settings in the "Privacy" or
              "Security" section of your browser's settings menu. The exact
              steps vary depending on which browser you use.
            </p>
          </section>

          <section id="changes">
            <h2>6. Changes to this policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect
              changes in the cookies and technologies we use, or for legal and
              regulatory reasons. The "Last updated" date at the top of this
              page reflects the most recent revision.
            </p>
          </section>

          <section id="contact">
            <h2>7. Contact us</h2>
            <p>
              If you have questions about this Cookie Policy, please contact us
              at <a href="mailto:xenoralabs@gmail.com">xenoralabs@gmail.com</a> or
              through our <Link to="/contact">Contact page</Link>.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}