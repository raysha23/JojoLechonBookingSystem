import { Navigate } from "react-router-dom";

export default function EncoderProtectedRoute({ children }) {
  try {
    const raw = sessionStorage.getItem("encoder");
    if (!raw) return <Navigate to="/encoder/login" replace />;
    const encoder = JSON.parse(raw);
    if (!encoder?.id) {
      sessionStorage.removeItem("encoder");
      return <Navigate to="/encoder/login" replace />;
    }
    return children;
  } catch {
    sessionStorage.removeItem("encoder");
    return <Navigate to="/encoder/login" replace />;
  }
}
