import api from "./api";

/**
 * Provider dashboard analytics endpoints (provider-scoped — returns only
 * the logged-in provider's own data, resolved from their auth token).
 */

export const getProviderSummary = () => api.get("/provider/summary");

export const getEarningsTrend = (months = 6) =>
    api.get(`/provider/analytics/earnings?months=${months}`);

export const getProviderBookingStatus = () =>
    api.get("/provider/analytics/booking-status");

export const getProviderReviews = (limit = 5) =>
    api.get(`/provider/reviews?limit=${limit}`);

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
export const getProviderProfile = (id) => api.get(`/providers/${id}`);

export const getMyProviderProfile = () =>
    api.get("/provider/profile");

export const updateMyProviderProfile = (data) =>
    api.put("/provider/profile", data);