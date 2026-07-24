import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getReviewsForProvider } from '../services/providerservice';
import './ProviderReviews.css';

// Same mock provider directory used on the profile page, just enough to
// show the name/rating header here. TODO: replace with GET /api/users/:id
const mockProviders = {
  p1: { name: 'Nuwan Perera', rating: 4.9, reviews: 312 },
  p2: { name: 'Sahan Fernando', rating: 4.8, reviews: 278 },
  p3: { name: 'Dilani Silva', rating: 4.9, reviews: 512 },
  p4: { name: 'Roshan Jayasuriya', rating: 4.8, reviews: 119 },
  p5: { name: 'Kasun Bandara', rating: 4.6, reviews: 88 },
  p6: { name: 'Priyantha Kumara', rating: 4.8, reviews: 134 },
  p7: { name: 'Chamara Rathnayake', rating: 4.7, reviews: 142 },
  p8: { name: 'Anushka Wijesinghe', rating: 4.8, reviews: 267 },
  p9: { name: 'Lasith Gunawardena', rating: 4.7, reviews: 96 },
  p10: { name: 'Tharindu Mendis', rating: 4.6, reviews: 71 },
};

const DEMO_REVIEWS = [
  { id: 'r1', customer: 'Amaya Wickrama', rating: 5, comment: 'Excellent electrician, fixed the issue in no time and explained everything clearly.', date: '2026-07-10' },
  { id: 'r2', customer: 'Ruwan Silva', rating: 5, comment: 'Very professional and punctual, highly recommend for any wiring work.', date: '2026-07-08' },
  { id: 'r3', customer: 'Dinesh Kumara', rating: 4, comment: 'Good work overall, explained the problem clearly before starting.', date: '2026-07-05' },
  { id: 'r4', customer: 'Ishara Bandara', rating: 5, comment: 'Neat and tidy job, will definitely book again for future work.', date: '2026-07-02' },
  { id: 'r5', customer: 'Chamodi Silva', rating: 4, comment: 'Arrived a little late but did solid, careful work once he got there.', date: '2026-06-28' },
  { id: 'r6', customer: 'Tharindu Rathnayake', rating: 5, comment: 'Best service I have used on Workly so far. Fair pricing too.', date: '2026-06-20' },
  { id: 'r7', customer: 'Nadeesha Fonseka', rating: 3, comment: 'Job was done fine but communication could have been better.', date: '2026-06-11' },
];

function StarRow({ value }) {
  return (
      <span className="prev-stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} size={14} className={n <= value ? 'filled' : ''} />
      ))}
    </span>
  );
}

export default function ProviderReviews() {
  const { id } = useParams();
  const provider = mockProviders[id] || { name: 'Provider', rating: null, reviews: 0 };

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [filterStars, setFilterStars] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getReviewsForProvider(id)
        .then((res) => {
          if (cancelled) return;
          setReviews(res.data);
          setUsingDemo(false);
        })
        .catch(() => {
          if (cancelled) return;
          setReviews(DEMO_REVIEWS);
          setUsingDemo(true);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const filtered = filterStars === 0 ? reviews : reviews.filter((r) => r.rating === filterStars);

  const avgRating = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : provider.rating;

  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
      <div className="prev-page">
        <Navbar />

        <div className="prev-header">
          <Link to={`/profile/${id}`} className="prev-back">
            <ArrowLeft size={15} /> Back to profile
          </Link>
          <span className="prev-eyebrow">Reviews</span>
          <h1>{provider.name}</h1>
          <div className="prev-summary">
            <div className="prev-score">
              <strong>{avgRating || '—'}</strong>
              <StarRow value={Math.round(avgRating || 0)} />
              <span>{reviews.length} review{reviews.length === 1 ? '' : 's'}</span>
            </div>
            <div className="prev-breakdown">
              {breakdown.map((b) => (
                  <button
                      key={b.star}
                      className={`prev-breakdown-row ${filterStars === b.star ? 'active' : ''}`}
                      onClick={() => setFilterStars((prev) => (prev === b.star ? 0 : b.star))}
                  >
                    <span>{b.star}★</span>
                    <span className="prev-bar-track">
                  <span
                      className="prev-bar-fill"
                      style={{ width: reviews.length ? `${(b.count / reviews.length) * 100}%` : '0%' }}
                  ></span>
                </span>
                    <span className="prev-bar-count">{b.count}</span>
                  </button>
              ))}
            </div>
          </div>
        </div>

        <div className="prev-body">
          {usingDemo && (
              <div className="prev-notice">
                Showing demo data — connect the reviews API to see real feedback for this provider.
              </div>
          )}

          {filterStars > 0 && (
              <button className="prev-clear-filter" onClick={() => setFilterStars(0)}>
                Showing {filterStars}★ only — clear filter
              </button>
          )}

          {loading ? (
              <div className="prev-empty">Loading reviews...</div>
          ) : filtered.length === 0 ? (
              <div className="prev-empty">
                <p>No reviews to show.</p>
              </div>
          ) : (
              <div className="prev-list">
                {filtered.map((r) => (
                    <div className="prev-card" key={r.id}>
                      <div className="prev-card-top">
                        <div className="prev-avatar">
                          {r.customer.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <strong>{r.customer}</strong>
                          <StarRow value={r.rating} />
                        </div>
                        <span className="prev-date">
                    {new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                      </div>
                      <p className="prev-comment">"{r.comment}"</p>
                    </div>
                ))}
              </div>
          )}
        </div>

        <Footer />
      </div>
  );
}
