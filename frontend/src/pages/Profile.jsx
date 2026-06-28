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

const mockProviders = {
  p1: { id: 'p1', role: 'provider', name: 'Nuwan Perera', image: '', address: 'Kandy, Sri Lanka', gender: 'Male', rating: 4.9, reviews: 312, jobsDone: 480, verified: true, skills: ['Electrical wiring', 'Switchboard repair', 'Lighting installation', 'Inverter setup'], mobile: '+94 71 234 5678', whatsapp: '+94 71 234 5678', email: 'nuwan.perera@example.com' },
  p2: { id: 'p2', role: 'provider', name: 'Sahan Fernando', image: '', address: 'Colombo, Sri Lanka', gender: 'Male', rating: 4.8, reviews: 278, jobsDone: 392, verified: true, skills: ['Pipe leak repair', 'Bathroom fittings', 'Water pressure'], mobile: '+94 72 345 6789', whatsapp: '+94 72 345 6789', email: 'sahan.fernando@example.com' },
  p3: { id: 'p3', role: 'provider', name: 'Dilani Silva', image: '', address: 'Colombo, Sri Lanka', gender: 'Female', rating: 4.9, reviews: 512, jobsDone: 610, verified: true, skills: ['Deep home cleaning', 'Post-construction cleanup', 'Regular cleaning'], mobile: '+94 76 456 7890', whatsapp: '+94 76 456 7890', email: 'dilani.silva@example.com' },
  p4: { id: 'p4', role: 'provider', name: 'Roshan Jayasuriya', image: '', address: 'Gampaha, Sri Lanka', gender: 'Male', rating: 4.8, reviews: 119, jobsDone: 204, verified: true, skills: ['AC servicing', 'Gas refill', 'AC installation'], mobile: '+94 77 567 8901', whatsapp: '+94 77 567 8901', email: 'roshan.j@example.com' },
  p5: { id: 'p5', role: 'provider', name: 'Kasun Bandara', image: '', address: 'Kandy, Sri Lanka', gender: 'Male', rating: 4.6, reviews: 88, jobsDone: 142, verified: false, skills: ['Interior painting', 'Exterior painting', 'Wall preparation'], mobile: '+94 78 678 9012', whatsapp: '+94 78 678 9012', email: 'kasun.bandara@example.com' },
  p6: { id: 'p6', role: 'provider', name: 'Priyantha Kumara', image: '', address: 'Negombo, Sri Lanka', gender: 'Male', rating: 4.8, reviews: 134, jobsDone: 219, verified: true, skills: ['Custom furniture', 'Door repair', 'Window fittings', 'Shelving'], mobile: '+94 71 789 0123', whatsapp: '+94 71 789 0123', email: 'priyantha.k@example.com' },
  p7: { id: 'p7', role: 'provider', name: 'Chamara Rathnayake', image: '', address: 'Kandy, Sri Lanka', gender: 'Male', rating: 4.7, reviews: 142, jobsDone: 167, verified: true, skills: ['Tiling', 'Flooring', 'Brickwork', 'Plastering'], mobile: '+94 72 890 1234', whatsapp: '+94 72 890 1234', email: 'chamara.r@example.com' },
  p8: { id: 'p8', role: 'provider', name: 'Anushka Wijesinghe', image: '', address: 'Colombo, Sri Lanka', gender: 'Male', rating: 4.8, reviews: 267, jobsDone: 355, verified: true, skills: ['Handyman repairs', 'Mounting', 'Assembly', 'Pest control'], mobile: '+94 76 901 2345', whatsapp: '+94 76 901 2345', email: 'anushka.w@example.com' },
  p9: { id: 'p9', role: 'provider', name: 'Lasith Gunawardena', image: '', address: 'Negombo, Sri Lanka', gender: 'Male', rating: 4.7, reviews: 96, jobsDone: 130, verified: false, skills: ['Electrical wiring', 'Lighting installation'], mobile: '+94 77 012 3456', whatsapp: '+94 77 012 3456', email: 'lasith.g@example.com' },
  p10: { id: 'p10', role: 'provider', name: 'Tharindu Mendis', image: '', address: 'Gampaha, Sri Lanka', gender: 'Male', rating: 4.6, reviews: 71, jobsDone: 98, verified: true, skills: ['Pipe repairs', 'Bathroom fittings'], mobile: '+94 78 123 4567', whatsapp: '+94 78 123 4567', email: 'tharindu.m@example.com' },
};

const mockCustomers = {
  c1: {
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
  },
};

// TODO: replace with real auth context — current logged-in user id
const CURRENT_USER_ID = 'c1';

