import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  X,
  MapPin,
  Star,
  BadgeCheck,
  Briefcase,
  SearchX,
  SlidersHorizontal,
  ArrowRight,
  MessageCircleMore,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Providers.css';

const serviceOptions = [
  'All services',
  'Electrical',
  'Plumbing',
  'AC repair',
  'Painting',
  'Carpentry',
  'Cleaning',
  'Masonry',
  'General repair',
];

// TODO: replace with a fetch to GET /api/providers (optionally filtered by ?service=) once the backend is ready
// e.g. useEffect(() => { fetch(`/api/providers?service=${serviceFilter}`).then(r => r.json()).then(setProviders); }, [serviceFilter]);
const allProviders = [
  {
    id: 1,
    name: 'Nuwan Perera',
    service: 'Electrical',
    location: 'Kandy',
    rating: 4.9,
    reviews: 312,
    jobsDone: 480,
    verified: true,
    price: 'From Rs. 1,500',
    initials: 'NP',
  },
  {
    id: 2,
    name: 'Sahan Fernando',
    service: 'Plumbing',
    location: 'Colombo',
    rating: 4.8,
    reviews: 278,
    jobsDone: 392,
    verified: true,
    price: 'From Rs. 1,200',
    initials: 'SF',
  },
  {
    id: 3,
    name: 'Dilani Silva',
    service: 'Cleaning',
    location: 'Colombo',
    rating: 4.9,
    reviews: 512,
    jobsDone: 610,
    verified: true,
    price: 'From Rs. 4,500',
    initials: 'DS',
  },
  {
    id: 4,
    name: 'Roshan Jayasuriya',
    service: 'AC repair',
    location: 'Gampaha',
    rating: 4.8,
    reviews: 119,
    jobsDone: 204,
    verified: true,
    price: 'From Rs. 3,500',
    initials: 'RJ',
  },
  {
    id: 5,
    name: 'Kasun Bandara',
    service: 'Painting',
    location: 'Kandy',
    rating: 4.6,
    reviews: 88,
    jobsDone: 142,
    verified: false,
    price: 'From Rs. 25/sqft',
    initials: 'KB',
  },
  {
    id: 6,
    name: 'Priyantha Kumara',
    service: 'Carpentry',
    location: 'Negombo',
    rating: 4.8,
    reviews: 134,
    jobsDone: 219,
    verified: true,
    price: 'From Rs. 3,000',
    initials: 'PK',
  },
  {
    id: 7,
    name: 'Chamara Rathnayake',
    service: 'Masonry',
    location: 'Kandy',
    rating: 4.7,
    reviews: 142,
    jobsDone: 167,
    verified: true,
    price: 'From Rs. 150/sqft',
    initials: 'CR',
  },
  {
    id: 8,
    name: 'Anushka Wijesinghe',
    service: 'General repair',
    location: 'Colombo',
    rating: 4.8,
    reviews: 267,
    jobsDone: 355,
    verified: true,
    price: 'From Rs. 1,000',
    initials: 'AW',
  },
  {
    id: 9,
    name: 'Lasith Gunawardena',
    service: 'Electrical',
    location: 'Negombo',
    rating: 4.7,
    reviews: 96,
    jobsDone: 130,
    verified: false,
    price: 'From Rs. 1,800',
    initials: 'LG',
  },
  {
    id: 10,
    name: 'Tharindu Mendis',
    service: 'Plumbing',
    location: 'Gampaha',
    rating: 4.6,
    reviews: 71,
    jobsDone: 98,
    verified: true,
    price: 'From Rs. 1,400',
    initials: 'TM',
  },
];

export default function Providers() {
  const [searchParams] = useSearchParams();
  const presetService = searchParams.get('service');

  const [query, setQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState(presetService || 'All services');
  const [sortBy, setSortBy] = useState('rating');

  const filteredProviders = useMemo(() => {
    const q = query.trim().toLowerCase();

    let results = allProviders.filter((p) => {
      const matchesService = serviceFilter === 'All services' || p.service === serviceFilter;
      const matchesQuery =
        q === '' ||
        p.name.toLowerCase().includes(q) ||
        p.service.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q);
      return matchesService && matchesQuery;
    });

    if (sortBy === 'rating') {
      results = [...results].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'jobs') {
      results = [...results].sort((a, b) => b.jobsDone - a.jobsDone);
    }

    return results;
  }, [query, serviceFilter, sortBy]);

  return (
    <div className="providers-page">
      <Navbar />

      {/* Header + search */}
      <section className="providers-header">
        <span className="providers-eyebrow">Find providers</span>
        <h1>Verified professionals, ready to help</h1>
        <p>
          Browse trusted, background-checked service providers near you and
          book the right person for the job.
        </p>

        <div className="providers-search">
          <Search size={19} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search by name, service, or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="providers-search-clear"
              aria-label="Clear search"
              onClick={() => setQuery('')}
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </section>

      {/* Filter bar */}
      <section className="providers-filterbar">
        <div className="providers-filterbar-inner">
          <div className="providers-filter-group">
            <SlidersHorizontal size={16} aria-hidden="true" />
            <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
              {serviceOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="providers-filter-group">
            <Star size={16} aria-hidden="true" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="rating">Highest rated</option>
              <option value="jobs">Most jobs completed</option>
            </select>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="providers-results">
        <div className="providers-results-header">
          <p>
            <strong>{filteredProviders.length}</strong>{' '}
            {filteredProviders.length === 1 ? 'provider' : 'providers'} found
            {serviceFilter !== 'All services' && (
              <> for <strong>{serviceFilter}</strong></>
            )}
          </p>
        </div>

        {filteredProviders.length > 0 ? (
          <div className="providers-grid">
            {filteredProviders.map((provider) => (
              <div className="provider-card" key={provider.id}>
                <div className="provider-card-top">
                  <div className="provider-avatar">{provider.initials}</div>
                  <div className="provider-card-name">
                    <h3>
                      {provider.name}
                      {provider.verified && (
                        <BadgeCheck size={16} className="verified-icon" aria-label="Verified provider" />
                      )}
                    </h3>
                    <span className="provider-service-tag">{provider.service}</span>
                  </div>
                </div>

                <div className="provider-card-meta">
                  <span>
                    <MapPin size={14} aria-hidden="true" />
                    {provider.location}
                  </span>
                  <span>
                    <Briefcase size={14} aria-hidden="true" />
                    {provider.jobsDone} jobs
                  </span>
                </div>

                <div className="provider-card-rating">
                  <Star size={15} className="star-icon" aria-hidden="true" />
                  <strong>{provider.rating}</strong>
                  <span>({provider.reviews} reviews)</span>
                </div>

                <div className="provider-card-footer">
                  <span className="provider-price">{provider.price}</span>
                  <Link to={`/profile/p${provider.id}`} className="provider-card-btn">
                    View profile
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="providers-empty">
            <SearchX size={40} aria-hidden="true" />
            <h3>No providers match your search</h3>
            <p>Try a different keyword or service filter.</p>
            <button
              className="providers-empty-reset"
              onClick={() => {
                setQuery('');
                setServiceFilter('All services');
              }}
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="providers-cta">
        <div className="providers-cta-icon">
          <MessageCircleMore size={26} aria-hidden="true" />
        </div>
        <div className="providers-cta-content">
          <h2>Are you a skilled professional?</h2>
          <p>
            Join Workly as a provider and start getting bookings from
            customers near you.
          </p>
        </div>
        <Link to="/register" className="providers-cta-btn">
          Become a provider
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>

      <Footer />
    </div>
  );
}