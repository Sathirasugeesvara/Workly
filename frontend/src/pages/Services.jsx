import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Wrench,
  Snowflake,
  PaintBucket,
  Hammer,
  Sparkles,
  Bath,
  Brush,
  Home as HomeIcon,
  DoorOpen,
  Trash2,
  Bug,
  Settings,
  Search,
  X,
  SearchX,
  ArrowRight,
  MessageCircleMore,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Services.css';

// TODO: replace with a fetch to GET /api/services once the backend table is ready
// e.g. useEffect(() => { fetch('/api/services').then(r => r.json()).then(setServices); }, []);
const allServices = [
  { id: 1, category: 'electrical', title: 'Electrical wiring & repair', desc: 'Faulty wiring, switchboards & lighting installs.', icon: Zap, link: '/providers' },
  { id: 2, category: 'electrical', title: 'Inverter & solar setup', desc: 'Backup power systems and solar panel wiring.', icon: Zap, link: '/providers' },
  { id: 3, category: 'plumbing', title: 'Pipe leak repair', desc: 'Leaking pipes, burst joints, water pressure issues.', icon: Wrench, link: '/providers' },
  { id: 4, category: 'plumbing', title: 'Bathroom fitting installation', desc: 'Taps, sinks, toilets, and shower fittings.', icon: Bath, link: '/providers' },
  { id: 5, category: 'ac', title: 'AC servicing & gas refill', desc: 'Routine maintenance and full system cleaning.', icon: Snowflake, link: '/providers' },
  { id: 6, category: 'ac', title: 'New AC installation', desc: 'Wall-mounted and split unit installation.', icon: Snowflake, link: '/providers' },
  { id: 7, category: 'painting', title: 'Interior wall painting', desc: 'Full room or accent wall painting & finishing.', icon: PaintBucket, link: '/providers' },
  { id: 8, category: 'painting', title: 'Exterior house painting', desc: 'Weatherproof exterior coating for walls & gates.', icon: Brush, link: '/providers' },
  { id: 9, category: 'carpentry', title: 'Custom furniture & fittings', desc: 'Wardrobes, shelving, and made-to-measure pieces.', icon: Hammer, link: '/providers' },
  { id: 10, category: 'carpentry', title: 'Door & window installation', desc: 'Wooden and metal door/window fitting & repair.', icon: DoorOpen, link: '/providers' },
  { id: 11, category: 'cleaning', title: 'Deep home cleaning', desc: 'Thorough cleaning for kitchens, bathrooms & living areas.', icon: Sparkles, link: '/providers' },
  { id: 12, category: 'cleaning', title: 'Post-construction cleanup', desc: 'Dust, debris & paint residue removal.', icon: Trash2, link: '/providers' },
  { id: 13, category: 'masonry', title: 'Tiling & flooring', desc: 'Floor and wall tiling for kitchens & patios.', icon: HomeIcon, link: '/providers' },
  { id: 14, category: 'masonry', title: 'Wall & boundary construction', desc: 'Brickwork, plastering & boundary walls.', icon: HomeIcon, link: '/providers' },
  { id: 15, category: 'general', title: 'Handyman home fix-ups', desc: 'Small repairs, mounting & assembly jobs.', icon: Settings, link: '/providers' },
  { id: 16, category: 'general', title: 'Pest control treatment', desc: 'Safe treatment for pests and termites.', icon: Bug, link: '/providers' },
];

export default function Services() {
  const [query, setQuery] = useState('');

  const filteredServices = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q === '') return allServices;
    return allServices.filter(
      (service) =>
        service.title.toLowerCase().includes(q) ||
        service.desc.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="services-page">
      <Navbar />

      {/* Header + search */}
      <section className="services-header">
        <span className="services-eyebrow">Browse services</span>
        <h1>Find the right professional for any job</h1>
        <p>
          Search our verified service categories and tap a service to see
          available providers near you.
        </p>

        <div className="services-search">
          <Search size={19} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search for a service — e.g. plumbing, AC repair, painting..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="services-search-clear"
              aria-label="Clear search"
              onClick={() => setQuery('')}
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="services-results">
        <div className="services-results-header">
          <p>
            <strong>{filteredServices.length}</strong>{' '}
            {filteredServices.length === 1 ? 'service' : 'services'} found
            {query && <> for "<strong>{query}</strong>"</>}
          </p>
        </div>

        {filteredServices.length > 0 ? (
          <div className="services-grid">
            {filteredServices.map((service) => (
              <Link to={service.link} className="service-card-mini" key={service.id}>
                <div className="service-card-mini-icon">
                  <service.icon size={22} aria-hidden="true" />
                </div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="services-empty">
            <SearchX size={40} aria-hidden="true" />
            <h3>No services match your search</h3>
            <p>Try a different keyword.</p>
            <button className="services-empty-reset" onClick={() => setQuery('')}>
              Clear search
            </button>
          </div>
        )}
      </section>

      {/* Custom request CTA */}
      <section className="services-cta">
        <div className="services-cta-icon">
          <MessageCircleMore size={26} aria-hidden="true" />
        </div>
        <div className="services-cta-content">
          <h2>Can't find what you're looking for?</h2>
          <p>
            Tell us what you need and we'll match you with a provider who can
            help — even if it's not listed above.
          </p>
        </div>
        <Link to="/contact" className="services-cta-btn">
          Request a custom service
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>

      <Footer />
    </div>
  );
}