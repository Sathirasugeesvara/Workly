import api from "./api";

/**
 * Provider dashboard analytics endpoints (provider-scoped — returns only
 * the logged-in provider's own data, resolved from their auth token).
 *
 * Suggested REST shape (adjust to match your Spring Boot controllers):
 *
 *   GET /api/provider/summary
 *     -> { name, avatarUrl, rating, verified,
 *          pendingRequests, acceptedJobs, completedJobs }
 *
 *   GET /api/provider/analytics/earnings?months=6
 *     -> [{ month: "Feb", earnings: 42000 }, ...]
 *
 *   GET /api/provider/analytics/booking-status
 *     -> [{ status: "PENDING", count: 3 }, ...]
 *
 *   GET /api/provider/reviews/latest?limit=5
 *     -> [{ id, customer, rating, comment, date }, ...]
 *
 *   GET /api/provider/schedule?days=30
 *     -> [{ date: "2026-07-14", title: "AC servicing — Roshan J." }, ...]
 *
 *   GET /api/providers/:id/reviews
 *     -> public reviews for any provider profile (used on the profile page's
 *        "View reviews" button, not scoped to the logged-in user)
 *        -> [{ id, customer, rating, comment, date }, ...]
 */

export const getProviderSummary = () => api.get("/provider/summary");

export const getEarningsTrend = (months = 6) =>
    api.get(`/provider/analytics/earnings?months=${months}`);

export const getProviderBookingStatus = () =>
    api.get("/provider/analytics/booking-status");

export const getProviderReviews = (limit = 5) =>
    api.get(`/provider/reviews/latest?limit=${limit}`);

export const getProviderSchedule = (days = 30) =>
    api.get(`/provider/schedule?days=${days}`);

export const getReviewsForProvider = (id) => api.get(`/providers/${id}/reviews`);

/**
 * Public listing of verified providers, for the browse/booking flow.
 * GET /api/providers
 *   -> [{ providerId, name, service, location, rating, reviews,
 *          jobsDone, verified, skills, avatarUrl }, ...]
 */
export const getVerifiedProviders = () => api.get("/providers");