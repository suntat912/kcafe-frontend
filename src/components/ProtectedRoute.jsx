import React from 'react';
import { Navigate } from 'react-router-dom';
import { getStoredUser } from '../utils/userSession';

const roleHomeMap = {
  admin: '/admin/dashboard',
  customer: '/customer/home',
};

const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = getStoredUser();

  if (!user?.id) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={roleHomeMap[user.role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;
