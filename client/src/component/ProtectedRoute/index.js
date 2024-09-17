// import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import MainLayout from "../MainLayout"; // adjust the path if necessary

const ProtectedRoute = () => {
  const location = useLocation();
  const token = Cookies.get("jwt_token");
  const userRole = Cookies.get("role");

  // If no token exists, redirect to the login page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Handling HOD Dashboard access
  if (location.pathname.includes("/hod-dashboard")) {
    if (userRole === "HOD") {
      return (
        <MainLayout>
          <Outlet />
        </MainLayout>
      );
    } else {
      // Redirect non-HOD users trying to access the HOD Dashboard to the home page
      return <Navigate to="/home" replace />;
    }
  }

  // For other authenticated routes, render normally
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default ProtectedRoute;
