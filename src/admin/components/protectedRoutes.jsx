import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  try {
    const raw = localStorage.getItem("adminToken");
    if (!raw) return <Navigate to="/admin/login" replace />;
    const admin = JSON.parse(raw);
    if (!admin?.role || admin.role !== "admin") {
      localStorage.removeItem("adminToken");
      return <Navigate to="/admin/login" replace />;
    }
    return children;
  } catch {
    localStorage.removeItem("adminToken");
    return <Navigate to="/admin/login" replace />;
  }
}
