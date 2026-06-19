import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Star,
  BadgeCheck,
  Briefcase,
  Pencil,
  Save,
  X,
  Camera,
  Calendar,
  Globe2,
  User,
  Wrench,
  ArrowRight,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Profile.css';

// TODO: replace with GET /api/users/:id (or /api/providers/:id) once backend is ready
const mockCustomer = {
  id: 'c1',
  role: 'customer',
  name: 'Sathira Sugeesvara',
  email: 'sathira@example.com',
  mobile: '+94 77 123 4567',
  address: 'Negombo, Western Province, Sri Lanka',
  dob: '2003-05-14',
  gender: 'Male',
  language: 'Sinhala, English',
  image: '',
};

const mockProvider = {
  id: 'p1',
  role: 'provider',
  name: 'Nuwan Perera',
  image: '',
  address: 'Kandy, Sri Lanka',
  gender: 'Male',
  rating: 4.9,
  reviews: 312,
  jobsDone: 480,
  verified: true,
  skills: ['Electrical wiring', 'Switchboard repair', 'Lighting installation', 'Inverter setup'],
  mobile: '+94 71 234 5678',
  whatsapp: '+94 71 234 5678',
  email: 'nuwan.perera@example.com',
};

// Determine whether the current logged-in user owns this profile.
// TODO: replace with real auth check, e.g. currentUser.id === id
const CURRENT_USER_ID = 'c1';

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  // TODO: fetch real data by id; for now fall back to mock customer/provider by id prefix
  const initialData = id?.startsWith('p') ? mockProvider : mockCustomer;
  const isOwnProfile = id === CURRENT_USER_ID;

  const [data, setData] = useState(initialData);
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(initialData);

  const handleChange = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // TODO: PUT /api/users/:id with draft payload
    setData(draft);
    setEditMode(false);
  };

  const handleCancel = () => {
    setDraft(data);
    setEditMode(false);
  };

  const initials = data.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <div className="profile-page">
      <Navbar />

      {data.role === 'customer' ? (
        <CustomerProfile
          data={data}
          draft={draft}
          editMode={editMode}
          isOwnProfile={isOwnProfile}
          initials={initials}
          onChange={handleChange}
          onEdit={() => setEditMode(true)}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <ProviderProfile
          data={data}
          draft={draft}
          editMode={editMode}
          isOwnProfile={isOwnProfile}
          initials={initials}
          onChange={handleChange}
          onEdit={() => setEditMode(true)}
          onSave={handleSave}
          onCancel={handleCancel}
          onRequest={() => navigate(`/request/${data.id}`)}
        />
      )}

      <Footer />
    </div>
  );
}

