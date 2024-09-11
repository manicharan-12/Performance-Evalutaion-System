// ProtectedRoute.js
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import MainLayout from "../MainLayout"; // adjust the path to where your MainLayout component is

const ProtectedRoute = () => {
  const token = Cookies.get("jwt_token");
  const userRole = Cookies.get("role");

  if (!token) {
    return <Navigate to="/" />;
  }

  if (window.location.pathname === "/hod-dashboard" && userRole !== "HOD") {
    // Redirect non-HOD users trying to access the HOD Dashboard
    return <Navigate to="/home" />;
  }

  if (userRole === "HOD" && window.location.pathname !== "/hod-dashboard") {
    return <Navigate to="/hod-dashboard" />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default ProtectedRoute;
