import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  getProviderSummary,
  getEarningsTrend,
  getProviderBookingStatus,
  getProviderReviews,
  getProviderSchedule,
} from '../services/providerService';
import './ProviderDashboard.css';

/* ---------------------------------------------------------------------- */
/* Demo data — per-section fallback while the backend endpoints are being */
/* built out, so the dashboard is always fully populated.                 */
/* ---------------------------------------------------------------------- */

const DEMO_SUMMARY = {
  name: 'Nimal Perera',
  avatarUrl: '',
  rating: 4.9,
  verified: true,
  pendingRequests: 3,
  acceptedJobs: 5,
  completedJobs: 480,
};

const DEMO_EARNINGS = [
  { month: 'Feb', earnings: 38500 },
  { month: 'Mar', earnings: 44200 },
  { month: 'Apr', earnings: 41800 },
  { month: 'May', earnings: 52100 },
  { month: 'Jun', earnings: 47600 },
  { month: 'Jul', earnings: 31200 },
];

const DEMO_STATUS = [
  { name: 'Pending', value: 3 },
  { name: 'Accepted', value: 5 },
  { name: 'Completed', value: 42 },
  { name: 'Cancelled', value: 4 },
];

const STATUS_COLORS = {
  Pending: '#ff9800',
  Accepted: '#6366f1',
  Completed: '#22c55e',
  Cancelled: '#ef4444',
};

const DEMO_REVIEWS = [
  { id: 'r1', customer: 'Amaya', rating: 5, comment: 'Excellent electrician, fixed the issue in no time.', date: '2026-07-10' },
  { id: 'r2', customer: 'Ruwan Silva', rating: 5, comment: 'Very professional and punctual, highly recommend.', date: '2026-07-08' },
  { id: 'r3', customer: 'Dinesh Kumara', rating: 4, comment: 'Good work, explained the problem clearly.', date: '2026-07-05' },
  { id: 'r4', customer: 'Ishara Bandara', rating: 5, comment: 'Neat and tidy, will book again for sure.', date: '2026-07-02' },
  { id: 'r5', customer: 'Chamodi Silva', rating: 4, comment: 'Arrived a little late but did solid work.', date: '2026-06-28' },
];

function buildDemoSchedule() {
  const now = new Date();
  const items = [
    { offset: 0, title: 'Switchboard repair — Amaya W.' },
    { offset: 2, title: 'Inverter installation — Ruwan S.' },
    { offset: 5, title: 'Wiring inspection — Dinesh K.' },
    { offset: 9, title: 'Lighting installation — Ishara B.' },
  ];
  return items.map((item) => {
    const d = new Date(now);
    d.setDate(d.getDate() + item.offset);
    return { date: d.toISOString().slice(0, 10), title: item.title };
  });
}

const DEMO_SCHEDULE = buildDemoSchedule();

/* ---------------------------------------------------------------------- */

const initialsOf = (name) => name.split(' ').map((n) => n[0]).slice(0, 2).join('');

function StarRating({ value }) {
  return (
    <span className="pdash-stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <i key={n} className={`ti ${n <= value ? 'ti-star-filled' : 'ti-star'}`} aria-hidden="true"></i>
      ))}
    </span>
  );
}

