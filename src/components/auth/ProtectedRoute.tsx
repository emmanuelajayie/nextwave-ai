import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  console.log("Protected route - User:", user, "Loading:", loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log("No user found, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};