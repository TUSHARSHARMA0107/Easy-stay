import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function OwnerRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "OWNER") return <Navigate to="/" />;
  return children;
}