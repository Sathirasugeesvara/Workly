import { useState, useMemo, useEffect } from 'react';
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
  Loader2,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getVerifiedProviders } from '../services/providerservice';
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

function initialsFor(name) {
  if (!name) return '?';
  return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
}

export default function Providers() {
  const [searchParams] = useSearchParams();
  const presetService = searchParams.get('service');

  const [query, setQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState(presetService || 'All services');
  const [sortBy, setSortBy] = useState('rating');

  const [allProviders, setAllProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    getVerifiedProviders()
        .then((res) => {
          if (cancelled) return;

          const mapped = (res.data || []).map((p) => ({
            id: p.providerId,
            name: p.name,
            service: p.service,
            location: p.location || 'Location not set',
            rating: p.rating || 0,
            reviews: p.reviews || 0,
            jobsDone: p.jobsDone || 0,
            verified: p.verified,
            initials: initialsFor(p.name),
          }));

          setAllProviders(mapped);
        })
        .catch(() => {
          if (!cancelled) setError('Could not load providers right now. Please try again shortly.');
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProviders = useMemo(() => {
    const q = query.trim().toLowerCase();

    let results = allProviders.filter((p) => {
      const matchesService = serviceFilter === 'All services' || p.service === serviceFilter;
      const matchesQuery =
          q === '' ||
          (p.name || '').toLowerCase().includes(q) ||
          (p.service || '').toLowerCase().includes(q) ||
          (p.location || '').toLowerCase().includes(q);
      return matchesService && matchesQuery;
    });

    if (sortBy === 'rating') {
      results = [...results].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'jobs') {
      results = [...results].sort((a, b) => b.jobsDone - a.jobsDone);
    }

    return results;
  }, [allProviders, query, serviceFilter, sortBy]);

  return (
      <div className="providers-page">
        <Navbar />

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

        <section className="providers-results">
          {loading ? (
              <div className="providers-empty">
                <Loader2 size={32} className="spin" aria-hidden="true" />
                <h3>Loading providers...</h3>
              </div>
          ) : error ? (
              <div className="providers-empty">
                <SearchX size={40} aria-hidden="true" />
                <h3>{error}</h3>
              </div>
          ) : (
              <>
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
                              <Link to={`/profile/${provider.id}`} className="provider-card-btn">
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
              </>
          )}
        </section>

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