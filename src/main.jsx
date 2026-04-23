import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";

import "./index.css";

import App from "./App.jsx";
import AdminLogin from "./admin/pages/AdminLogin.jsx";
import AdminDashboard from "./admin/pages/AdminDashboard.jsx";
import ProtectedRoute from "./admin/components/protectedRoutes.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        {/* PUBLIC — Customer Booking Form */}
        <Route path="/" element={<App />} />

        {/* PUBLIC — Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* PROTECTED — Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  </StrictMode>,
);
