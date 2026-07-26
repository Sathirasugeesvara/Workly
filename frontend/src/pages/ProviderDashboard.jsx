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
  getProviderSchedule,
} from '../services/providerservice';
import './ProviderDashboard.css';

/* ---------------------------------------------------------------------- */
/* Demo data — per-section fallback while the backend endpoints are being */
/* built out, so the dashboard is always fully populated.                 */
/* ---------------------------------------------------------------------- */

const EMPTY_SUMMARY = {
  name: '',
  avatarUrl: '',
  rating: 0,
  verified: false,
  pendingRequests: 0,
  acceptedJobs: 0,
  completedJobs: 0,
};

const STATUS_COLORS = {
  Pending: '#ff9800',
  Accepted: '#6366f1',
  Completed: '#22c55e',
  Cancelled: '#ef4444',
};

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

  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [earnings, setEarnings] = useState(DEMO_EARNINGS);
  const [statusData, setStatusData] = useState(DEMO_STATUS);
  const [schedule, setSchedule] = useState(DEMO_SCHEDULE);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const results = await Promise.allSettled([
        getProviderSummary(),
        getEarningsTrend(6),
        getProviderBookingStatus(),
        getProviderSchedule(30),
      ]);

      if (cancelled) return;

      const [
    summaryRes,
    earningsRes,
    statusRes,
    scheduleRes,
] = results;
      let anyDemo = false;

      if (
  summaryRes.status === 'fulfilled' &&
  summaryRes.value?.data
) {
  setSummary(summaryRes.value.data);
} else {
  console.error('Failed to load provider summary');
}

      if (earningsRes.status === 'fulfilled') setEarnings(earningsRes.value.data);
      else anyDemo = true;

      if (statusRes.status === 'fulfilled') setStatusData(statusRes.value.data);
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
                <h1>
  👋 Welcome back, {summary.name || "Provider"}
</h1>
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
