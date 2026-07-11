import api from "./api";

/**
 * Admin management endpoints — provider verification, customer/provider/
 * service CRUD. Split from adminService.js (which only holds analytics
 * reads) since these are write-heavy admin actions.
 *
 * Suggested REST shape (adjust to match your Spring Boot controllers):
 *
 *   GET    /api/admin/providers/pending          -> providers awaiting verification
 *   PATCH  /api/admin/providers/:id/approve      -> approve a pending provider
 *   PATCH  /api/admin/providers/:id/reject       -> reject a pending provider
 *
 *   GET    /api/admin/customers                  -> list all customers
 *   GET    /api/admin/customers/:id               -> single customer profile
 *   DELETE /api/admin/customers/:id               -> remove a customer
 *
 *   GET    /api/admin/providers                  -> list all verified+unverified providers
 *   GET    /api/admin/providers/:id                -> single provider profile
 *   DELETE /api/admin/providers/:id                -> remove a provider
 *   PATCH  /api/admin/providers/:id/demote        -> demote a verified provider back to unverified
 *   PUT    /api/admin/providers/:id/skills        -> update a provider's skill list
 *
 *   GET    /api/admin/services                    -> list all service catalog entries
 *   POST   /api/admin/services                     -> create a new service
 *   PUT    /api/admin/services/:id                  -> update a service
 *   DELETE /api/admin/services/:id                  -> delete a service
 */

/* ---------- Provider verification ---------- */

export const getPendingProviders = () => api.get("/admin/providers/pending");

export const approveProvider = (id) => api.patch(`/admin/providers/${id}/approve`);

export const rejectProvider = (id) => api.patch(`/admin/providers/${id}/reject`);

/* ---------- Customers ---------- */

export const getAllCustomers = () => api.get("/admin/customers");

export const getCustomerById = (id) => api.get(`/admin/customers/${id}`);

export const deleteCustomerById = (id) => api.delete(`/admin/customers/${id}`);

/* ---------- Providers ---------- */

export const getAllProviders = () => api.get("/admin/providers");

export const getProviderById = (id) => api.get(`/admin/providers/${id}`);

export const deleteProviderById = (id) => api.delete(`/admin/providers/${id}`);

export const demoteProvider = (id) => api.patch(`/admin/providers/${id}/demote`);

export const updateProviderSkills = (id, skills) =>
  api.put(`/admin/providers/${id}/skills`, { skills });

/* ---------- Services catalog ---------- */

export const getAllServicesAdmin = () => api.get("/admin/services");

export const createService = (data) => api.post("/admin/services", data);

export const updateService = (id, data) => api.put(`/admin/services/${id}`, data);

export const deleteService = (id) => api.delete(`/admin/services/${id}`);
