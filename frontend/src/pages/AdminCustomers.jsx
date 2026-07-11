import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getAllCustomers, deleteCustomerById } from '../services/adminManageService';
import './AdminCustomers.css';

const DEMO_CUSTOMERS = [
  { id: 'c1', name: 'Amaya Wickrama', email: 'amaya.w@example.com', phone: '077 112 4456', location: 'Colombo', joinedDate: '2025-11-02', totalBookings: 14, avatarUrl: '' },
  { id: 'c2', name: 'Dinesh Kumara', email: 'dinesh.k@example.com', phone: '071 998 2231', location: 'Kandy', joinedDate: '2025-12-18', totalBookings: 6, avatarUrl: '' },
  { id: 'c3', name: 'Ishara Bandara', email: 'ishara.b@example.com', phone: '076 554 7789', location: 'Galle', joinedDate: '2026-01-09', totalBookings: 22, avatarUrl: '' },
  { id: 'c4', name: 'Sanduni Perera', email: 'sanduni.p@example.com', phone: '070 221 6690', location: 'Negombo', joinedDate: '2026-02-27', totalBookings: 3, avatarUrl: '' },
  { id: 'c5', name: 'Tharindu Rathnayake', email: 'tharindu.r@example.com', phone: '075 336 1120', location: 'Colombo', joinedDate: '2026-03-14', totalBookings: 9, avatarUrl: '' },
];

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const initialsOf = (name) => name.split(' ').map((n) => n[0]).slice(0, 2).join('');

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [search, setSearch] = useState('');
  const [viewing, setViewing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllCustomers();
      setCustomers(res.data);
      setUsingDemo(false);
    } catch {
      setCustomers(DEMO_CUSTOMERS);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this customer? This cannot be undone.')) return;
    setBusyId(id);
    try {
      await deleteCustomerById(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      if (viewing?.id === id) setViewing(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not remove this customer.');
    } finally {
      setBusyId(null);
    }
  };

  const filtered = customers.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  return (
    <div className="acust-page">
      <Navbar />

      <div className="acust-header">
        <span className="acust-eyebrow">Admin · Customers</span>
        <h1>Customers</h1>
        <p>View customer profiles and manage accounts on the platform.</p>
      </div>

      <div className="acust-body">
        {usingDemo && (
          <div className="acust-notice">
            <i className="ti ti-info-circle" aria-hidden="true"></i>
            Showing demo data — connect the admin customers API to manage real accounts.
          </div>
        )}

        <div className="acust-toolbar">
          <div className="acust-search">
            <i className="ti ti-search" aria-hidden="true"></i>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="acust-count">{filtered.length} customer{filtered.length === 1 ? '' : 's'}</span>
        </div>

        {loading ? (
          <div className="acust-empty">Loading customers...</div>
        ) : filtered.length === 0 ? (
          <div className="acust-empty">
            <i className="ti ti-users" aria-hidden="true"></i>
            <p>No customers found.</p>
          </div>
        ) : (
          <div className="acust-list">
            {filtered.map((c) => (
              <div className="acust-row" key={c.id}>
                <div className="acust-row-main">
                  {c.avatarUrl ? (
                    <img src={c.avatarUrl} alt={c.name} className="acust-avatar-img" />
                  ) : (
                    <div className="acust-avatar">{initialsOf(c.name)}</div>
                  )}
                  <div>
                    <h4>{c.name}</h4>
                    <p>{c.email} · {c.location}</p>
                  </div>
                </div>
                <div className="acust-row-stats">
                  <span>{c.totalBookings} bookings</span>
                  <span>Joined {fmtDate(c.joinedDate)}</span>
                </div>
                <div className="acust-row-actions">
                  <button className="acust-btn acust-btn-ghost" onClick={() => setViewing(c)}>
                    <i className="ti ti-eye" aria-hidden="true"></i> View
                  </button>
                  <button
                    className="acust-btn acust-btn-danger"
                    disabled={busyId === c.id}
                    onClick={() => handleDelete(c.id)}
                  >
                    <i className="ti ti-trash" aria-hidden="true"></i>
                    {busyId === c.id ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {viewing && (
        <div className="acust-modal-overlay" onClick={() => setViewing(null)}>
          <div className="acust-modal" onClick={(e) => e.stopPropagation()}>
            <button className="acust-modal-close" onClick={() => setViewing(null)} aria-label="Close">
              <i className="ti ti-x" aria-hidden="true"></i>
            </button>

            {viewing.avatarUrl ? (
              <img src={viewing.avatarUrl} alt={viewing.name} className="acust-modal-avatar-img" />
            ) : (
              <div className="acust-modal-avatar">{initialsOf(viewing.name)}</div>
            )}

            <h2>{viewing.name}</h2>
            <p className="acust-modal-sub">Customer since {fmtDate(viewing.joinedDate)}</p>

            <div className="acust-modal-grid">
              <div>
                <span>Email</span>
                <strong>{viewing.email}</strong>
              </div>
              <div>
                <span>Phone</span>
                <strong>{viewing.phone}</strong>
              </div>
              <div>
                <span>Location</span>
                <strong>{viewing.location}</strong>
              </div>
              <div>
                <span>Total bookings</span>
                <strong>{viewing.totalBookings}</strong>
              </div>
            </div>

            <div className="acust-modal-actions">
              <button
                className="acust-btn acust-btn-danger"
                disabled={busyId === viewing.id}
                onClick={() => handleDelete(viewing.id)}
              >
                <i className="ti ti-trash" aria-hidden="true"></i> Remove customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
