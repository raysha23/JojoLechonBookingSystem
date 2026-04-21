import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Checks if admin is logged in
  // When backend is ready, replace this with a real token check
  const isAuthenticated =
    localStorage.getItem("adminToken") === "authenticated";

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
