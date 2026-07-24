import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageSlider from '../components/ImageSlider';
import { getMyProfile } from '../services/userService';
import { getMyBookings } from '../services/bookingService';
import './Home.css';
import './CustomerDashboard.css';

/* ---------------------------------------------------------------------- */
/* Same static content as the public Home page (hero slides, how-it-works,*/
/* services grid, why-choose-us) — duplicated here rather than imported   */
/* so Home.jsx stays untouched.                                           */
/* ---------------------------------------------------------------------- */

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
  { icon: 'ti-search', title: 'Find a service', desc: 'Browse categories or search for the exact service you need near you.' },
  { icon: 'ti-calendar-event', title: 'Book a slot', desc: 'Pick a verified provider and choose a date and time that works for you.' },
  { icon: 'ti-tool', title: 'Get the job done', desc: 'A trusted professional arrives and completes the work to your satisfaction.' },
  { icon: 'ti-star', title: 'Rate & review', desc: 'Share your experience to help other users and reward great service.' },
];

const heroSlides = [
  { image: '/heroimages/hero-1.jpg', title: 'Electrical repair', detail: 'Booked for tomorrow, 10:00 AM — Kandy' },
  { image: '/heroimages/hero-2.jpg', title: 'House painting', detail: 'Booked for tomorrow, 9:30 AM — Kandy' },
  { image: '/heroimages/hero-3.jpg', title: 'Car repair service', detail: 'Booked for tomorrow, 2:00 PM — Kandy' },
  { image: '/heroimages/hero-4.jpg', title: 'Garden maintenance', detail: 'Booked for tomorrow, 8:00 AM — Kandy' },
  { image: '/heroimages/hero-5.jpg', title: 'AC repair & service', detail: 'Booked for tomorrow, 11:00 AM — Kandy' },
  { image: '/heroimages/hero-6.jpg', title: 'Plumbing repair', detail: 'Booked for tomorrow, 3:00 PM — Kandy' },
];
const heroImages = heroSlides.map((slide) => slide.image);

const whyImages = [
  '/whyimages/why-1.jpg', '/whyimages/why-2.jpg', '/whyimages/why-3.jpg',
  '/whyimages/why-4.jpg', '/whyimages/why-5.jpg', '/whyimages/why-6.jpg',
];

const whyItems = [
  { icon: 'ti-shield-check', title: 'Verified professionals', desc: 'Every provider is background-checked and reviewed before joining Workly.' },
  { icon: 'ti-clock', title: 'On-time, every time', desc: 'Real-time booking and tracking keeps your schedule on point.' },
  { icon: 'ti-receipt', title: 'Transparent pricing', desc: 'See upfront estimates with no hidden fees before you confirm a booking.' },
  { icon: 'ti-headset', title: '24/7 support', desc: 'Our team is always available to help with any issue, big or small.' },
];

/* ---------------------------------------------------------------------- */

const DEMO_NAME = 'Sathira';

const DEMO_BOOKINGS = [
  { id: 'WK-10245', service: 'AC servicing', provider: 'Roshan Jayasuriya', date: '2026-07-14', status: 'PENDING', amount: 3500 },
  { id: 'WK-10234', service: 'Electrical wiring repair', provider: 'Nimal Perera', date: '2026-06-28', status: 'COMPLETED', amount: 4500 },
  { id: 'WK-10198', service: 'Deep house cleaning', provider: 'CleanPro Services', date: '2026-06-15', status: 'COMPLETED', amount: 3200 },
  { id: 'WK-10176', service: 'Plumbing - leak fix', provider: 'Sunil Fernando', date: '2026-06-02', status: 'CANCELLED', amount: 0 },
  { id: 'WK-10150', service: 'Inverter installation', provider: 'Kasun Bandara', date: '2026-05-18', status: 'COMPLETED', amount: 6200 },
  { id: 'WK-10120', service: 'Wall painting', provider: 'ColorCraft Painters', date: '2026-04-22', status: 'COMPLETED', amount: 8400 },
  { id: 'WK-10098', service: 'Tiling work', provider: 'BuildRight Masonry', date: '2026-03-10', status: 'COMPLETED', amount: 12500 },
];

