import api from "./api";

/**
 * Assumed REST conventions (adjust paths to match your Spring Boot
 * @RequestMapping values if they differ):
 *
 *   GET    /api/users/me            -> current logged-in user's profile
 *   PUT    /api/users/me            -> update current user's profile
 *   DELETE /api/users/me            -> delete current user's account
 *   GET    /api/users/:id           -> public profile (customer or provider) by id
 *
 *   GET    /api/admin/users              -> list all users (admin only)
 *   PATCH  /api/admin/users/:id/verify   -> verify a provider (admin only)
 *   DELETE /api/admin/users/:id          -> remove a user (admin only)
 */

export const getMyProfile = () => api.get("/users/me");

export const updateMyProfile = (data) => api.put("/users/me", data);

export const deleteMyAccount = () => api.delete("/users/me");

export const getUserById = (id) => api.get(`/users/${id}`);

export const getAllUsers = () => api.get("/admin/users");

export const verifyProvider = (id) => api.patch(`/admin/users/${id}/verify`);

export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
