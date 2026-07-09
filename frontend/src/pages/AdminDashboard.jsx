import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getAllUsers, verifyProvider, deleteUser } from '../services/userService';
import { getAllBookings, deleteBooking } from '../services/bookingService';
import './Dashboard.css';

const DEMO_USERS = [
  { id: 'u1', name: 'Sathira Sugeesvara', email: 'sathira@example.com', role: 'CUSTOMER', verified: true },
  { id: 'u2', name: 'Nimal Perera', email: 'nimal.perera@example.com', role: 'PROVIDER', verified: true },
  { id: 'u3', name: 'Kasun Bandara', email: 'kasun.bandara@example.com', role: 'PROVIDER', verified: false },
  { id: 'u4', name: 'Amaya Wickrama', email: 'amaya.w@example.com', role: 'CUSTOMER', verified: true },
];

const DEMO_BOOKINGS = [
  { id: 'WK-10301', service: 'Switchboard repair', customer: 'Amaya Wickrama', provider: 'Nimal Perera', date: '2026-07-11', status: 'PENDING', amount: 2800 },
  { id: 'WK-10255', service: 'Lighting installation', customer: 'Ishara Bandara', provider: 'Kasun Bandara', date: '2026-06-30', status: 'COMPLETED', amount: 3100 },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [usersRes, bookingsRes] = await Promise.all([getAllUsers(), getAllBookings()]);
      setUsers(usersRes.data);
      setBookings(bookingsRes.data);
      setUsingDemo(false);
    } catch {
      setUsers(DEMO_USERS);
      setBookings(DEMO_BOOKINGS);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleVerify = async (id) => {
    setBusyId(id);
    try {
      await verifyProvider(id);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, verified: true } : u)));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not verify provider.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Remove this user? This cannot be undone.')) return;
    setBusyId(id);
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not remove user.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Remove this booking record?')) return;
    setBusyId(id);
    try {
      await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not remove booking.');
    } finally {
      setBusyId(null);
    }
  };

  const customers = users.filter((u) => u.role === 'CUSTOMER');
  const providers = users.filter((u) => u.role === 'PROVIDER');
  const pendingVerification = providers.filter((p) => !p.verified);

  return (
    <div className="dash-page">
      <Navbar />

      <div className="dash-header">
        <span className="dash-eyebrow">Admin dashboard</span>
        <h1>Platform overview</h1>
        <p>Manage users, providers, and bookings across Workly.</p>
      </div>

      <div className="dash-body">
        {usingDemo && (
          <div className="dash-notice">
            <i className="ti ti-info-circle" aria-hidden="true"></i>
            Showing demo data — connect the admin API to manage real users and bookings.
          </div>
        )}

        <div className="dash-stats">
          <div className="dash-stat-card">
            <div className="dash-stat-icon"><i className="ti ti-users" aria-hidden="true"></i></div>
            <div><strong>{customers.length}</strong><span>Customers</span></div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon"><i className="ti ti-tool" aria-hidden="true"></i></div>
            <div><strong>{providers.length}</strong><span>Providers</span></div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon"><i className="ti ti-shield-exclamation" aria-hidden="true"></i></div>
            <div><strong>{pendingVerification.length}</strong><span>Pending verification</span></div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon"><i className="ti ti-clipboard-list" aria-hidden="true"></i></div>
            <div><strong>{bookings.length}</strong><span>Total bookings</span></div>
          </div>
        </div>

        <div className="dash-section">
          <div className="dash-section-title">
            <h2>Manage</h2>
            <div className="dash-tabs">
              <button className={`dash-tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>Users</button>
              <button className={`dash-tab ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>Bookings</button>
            </div>
          </div>

          {loading ? (
            <div className="dash-empty">Loading...</div>
          ) : tab === 'users' ? (
            users.length === 0 ? (
              <div className="dash-empty">
                <i className="ti ti-users" aria-hidden="true"></i>
                <p>No users found.</p>
              </div>
            ) : (
              <div className="dash-list">
                {users.map((u) => (
                  <div className="dash-row" key={u.id}>
                    <div className="dash-row-main">
                      <div className="dash-row-icon">
                        <i className={`ti ${u.role === 'PROVIDER' ? 'ti-tool' : 'ti-user'}`} aria-hidden="true"></i>
                      </div>
                      <div>
                        <h4>{u.name}</h4>
                        <p>{u.email} · {u.role}</p>
                      </div>
                    </div>
                    <div className="dash-row-actions">
                      {u.role === 'PROVIDER' && (
                        <span className={`dash-badge ${u.verified ? 'badge-verified' : 'badge-unverified'}`}>
                          {u.verified ? 'Verified' : 'Unverified'}
                        </span>
                      )}
                      {u.role === 'PROVIDER' && !u.verified && (
                        <button
                          className="dash-btn dash-btn-solid"
                          disabled={busyId === u.id}
                          onClick={() => handleVerify(u.id)}
                        >
                          <i className="ti ti-shield-check" aria-hidden="true"></i>
                          {busyId === u.id ? 'Working...' : 'Verify'}
                        </button>
                      )}
                      <button
                        className="dash-btn dash-btn-danger"
                        disabled={busyId === u.id}
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        <i className="ti ti-trash" aria-hidden="true"></i> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : bookings.length === 0 ? (
            <div className="dash-empty">
              <i className="ti ti-clipboard-off" aria-hidden="true"></i>
              <p>No bookings found.</p>
            </div>
          ) : (
            <div className="dash-list">
              {bookings.map((b) => (
                <div className="dash-row" key={b.id}>
                  <div className="dash-row-main">
                    <div className="dash-row-icon"><i className="ti ti-clipboard-list" aria-hidden="true"></i></div>
                    <div>
                      <h4>{b.service}</h4>
                      <p>{b.customer} → {b.provider} · {new Date(b.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="dash-row-actions">
                    <span className={`dash-badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                    <button
                      className="dash-btn dash-btn-danger"
                      disabled={busyId === b.id}
                      onClick={() => handleDeleteBooking(b.id)}
                    >
                      <i className="ti ti-trash" aria-hidden="true"></i> Remove
                    </button>
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
