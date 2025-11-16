import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OwnerRoute({ children }) {
  const { user } = useAuth();

  if (!user || user.role !== "OWNER") {
    return <Navigate to="/login" replace />;
  }

  return children;
}