import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  getAdminSummary,
  getBookingStatusBreakdown,
  getUserGrowth,
  getCategoryPopularity,
  getBookingTrend,
  getRecentBookingsList,
  getLatestReviews,
  getPlatformHealth,
} from '../services/adminService';
import './AdminDashboard.css';

/* ---------------------------------------------------------------------- */
/* Demo data — used per-section whenever the matching endpoint isn't      */
/* live yet, so the UI is always fully populated while the backend is     */
/* being built out.                                                       */
/* ---------------------------------------------------------------------- */

const DEMO_SUMMARY = {
  adminName: 'Sathira',
  customers: 1284,
  providers: 312,
  totalBookings: 4021,
  revenue: 6842500,
  pendingVerifications: 7,
};

const DEMO_STATUS = [
  { name: 'Pending', value: 48 },
  { name: 'Accepted', value: 36 },
  { name: 'Completed', value: 214 },
  { name: 'Cancelled', value: 22 },
];

const STATUS_COLORS = {
  Pending: '#ff9800',
  Accepted: '#6366f1',
  Completed: '#22c55e',
  Cancelled: '#ef4444',
};

const DEMO_GROWTH = [
  { month: 'Feb', customers: 780, providers: 190 },
  { month: 'Mar', customers: 860, providers: 212 },
  { month: 'Apr', customers: 945, providers: 238 },
  { month: 'May', customers: 1040, providers: 268 },
  { month: 'Jun', customers: 1160, providers: 292 },
  { month: 'Jul', customers: 1284, providers: 312 },
];

const DEMO_CATEGORIES = [
  { category: 'Electrical', bookings: 812 },
  { category: 'Plumbing', bookings: 690 },
  { category: 'Cleaning', bookings: 604 },
  { category: 'Repair', bookings: 511 },
  { category: 'Painting', bookings: 398 },
  { category: 'Carpentry', bookings: 340 },
];

function buildDemoTrend() {
  const days = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const base = 18 + Math.round(10 * Math.sin(i / 4)) + Math.round(Math.random() * 6);
    days.push({
      date: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      bookings: Math.max(4, base),
    });
  }
  return days;
}

const DEMO_TREND = buildDemoTrend();

const DEMO_RECENT_BOOKINGS = [
  { id: 'WK-10412', service: 'Switchboard repair', customer: 'Amaya Wickrama', provider: 'Nimal Perera', date: '2026-07-11', status: 'PENDING', amount: 2800 },
  { id: 'WK-10409', service: 'Deep house cleaning', customer: 'Ruwan Silva', provider: 'CleanPro Services', date: '2026-07-10', status: 'ACCEPTED', amount: 3200 },
  { id: 'WK-10405', service: 'Inverter installation', customer: 'Dinesh Kumara', provider: 'Kasun Bandara', date: '2026-07-10', status: 'COMPLETED', amount: 6200 },
  { id: 'WK-10398', service: 'Lighting installation', customer: 'Ishara Bandara', provider: 'Nimal Perera', date: '2026-07-09', status: 'COMPLETED', amount: 3100 },
  { id: 'WK-10391', service: 'Leak repair', customer: 'Sanduni Perera', provider: 'Sunil Fernando', date: '2026-07-09', status: 'CANCELLED', amount: 0 },
  { id: 'WK-10388', service: 'Wall painting', customer: 'Tharindu Rathnayake', provider: 'ColorCraft Painters', date: '2026-07-08', status: 'COMPLETED', amount: 8400 },
  { id: 'WK-10380', service: 'AC servicing', customer: 'Chamodi Silva', provider: 'Roshan Jayasuriya', date: '2026-07-08', status: 'ACCEPTED', amount: 3500 },
  { id: 'WK-10375', service: 'Furniture assembly', customer: 'Yohan Perera', provider: 'Kasun Bandara', date: '2026-07-07', status: 'PENDING', amount: 1800 },
  { id: 'WK-10370', service: 'Tiling work', customer: 'Nadeesha Fonseka', provider: 'BuildRight Masonry', date: '2026-07-06', status: 'COMPLETED', amount: 12500 },
  { id: 'WK-10362', service: 'Wiring inspection', customer: 'Dilshan Perera', provider: 'Nimal Perera', date: '2026-07-05', status: 'COMPLETED', amount: 1800 },
];

