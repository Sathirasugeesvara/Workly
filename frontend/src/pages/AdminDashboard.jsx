import React, { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  getAdminProfile,
  getAdminCustomers,
  getAdminProviders,
  getAdminServices,
  getAdminBookings,
} from '../services/adminService';
import './AdminDashboard.css';

const STATUS_ORDER = ['PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED'];

const STATUS_COLORS = {
  PENDING: '#ff9800',
  ACCEPTED: '#6366f1',
  COMPLETED: '#22c55e',
  CANCELLED: '#ef4444',
};

const formatLKR = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;

const fmtDate = (d) => {
  if (!d) return '—';
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

function SectionHeading({ eyebrow, title }) {
  return (
    <div className="adash-section-heading">
      <span className="adash-section-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
    </div>
  );
}

function StatCard({ icon, tone, value, label }) {
  return (
    <div className="adash-stat-card">
      <div className={`adash-stat-icon adash-icon-${tone}`}>
        <i className={`ti ${icon}`} aria-hidden="true"></i>
      </div>
      <div>
        <strong>{value.toLocaleString()}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function EmptyRow({ colSpan, label }) {
  return (
    <tr>
      <td colSpan={colSpan} className="adash-empty-cell">
        {label}
      </td>
    </tr>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [profile, setProfile] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const [profileRes, customersRes, providersRes, servicesRes, bookingsRes] =
          await Promise.all([
            getAdminProfile(),
            getAdminCustomers(),
            getAdminProviders(),
            getAdminServices(),
            getAdminBookings(),
          ]);

        if (cancelled) return;

        setProfile(profileRes.data);
        setCustomers(customersRes.data || []);
        setProviders(providersRes.data || []);
        setServices(servicesRes.data || []);
        setBookings(bookingsRes.data || []);
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              'Could not load the admin dashboard. Please try again.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const statusCounts = useMemo(() => {
    const counts = { PENDING: 0, ACCEPTED: 0, COMPLETED: 0, CANCELLED: 0 };
    bookings.forEach((b) => {
      const status = (b.status || '').toUpperCase();
      if (status in counts) counts[status] += 1;
    });
    return counts;
  }, [bookings]);

  const statusData = useMemo(
    () =>
      STATUS_ORDER.map((name) => ({ name, value: statusCounts[name] })).filter(
        (s) => s.value > 0
      ),
    [statusCounts]
  );

  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
      .slice(0, 10);
  }, [bookings]);

  const adminName = profile?.name || profile?.fullName || profile?.username || 'Admin';

  return (
    <div className="adash-page">
      <Navbar />

      {/* ---------- Welcome ---------- */}
      <div className="adash-welcome">
        <div className="adash-welcome-text">
          <span className="adash-eyebrow">Admin dashboard</span>
          <h1>Welcome back, {adminName}</h1>
          <p>
            Here&apos;s a live snapshot of Workly &mdash; <strong>{customers.length}</strong> customers,{' '}
            <strong>{providers.length}</strong> providers, and{' '}
            <strong>{bookings.length}</strong> bookings on the platform.
          </p>
        </div>
      </div>

      <div className="adash-body">
        {error && (
          <div className="adash-notice adash-notice-error">
            <i className="ti ti-alert-circle" aria-hidden="true"></i>
            {error}
          </div>
        )}

        {loading ? (
          <div className="adash-loading">
            <div className="adash-spinner" aria-hidden="true"></div>
            <span>Loading dashboard data&hellip;</span>
          </div>
        ) : (
          <>
            {/* ---------- Stat cards ---------- */}
            <SectionHeading eyebrow="Overview" title="Platform at a glance" />
            <div className="adash-stats">
              <StatCard icon="ti-users" tone="blue" value={customers.length} label="Total customers" />
              <StatCard icon="ti-tool" tone="orange" value={providers.length} label="Total providers" />
              <StatCard icon="ti-list-details" tone="purple" value={services.length} label="Total services" />
              <StatCard icon="ti-clipboard-list" tone="green" value={bookings.length} label="Total bookings" />
            </div>

            {/* ---------- Booking status chart ---------- */}
            <SectionHeading eyebrow="Analytics" title="Booking status breakdown" />
            <div className="adash-card adash-chart-card">
              {statusData.length === 0 ? (
                <div className="adash-empty-state">
                  <i className="ti ti-chart-pie" aria-hidden="true"></i>
                  <p>No bookings yet — the chart will populate once bookings come in.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={65}
                      outerRadius={100}
                      paddingAngle={3}
                    >
                      {statusData.map((entry) => (
                        <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#999'} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={32} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* ---------- Recent bookings ---------- */}
            <SectionHeading eyebrow="Activity" title="Recent bookings" />
            <div className="adash-card adash-table-card">
              <div className="adash-table-wrap">
                <table className="adash-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer</th>
                      <th>Provider</th>
                      <th>Service</th>
                      <th>Booking date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.length === 0 ? (
                      <EmptyRow colSpan={7} label="No bookings yet." />
                    ) : (
                      recentBookings.map((b) => (
                        <tr key={b.id}>
                          <td>{b.bookingId || b.id}</td>
                          <td>{b.customerName || '—'}</td>
                          <td>{b.providerName || '—'}</td>
                          <td>{b.serviceTitle || '—'}</td>
                          <td>{fmtDate(b.bookingDate)}</td>
                          <td>{formatLKR(b.amount)}</td>
                          <td>
                            <span
                              className={`adash-badge badge-${(b.status || '').toLowerCase()}`}
                            >
                              {b.status || 'UNKNOWN'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ---------- Customers ---------- */}
            <SectionHeading eyebrow="People" title="Customers" />
            <div className="adash-card adash-table-card">
              <div className="adash-card-title">
                <h2>All customers</h2>
                <span className="adash-count-pill">{customers.length}</span>
              </div>
              <div className="adash-table-wrap">
                <table className="adash-table">
                  <thead>
                    <tr>
                      <th>Customer ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Location</th>
                      <th>Joined date</th>
                      <th>Bookings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.length === 0 ? (
                      <EmptyRow colSpan={7} label="No customers yet." />
                    ) : (
                      customers.map((c) => (
                        <tr key={c.id}>
                          <td>{c.id}</td>
                          <td>
                            <div className="adash-name-cell">
                              {c.avatarUrl ? (
                                <img
                                   src={c.avatarUrl}
                                   onError={(e)=>{
                                      e.target.style.display="none";
                                   }} alt="" className="adash-avatar-sm" />
                              ) : (
                                <span className="adash-avatar-sm adash-avatar-empty">
                                  <i className="ti ti-user" aria-hidden="true"></i>
                                </span>
                              )}
                              <strong>{c.name}</strong>
                            </div>
                          </td>
                          <td>{c.email}</td>
                          <td>{c.phone || '—'}</td>
                          <td>{c.location || '—'}</td>
                          <td>{fmtDate(c.joinedDate)}</td>
                          <td>{c.totalBookings ?? 0}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ---------- Providers ---------- */}
            <SectionHeading eyebrow="People" title="Providers" />
            <div className="adash-card adash-table-card">
              <div className="adash-card-title">
                <h2>All providers</h2>
                <span className="adash-count-pill">{providers.length}</span>
              </div>
              <div className="adash-table-wrap">
                <table className="adash-table">
                  <thead>
                    <tr>
                      <th>Provider ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Primary service</th>
                      <th>Verified</th>
                      <th>Skills</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.length === 0 ? (
                      <EmptyRow colSpan={7} label="No providers yet." />
                    ) : (
                      providers.map((p) => (
                        <tr key={p.id}>
                          <td>{p.id}</td>
                          <td>
                            <div className="adash-name-cell">
                              {p.avatarUrl ? (
                                <img src={p.avatarUrl} alt="" className="adash-avatar-sm" />
                              ) : (
                                <span className="adash-avatar-sm adash-avatar-empty">
                                  <i className="ti ti-user" aria-hidden="true"></i>
                                </span>
                              )}
                              <strong>{p.name}</strong>
                            </div>
                          </td>
                          <td>{p.email}</td>
                          <td>{p.phone || '—'}</td>
                          <td>{p.service || '—'}</td>
                          <td>
                            <span className={`adash-badge ${p.verified ? 'badge-completed' : 'badge-pending'}`}>
                              {p.verified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="adash-skills-cell">
                            {p.skills && p.skills.length > 0 ? (
                              p.skills.map((s) => (
                                <span key={s} className="adash-chip">
                                  {s}
                                </span>
                              ))
                            ) : (
                              '—'
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ---------- Services ---------- */}
            <SectionHeading eyebrow="Catalog" title="Services" />
            <div className="adash-card adash-table-card">
              <div className="adash-card-title">
                <h2>All services</h2>
                <span className="adash-count-pill">{services.length}</span>
              </div>
              <div className="adash-table-wrap">
                <table className="adash-table">
                  <thead>
                    <tr>
                      <th>Service ID</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.length === 0 ? (
                      <EmptyRow colSpan={4} label="No services yet." />
                    ) : (
                      services.map((s) => (
                        <tr key={s.id}>
                          <td>{s.id}</td>
                          <td>
                            <strong>{s.title}</strong>
                          </td>
                          <td>{s.category}</td>
                          <td className="adash-comment">{s.desc}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
