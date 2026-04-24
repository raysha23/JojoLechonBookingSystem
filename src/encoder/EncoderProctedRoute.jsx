import { Navigate } from "react-router-dom";

export default function EncoderProtectedRoute({ children }) {
  const encoder = sessionStorage.getItem("encoder");
  if (!encoder) return <Navigate to="/encoder/login" replace />;
  return children;
}
