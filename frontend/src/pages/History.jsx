import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  getMyBookings,
  getProviderJobs,
  cancelBooking,
  acceptBooking,
  rejectBooking,
  completeBooking,
} from '../services/bookingService';
import './History.css';

const DEMO_CUSTOMER = [
  { id: 'WK-10245', service: 'AC servicing', provider: 'Roshan Jayasuriya', date: '2026-07-14', status: 'PENDING', amount: 3500 },
  { id: 'WK-10234', service: 'Electrical wiring repair', provider: 'Nimal Perera', date: '2026-06-28', status: 'COMPLETED', amount: 4500 },
  { id: 'WK-10198', service: 'Deep house cleaning', provider: 'CleanPro Services', date: '2026-06-15', status: 'COMPLETED', amount: 3200 },
  { id: 'WK-10176', service: 'Plumbing - leak fix', provider: 'Sunil Fernando', date: '2026-06-02', status: 'CANCELLED', amount: 0 },
];

const DEMO_PROVIDER = [
  { id: 'WK-10301', service: 'Switchboard repair', customer: 'Amaya Wickrama', date: '2026-07-11', status: 'PENDING', amount: 2800 },
  { id: 'WK-10288', service: 'Inverter installation', customer: 'Ruwan Silva', date: '2026-07-09', status: 'ACCEPTED', amount: 6200 },
  { id: 'WK-10255', service: 'Lighting installation', customer: 'Ishara Bandara', date: '2026-06-30', status: 'COMPLETED', amount: 3100 },
  { id: 'WK-10240', service: 'Wiring inspection', customer: 'Dinesh Kumara', date: '2026-06-20', status: 'REJECTED', amount: 0 },
];

const FILTERS = ['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED', 'REJECTED'];

export default function History() {
  const role = (localStorage.getItem('role') || 'customer').toLowerCase();
  const isProvider = role === 'provider';

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = isProvider ? await getProviderJobs() : await getMyBookings();
      setEntries(res.data);
      setUsingDemo(false);
    } catch {
      setEntries(isProvider ? DEMO_PROVIDER : DEMO_CUSTOMER);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProvider]);

  const runAction = async (id, action, nextStatus) => {
    setBusyId(id);
    try {
      await action(id);
      setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: nextStatus } : e)));
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed. Try again.');
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(
    () => (filter === 'ALL' ? entries : entries.filter((e) => e.status === filter)),
    [entries, filter]
  );

  return (
    <>
      <Navbar />

      <div className="history-page">
        <div className="history-header">
          <span className="history-eyebrow">Your activity</span>
          <h1>{isProvider ? 'Job history' : 'Booking history'}</h1>
          <p>
            {isProvider
              ? 'All service requests assigned to you, past and present.'
              : 'All your past and ongoing service requests in one place.'}
          </p>
        </div>

        <div className="history-content">
          {usingDemo && (
            <div className="dash-notice">
              <i className="ti ti-info-circle" aria-hidden="true"></i>
              Showing demo data — connect the bookings API to see real activity.
            </div>
          )}

          <div className="dash-tabs history-filter-tabs">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`dash-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="dash-empty">Loading your history...</div>
          ) : filtered.length === 0 ? (
            <div className="dash-empty">
              <i className="ti ti-history" aria-hidden="true"></i>
              <p>Nothing here yet.</p>
            </div>
          ) : (
            <div className="dash-list">
              {filtered.map((entry) => (
                <div key={entry.id} className="dash-row">
                  <div className="dash-row-main">
                    <div className="dash-row-icon">
                      <i className="ti ti-clipboard-list" aria-hidden="true"></i>
                    </div>
                    <div>
                      <h4>{entry.service}</h4>
                      <p>
                        {isProvider ? entry.customer : entry.provider} ·{' '}
                        {new Date(entry.date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                        {entry.amount > 0 && ` · Rs. ${entry.amount.toLocaleString()}`}
                      </p>
                    </div>
                  </div>

                  <div className="dash-row-actions">
                    <span className={`dash-badge badge-${entry.status.toLowerCase()}`}>{entry.status}</span>

                    {!isProvider && (entry.status === 'PENDING' || entry.status === 'ACCEPTED') && (
                      <button
                        className="dash-btn dash-btn-danger"
                        disabled={busyId === entry.id}
                        onClick={() => runAction(entry.id, cancelBooking, 'CANCELLED')}
                      >
                        <i className="ti ti-x" aria-hidden="true"></i>
                        {busyId === entry.id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}

                    {isProvider && entry.status === 'PENDING' && (
                      <>
                        <button
                          className="dash-btn dash-btn-danger"
                          disabled={busyId === entry.id}
                          onClick={() => runAction(entry.id, rejectBooking, 'REJECTED')}
                        >
                          <i className="ti ti-x" aria-hidden="true"></i> Reject
                        </button>
                        <button
                          className="dash-btn dash-btn-solid"
                          disabled={busyId === entry.id}
                          onClick={() => runAction(entry.id, acceptBooking, 'ACCEPTED')}
                        >
                          <i className="ti ti-check" aria-hidden="true"></i>
                          {busyId === entry.id ? 'Working...' : 'Accept'}
                        </button>
                      </>
                    )}

                    {isProvider && entry.status === 'ACCEPTED' && (
                      <button
                        className="dash-btn dash-btn-solid"
                        disabled={busyId === entry.id}
                        onClick={() => runAction(entry.id, completeBooking, 'COMPLETED')}
                      >
                        <i className="ti ti-check" aria-hidden="true"></i>
                        {busyId === entry.id ? 'Working...' : 'Mark complete'}
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
    </>
  );
}
