import api from "./api";

/**
 * Admin API service.
 * Maps 1:1 to the endpoints exposed by AdminController.java.
 * No other endpoints exist — do not add analytics/summary/health/review calls here.
 */

// GET /api/admin/profile -> AdminResponse
export const getAdminProfile = () => api.get("/admin/profile");

// GET /api/admin/customers -> List<AdminCustomerResponse>
export const getAdminCustomers = () => api.get("/admin/customers");

// GET /api/admin/providers -> List<AdminProviderResponse>
export const getAdminProviders = () => api.get("/admin/providers");

// GET /api/admin/services -> List<ServiceResponse>
export const getAdminServices = () => api.get("/admin/services");

// GET /api/admin/bookings -> List<BookingResponse>
export const getAdminBookings = () => api.get("/admin/bookings");