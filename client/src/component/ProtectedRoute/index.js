import { Outlet, Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = () => {
  const token = Cookies.get("jwt_token");
  const userRole = Cookies.get("userRole");

  if (!token) {
    return <Navigate to="/" />;
  }

  if (userRole === "PROF") {
    return <Outlet />;
  }
  if (userRole === "HOD") {
    return <Outlet />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
