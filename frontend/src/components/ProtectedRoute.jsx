import React from 'react';
import { Navigate } from 'react-router-dom';

// Wrap any route element that should only be reachable while logged in.
// Pass allowedRoles to also restrict by role, e.g.:
//   <ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>
// Role comparison is case-insensitive since localStorage stores it lowercase
// ("customer"/"provider"/"admin") but routes may check uppercase.
export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const role = (localStorage.getItem('role') || '').toUpperCase();
    const allowed = allowedRoles.map((r) => r.toUpperCase());
    if (!allowed.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}
