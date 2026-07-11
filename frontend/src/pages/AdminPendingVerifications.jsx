import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getPendingProviders, approveProvider, rejectProvider } from '../services/adminManageService';
import './AdminPendingVerifications.css';

const DEMO_PENDING = [
  {
    id: 'p101',
    name: 'Kasun Bandara',
    email: 'kasun.bandara@example.com',
    phone: '077 214 5590',
    service: 'Electrical',
    location: 'Kandy',
    appliedDate: '2026-07-08',
    experience: '5 years',
    skills: ['Wiring', 'Switchboard repair', 'Inverter installation'],
    documentsSubmitted: 3,
  },
  {
    id: 'p102',
    name: 'Ruwan Silva',
    email: 'ruwan.silva@example.com',
    phone: '071 883 2210',
    service: 'Plumbing',
    location: 'Colombo',
    appliedDate: '2026-07-09',
    experience: '3 years',
    skills: ['Pipe fitting', 'Leak repair'],
    documentsSubmitted: 2,
  },
  {
    id: 'p103',
    name: 'Ishara Fonseka',
    email: 'ishara.fonseka@example.com',
    phone: '076 442 1187',
    service: 'Painting',
    location: 'Galle',
    appliedDate: '2026-07-10',
    experience: '7 years',
    skills: ['Interior painting', 'Exterior coating', 'Wall texturing'],
    documentsSubmitted: 4,
  },
];

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function AdminPendingVerifications() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getPendingProviders();
      setRequests(res.data);
      setUsingDemo(false);
    } catch {
      setRequests(DEMO_PENDING);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (id) => {
    setBusyId(id);
    try {
      await approveProvider(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not approve this provider.');
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this verification request?')) return;
    setBusyId(id);
    try {
      await rejectProvider(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not reject this provider.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="apv-page">
      <Navbar />

      <div className="apv-header">
        <span className="apv-eyebrow">Admin · Verification</span>
        <h1>Pending verifications</h1>
        <p>Review provider applications and approve or decline access to the platform.</p>
      </div>

      <div className="apv-body">
        {usingDemo && (
          <div className="apv-notice">
            <i className="ti ti-info-circle" aria-hidden="true"></i>
            Showing demo data — connect the provider verification API to review real applications.
          </div>
        )}

        {loading ? (
          <div className="apv-empty">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="apv-empty">
            <i className="ti ti-circle-check" aria-hidden="true"></i>
            <p>No pending verification requests right now.</p>
          </div>
        ) : (
          <div className="apv-list">
            {requests.map((r) => (
              <div className="apv-card" key={r.id}>
                <div className="apv-card-top">
                  <div className="apv-avatar">{r.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}</div>
                  <div className="apv-card-main">
                    <h3>{r.name}</h3>
                    <p>{r.email} · {r.phone}</p>
                  </div>
                  <span className="apv-badge">{r.service}</span>
                </div>

                <div className="apv-card-meta">
                  <div>
                    <span>Location</span>
                    <strong>{r.location}</strong>
                  </div>
                  <div>
                    <span>Experience</span>
                    <strong>{r.experience}</strong>
                  </div>
                  <div>
                    <span>Applied</span>
                    <strong>{fmtDate(r.appliedDate)}</strong>
                  </div>
                  <div>
                    <span>Documents</span>
                    <strong>{r.documentsSubmitted} submitted</strong>
                  </div>
                </div>

                {r.skills?.length > 0 && (
                  <div className="apv-skills">
                    {r.skills.map((s) => (
                      <span className="apv-skill-chip" key={s}>{s}</span>
                    ))}
                  </div>
                )}

                <div className="apv-actions">
                  <button
                    className="apv-btn apv-btn-danger"
                    disabled={busyId === r.id}
                    onClick={() => handleReject(r.id)}
                  >
                    <i className="ti ti-x" aria-hidden="true"></i> Decline
                  </button>
                  <button
                    className="apv-btn apv-btn-solid"
                    disabled={busyId === r.id}
                    onClick={() => handleApprove(r.id)}
                  >
                    <i className="ti ti-check" aria-hidden="true"></i>
                    {busyId === r.id ? 'Working...' : 'Approve'}
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