/* ===================== CUSTOMER PROFILE ===================== */
function CustomerProfile({ data, draft, editMode, isOwnProfile, initials, onChange, onEdit, onSave, onCancel }) {
  const fields = [
    { key: 'name', label: 'Full name', icon: User, type: 'text' },
    { key: 'email', label: 'Email address', icon: Mail, type: 'email' },
    { key: 'mobile', label: 'Mobile number', icon: Phone, type: 'tel' },
    { key: 'address', label: 'Address', icon: MapPin, type: 'text' },
    { key: 'dob', label: 'Date of birth', icon: Calendar, type: 'date' },
    { key: 'gender', label: 'Gender', icon: User, type: 'select', options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    { key: 'language', label: 'Preferred language', icon: Globe2, type: 'text' },
  ];

  return (
    <section className="profile-section">
      <div className="profile-card">
        <div className="profile-card-header">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              {data.image ? <img src={data.image} alt={data.name} /> : initials}
            </div>
            {editMode && (
              <button className="profile-avatar-edit" aria-label="Change photo">
                <Camera size={15} aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="profile-card-headtext">
            <h1>{editMode ? draft.name : data.name}</h1>
            <span className="profile-role-tag customer">Customer account</span>
          </div>

          {isOwnProfile && (
            <div className="profile-edit-actions">
              {editMode ? (
                <>
                  <button className="profile-btn profile-btn-ghost" onClick={onCancel}>
                    <X size={15} aria-hidden="true" />
                    Cancel
                  </button>
                  <button className="profile-btn profile-btn-solid" onClick={onSave}>
                    <Save size={15} aria-hidden="true" />
                    Save changes
                  </button>
                </>
              ) : (
                <button className="profile-btn profile-btn-solid" onClick={onEdit}>
                  <Pencil size={15} aria-hidden="true" />
                  Edit profile
                </button>
              )}
            </div>
          )}
        </div>

        <div className="profile-fields-grid">
          {fields.map((field) => (
            <div className="profile-field" key={field.key}>
              <label>
                <field.icon size={14} aria-hidden="true" />
                {field.label}
              </label>

              {editMode ? (
                field.type === 'select' ? (
                  <select
                    value={draft[field.key]}
                    onChange={(e) => onChange(field.key, e.target.value)}
                  >
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={draft[field.key]}
                    onChange={(e) => onChange(field.key, e.target.value)}
                  />
                )
              ) : (
                <p>{data[field.key] || '—'}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== PROVIDER PROFILE ===================== */
function ProviderProfile({ data, draft, editMode, isOwnProfile, initials, onChange, onEdit, onSave, onCancel, onRequest }) {
  const fields = [
    { key: 'name', label: 'Full name', icon: User, type: 'text' },
    { key: 'address', label: 'Location', icon: MapPin, type: 'text' },
    { key: 'gender', label: 'Gender', icon: User, type: 'select', options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    { key: 'mobile', label: 'Mobile number', icon: Phone, type: 'tel' },
    { key: 'whatsapp', label: 'WhatsApp number', icon: MessageCircle, type: 'tel' },
    { key: 'email', label: 'Email address', icon: Mail, type: 'email' },
  ];

  return (
    <>
      <section className="profile-section">
        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar provider">
                {data.image ? <img src={data.image} alt={data.name} /> : initials}
              </div>
              {editMode && (
                <button className="profile-avatar-edit" aria-label="Change photo">
                  <Camera size={15} aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="profile-card-headtext">
              <h1>
                {editMode ? draft.name : data.name}
                {data.verified && (
                  <BadgeCheck size={20} className="profile-verified-icon" aria-label="Verified provider" />
                )}
              </h1>
              <span className="profile-role-tag provider">Service provider</span>

              <div className="profile-stats-row">
                <span>
                  <Star size={14} className="star-icon" aria-hidden="true" />
                  <strong>{data.rating}</strong> ({data.reviews} reviews)
                </span>
                <span>
                  <Briefcase size={14} aria-hidden="true" />
                  {data.jobsDone} jobs completed
                </span>
              </div>
            </div>

            {isOwnProfile && (
              <div className="profile-edit-actions">
                {editMode ? (
                  <>
                    <button className="profile-btn profile-btn-ghost" onClick={onCancel}>
                      <X size={15} aria-hidden="true" />
                      Cancel
                    </button>
                    <button className="profile-btn profile-btn-solid" onClick={onSave}>
                      <Save size={15} aria-hidden="true" />
                      Save changes
                    </button>
                  </>
                ) : (
                  <button className="profile-btn profile-btn-solid" onClick={onEdit}>
                    <Pencil size={15} aria-hidden="true" />
                    Edit profile
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="profile-skills-block">
            <h3>
              <Wrench size={15} aria-hidden="true" />
              Skills & specialties
            </h3>
            <div className="profile-skills-list">
              {data.skills.map((skill) => (
                <span className="profile-skill-pill" key={skill}>{skill}</span>
              ))}
            </div>
          </div>

          <div className="profile-fields-grid">
            {fields.map((field) => (
              <div className="profile-field" key={field.key}>
                <label>
                  <field.icon size={14} aria-hidden="true" />
                  {field.label}
                </label>

                {editMode ? (
                  field.type === 'select' ? (
                    <select
                      value={draft[field.key]}
                      onChange={(e) => onChange(field.key, e.target.value)}
                    >
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={draft[field.key]}
                      onChange={(e) => onChange(field.key, e.target.value)}
                    />
                  )
                ) : (
                  <p>{data[field.key] || '—'}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact + Request bar — only shown when viewing someone else's provider profile */}
      {!isOwnProfile && (
        <section className="profile-contact-bar">
          <div className="profile-contact-bar-inner">
            <div className="profile-contact-buttons">
              <a href={`tel:${data.mobile}`} className="contact-btn contact-call">
                <Phone size={17} aria-hidden="true" />
                Call
              </a>
              <a
                href={`https://wa.me/${data.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-btn contact-whatsapp"
              >
                <MessageCircle size={17} aria-hidden="true" />
                WhatsApp
              </a>
              <a href={`mailto:${data.email}`} className="contact-btn contact-email">
                <Mail size={17} aria-hidden="true" />
                Email
              </a>
            </div>

            <button className="profile-request-btn" onClick={onRequest}>
              Request this provider
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </section>
      )}
    </>
  );
}