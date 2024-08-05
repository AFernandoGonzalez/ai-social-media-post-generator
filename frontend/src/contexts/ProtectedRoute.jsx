import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Loading from '../components/Loading'; 

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
