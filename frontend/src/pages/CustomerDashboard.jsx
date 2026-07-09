import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getMyBookings, cancelBooking } from '../services/bookingService';
import './Dashboard.css';

const DEMO_BOOKINGS = [
  { id: 'WK-10245', service: 'AC servicing', provider: 'Roshan Jayasuriya', date: '2026-07-14', status: 'PENDING', amount: 3500 },
  { id: 'WK-10234', service: 'Electrical wiring repair', provider: 'Nimal Perera', date: '2026-06-28', status: 'COMPLETED', amount: 4500 },
  { id: 'WK-10198', service: 'Deep house cleaning', provider: 'CleanPro Services', date: '2026-06-15', status: 'COMPLETED', amount: 3200 },
  { id: 'WK-10176', service: 'Plumbing - leak fix', provider: 'Sunil Fernando', date: '2026-06-02', status: 'CANCELLED', amount: 0 },
];

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getMyBookings();
      setBookings(res.data);
      setUsingDemo(false);
    } catch {
      // Backend not reachable / endpoint not implemented yet — fall back to demo data
      setBookings(DEMO_BOOKINGS);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    setBusyId(id);
    try {
      await cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'CANCELLED' } : b))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel booking. Try again.');
    } finally {
      setBusyId(null);
    }
  };

  const active = bookings.filter((b) => b.status === 'PENDING' || b.status === 'ACCEPTED');
  const completed = bookings.filter((b) => b.status === 'COMPLETED');
  const totalSpent = completed.reduce((sum, b) => sum + (b.amount || 0), 0);

  return (
    <div className="dash-page">
      <Navbar />

      <div className="dash-header">
        <span className="dash-eyebrow">Customer dashboard</span>
        <h1>Welcome back</h1>
        <p>Track your bookings and manage your service requests.</p>
      </div>

      <div className="dash-body">
        {usingDemo && (
          <div className="dash-notice">
            <i className="ti ti-info-circle" aria-hidden="true"></i>
            Showing demo data — connect the bookings API to see your real activity.
          </div>
        )}

        <div className="dash-stats">
          <div className="dash-stat-card">
            <div className="dash-stat-icon"><i className="ti ti-clock" aria-hidden="true"></i></div>
            <div><strong>{active.length}</strong><span>Active bookings</span></div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon"><i className="ti ti-circle-check" aria-hidden="true"></i></div>
            <div><strong>{completed.length}</strong><span>Completed jobs</span></div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon"><i className="ti ti-cash" aria-hidden="true"></i></div>
            <div><strong>Rs. {totalSpent.toLocaleString()}</strong><span>Total spent</span></div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon"><i className="ti ti-tools" aria-hidden="true"></i></div>
            <div>
              <Link to="/providers" className="dash-btn dash-btn-solid" style={{ marginTop: 4 }}>
                Find a provider
              </Link>
            </div>
          </div>
        </div>

        <div className="dash-section">
          <div className="dash-section-title">
            <h2>Your bookings</h2>
            <Link to="/history" className="dash-btn dash-btn-ghost">
              <i className="ti ti-history" aria-hidden="true"></i> Full history
            </Link>
          </div>

          {loading ? (
            <div className="dash-empty">Loading your bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="dash-empty">
              <i className="ti ti-calendar-off" aria-hidden="true"></i>
              <p>No bookings yet — browse providers to get started.</p>
            </div>
          ) : (
            <div className="dash-list">
              {bookings.map((b) => (
                <div className="dash-row" key={b.id}>
                  <div className="dash-row-main">
                    <div className="dash-row-icon"><i className="ti ti-clipboard-list" aria-hidden="true"></i></div>
                    <div>
                      <h4>{b.service}</h4>
                      <p>{b.provider} · {new Date(b.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="dash-row-actions">
                    <span className={`dash-badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                    {(b.status === 'PENDING' || b.status === 'ACCEPTED') && (
                      <button
                        className="dash-btn dash-btn-danger"
                        onClick={() => handleCancel(b.id)}
                        disabled={busyId === b.id}
                      >
                        <i className="ti ti-x" aria-hidden="true"></i>
                        {busyId === b.id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
