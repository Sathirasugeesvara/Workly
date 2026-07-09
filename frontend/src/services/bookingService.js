import api from "./api";

/**
 * Assumed REST conventions (adjust paths to match your Spring Boot
 * @RequestMapping values if they differ):
 *
 *   POST   /api/bookings                    -> create a booking (customer)
 *   GET    /api/bookings/me                 -> current customer's bookings
 *   GET    /api/bookings/provider           -> current provider's job requests
 *   GET    /api/admin/bookings              -> all bookings (admin only)
 *   PATCH  /api/bookings/:id/status         -> update status (accept/reject/complete/cancel)
 *   DELETE /api/bookings/:id                -> remove a booking record
 */

export const createBooking = (data) => api.post("/bookings", data);

export const getMyBookings = () => api.get("/bookings/me");

export const getProviderJobs = () => api.get("/bookings/provider");

export const getAllBookings = () => api.get("/admin/bookings");

export const updateBookingStatus = (id, status) =>
  api.patch(`/bookings/${id}/status`, { status });

export const cancelBooking = (id) => updateBookingStatus(id, "CANCELLED");

export const acceptBooking = (id) => updateBookingStatus(id, "ACCEPTED");

export const rejectBooking = (id) => updateBookingStatus(id, "REJECTED");

export const completeBooking = (id) => updateBookingStatus(id, "COMPLETED");

export const deleteBooking = (id) => api.delete(`/bookings/${id}`);