const DEMO_REVIEWS = [
  { id: 'RV-2291', customer: 'Amaya Wickrama', provider: 'Nimal Perera', rating: 5, comment: 'Fixed the wiring issue quickly and explained everything clearly.', date: '2026-07-10' },
  { id: 'RV-2288', customer: 'Ruwan Silva', provider: 'CleanPro Services', rating: 4, comment: 'Great job overall, arrived a little late.', date: '2026-07-10' },
  { id: 'RV-2284', customer: 'Dinesh Kumara', provider: 'Kasun Bandara', rating: 5, comment: 'Very professional installation, highly recommend.', date: '2026-07-09' },
  { id: 'RV-2280', customer: 'Ishara Bandara', provider: 'Nimal Perera', rating: 5, comment: 'Excellent work, will book again.', date: '2026-07-09' },
  { id: 'RV-2276', customer: 'Tharindu Rathnayake', provider: 'ColorCraft Painters', rating: 4, comment: 'Neat finish, good communication throughout.', date: '2026-07-08' },
  { id: 'RV-2271', customer: 'Chamodi Silva', provider: 'Roshan Jayasuriya', rating: 3, comment: 'AC works fine now but took longer than expected.', date: '2026-07-08' },
  { id: 'RV-2265', customer: 'Yohan Perera', provider: 'Kasun Bandara', rating: 5, comment: 'Assembled everything perfectly, very tidy.', date: '2026-07-07' },
  { id: 'RV-2260', customer: 'Nadeesha Fonseka', provider: 'BuildRight Masonry', rating: 5, comment: 'Outstanding tiling work, exceeded expectations.', date: '2026-07-06' },
  { id: 'RV-2254', customer: 'Dilshan Perera', provider: 'Nimal Perera', rating: 4, comment: 'Thorough inspection and fair pricing.', date: '2026-07-05' },
  { id: 'RV-2249', customer: 'Sanduni Perera', provider: 'Sunil Fernando', rating: 2, comment: 'Booking got cancelled last minute, disappointing.', date: '2026-07-04' },
];

const DEMO_HEALTH = {
  uptimePercent: 99.94,
  avgResponseMs: 182,
  openDisputes: 3,
  avgRating: 4.6,
  verifiedProviderRate: 88,
  activeSessions: 214,
};

/* ---------------------------------------------------------------------- */

const formatLKR = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

function StarRating({ value }) {
  return (
    <span className="adash-stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <i
          key={n}
          className={`ti ${n <= value ? 'ti-star-filled' : 'ti-star'}`}
          aria-hidden="true"
        ></i>
      ))}
    </span>
  );
}

function SectionHeading({ eyebrow, title }) {
  return (
    <div className="adash-section-heading">
      <span className="adash-section-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
    </div>
  );
}

