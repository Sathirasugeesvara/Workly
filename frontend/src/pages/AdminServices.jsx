import React, { useEffect, useState } from 'react';
import {
  Zap, Wrench, Snowflake, PaintBucket, Hammer, Sparkles, Bath, Brush,
  Home as HomeIcon, DoorOpen, Trash2, Bug, Settings, Plus, Pencil, X,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService,
} from '../services/adminManageService';
import './AdminServices.css';

const ICONS = {
  Zap, Wrench, Snowflake, PaintBucket, Hammer, Sparkles, Bath, Brush,
  Home: HomeIcon, DoorOpen, Trash2, Bug, Settings,
};
const ICON_NAMES = Object.keys(ICONS);

const DEMO_SERVICES = [
  { id: 1, category: 'electrical', title: 'Electrical wiring & repair', desc: 'Faulty wiring, switchboards & lighting installs.', icon: 'Zap' },
  { id: 2, category: 'electrical', title: 'Inverter & solar setup', desc: 'Backup power systems and solar panel wiring.', icon: 'Zap' },
  { id: 3, category: 'plumbing', title: 'Pipe leak repair', desc: 'Leaking pipes, burst joints, water pressure issues.', icon: 'Wrench' },
  { id: 4, category: 'plumbing', title: 'Bathroom fitting installation', desc: 'Taps, sinks, toilets, and shower fittings.', icon: 'Bath' },
  { id: 5, category: 'ac', title: 'AC servicing & gas refill', desc: 'Routine maintenance and full system cleaning.', icon: 'Snowflake' },
  { id: 6, category: 'painting', title: 'Interior wall painting', desc: 'Full room or accent wall painting & finishing.', icon: 'PaintBucket' },
  { id: 7, category: 'carpentry', title: 'Custom furniture & fittings', desc: 'Wardrobes, shelving, and made-to-measure pieces.', icon: 'Hammer' },
  { id: 8, category: 'cleaning', title: 'Deep home cleaning', desc: 'Thorough cleaning for kitchens, bathrooms & living areas.', icon: 'Sparkles' },
];

const emptyForm = { category: '', title: '', desc: '', icon: 'Settings' };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [search, setSearch] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllServicesAdmin();
      setServices(res.data);
      setUsingDemo(false);
    } catch {
      setServices(DEMO_SERVICES);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (s) => {
    setEditingId(s.id);
    setForm({ category: s.category, title: s.title, desc: s.desc, icon: s.icon });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.category.trim()) return;

    setSaving(true);
    try {
      if (editingId) {
        await updateService(editingId, form);
        setServices((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...form } : s)));
      } else {
        const res = await createService(form);
        const created = res?.data?.id ? res.data : { ...form, id: Date.now() };
        setServices((prev) => [created, ...prev]);
      }
      closeForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not save this service.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service? This cannot be undone.')) return;
    setBusyId(id);
    try {
      await deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete this service.');
    } finally {
      setBusyId(null);
    }
  };

  const filtered = services.filter((s) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
  });

  return (
    <div className="asvc-page">
      <Navbar />

      <div className="asvc-header">
        <span className="asvc-eyebrow">Admin · Services</span>
        <h1>Services</h1>
        <p>Manage the service catalog shown to customers.</p>
      </div>

      <div className="asvc-body">
        {usingDemo && (
          <div className="asvc-notice">
            <i className="ti ti-info-circle" aria-hidden="true"></i>
            Showing demo data — connect the admin services API to manage the real catalog.
          </div>
        )}

        <div className="asvc-toolbar">
          <div className="asvc-search">
            <i className="ti ti-search" aria-hidden="true"></i>
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="asvc-btn asvc-btn-solid" onClick={openCreate}>
            <Plus size={16} /> Add service
          </button>
        </div>

        {loading ? (
          <div className="asvc-empty">Loading services...</div>
        ) : filtered.length === 0 ? (
          <div className="asvc-empty">
            <i className="ti ti-list" aria-hidden="true"></i>
            <p>No services found.</p>
          </div>
        ) : (
          <div className="asvc-grid">
            {filtered.map((s) => {
              const Icon = ICONS[s.icon] || Settings;
              return (
                <div className="asvc-card" key={s.id}>
                  <div className="asvc-card-icon"><Icon size={20} /></div>
                  <span className="asvc-card-category">{s.category}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <div className="asvc-card-actions">
                    <button className="asvc-btn asvc-btn-ghost" onClick={() => openEdit(s)}>
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      className="asvc-btn asvc-btn-danger"
                      disabled={busyId === s.id}
                      onClick={() => handleDelete(s.id)}
                    >
                      <Trash2 size={14} /> {busyId === s.id ? 'Removing...' : 'Delete'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />

      {formOpen && (
        <div className="asvc-modal-overlay" onClick={closeForm}>
          <form className="asvc-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
            <button type="button" className="asvc-modal-close" onClick={closeForm} aria-label="Close">
              <X size={16} />
            </button>

            <h2>{editingId ? 'Edit service' : 'Add a new service'}</h2>

            <div className="asvc-field">
              <label>Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Pipe leak repair"
                required
              />
            </div>

            <div className="asvc-field">
              <label>Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value.toLowerCase() }))}
                placeholder="e.g. plumbing"
                required
              />
            </div>

            <div className="asvc-field">
              <label>Description</label>
              <textarea
                rows={3}
                value={form.desc}
                onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
                placeholder="Short description shown on the service card"
              />
            </div>

            <div className="asvc-field">
              <label>Icon</label>
              <div className="asvc-icon-grid">
                {ICON_NAMES.map((name) => {
                  const Icon = ICONS[name];
                  return (
                    <button
                      type="button"
                      key={name}
                      className={`asvc-icon-option ${form.icon === name ? 'selected' : ''}`}
                      onClick={() => setForm((f) => ({ ...f, icon: name }))}
                      aria-label={name}
                    >
                      <Icon size={18} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="asvc-modal-actions">
              <button type="button" className="asvc-btn asvc-btn-ghost" onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className="asvc-btn asvc-btn-solid" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add service'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
