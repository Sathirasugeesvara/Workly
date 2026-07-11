import api from "./api";

/**
 * Admin analytics endpoints (all admin-only).
 * Everything here is expected to be wired up once the Spring Boot admin
 * controller exists — each call below tries the real endpoint first, and
 * AdminDashboard.jsx falls back to demo data per-section if it 404s/fails,
 * so you can build the backend incrementally without breaking the UI.
 *
 * Suggested REST shape (adjust paths to match your @RequestMapping values):
 *
 *   GET /api/admin/summary
 *     -> { customers, providers, totalBookings, revenue,
 *          pendingVerifications, adminName }
 *
 *   GET /api/admin/analytics/booking-status
 *     -> [{ status: "PENDING", count: 12 }, ...]
 *
 *   GET /api/admin/analytics/user-growth?months=6
 *     -> [{ month: "Feb", customers: 120, providers: 18 }, ...]
 *
 *   GET /api/admin/analytics/category-popularity
 *     -> [{ category: "Electrical", bookings: 84 }, ...]
 *
 *   GET /api/admin/analytics/booking-trend?days=30
 *     -> [{ date: "2026-06-12", bookings: 14 }, ...]
 *
 *   GET /api/admin/bookings/recent?limit=10
 *     -> [{ id, service, customer, provider, date, status, amount }, ...]
 *
 *   GET /api/admin/reviews/latest?limit=10
 *     -> [{ id, customer, provider, rating, comment, date }, ...]
 *
 *   GET /api/admin/platform-health
 *     -> { uptimePercent, avgResponseMs, openDisputes,
 *          avgRating, verifiedProviderRate, activeSessions }
 */

export const getAdminSummary = () => api.get("/admin/summary");

export const getBookingStatusBreakdown = () =>
  api.get("/admin/analytics/booking-status");

export const getUserGrowth = (months = 6) =>
  api.get(`/admin/analytics/user-growth?months=${months}`);

export const getCategoryPopularity = () =>
  api.get("/admin/analytics/category-popularity");

export const getBookingTrend = (days = 30) =>
  api.get(`/admin/analytics/booking-trend?days=${days}`);

export const getRecentBookingsList = (limit = 10) =>
  api.get(`/admin/bookings/recent?limit=${limit}`);

export const getLatestReviews = (limit = 10) =>
  api.get(`/admin/reviews/latest?limit=${limit}`);

export const getPlatformHealth = () => api.get("/admin/platform-health");