// ProtectedRoute.js
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import MainLayout from '../MainLayout'; // adjust the path to where your MainLayout component is

const ProtectedRoute = () => {
  const token = Cookies.get('jwt_token');
  const userRole = Cookies.get('userRole');

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <MainLayout>
      <Outlet/>
    </MainLayout>
  );
};

export default ProtectedRoute;