const notFoundData = {
  id: '404',
  role: 'customer',
  name: 'Unknown User',
  email: '',
  mobile: '',
  address: '',
  dob: '',
  gender: '',
  language: '',
  image: '',
};

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  // TODO: replace with fetch('/api/users/' + id) once backend ready
  const initialData =
    id?.startsWith('p')
      ? (mockProviders[id] || notFoundData)
      : (mockCustomers[id] || notFoundData);

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
    .slice(0, 2)
    .toUpperCase();

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
    { key: 'name',     label: 'Full name',         icon: User,     type: 'text' },
    { key: 'email',    label: 'Email address',      icon: Mail,     type: 'email' },
    { key: 'mobile',   label: 'Mobile number',      icon: Phone,    type: 'tel' },
    { key: 'address',  label: 'Address',            icon: MapPin,   type: 'text' },
    { key: 'dob',      label: 'Date of birth',      icon: Calendar, type: 'date' },
    { key: 'gender',   label: 'Gender',             icon: User,     type: 'select', options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    { key: 'language', label: 'Preferred language', icon: Globe2,   type: 'text' },
  ];

  return (
    <>
      <div className="profile-header-banner">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar">
            {data.image ? <img src={data.image} alt={data.name} /> : initials}
          </div>
          {editMode && (
            <button className="profile-avatar-edit" aria-label="Change photo">
              <Camera size={14} aria-hidden="true" />
            </button>
          )}
        </div>
        <h1 className="profile-header-name">{editMode ? draft.name : data.name}</h1>
        <span className="profile-role-tag customer">Customer account</span>
        {isOwnProfile && (
          <div className="profile-header-actions">
            {editMode ? (
              <>
                <button className="profile-btn profile-btn-ghost" onClick={onCancel}>
                  <X size={15} /> Cancel
                </button>
                <button className="profile-btn profile-btn-solid" onClick={onSave}>
                  <Save size={15} /> Save changes
                </button>
              </>
            ) : (
              <button className="profile-btn profile-btn-solid" onClick={onEdit}>
                <Pencil size={15} /> Edit profile
              </button>
            )}
          </div>
        )}
      </div>

      <div className="profile-body">
        <div className="profile-card">
          <div className="profile-fields-grid">
            {fields.map((field) => (
              <div className="profile-field" key={field.key}>
                <label>
                  <field.icon size={13} aria-hidden="true" />
                  {field.label}
                </label>
                {editMode ? (
                  field.type === 'select' ? (
                    <select value={draft[field.key]} onChange={(e) => onChange(field.key, e.target.value)}>
                      {field.options.map((opt) => <option key={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input type={field.type} value={draft[field.key]} onChange={(e) => onChange(field.key, e.target.value)} />
                  )
                ) : (
                  <p>{data[field.key] || '—'}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ===================== PROVIDER PROFILE ===================== */
function ProviderProfile({ data, draft, editMode, isOwnProfile, initials, onChange, onEdit, onSave, onCancel, onRequest }) {
  const fields = [
    { key: 'name',     label: 'Full name',       icon: User,          type: 'text' },
    { key: 'address',  label: 'Location',        icon: MapPin,        type: 'text' },
    { key: 'gender',   label: 'Gender',          icon: User,          type: 'select', options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    { key: 'mobile',   label: 'Mobile number',   icon: Phone,         type: 'tel' },
    { key: 'whatsapp', label: 'WhatsApp number', icon: MessageCircle, type: 'tel' },
    { key: 'email',    label: 'Email address',   icon: Mail,          type: 'email' },
  ];

  return (
    <>
      <div className="profile-header-banner">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar provider">
            {data.image ? <img src={data.image} alt={data.name} /> : initials}
          </div>
          {editMode && (
            <button className="profile-avatar-edit" aria-label="Change photo">
              <Camera size={14} aria-hidden="true" />
            </button>
          )}
        </div>
        <h1 className="profile-header-name">
          {editMode ? draft.name : data.name}
          {data.verified && <BadgeCheck size={20} className="profile-verified-icon" />}
        </h1>
        <span className="profile-role-tag provider">Service provider</span>
        <div className="profile-stats-row">
          <span>
            <Star size={13} className="star-icon" />
            <strong>{data.rating}</strong>&nbsp;({data.reviews} reviews)
          </span>
          <span>
            <Briefcase size={13} />
            {data.jobsDone} jobs completed
          </span>
        </div>
        {isOwnProfile && (
          <div className="profile-header-actions">
            {editMode ? (
              <>
                <button className="profile-btn profile-btn-ghost" onClick={onCancel}>
                  <X size={15} /> Cancel
                </button>
                <button className="profile-btn profile-btn-solid" onClick={onSave}>
                  <Save size={15} /> Save changes
                </button>
              </>
            ) : (
              <button className="profile-btn profile-btn-solid" onClick={onEdit}>
                <Pencil size={15} /> Edit profile
              </button>
            )}
          </div>
        )}
      </div>

      <div className="profile-body">
        <div className="profile-card">
          <p className="profile-card-label">
            <Wrench size={13} aria-hidden="true" />
            Skills & specialties
          </p>
          <div className="profile-skills-list">
            {data.skills.map((skill) => (
              <span className="profile-skill-pill" key={skill}>{skill}</span>
            ))}
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-fields-grid">
            {fields.map((field) => (
              <div className="profile-field" key={field.key}>
                <label>
                  <field.icon size={13} aria-hidden="true" />
                  {field.label}
                </label>
                {editMode ? (
                  field.type === 'select' ? (
                    <select value={draft[field.key]} onChange={(e) => onChange(field.key, e.target.value)}>
                      {field.options.map((opt) => <option key={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input type={field.type} value={draft[field.key]} onChange={(e) => onChange(field.key, e.target.value)} />
                  )
                ) : (
                  <p>{data[field.key] || '—'}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {!isOwnProfile && (
          <div className="profile-contact-bar">
            <div className="profile-contact-buttons">
              <a href={`tel:${data.mobile}`} className="contact-btn contact-call">
                <Phone size={16} /> Call
              </a>
              <a href={`https://wa.me/${data.whatsapp?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="contact-btn contact-whatsapp">
                <MessageCircle size={16} /> WhatsApp
              </a>
              <a href={`mailto:${data.email}`} className="contact-btn contact-email">
                <Mail size={16} /> Email
              </a>
            </div>
            <button className="profile-request-btn" onClick={onRequest}>
              Request this provider
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}