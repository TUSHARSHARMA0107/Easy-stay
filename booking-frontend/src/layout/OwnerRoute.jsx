import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function OwnerRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center py-10">Loading...</p>;

  if (!user || user.role !== "OWNER") {
    return <Navigate to="/" replace />;
  }

  return children;
}