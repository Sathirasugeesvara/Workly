import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getProviderJobs, acceptBooking, rejectBooking, completeBooking } from '../services/bookingService';
import './Dashboard.css';

const DEMO_JOBS = [
  { id: 'WK-10301', service: 'Switchboard repair', customer: 'Amaya Wickrama', date: '2026-07-11', status: 'PENDING', amount: 2800 },
  { id: 'WK-10288', service: 'Inverter installation', customer: 'Ruwan Silva', date: '2026-07-09', status: 'ACCEPTED', amount: 6200 },
  { id: 'WK-10255', service: 'Lighting installation', customer: 'Ishara Bandara', date: '2026-06-30', status: 'COMPLETED', amount: 3100 },
  { id: 'WK-10240', service: 'Wiring inspection', customer: 'Dinesh Kumara', date: '2026-06-20', status: 'COMPLETED', amount: 1800 },
];

export default function ProviderDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getProviderJobs();
      setJobs(res.data);
      setUsingDemo(false);
    } catch {
      setJobs(DEMO_JOBS);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const runAction = async (id, action, nextStatus) => {
    setBusyId(id);
    try {
      await action(id);
      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: nextStatus } : j)));
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed. Try again.');
    } finally {
      setBusyId(null);
    }
  };

  const pending = jobs.filter((j) => j.status === 'PENDING');
  const active = jobs.filter((j) => j.status === 'ACCEPTED');
  const completed = jobs.filter((j) => j.status === 'COMPLETED');
  const earnings = completed.reduce((sum, j) => sum + (j.amount || 0), 0);

  return (
    <div className="dash-page">
      <Navbar />

      <div className="dash-header">
        <span className="dash-eyebrow">Provider dashboard</span>
        <h1>Your jobs</h1>
        <p>Manage incoming requests and track your completed work.</p>
      </div>

      <div className="dash-body">
        {usingDemo && (
          <div className="dash-notice">
            <i className="ti ti-info-circle" aria-hidden="true"></i>
            Showing demo data — connect the bookings API to see your real jobs.
          </div>
        )}

        <div className="dash-stats">
          <div className="dash-stat-card">
            <div className="dash-stat-icon"><i className="ti ti-bell" aria-hidden="true"></i></div>
            <div><strong>{pending.length}</strong><span>New requests</span></div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon"><i className="ti ti-briefcase" aria-hidden="true"></i></div>
            <div><strong>{active.length}</strong><span>Active jobs</span></div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon"><i className="ti ti-circle-check" aria-hidden="true"></i></div>
            <div><strong>{completed.length}</strong><span>Completed</span></div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon"><i className="ti ti-cash" aria-hidden="true"></i></div>
            <div><strong>Rs. {earnings.toLocaleString()}</strong><span>Total earnings</span></div>
          </div>
        </div>

        {pending.length > 0 && (
          <div className="dash-section">
            <div className="dash-section-title"><h2>New requests</h2></div>
            <div className="dash-list">
              {pending.map((j) => (
                <div className="dash-row" key={j.id}>
                  <div className="dash-row-main">
                    <div className="dash-row-icon"><i className="ti ti-clipboard-list" aria-hidden="true"></i></div>
                    <div>
                      <h4>{j.service}</h4>
                      <p>{j.customer} · {new Date(j.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="dash-row-actions">
                    <button
                      className="dash-btn dash-btn-danger"
                      disabled={busyId === j.id}
                      onClick={() => runAction(j.id, rejectBooking, 'REJECTED')}
                    >
                      <i className="ti ti-x" aria-hidden="true"></i> Reject
                    </button>
                    <button
                      className="dash-btn dash-btn-solid"
                      disabled={busyId === j.id}
                      onClick={() => runAction(j.id, acceptBooking, 'ACCEPTED')}
                    >
                      <i className="ti ti-check" aria-hidden="true"></i>
                      {busyId === j.id ? 'Working...' : 'Accept'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="dash-section">
          <div className="dash-section-title"><h2>All jobs</h2></div>

          {loading ? (
            <div className="dash-empty">Loading your jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="dash-empty">
              <i className="ti ti-briefcase-off" aria-hidden="true"></i>
              <p>No job requests yet.</p>
            </div>
          ) : (
            <div className="dash-list">
              {jobs.map((j) => (
                <div className="dash-row" key={j.id}>
                  <div className="dash-row-main">
                    <div className="dash-row-icon"><i className="ti ti-tools" aria-hidden="true"></i></div>
                    <div>
                      <h4>{j.service}</h4>
                      <p>{j.customer} · {new Date(j.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="dash-row-actions">
                    <span className={`dash-badge badge-${j.status.toLowerCase()}`}>{j.status}</span>
                    {j.status === 'ACCEPTED' && (
                      <button
                        className="dash-btn dash-btn-solid"
                        disabled={busyId === j.id}
                        onClick={() => runAction(j.id, completeBooking, 'COMPLETED')}
                      >
                        <i className="ti ti-check" aria-hidden="true"></i>
                        {busyId === j.id ? 'Working...' : 'Mark complete'}
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