function HealthTile({ icon, label, value, tone = 'good' }) {
  return (
    <div className="adash-health-tile">
      <div className={`adash-health-dot adash-health-dot-${tone}`}></div>
      <div className="adash-health-icon"><i className={`ti ${icon}`} aria-hidden="true"></i></div>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);

  const [summary, setSummary] = useState(DEMO_SUMMARY);
  const [statusData, setStatusData] = useState(DEMO_STATUS);
  const [growthData, setGrowthData] = useState(DEMO_GROWTH);
  const [categoryData, setCategoryData] = useState(DEMO_CATEGORIES);
  const [trendData, setTrendData] = useState(DEMO_TREND);
  const [recentBookings, setRecentBookings] = useState(DEMO_RECENT_BOOKINGS);
  const [reviews, setReviews] = useState(DEMO_REVIEWS);
  const [health, setHealth] = useState(DEMO_HEALTH);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);

      const results = await Promise.allSettled([
        getAdminSummary(),
        getBookingStatusBreakdown(),
        getUserGrowth(6),
        getCategoryPopularity(),
        getBookingTrend(30),
        getRecentBookingsList(10),
        getLatestReviews(10),
        getPlatformHealth(),
      ]);

      if (cancelled) return;

      const [
        summaryRes,
        statusRes,
        growthRes,
        categoryRes,
        trendRes,
        bookingsRes,
        reviewsRes,
        healthRes,
      ] = results;

      let anyDemo = false;

      if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value.data);
      else anyDemo = true;

      if (statusRes.status === 'fulfilled') setStatusData(statusRes.value.data);
      else anyDemo = true;

      if (growthRes.status === 'fulfilled') setGrowthData(growthRes.value.data);
      else anyDemo = true;

      if (categoryRes.status === 'fulfilled') setCategoryData(categoryRes.value.data);
      else anyDemo = true;

      if (trendRes.status === 'fulfilled') setTrendData(trendRes.value.data);
      else anyDemo = true;

      if (bookingsRes.status === 'fulfilled') setRecentBookings(bookingsRes.value.data);
      else anyDemo = true;

      if (reviewsRes.status === 'fulfilled') setReviews(reviewsRes.value.data);
      else anyDemo = true;

      if (healthRes.status === 'fulfilled') setHealth(healthRes.value.data);
      else anyDemo = true;

      setUsingDemo(anyDemo);
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const newSignups =
    growthData.length >= 2
      ? growthData[growthData.length - 1].customers +
        growthData[growthData.length - 1].providers -
        (growthData[growthData.length - 2].customers + growthData[growthData.length - 2].providers)
      : 0;

  return (
    <div className="adash-page">
      <Navbar />

      {/* ---------- Welcome ---------- */}
      <div className="adash-welcome">
        <div className="adash-welcome-text">
          <span className="adash-eyebrow">Admin dashboard</span>
          <h1>Welcome back, {summary.adminName || 'Admin'}</h1>
          <p>
            You have <strong>{summary.pendingVerifications}</strong> provider
            {summary.pendingVerifications === 1 ? '' : 's'} waiting for verification,
            and <strong>{statusData.find((s) => s.name === 'Pending')?.value ?? 0}</strong> bookings
            awaiting a response today.
          </p>
        </div>
        <Link to="/admin/pending-verifications" className="adash-btn adash-btn-solid">
          <i className="ti ti-shield-check" aria-hidden="true"></i>
          Review verifications
        </Link>
      </div>

      <div className="adash-body">
        {usingDemo && !loading && (
          <div className="adash-notice">
            <i className="ti ti-info-circle" aria-hidden="true"></i>
            Some panels are showing demo data — connect the admin analytics API to replace them with live figures.
          </div>
        )}

        {/* ---------- Stat cards ---------- */}
        <SectionHeading eyebrow="Overview" title="Platform at a glance" />
        <div className="adash-stats">
          <div className="adash-stat-card">
            <div className="adash-stat-icon adash-icon-blue"><i className="ti ti-users" aria-hidden="true"></i></div>
            <div>
              <strong>{summary.customers.toLocaleString()}</strong>
              <span>Total customers</span>
            </div>
          </div>
          <div className="adash-stat-card">
            <div className="adash-stat-icon adash-icon-orange"><i className="ti ti-tool" aria-hidden="true"></i></div>
            <div>
              <strong>{summary.providers.toLocaleString()}</strong>
              <span>Total providers</span>
            </div>
          </div>
          <div className="adash-stat-card">
            <div className="adash-stat-icon adash-icon-purple"><i className="ti ti-clipboard-list" aria-hidden="true"></i></div>
            <div>
              <strong>{summary.totalBookings.toLocaleString()}</strong>
              <span>Total bookings</span>
            </div>
          </div>
          <div className="adash-stat-card">
            <div className="adash-stat-icon adash-icon-green"><i className="ti ti-user-plus" aria-hidden="true"></i></div>
            <div>
              <strong>+{newSignups.toLocaleString()}</strong>
              <span>New signups this month</span>
            </div>
          </div>
        </div>

        {/* ---------- Charts ---------- */}
        <SectionHeading eyebrow="Analytics" title="Trends & performance" />
        <div className="adash-charts-grid">
          <div className="adash-card">
            <h2>Booking status</h2>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#999'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={28} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="adash-card">
            <h2>User growth</h2>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={growthData} margin={{ left: -20, right: 10, top: 10 }}>
                <defs>
                  <linearGradient id="custGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff9800" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#ff9800" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="provGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="customers" stroke="#ff9800" fill="url(#custGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="providers" stroke="#6366f1" fill="url(#provGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="adash-card">
            <h2>Service category popularity</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={categoryData} margin={{ left: -20, right: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="category" tick={{ fontSize: 10.5 }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="bookings" fill="#ff6a00" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="adash-card">
            <h2>Booking trend — last 30 days</h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trendData} margin={{ left: -20, right: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#22c55e" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ---------- Tables ---------- */}
        <SectionHeading eyebrow="Activity" title="Recent activity" />
        <div className="adash-card adash-table-card">
          <div className="adash-card-title">
            <h2>Recent bookings</h2>
          </div>
          <div className="adash-table-wrap">
            <table className="adash-table">
              <thead>
                <tr>
                  <th>Booking</th>
                  <th>Customer</th>
                  <th>Provider</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.slice(0, 10).map((b) => (
                  <tr key={b.id}>
                    <td>
                      <strong>{b.service}</strong>
                      <span className="adash-subtext">{b.id}</span>
                    </td>
                    <td>{b.customer}</td>
                    <td>{b.provider}</td>
                    <td>{fmtDate(b.date)}</td>
                    <td><span className={`adash-badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                    <td>{b.amount > 0 ? formatLKR(b.amount) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="adash-card adash-table-card">
          <div className="adash-card-title">
            <h2>Latest reviews</h2>
          </div>
          <div className="adash-table-wrap">
            <table className="adash-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Provider</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {reviews.slice(0, 10).map((r) => (
                  <tr key={r.id}>
                    <td>{r.customer}</td>
                    <td>{r.provider}</td>
                    <td><StarRating value={r.rating} /></td>
                    <td className="adash-comment">{r.comment}</td>
                    <td>{fmtDate(r.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ---------- Platform health ---------- */}
        <SectionHeading eyebrow="System" title="Platform health" />
        <div className="adash-card adash-health-card">
          <div className="adash-card-title">
            <h2>Live system status</h2>
            <span className={`adash-health-status ${health.openDisputes > 5 || health.uptimePercent < 99 ? 'warn' : 'ok'}`}>
              <span className="adash-health-status-dot"></span>
              {health.openDisputes > 5 || health.uptimePercent < 99 ? 'Degraded performance' : 'All systems operational'}
            </span>
          </div>

          <div className="adash-health-layout">
            <div className="adash-health-visual">
              <img
                src="/adminimages/system-status.png"
                alt="Illustration of a server and shield representing platform system status"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextSibling.style.display = 'flex';
                }}
              />
              <div className="adash-health-visual-fallback">
                <i className="ti ti-server-2" aria-hidden="true"></i>
              </div>
            </div>

            <div className="adash-health-grid">
              <HealthTile icon="ti-activity" label="Uptime" value={`${health.uptimePercent}%`} tone="good" />
              <HealthTile icon="ti-bolt" label="Avg response time" value={`${health.avgResponseMs} ms`} tone="good" />
              <HealthTile icon="ti-alert-triangle" label="Open disputes" value={health.openDisputes} tone={health.openDisputes > 5 ? 'bad' : 'warn'} />
              <HealthTile icon="ti-star" label="Average rating" value={health.avgRating} tone="good" />
              <HealthTile icon="ti-shield-check" label="Verified providers" value={`${health.verifiedProviderRate}%`} tone="good" />
              <HealthTile icon="ti-users" label="Active sessions" value={health.activeSessions} tone="good" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
