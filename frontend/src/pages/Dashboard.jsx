import React from 'react';
import { Navigate } from 'react-router-dom';
import CustomerDashboard from './CustomerDashboard';
import ProviderDashboard from './ProviderDashboard';
import AdminDashboard from './AdminDashboard';

// Single /dashboard route that renders the right dashboard for whoever is
// logged in, based on the role saved in localStorage during login.
export default function Dashboard() {
  const token = localStorage.getItem('token');
  const role = (localStorage.getItem('role') || '').toLowerCase();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'provider') return <ProviderDashboard />;
  if (role === 'admin') return <AdminDashboard />;
  return <CustomerDashboard />;
}