function MiniCalendar({ schedule }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const scheduleDates = new Set(schedule.map((s) => s.date));
  const todayStr = today.toISOString().slice(0, 10);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthLabel = today.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  return (
    <div className="pdash-calendar">
      <div className="pdash-calendar-header">{monthLabel}</div>
      <div className="pdash-calendar-weekdays">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={`${d}-${i}`}>{d}</span>
        ))}
      </div>
      <div className="pdash-calendar-grid">
        {cells.map((d, i) => {
          if (d === null) return <span key={`empty-${i}`} className="pdash-calendar-cell empty"></span>;
          const dateStr = new Date(year, month, d).toISOString().slice(0, 10);
          const hasJob = scheduleDates.has(dateStr);
          const isToday = dateStr === todayStr;
          return (
            <span
              key={d}
              className={`pdash-calendar-cell ${isToday ? 'today' : ''} ${hasJob ? 'has-job' : ''}`}
            >
              {d}
              {hasJob && <span className="pdash-calendar-dot"></span>}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function ProviderDashboard() {
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);

  const [summary, setSummary] = useState(DEMO_SUMMARY);
  const [earnings, setEarnings] = useState(DEMO_EARNINGS);
  const [statusData, setStatusData] = useState(DEMO_STATUS);
  const [reviews, setReviews] = useState(DEMO_REVIEWS);
  const [schedule, setSchedule] = useState(DEMO_SCHEDULE);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const results = await Promise.allSettled([
        getProviderSummary(),
        getEarningsTrend(6),
        getProviderBookingStatus(),
        getProviderReviews(5),
        getProviderSchedule(30),
      ]);

      if (cancelled) return;

      const [summaryRes, earningsRes, statusRes, reviewsRes, scheduleRes] = results;
      let anyDemo = false;

      if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value.data);
      else anyDemo = true;

      if (earningsRes.status === 'fulfilled') setEarnings(earningsRes.value.data);
      else anyDemo = true;

      if (statusRes.status === 'fulfilled') setStatusData(statusRes.value.data);
      else anyDemo = true;

      if (reviewsRes.status === 'fulfilled') setReviews(reviewsRes.value.data);
      else anyDemo = true;

      if (scheduleRes.status === 'fulfilled') setSchedule(scheduleRes.value.data);
      else anyDemo = true;

      setUsingDemo(anyDemo);
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const upcoming = useMemo(
    () =>
      [...schedule]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 4),
    [schedule]
  );

  return (
    <div className="pdash-page">
      <Navbar />

      {/* ---------- Hero ---------- */}
      <div className="pdash-hero">
        <div className="pdash-hero-main">
          {summary.avatarUrl ? (
            <img src={summary.avatarUrl} alt={summary.name} className="pdash-hero-avatar-img" />
          ) : (
            <div className="pdash-hero-avatar">{initialsOf(summary.name)}</div>
          )}

          <div>
            <div className="pdash-hero-name-row">
              <h1>👋 Welcome back, {summary.name}</h1>
              {summary.verified && (
                <span className="pdash-verified-badge">
                  <i className="ti ti-rosette-discount-check" aria-hidden="true"></i> Verified
                </span>
              )}
            </div>
            <p>
              You have <strong>{summary.pendingRequests}</strong> new request
              {summary.pendingRequests === 1 ? '' : 's'} waiting.
            </p>
            <span className="pdash-hero-rating">
              <i className="ti ti-star-filled" aria-hidden="true"></i> {summary.rating} rating
            </span>
          </div>
        </div>

        <Link to="/provider/booking-requests" className="pdash-btn pdash-btn-solid">
          <i className="ti ti-bell" aria-hidden="true"></i>
          View requests
        </Link>
      </div>

      <div className="pdash-body">
        {usingDemo && !loading && (
          <div className="pdash-notice">
            <i className="ti ti-info-circle" aria-hidden="true"></i>
            Some panels are showing demo data — connect the provider dashboard API to see live figures.
          </div>
        )}

        {/* ---------- Stat cards ---------- */}
        <div className="pdash-stats">
          <div className="pdash-stat-card">
            <div className="pdash-stat-icon pdash-icon-orange"><i className="ti ti-bell" aria-hidden="true"></i></div>
            <div><strong>{summary.pendingRequests}</strong><span>Pending requests</span></div>
          </div>
          <div className="pdash-stat-card">
            <div className="pdash-stat-icon pdash-icon-blue"><i className="ti ti-briefcase" aria-hidden="true"></i></div>
            <div><strong>{summary.acceptedJobs}</strong><span>Accepted jobs</span></div>
          </div>
          <div className="pdash-stat-card">
            <div className="pdash-stat-icon pdash-icon-green"><i className="ti ti-circle-check" aria-hidden="true"></i></div>
            <div><strong>{summary.completedJobs}</strong><span>Completed jobs</span></div>
          </div>
          <div className="pdash-stat-card">
            <div className="pdash-stat-icon pdash-icon-purple"><i className="ti ti-star-filled" aria-hidden="true"></i></div>
            <div><strong>{summary.rating}</strong><span>Average rating</span></div>
          </div>
        </div>

        {/* ---------- Charts ---------- */}
        <div className="pdash-charts-grid">
          <div className="pdash-card">
            <h2>Earnings</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={earnings} margin={{ left: -20, right: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`Rs. ${Number(v).toLocaleString()}`, 'Earnings']} />
                <Line type="monotone" dataKey="earnings" stroke="#ff6a00" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pdash-card">
            <h2>Booking status</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={3}>
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#999'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={28} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ---------- Reviews + Calendar ---------- */}
        <div className="pdash-mid-grid">
          <div className="pdash-card">
            <div className="pdash-card-title">
              <h2>Customer reviews</h2>
              <Link to="/provider/booking-history" className="pdash-link">View all</Link>
            </div>
            <div className="pdash-reviews-list">
              {reviews.slice(0, 5).map((r) => (
                <div className="pdash-review" key={r.id}>
                  <div className="pdash-review-top">
                    <span className="pdash-review-name">{r.customer}</span>
                    <StarRating value={r.rating} />
                  </div>
                  <p>"{r.comment}"</p>
                  <span className="pdash-review-date">
                    {new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pdash-card">
            <h2>Calendar</h2>
            <MiniCalendar schedule={schedule} />
            <div className="pdash-upcoming">
              <span className="pdash-upcoming-title">Upcoming</span>
              {upcoming.length === 0 ? (
                <p className="pdash-upcoming-empty">Nothing scheduled.</p>
              ) : (
                upcoming.map((s) => (
                  <div className="pdash-upcoming-item" key={`${s.date}-${s.title}`}>
                    <span className="pdash-upcoming-date">
                      {new Date(s.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                    <span>{s.title}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ---------- Quick actions ---------- */}
        <div className="pdash-card">
          <h2>Quick actions</h2>
          <div className="pdash-quick-actions">
            <Link to="/profile/me" className="pdash-action-btn">
              <i className="ti ti-plus" aria-hidden="true"></i> Add service
            </Link>
            <Link to="/profile/me" className="pdash-action-btn">
              <i className="ti ti-user-edit" aria-hidden="true"></i> Update profile
            </Link>
            <Link to="/profile/me" className="pdash-action-btn">
              <i className="ti ti-calendar-time" aria-hidden="true"></i> Update availability
            </Link>
            <Link to="/provider/booking-history" className="pdash-action-btn">
              <i className="ti ti-star" aria-hidden="true"></i> View reviews
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
