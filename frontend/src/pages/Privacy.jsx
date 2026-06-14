import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './TermsPrivacyCookies.css';

const sections = [
  { id: 'information', title: '1. Information we collect' },
  { id: 'use', title: '2. How we use your information' },
  { id: 'sharing', title: '3. How we share information' },
  { id: 'cookies', title: '4. Cookies & tracking technologies' },
  { id: 'security', title: '5. Data security' },
  { id: 'rights', title: '6. Your rights & choices' },
  { id: 'retention', title: '7. Data retention' },
  { id: 'children', title: "8. Children's privacy" },
  { id: 'international', title: '9. International data transfers' },
  { id: 'changes', title: '10. Changes to this policy' },
  { id: 'contact', title: '11. Contact us' },
];

export default function Privacy() {
  return (
    <div className="legal-page">
      <Navbar />

      <section className="legal-header">
        <span className="legal-eyebrow">Legal</span>
        <h1>Privacy Policy</h1>
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
            This Privacy Policy explains how Workly ("we", "us", or "our")
            collects, uses, shares, and protects your personal information when
            you use our website, mobile applications, and related services (the
            "Platform"). By using Workly, you agree to the collection and use of
            information in accordance with this policy.
          </p>

          <section id="information">
            <h2>1. Information we collect</h2>
            <p>We collect the following types of information:</p>
            <ul>
              <li><strong>Account information:</strong> name, email address, phone number, password, and profile photo</li>
              <li><strong>Booking information:</strong> service requests, addresses, scheduling details, and special instructions</li>
              <li><strong>Provider information:</strong> identity verification documents, certifications, work history, and payout details</li>
              <li><strong>Payment information:</strong> processed securely by our third-party payment providers — Workly does not store full card numbers</li>
              <li><strong>Usage information:</strong> device type, IP address, browser, pages visited, and interactions with the Platform</li>
              <li><strong>Location information:</strong> approximate or precise location, with your permission, to match you with nearby providers</li>
            </ul>
          </section>

          <section id="use">
            <h2>2. How we use your information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Create and manage your account, and match customers with appropriate providers</li>
              <li>Process bookings, payments, and payouts</li>
              <li>Verify provider identity and qualifications</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Send booking confirmations, reminders, and service updates</li>
              <li>Improve and personalize the Platform, including through analytics</li>
              <li>Detect, prevent, and address fraud, abuse, and security issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section id="sharing">
            <h2>3. How we share information</h2>
            <p>
              We do not sell your personal information. We may share
              information in the following circumstances:
            </p>
            <ul>
              <li><strong>Between users:</strong> to facilitate a booking, customers and providers may see each other's name, contact details, and relevant booking information</li>
              <li><strong>Service providers:</strong> third parties that help us operate the Platform, such as payment processors, hosting providers, and analytics services</li>
              <li><strong>Legal & safety:</strong> when required by law, or to protect the rights, property, or safety of Workly, our users, or the public</li>
              <li><strong>Business transfers:</strong> in connection with a merger, acquisition, or sale of assets, subject to confidentiality protections</li>
            </ul>
          </section>

          <section id="cookies">
            <h2>4. Cookies & tracking technologies</h2>
            <p>
              We use cookies and similar technologies to keep you signed in,
              remember your preferences, and understand how the Platform is
              used. For full details on the types of cookies we use and how to
              manage them, please see our <Link to="/cookies">Cookie Policy</Link>.
            </p>
          </section>

          <section id="security">
            <h2>5. Data security</h2>
            <p>
              We implement technical and organizational measures designed to
              protect your personal information against unauthorized access,
              alteration, disclosure, or destruction, including encryption in
              transit, access controls, and regular security reviews. However,
              no method of transmission or storage is completely secure, and we
              cannot guarantee absolute security.
            </p>
          </section>

          <section id="rights">
            <h2>6. Your rights & choices</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access, correct, or delete the personal information we hold about you</li>
              <li>Object to or restrict certain processing of your information</li>
              <li>Withdraw consent for location tracking or marketing communications at any time</li>
              <li>Request a copy of your data in a portable format</li>
            </ul>
            <p>
              To exercise any of these rights, contact us using the details in
              the "Contact us" section below.
            </p>
          </section>

          <section id="retention">
            <h2>7. Data retention</h2>
            <p>
              We retain personal information for as long as necessary to
              provide the Platform, comply with our legal obligations, resolve
              disputes, and enforce our agreements. When information is no
              longer needed, we securely delete or anonymize it.
            </p>
          </section>

          <section id="children">
            <h2>8. Children's privacy</h2>
            <p>
              Workly is not directed to individuals under the age of 18, and we
              do not knowingly collect personal information from children. If we
              become aware that we have collected information from a child
              without parental consent, we will take steps to delete it.
            </p>
          </section>

          <section id="international">
            <h2>9. International data transfers</h2>
            <p>
              Your information may be processed and stored in countries other
              than your own. Where this occurs, we take steps to ensure
              appropriate safeguards are in place to protect your information in
              accordance with this Privacy Policy.
            </p>
          </section>

          <section id="changes">
            <h2>10. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. If we make
              material changes, we will notify you through the Platform or by
              email before the changes take effect. The "Last updated" date at
              the top of this page reflects the most recent revision.
            </p>
          </section>

          <section id="contact">
            <h2>11. Contact us</h2>
            <p>
              If you have questions about this Privacy Policy or how we handle
              your information, please contact us at{' '}
              <a href="mailto:xenoralabs@gmail.com">xenoralabs@gmail.com</a> or
              through our <Link to="/contact">Contact page</Link>.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}