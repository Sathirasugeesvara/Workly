import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  getAllProviders,
  deleteProviderById,
  demoteProvider,
  updateProviderSkills,
} from '../services/adminManageService';
import './AdminProviders.css';

const DEMO_PROVIDERS = [
  { id: 'p1', name: 'Nimal Perera', email: 'nimal.perera@example.com', phone: '077 512 3390', service: 'Electrical', location: 'Kandy', rating: 4.9, jobsDone: 480, verified: true, joinedDate: '2025-09-12', skills: ['Wiring', 'Switchboard repair', 'Inverter installation'], avatarUrl: '' },
  { id: 'p2', name: 'Kasun Bandara', email: 'kasun.bandara@example.com', phone: '071 224 8821', service: 'Carpentry', location: 'Colombo', rating: 4.7, jobsDone: 96, verified: false, joinedDate: '2026-05-30', skills: ['Furniture assembly', 'Custom fittings'], avatarUrl: '' },
  { id: 'p3', name: 'CleanPro Services', email: 'contact@cleanpro.example.com', phone: '076 990 1145', service: 'Cleaning', location: 'Colombo', rating: 4.8, jobsDone: 612, verified: true, joinedDate: '2025-06-04', skills: ['Deep cleaning', 'Move-in/move-out cleaning'], avatarUrl: '' },
  { id: 'p4', name: 'Sunil Fernando', email: 'sunil.fernando@example.com', phone: '070 445 3312', service: 'Plumbing', location: 'Negombo', rating: 4.5, jobsDone: 210, verified: true, joinedDate: '2025-10-21', skills: ['Leak repair', 'Pipe fitting'], avatarUrl: '' },
  { id: 'p5', name: 'ColorCraft Painters', email: 'hello@colorcraft.example.com', phone: '075 662 8801', service: 'Painting', location: 'Galle', rating: 4.8, jobsDone: 154, verified: true, joinedDate: '2025-12-02', skills: ['Interior painting', 'Exterior coating', 'Wall texturing'], avatarUrl: '' },
];

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const initialsOf = (name) => name.split(' ').map((n) => n[0]).slice(0, 2).join('');

