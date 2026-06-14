import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './TermsPrivacyCookies.css';

const sections = [
  { id: 'acceptance', title: '1. Acceptance of terms' },
  { id: 'service', title: '2. Description of service' },
  { id: 'accounts', title: '3. User accounts' },
  { id: 'bookings', title: '4. Bookings & payments' },
  { id: 'providers', title: '5. Provider responsibilities' },
  { id: 'conduct', title: '6. User conduct' },
  { id: 'cancellations', title: '7. Cancellations & refunds' },
  { id: 'liability', title: '8. Limitation of liability' },
  { id: 'ip', title: '9. Intellectual property' },
  { id: 'changes', title: '10. Changes to these terms' },
  { id: 'law', title: '11. Governing law' },
  { id: 'contact', title: '12. Contact us' },
];

export default function Terms() {
  return (
    <div className="legal-page">
      <Navbar />

      <section className="legal-header">
        <span className="legal-eyebrow">Legal</span>
        <h1>Terms of Service</h1>
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
            These Terms of Service ("Terms") govern your access to and use of
            Workly, including our website, mobile applications, and related
            services (collectively, the "Platform"). By creating an account,
            booking a service, or registering as a service provider, you agree
            to be bound by these Terms. If you do not agree, please do not use
            the Platform.
          </p>

          <section id="acceptance">
            <h2>1. Acceptance of terms</h2>
            <p>
              By accessing or using Workly, you confirm that you are at least
              18 years old (or the age of majority in your jurisdiction) and
              that you have the legal capacity to enter into a binding
              agreement. If you are using the Platform on behalf of a business,
              you confirm that you have the authority to bind that business to
              these Terms.
            </p>
          </section>

          <section id="service">
            <h2>2. Description of service</h2>
            <p>
              Workly is an online marketplace that connects customers seeking
              home services (such as electrical, plumbing, cleaning, painting,
              and general repairs) with independent service providers. Workly
              does not employ service providers and is not a party to the
              agreement formed between a customer and a provider when a
              booking is confirmed.
            </p>
            <p>
              We may update, suspend, or discontinue any part of the Platform
              at any time, with or without notice, including the availability
              of any feature, service category, or geographic area.
            </p>
          </section>

          <section id="accounts">
            <h2>3. User accounts</h2>
            <p>
              To access most features of Workly, you must create an account.
              You agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain the security of your password and accept all risks of unauthorized access</li>
              <li>Promptly update your account information to keep it accurate</li>
              <li>Notify us immediately if you suspect any unauthorized use of your account</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that
              violate these Terms or that we reasonably believe to be
              fraudulent, abusive, or harmful to other users.
            </p>
          </section>

          <section id="bookings">
            <h2>4. Bookings & payments</h2>
            <p>
              When you book a service through Workly, you enter into a direct
              agreement with the provider for the performance of that service.
              Prices displayed on the Platform are estimates provided by
              providers and may be adjusted based on the actual scope of work,
              subject to the provider's pricing policy.
            </p>
            <p>
              Payments made through the Platform are processed by third-party
              payment providers. By making a payment, you authorize Workly and
              its payment processors to charge the payment method you provide
              for the agreed service amount, applicable fees, and any
              applicable taxes.
            </p>
          </section>

          <section id="providers">
            <h2>5. Provider responsibilities</h2>
            <p>
              Service providers registered on Workly represent and warrant
              that they:
            </p>
            <ul>
              <li>Hold any licenses, permits, or certifications required to perform the services they offer</li>
              <li>Will perform services with reasonable skill and care, in compliance with applicable laws</li>
              <li>Maintain appropriate insurance coverage for their trade where required</li>
              <li>Will not subcontract a booking to an unverified individual without the customer's consent</li>
            </ul>
            <p>
              Workly reserves the right to suspend or remove a provider's
              profile if we receive credible reports of misconduct, fraud, or
              repeated quality issues.
            </p>
          </section>

          <section id="conduct">
            <h2>6. User conduct</h2>
            <p>You agree not to use the Platform to:</p>
            <ul>
              <li>Violate any applicable local, national, or international law</li>
              <li>Harass, threaten, or discriminate against any other user</li>
              <li>Post false, misleading, or fraudulent reviews or listings</li>
              <li>Circumvent the Platform's booking or payment systems to avoid applicable fees</li>
              <li>Attempt to gain unauthorized access to any part of the Platform or its systems</li>
            </ul>
          </section>

          <section id="cancellations">
            <h2>7. Cancellations & refunds</h2>
            <p>
              Cancellation policies may vary by service category and provider,
              and will be displayed before you confirm a booking. In general:
            </p>
            <ul>
              <li>Customers may cancel a booking free of charge up to a specified time before the scheduled service</li>
              <li>Late cancellations or no-shows may incur a fee to compensate the provider</li>
              <li>Refunds for services not performed, or performed unsatisfactorily, will be reviewed on a case-by-case basis through our support team</li>
            </ul>
          </section>

          <section id="liability">
            <h2>8. Limitation of liability</h2>
            <p>
              Workly acts as an intermediary platform and is not responsible
              for the quality, safety, legality, or any other aspect of
              services provided by independent providers. To the maximum extent
              permitted by law, Workly shall not be liable for any indirect,
              incidental, special, or consequential damages arising from your
              use of the Platform or any service booked through it.
            </p>
            <p>
              Nothing in these Terms limits any liability that cannot be
              excluded or limited under applicable law.
            </p>
          </section>

          <section id="ip">
            <h2>9. Intellectual property</h2>
            <p>
              The Workly name, logo, design, and all related trademarks, as
              well as the software, text, graphics, and other content on the
              Platform (excluding user-submitted content), are the property of
              Workly or its licensors and are protected by intellectual
              property laws. You may not copy, modify, distribute, or create
              derivative works based on the Platform without prior written
              consent.
            </p>
          </section>

          <section id="changes">
            <h2>10. Changes to these terms</h2>
            <p>
              We may update these Terms from time to time to reflect changes to
              our services, legal requirements, or business practices. If we
              make material changes, we will provide notice through the
              Platform or by email before the changes take effect. Continued
              use of Workly after changes take effect constitutes acceptance of
              the revised Terms.
            </p>
          </section>

          <section id="law">
            <h2>11. Governing law</h2>
            <p>
              These Terms are governed by and construed in accordance with the
              laws of Sri Lanka, without regard to its conflict of law
              provisions. Any disputes arising under these Terms shall be
              subject to the exclusive jurisdiction of the courts of Sri Lanka.
            </p>
          </section>

          <section id="contact">
            <h2>12. Contact us</h2>
            <p>
              If you have any questions about these Terms, please contact us at{' '}
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