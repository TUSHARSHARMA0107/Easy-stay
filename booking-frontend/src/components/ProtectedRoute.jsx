import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ roles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) return <Navigate to="/login" replace />;

  if (roles?.length && !roles.includes(user.role)) {
    // role not allowed: send to home (or a 403 page)
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}