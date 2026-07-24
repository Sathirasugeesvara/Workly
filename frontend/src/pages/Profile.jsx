import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
    User,
    Wrench,
    ArrowRight,
    Trash2,
    Plus,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
<<<<<<< Updated upstream
import { getMyProfile, getUserById, updateMyProfile, deleteMyAccount } from '../services/userService';
import {
    getProviderProfile,
    getMyProviderProfile,
    updateMyProviderProfile
} from "../services/providerservice";
import { getAdminProfile } from "../services/adminService";
=======
import { getMyProfile, updateMyProfile, deleteMyAccount } from '../services/userService';
import { getProviderProfile } from '../services/providerservice';
>>>>>>> Stashed changes
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

// Demo fallback data, used only if the backend call fails (e.g. during dev).

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

    // "/profile/me" is the logged-in user's own profile; any other id is a
    // public profile lookup (e.g. viewing a provider from the Providers page).
    const isOwnProfile = id === 'me';
    const role = localStorage.getItem("role");

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [usingDemo, setUsingDemo] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [draft, setDraft] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        let cancelled = false;

<<<<<<< Updated upstream
        const load = async () => {
            setLoading(true);
            setLoadError(false);
            try {
                if (isOwnProfile) {

                    if (role === "CUSTOMER") {

                        const res = await getMyProfile();

                        if (cancelled) return;

                        const profile = {
                            id: res.data.customerId,
                            role: "customer",
                            name: res.data.fullName,
                            email: res.data.email,
                            mobile: res.data.phoneNumber,
                            address: res.data.address,
                            gender: res.data.gender,
                            image: res.data.profilePicture,
                            dob: res.data.dateOfBirth,
                            category: res.data.category,
                        };

                        setData(profile);
                        setDraft(profile);

                    } else if (role === "ADMIN") {

                        const res = await getAdminProfile();

                        if (cancelled) return;

                        const profile = {
                            id: res.data.adminId,
                            role: "admin",
                            name: res.data.fullName,
                            email: res.data.email,
                            mobile: "",
                            address: "",
                            gender: "",
                            image: "",
                            dob: "",
                        };

                        setData(profile);
                        setDraft(profile);

                    } else {

                        const res = await getMyProviderProfile();

                        if (cancelled) return;

                        const profile = {
                            id: res.data.providerId,
                            role: "provider",
                            name: res.data.fullName,
                            email: res.data.email,
                            mobile: res.data.phoneNumber,
                            address: res.data.address,
                            gender: res.data.gender,
                            image: res.data.profilePicture,
                            skills: res.data.skills || [],
                            verified: res.data.verified,
                        };

                        setData(profile);
                        setDraft(profile);
                    }

                }else {
                    const res = await getProviderProfile(id);
                    if (cancelled) return;
                    const mapped = {
                        id: res.data.providerId,
                        role: 'provider',
                        name: res.data.name,
                        image: res.data.avatarUrl || '',
                        address: res.data.location,
                        gender: res.data.gender,
                        rating: res.data.rating,
                        reviews: res.data.reviews,
                        jobsDone: res.data.jobsDone,
                        verified: res.data.verified,
                        skills: res.data.skills || [],
                        mobile: res.data.phoneNumber || '',
                        whatsapp: res.data.whatsappNumber || '',
                        email: res.data.email || '',
                    };
                    setData(mapped);
                    setDraft(mapped);
                }
                setUsingDemo(false);
            } catch (err) {
                if (cancelled) return;
                // Backend not reachable — log the real reason so it's visible in
                // devtools instead of just silently showing demo data.
                console.error('Failed to load profile, falling back to demo data:', err);
                const fallback =
                    id?.toLowerCase().startsWith('p') ? (mockProviders[id] || notFoundData) : (mockCustomers[id] || notFoundData);
                if (isOwnProfile && !mockCustomers.c1) {
                    setLoadError(true);
                } else {
                    setData(isOwnProfile ? mockCustomers.c1 : fallback);
                    setDraft(isOwnProfile ? mockCustomers.c1 : fallback);
                    setUsingDemo(true);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [id, isOwnProfile]);

    const handleChange = (field, value) => {
        setDraft((prev) => ({ ...prev, [field]: value }));
=======
    const load = async () => {
      setLoading(true);
      setLoadError(false);
      try {
        if (isOwnProfile) {
          const res = await getMyProfile();
          if (cancelled) return;
          setData(res.data);
          setDraft(res.data);
        } else {
          const res = await getProviderProfile(id);
          if (cancelled) return;
          const mapped = {
            id: res.data.providerId,
            role: 'provider',
            name: res.data.name ?? '',
            image: res.data.avatarUrl ?? '',
            address: res.data.location ?? '',
            rating: res.data.rating ?? 0,
            reviews: res.data.reviews ?? 0,
            jobsDone: res.data.jobsDone ?? 0,
            verified: !!res.data.verified,
            skills: Array.isArray(res.data.skills) ? res.data.skills : [],
            mobile: '',
            whatsapp: '',
            email: '',
          };
          setData(mapped);
          setDraft(mapped);
        }
        setUsingDemo(false);
      } catch {
        if (cancelled) return;
        // Backend not reachable yet — fall back to mock data so the page
        // still renders something sensible during development.
        const fallback =
          id?.startsWith('p') ? (mockProviders[id] || notFoundData) : (mockCustomers[id] || notFoundData);
        if (isOwnProfile && !mockCustomers.c1) {
          setLoadError(true);
        } else {
          setData(isOwnProfile ? mockCustomers.c1 : fallback);
          setDraft(isOwnProfile ? mockCustomers.c1 : fallback);
          setUsingDemo(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
>>>>>>> Stashed changes
    };

    const handleSave = async () => {
        setSaving(true);

        try {

            // Admin - UI only (no backend save)
            if (role === "ADMIN") {
                setData(draft);
                setEditMode(false);
                return;
            }

            // Customer - save to backend
            if (role === "CUSTOMER") {

                const res = await updateMyProfile(draft);

                const profile = {
                    id: res.data.customerId,
                    role: "customer",
                    name: res.data.fullName,
                    email: res.data.email,
                    mobile: res.data.phoneNumber,
                    address: res.data.address,
                    gender: res.data.gender,
                    image: res.data.profilePicture,
                    dob: res.data.dateOfBirth,
                    category: res.data.category,
                };

                setData(profile);
                setDraft(profile);
                setEditMode(false);
                return;
            }

            // Provider - UI only (until backend update API exists)
            if (role === "PROVIDER") {

                const payload = {
                    fullName: draft.name,
                    phoneNumber: draft.mobile,
                    address: draft.address,
                    profilePicture: draft.image,
                    gender: draft.gender,
                    skills: draft.skills,
                };

                const res = await updateMyProviderProfile(payload);

                const profile = {
                    id: res.data.providerId,
                    role: "provider",
                    name: res.data.fullName,
                    email: res.data.email,
                    mobile: res.data.phoneNumber,
                    address: res.data.address,
                    gender: res.data.gender,
                    image: res.data.profilePicture,
                    skills: res.data.skills,
                    verified: res.data.verified,
                };

                setData(profile);
                setDraft(profile);
                setEditMode(false);
                return;
            }
        } catch (err) {
            alert(err.response?.data?.message || "Could not save changes.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setDraft(data);
        setEditMode(false);
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Delete your account? This cannot be undone.')) return;
        setDeleting(true);
        try {
            if (!usingDemo) {
                await deleteMyAccount();
            }
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Could not delete account. Try again.');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-page">
                <Navbar />
                <div className="profile-loading">Loading profile...</div>
                <Footer />
            </div>
        );
    }

    if (loadError || !data) {
        return (
            <div className="profile-page">
                <Navbar />
                <div className="profile-error">Could not load this profile. Please try again later.</div>
                <Footer />
            </div>
        );
    }

    const initials = (data?.name || "")
        .split(" ")
        .map((n) => n[0] || "")
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="profile-page">
            <Navbar />

            {usingDemo && (
                <div className="profile-demo-notice">
                    <i className="ti ti-info-circle" aria-hidden="true"></i>
                    Showing demo data — connect the users API to load and save real profiles.
                </div>
            )}

<<<<<<< Updated upstream
            {data.role === "provider" ? (
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
                    saving={saving}
                    onDelete={handleDeleteAccount}
                    deleting={deleting}
                />
            ) : (
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
                    saving={saving}
                    onDelete={handleDeleteAccount}
                    deleting={deleting}
                />
            )}
=======
  const initials = (data.name || '')
      .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
>>>>>>> Stashed changes

            <Footer />
        </div>
    );
}

/* ===================== CUSTOMER PROFILE ===================== */
function CustomerProfile({ data, draft, editMode, isOwnProfile, initials, onChange, onEdit, onSave, onCancel, saving, onDelete, deleting }) {
    const fields = [
        { key: 'name',     label: 'Full name',         icon: User,     type: 'text' },
        { key: 'email',    label: 'Email address',      icon: Mail,     type: 'email' },
        { key: 'mobile',   label: 'Mobile number',      icon: Phone,    type: 'tel' },
        { key: 'address',  label: 'Address',            icon: MapPin,   type: 'text' },
        { key: 'dob',      label: 'Date of birth',      icon: Calendar, type: 'date' },
        { key: 'gender',   label: 'Gender',             icon: User,     type: 'select', options: ['Male', 'Female', 'Other'] },
    ];

    return (
        <>
            <div className="profile-header-banner">
                <div className="profile-avatar-wrap">
                    <div className="profile-avatar">
                        {data.image ? <img src={data.image} alt={data.name} /> : initials}
                    </div>
                    {editMode && (
                        <input
                            type="text"
                            placeholder="Paste profile image URL"
                            value={draft.image || ""}
                            onChange={(e) => onChange("image", e.target.value)}
                            className="profile-image-input"
                        />
                    )}
                </div>
                <h1 className="profile-header-name">{editMode ? draft.name : data.name}</h1>
                <span className="profile-role-tag customer">Customer account</span>
                {isOwnProfile && (
                    <div className="profile-header-actions">
                        {editMode ? (
                            <>
                                <button
                                    className="profile-btn profile-btn-ghost"
                                    onClick={onCancel}
                                    disabled={saving}
                                >
                                    <X size={15} /> Cancel
                                </button>

                                <button
                                    className="profile-btn profile-btn-solid"
                                    onClick={onSave}
                                    disabled={saving}
                                >
                                    <Save size={15} /> {saving ? "Saving..." : "Save changes"}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="profile-btn profile-btn-solid"
                                    onClick={() => {
                                        const role = localStorage.getItem("role");

                                        if (role === "ADMIN") {
                                            alert("Admin profile editing is currently not available.");
                                            return;
                                        }

                                        onEdit();
                                    }}
                                >
                                    <Pencil size={15} /> Edit profile
                                </button>

                                {localStorage.getItem("role") !== "ADMIN" && (
                                    <button
                                        className="profile-btn profile-btn-danger"
                                        onClick={onDelete}
                                        disabled={deleting}
                                    >
                                        <Trash2 size={15} />{" "}
                                        {deleting ? "Deleting..." : "Delete account"}
                                    </button>
                                )}
                            </>
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
function ProviderProfile({ data, draft, editMode, isOwnProfile, initials, onChange, onEdit, onSave, onCancel, onRequest, saving, onDelete, deleting }) {
    const [skillInput, setSkillInput] = useState('');

    const addSkill = () => {
        const val = skillInput.trim();
        if (val && !(draft.skills || []).includes(val)) {
            onChange('skills', [...(draft.skills || []), val]);
        }
        setSkillInput('');
    };

    const removeSkill = (skill) => {
        onChange('skills', (draft.skills || []).filter((s) => s !== skill));
    };

    const fields = [
        { key: 'name',     label: 'Full name',       icon: User,          type: 'text' },
        { key: 'address',  label: 'Location',        icon: MapPin,        type: 'text' },
        { key: 'gender',   label: 'Gender',          icon: User,          type: 'select', options: ['Male', 'Female', 'Other'] },
        { key: 'mobile',   label: 'Mobile number',   icon: Phone,         type: 'tel' },
        { key: 'whatsapp', label: 'WhatsApp number', icon: MessageCircle, type: 'tel' },
        { key: 'email',    label: 'Email address',   icon: Mail,          type: 'email' },
    ];

    return (
        <>
            <div className="profile-header-banner">
                <div className="profile-avatar-wrap">
                    <div className="profile-avatar provider">
                        {(editMode ? draft.image : data.image) ? (
                            <img
                                src={editMode ? draft.image : data.image}
                                alt={data.name}
                            />
                        ) : (
                            initials
                        )}
                    </div>
                    {editMode && (
                        <>
                            <button
                                type="button"
                                className="profile-avatar-edit"
                                aria-label="Change photo"
                            >
                                <Camera size={14} />
                            </button>

                            <input
                                type="text"
                                placeholder="Paste profile image URL"
                                value={draft.image || ""}
                                onChange={(e) => onChange("image", e.target.value)}
                                className="profile-image-input"
                            />
                        </>
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
<<<<<<< Updated upstream
                </div>
                <Link to={`/profile/${data.id}/reviews`} className="profile-reviews-link">
                    <Star size={13} />
                    View all reviews
                </Link>
                {isOwnProfile && (
                    <div className="profile-header-actions">
                        {editMode ? (
                            <>
                                <button className="profile-btn profile-btn-ghost" onClick={onCancel} disabled={saving}>
                                    <X size={15} /> Cancel
                                </button>
                                <button className="profile-btn profile-btn-solid" onClick={onSave} disabled={saving}>
                                    <Save size={15} /> {saving ? 'Saving...' : 'Save changes'}
                                </button>className="profile-btn profile-btn-solid"
                            </>
                        ) : (
                            <>
                                <button className="profile-btn profile-btn-solid" onClick={onEdit}>
                                    <Pencil size={15} /> Edit profile
                                </button>
                                <button className="profile-btn profile-btn-danger" onClick={onDelete} disabled={deleting}>
                                    <Trash2 size={15} /> {deleting ? 'Deleting...' : 'Delete account'}
                                </button>
                            </>
                        )}
                    </div>
=======
        </div>
        <Link to={`/profile/${data.id}/reviews`} className="profile-reviews-link">
          <Star size={13} />
          View all reviews
        </Link>
        {isOwnProfile && (
          <div className="profile-header-actions">
            {editMode ? (
              <>
                <button className="profile-btn profile-btn-ghost" onClick={onCancel} disabled={saving}>
                  <X size={15} /> Cancel
                </button>
                <button className="profile-btn profile-btn-solid" onClick={onSave} disabled={saving}>
                  <Save size={15} /> {saving ? 'Saving...' : 'Save changes'}
                </button>
              </>
            ) : (
              <>
                <button className="profile-btn profile-btn-solid" onClick={onEdit}>
                  <Pencil size={15} /> Edit profile
                </button>
                <button className="profile-btn profile-btn-danger" onClick={onDelete} disabled={deleting}>
                  <Trash2 size={15} /> {deleting ? 'Deleting...' : 'Delete account'}
                </button>
              </>
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
            {(data.skills || []).map((skill) => (
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
>>>>>>> Stashed changes
                )}
            </div>

            <div className="profile-body">
                <div className="profile-card">
                    <p className="profile-card-label">
                        <Wrench size={13} aria-hidden="true" />
                        Skills & specialties
                    </p>
                    {editMode && isOwnProfile ? (
                        <>
                            <div className="profile-skills-list">
                                {(draft.skills || []).length === 0 && (
                                    <span className="profile-skills-empty">No skills added yet — add at least one so customers can find you.</span>
                                )}
                                {(draft.skills || []).map((skill) => (
                                    <span className="profile-skill-pill profile-skill-pill-editable" key={skill}>
                    {skill}
                                        <button
                                            type="button"
                                            className="profile-skill-remove"
                                            onClick={() => removeSkill(skill)}
                                            aria-label={`Remove ${skill}`}
                                        >
                      <X size={11} />
                    </button>
                  </span>
                                ))}
                            </div>
                            <div className="profile-skill-add-row">
                                <input
                                    type="text"
                                    placeholder="e.g. AC repair"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addSkill();
                                        }
                                    }}
                                />
                                <button type="button" className="profile-skill-add-btn" onClick={addSkill}>
                                    <Plus size={14} /> Add
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="profile-skills-list">
                            {(data.skills || []).length === 0 ? (
                                <span className="profile-skills-empty">No skills listed yet.</span>
                            ) : (
                                data.skills.map((skill) => (
                                    <span className="profile-skill-pill" key={skill}>{skill}</span>
                                ))
                            )}
                        </div>
                    )}
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