const STATUS_COLORS = {
  Pending: '#ff9800',
  Accepted: '#6366f1',
  Completed: '#22c55e',
  Cancelled: '#ef4444',
};

export default function CustomerDashboard() {
  const [heroSlide, setHeroSlide] = useState(0);
  const [name, setName] = useState("");
const [bookings, setBookings] = useState([]);
const [loading, setLoading] = useState(true);

  useEffect(() => {

  const loadDashboard = async () => {

    try {

      const [profileRes, bookingsRes] = await Promise.all([
        getMyProfile(),
        getMyBookings()
      ]);

      setName(
        profileRes.data.fullName
          ? profileRes.data.fullName.split(" ")[0]
          : ""
      );

      setBookings(bookingsRes.data || []);

    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }

  };

  loadDashboard();

}, []);

  const active = bookings.filter((b) => b.status === 'PENDING' || b.status === 'ACCEPTED');
  const completed = bookings.filter((b) => b.status === 'COMPLETED');
  const totalSpent = completed.reduce((sum, b) => sum + (b.amount || 0), 0);

  const statusData = useMemo(() => {
    const counts = { Pending: 0, Accepted: 0, Completed: 0, Cancelled: 0 };
    bookings.forEach((b) => {
      const label = b.status.charAt(0) + b.status.slice(1).toLowerCase();
      if (counts[label] !== undefined) counts[label] += 1;
    });
    return Object.entries(counts)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [bookings]);

  const spendByMonth = useMemo(() => {
    const map = {};
    completed.forEach((b) => {
      const month = new Date(b.bookingDate).toLocaleDateString('en-GB', { month: 'short' });
      map[month] = (map[month] || 0) + (b.amount || 0);
    });
    return Object.entries(map).map(([month, amount]) => ({ month, amount }));
  }, [completed]);

  if (loading) {
  return (
    <div className="home">
      <Navbar />
      <div
        style={{
          padding: "120px 0",
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "600",
        }}
      >
        Loading Dashboard...
      </div>
      <Footer />
    </div>
  );
}

  return (
    <div className="home">
      <Navbar />

      {/* Hero — same as the public home page, minus the "Become a provider" CTA */}
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

      {/* Your activity — the customer-only dashboard row */}
      <section className="section cdash-section">
        <div className="section-header">
          <span className="section-eyebrow">Your activity</span>
          <h2>Welcome back, {name}</h2>
          <p>A quick look at your bookings and spending on Workly.</p>
        </div>

        <div className="cdash-stats">
          <div className="cdash-stat-card">
            <div className="cdash-stat-icon"><i className="ti ti-clock" aria-hidden="true"></i></div>
            <div>
              <strong>{active.length}</strong>
              <span>Active bookings</span>
            </div>
          </div>
          <div className="cdash-stat-card">
            <div className="cdash-stat-icon"><i className="ti ti-circle-check" aria-hidden="true"></i></div>
            <div>
              <strong>{completed.length}</strong>
              <span>Completed jobs</span>
            </div>
          </div>
          <div className="cdash-stat-card">
            <div className="cdash-stat-icon"><i className="ti ti-cash" aria-hidden="true"></i></div>
            <div>
              <strong>Rs. {totalSpent.toLocaleString()}</strong>
              <span>Total spent</span>
            </div>
          </div>
          <Link to="/history" className="cdash-stat-card cdash-stat-link">
            <div className="cdash-stat-icon"><i className="ti ti-history" aria-hidden="true"></i></div>
            <div>
              <strong>Full history</strong>
              <span>View all bookings</span>
            </div>
          </Link>
        </div>

        <div className="cdash-charts">
          <div className="cdash-chart-card">
            <h3>Booking status</h3>
            {statusData.length === 0 ? (
              <p className="cdash-chart-empty">No bookings yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#999'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={28} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="cdash-chart-card">
            <h3>Spending by month</h3>
            {spendByMonth.length === 0 ? (
              <p className="cdash-chart-empty">No completed bookings yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={spendByMonth} margin={{ left: -20, right: 10, top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => `Rs. ${v.toLocaleString()}`} />
                  <Bar dataKey="amount" fill="#ff6a00" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
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

      <Footer />
    </div>
  );
}