export default function AdminProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | verified | unverified

  const [viewing, setViewing] = useState(null);
  const [editingSkills, setEditingSkills] = useState(false);
  const [skillsDraft, setSkillsDraft] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [savingSkills, setSavingSkills] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllProviders();
      setProviders(res.data);
      setUsingDemo(false);
    } catch {
      setProviders(DEMO_PROVIDERS);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this provider? This cannot be undone.')) return;
    setBusyId(id);
    try {
      await deleteProviderById(id);
      setProviders((prev) => prev.filter((p) => p.id !== id));
      if (viewing?.id === id) setViewing(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not remove this provider.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDemote = async (id) => {
    if (!window.confirm('Demote this provider back to unverified?')) return;
    setBusyId(id);
    try {
      await demoteProvider(id);
      setProviders((prev) => prev.map((p) => (p.id === id ? { ...p, verified: false } : p)));
      setViewing((v) => (v && v.id === id ? { ...v, verified: false } : v));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not demote this provider.');
    } finally {
      setBusyId(null);
    }
  };

  const openView = (p) => {
    setViewing(p);
    setEditingSkills(false);
    setSkillsDraft(p.skills || []);
    setSkillInput('');
  };

  const addSkill = () => {
    const val = skillInput.trim();
    if (val && !skillsDraft.includes(val)) {
      setSkillsDraft((prev) => [...prev, val]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setSkillsDraft((prev) => prev.filter((s) => s !== skill));
  };

  const saveSkills = async () => {
    setSavingSkills(true);
    try {
      await updateProviderSkills(viewing.id, skillsDraft);
      setProviders((prev) =>
        prev.map((p) => (p.id === viewing.id ? { ...p, skills: skillsDraft } : p))
      );
      setViewing((v) => ({ ...v, skills: skillsDraft }));
      setEditingSkills(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update skills.');
    } finally {
      setSavingSkills(false);
    }
  };

  const filtered = providers.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.service.toLowerCase().includes(q);
    const matchesFilter =
      filter === 'all' || (filter === 'verified' ? p.verified : !p.verified);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="aprov-page">
      <Navbar />

      <div className="aprov-header">
        <span className="aprov-eyebrow">Admin · Providers</span>
        <h1>Providers</h1>
        <p>View provider profiles, manage verification status, and edit skills.</p>
      </div>

      <div className="aprov-body">
        {usingDemo && (
          <div className="aprov-notice">
            <i className="ti ti-info-circle" aria-hidden="true"></i>
            Showing demo data — connect the admin providers API to manage real accounts.
          </div>
        )}

        <div className="aprov-toolbar">
          <div className="aprov-search">
            <i className="ti ti-search" aria-hidden="true"></i>
            <input
              type="text"
              placeholder="Search by name or service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="aprov-filters">
            <button className={`aprov-filter ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
            <button className={`aprov-filter ${filter === 'verified' ? 'active' : ''}`} onClick={() => setFilter('verified')}>Verified</button>
            <button className={`aprov-filter ${filter === 'unverified' ? 'active' : ''}`} onClick={() => setFilter('unverified')}>Unverified</button>
          </div>
        </div>

        {loading ? (
          <div className="aprov-empty">Loading providers...</div>
        ) : filtered.length === 0 ? (
          <div className="aprov-empty">
            <i className="ti ti-tool" aria-hidden="true"></i>
            <p>No providers found.</p>
          </div>
        ) : (
          <div className="aprov-list">
            {filtered.map((p) => (
              <div className="aprov-row" key={p.id}>
                <div className="aprov-row-main">
                  {p.avatarUrl ? (
                    <img src={p.avatarUrl} alt={p.name} className="aprov-avatar-img" />
                  ) : (
                    <div className="aprov-avatar">{initialsOf(p.name)}</div>
                  )}
                  <div>
                    <h4>{p.name}</h4>
                    <p>{p.service} · {p.location}</p>
                  </div>
                </div>
                <div className="aprov-row-stats">
                  <span className={`aprov-badge ${p.verified ? 'badge-verified' : 'badge-unverified'}`}>
                    {p.verified ? 'Verified' : 'Unverified'}
                  </span>
                  <span className="aprov-rating"><i className="ti ti-star-filled" aria-hidden="true"></i> {p.rating}</span>
                </div>
                <div className="aprov-row-actions">
                  <button className="aprov-btn aprov-btn-ghost" onClick={() => openView(p)}>
                    <i className="ti ti-eye" aria-hidden="true"></i> View
                  </button>
                  {p.verified && (
                    <button
                      className="aprov-btn aprov-btn-warn"
                      disabled={busyId === p.id}
                      onClick={() => handleDemote(p.id)}
                    >
                      <i className="ti ti-arrow-down" aria-hidden="true"></i> Demote
                    </button>
                  )}
                  <button
                    className="aprov-btn aprov-btn-danger"
                    disabled={busyId === p.id}
                    onClick={() => handleDelete(p.id)}
                  >
                    <i className="ti ti-trash" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {viewing && (
        <div className="aprov-modal-overlay" onClick={() => setViewing(null)}>
          <div className="aprov-modal" onClick={(e) => e.stopPropagation()}>
            <button className="aprov-modal-close" onClick={() => setViewing(null)} aria-label="Close">
              <i className="ti ti-x" aria-hidden="true"></i>
            </button>

            {viewing.avatarUrl ? (
              <img src={viewing.avatarUrl} alt={viewing.name} className="aprov-modal-avatar-img" />
            ) : (
              <div className="aprov-modal-avatar">{initialsOf(viewing.name)}</div>
            )}

            <h2>{viewing.name}</h2>
            <p className="aprov-modal-sub">
              {viewing.service} · Provider since {fmtDate(viewing.joinedDate)}
            </p>
            <span className={`aprov-badge ${viewing.verified ? 'badge-verified' : 'badge-unverified'}`}>
              {viewing.verified ? 'Verified' : 'Unverified'}
            </span>

            <div className="aprov-modal-grid">
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
                <span>Rating</span>
                <strong>{viewing.rating} ({viewing.jobsDone} jobs)</strong>
              </div>
            </div>

            <div className="aprov-skills-section">
              <div className="aprov-skills-title">
                <span>Skills</span>
                {!editingSkills && (
                  <button className="aprov-link-btn" onClick={() => setEditingSkills(true)}>
                    <i className="ti ti-pencil" aria-hidden="true"></i> Edit
                  </button>
                )}
              </div>

              {!editingSkills ? (
                <div className="aprov-skills-list">
                  {(viewing.skills || []).length === 0 ? (
                    <span className="aprov-skills-empty">No skills added yet.</span>
                  ) : (
                    viewing.skills.map((s) => (
                      <span className="aprov-skill-chip" key={s}>{s}</span>
                    ))
                  )}
                </div>
              ) : (
                <>
                  <div className="aprov-skills-edit-list">
                    {skillsDraft.map((s) => (
                      <span className="aprov-skill-chip editable" key={s}>
                        {s}
                        <button onClick={() => removeSkill(s)} aria-label={`Remove ${s}`}>
                          <i className="ti ti-x" aria-hidden="true"></i>
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="aprov-skill-input-row">
                    <input
                      type="text"
                      placeholder="Add a skill and press Enter"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <button className="aprov-btn aprov-btn-ghost" onClick={addSkill}>Add</button>
                  </div>
                  <div className="aprov-skills-edit-actions">
                    <button
                      className="aprov-btn aprov-btn-ghost"
                      onClick={() => {
                        setEditingSkills(false);
                        setSkillsDraft(viewing.skills || []);
                      }}
                    >
                      Cancel
                    </button>
                    <button className="aprov-btn aprov-btn-solid" disabled={savingSkills} onClick={saveSkills}>
                      {savingSkills ? 'Saving...' : 'Save skills'}
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="aprov-modal-actions">
              {viewing.verified && (
                <button
                  className="aprov-btn aprov-btn-warn"
                  disabled={busyId === viewing.id}
                  onClick={() => handleDemote(viewing.id)}
                >
                  <i className="ti ti-arrow-down" aria-hidden="true"></i> Demote
                </button>
              )}
              <button
                className="aprov-btn aprov-btn-danger"
                disabled={busyId === viewing.id}
                onClick={() => handleDelete(viewing.id)}
              >
                <i className="ti ti-trash" aria-hidden="true"></i> Remove provider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
