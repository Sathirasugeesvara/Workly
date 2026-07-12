import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getProviderJobs, acceptBooking, rejectBooking } from '../services/bookingService';
import './ProviderBookingRequests.css';

const DEMO_REQUESTS = [
  { id: 'WK-10412', service: 'Switchboard repair', customer: 'Amaya Wickrama', location: 'Colombo 5', date: '2026-07-14', time: '10:00 AM', status: 'PENDING', amount: 2800, notes: 'One switchboard sparking intermittently in the kitchen.' },
  { id: 'WK-10409', service: 'Inverter installation', customer: 'Ruwan Silva', location: 'Malabe', date: '2026-07-15', time: '2:00 PM', status: 'PENDING', amount: 6200, notes: 'New 5kVA inverter, needs full wiring setup.' },
  { id: 'WK-10398', service: 'Lighting installation', customer: 'Ishara Bandara', location: 'Nugegoda', date: '2026-07-16', time: '9:30 AM', status: 'PENDING', amount: 3100, notes: 'Ceiling lights for 3 rooms, fittings already purchased.' },
];

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function ProviderBookingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getProviderJobs();
      const data = Array.isArray(res.data) ? res.data.filter((j) => j.status === 'PENDING') : res.data;
      setRequests(data);
      setUsingDemo(false);
    } catch {
      setRequests(DEMO_REQUESTS);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAccept = async (id) => {
    setBusyId(id);
    try {
      await acceptBooking(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not accept this request.');
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this booking request?')) return;
    setBusyId(id);
    try {
      await rejectBooking(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not reject this request.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="pbr-page">
      <Navbar />

      <div className="pbr-header">
        <span className="pbr-eyebrow">Provider · Requests</span>
        <h1>Booking requests</h1>
        <p>Review incoming job requests and accept or decline them.</p>
      </div>

      <div className="pbr-body">
        {usingDemo && (
          <div className="pbr-notice">
            <i className="ti ti-info-circle" aria-hidden="true"></i>
            Showing demo data — connect the bookings API to see real requests.
          </div>
        )}

        {loading ? (
          <div className="pbr-empty">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="pbr-empty">
            <i className="ti ti-circle-check" aria-hidden="true"></i>
            <p>No pending requests right now.</p>
          </div>
        ) : (
          <div className="pbr-list">
            {requests.map((r) => (
              <div className="pbr-card" key={r.id}>
                <div className="pbr-card-top">
                  <div>
                    <h3>{r.service}</h3>
                    <p>{r.customer}{r.location ? ` · ${r.location}` : ''}</p>
                  </div>
                  <span className="pbr-amount">Rs. {Number(r.amount || 0).toLocaleString()}</span>
                </div>

                <div className="pbr-card-meta">
                  <div>
                    <span>Date</span>
                    <strong>{fmtDate(r.date)}</strong>
                  </div>
                  {r.time && (
                    <div>
                      <span>Time</span>
                      <strong>{r.time}</strong>
                    </div>
                  )}
                  <div>
                    <span>Booking ID</span>
                    <strong>{r.id}</strong>
                  </div>
                </div>

                {r.notes && <p className="pbr-notes">"{r.notes}"</p>}

                <div className="pbr-actions">
                  <button
                    className="pbr-btn pbr-btn-danger"
                    disabled={busyId === r.id}
                    onClick={() => handleReject(r.id)}
                  >
                    <i className="ti ti-x" aria-hidden="true"></i> Reject
                  </button>
                  <button
                    className="pbr-btn pbr-btn-solid"
                    disabled={busyId === r.id}
                    onClick={() => handleAccept(r.id)}
                  >
                    <i className="ti ti-check" aria-hidden="true"></i>
                    {busyId === r.id ? 'Working...' : 'Accept'}
                  </button>
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
