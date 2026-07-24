import api from "./api";

// Customer Profile
export const getMyProfile = () => api.get("/customer/profile");

export const updateMyProfile = (data) =>
  api.put("/customer/profile", {
    fullName: data.name,
    phoneNumber: data.mobile,
    address: data.address,
    gender: data.gender,
    profilePicture: data.image,
    dateOfBirth: data.dob,
    category: data.category,
  });

export const deleteMyAccount = () =>
  api.delete("/customer/profile");

// Public Customer (if needed)
export const getUserById = (id) =>
  api.get(`/customer/${id}`);

// Admin
export const getAllUsers = () =>
  api.get("/admin/customers");

export const deleteUser = (id) =>
  api.delete(`/admin/customers/${id}`);