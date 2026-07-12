import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getProviderJobs, completeBooking } from '../services/bookingService';
import './BookingHistory.css';

const DEMO_JOBS = [
  { id: 'WK-10255', service: 'Lighting installation', customer: 'Ishara Bandara', date: '2026-06-30', status: 'COMPLETED', amount: 3100 },
  { id: 'WK-10240', service: 'Wiring inspection', customer: 'Dinesh Kumara', date: '2026-06-20', status: 'COMPLETED', amount: 1800 },
  { id: 'WK-10288', service: 'Inverter installation', customer: 'Ruwan Silva', date: '2026-07-09', status: 'ACCEPTED', amount: 6200 },
  { id: 'WK-10199', service: 'Switchboard repair', customer: 'Nadeesha Fonseka', date: '2026-06-08', status: 'COMPLETED', amount: 2800 },
  { id: 'WK-10180', service: 'Ceiling fan installation', customer: 'Tharindu Rathnayake', date: '2026-05-27', status: 'COMPLETED', amount: 2200 },
];

const FILTERS = ['ALL', 'ACCEPTED', 'COMPLETED'];

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function BookingHistory() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getProviderJobs();
      const data = Array.isArray(res.data)
        ? res.data.filter((j) => j.status === 'ACCEPTED' || j.status === 'COMPLETED')
        : res.data;
      setJobs(data);
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

  const handleComplete = async (id) => {
    setBusyId(id);
    try {
      await completeBooking(id);
      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: 'COMPLETED' } : j)));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not mark this job as complete.');
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(
    () => (filter === 'ALL' ? jobs : jobs.filter((j) => j.status === filter)),
    [jobs, filter]
  );

  const totalEarned = useMemo(
    () => jobs.filter((j) => j.status === 'COMPLETED').reduce((sum, j) => sum + (j.amount || 0), 0),
    [jobs]
  );

  const completedCount = jobs.filter((j) => j.status === 'COMPLETED').length;
  const acceptedCount = jobs.filter((j) => j.status === 'ACCEPTED').length;

  return (
    <div className="bhist-page">
      <Navbar />

      <div className="bhist-header">
        <span className="bhist-eyebrow">Provider · History</span>
        <h1>Booking history</h1>
        <p>All accepted and completed jobs, with earnings.</p>
      </div>

      <div className="bhist-body">
        {usingDemo && (
          <div className="bhist-notice">
            <i className="ti ti-info-circle" aria-hidden="true"></i>
            Showing demo data — connect the bookings API to see your real job history.
          </div>
        )}

        <div className="bhist-summary">
          <div className="bhist-summary-card">
            <strong>Rs. {totalEarned.toLocaleString()}</strong>
            <span>Total earned</span>
          </div>
          <div className="bhist-summary-card">
            <strong>{completedCount}</strong>
            <span>Completed jobs</span>
          </div>
          <div className="bhist-summary-card">
            <strong>{acceptedCount}</strong>
            <span>In progress</span>
          </div>
        </div>

        <div className="bhist-tabs">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`bhist-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bhist-empty">Loading your history...</div>
        ) : filtered.length === 0 ? (
          <div className="bhist-empty">
            <i className="ti ti-history" aria-hidden="true"></i>
            <p>Nothing here yet.</p>
          </div>
        ) : (
          <div className="bhist-list">
            {filtered.map((j) => (
              <div className="bhist-row" key={j.id}>
                <div className="bhist-row-main">
                  <div className="bhist-row-icon">
                    <i className="ti ti-clipboard-list" aria-hidden="true"></i>
                  </div>
                  <div>
                    <h4>{j.service}</h4>
                    <p>{j.customer} · {fmtDate(j.date)}</p>
                  </div>
                </div>

                <div className="bhist-row-actions">
                  <span className={`bhist-badge badge-${j.status.toLowerCase()}`}>{j.status}</span>
                  <span className="bhist-row-amount">Rs. {Number(j.amount || 0).toLocaleString()}</span>
                  {j.status === 'ACCEPTED' && (
                    <button
                      className="bhist-btn bhist-btn-solid"
                      disabled={busyId === j.id}
                      onClick={() => handleComplete(j.id)}
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

      <Footer />
    </div>
  );
}
