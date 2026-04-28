import { StrictMode } from "react";
import { useState } from "react";
import EncoderBookings from "./encoder/EncoderBookings.jsx";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";

import "./index.css";

import App from "./App.jsx";
import AdminLogin from "./admin/pages/AdminLogin.jsx";
import AdminDashboard from "./admin/pages/AdminDashboard.jsx";
import ProtectedRoute from "./admin/components/protectedRoutes.jsx";
import EncoderLogin from "./encoder/EncoderLogin.jsx";
import EncoderProtectedRoute from "./encoder/EncoderProctedRoute.jsx";
import CustomerPinGate from "./customer/CustomerPinGate.jsx";

createRoot(document.getElementById("root")).render(
  <HashRouter>
    <Routes>
      {/* CUSTOMER — PIN gated */}
      <Route
        path="/"
        element={
          <CustomerPinGate>
            <App submittedByUserId={null} />
          </CustomerPinGate>
        }
      />

      {/* ENCODER — login then booking */}
      <Route path="/encoder/login" element={<EncoderLogin />} />
      <Route
        path="/encoder/book"
        element={
          <EncoderProtectedRoute>
            <EncoderApp />
          </EncoderProtectedRoute>
        }
      />

      {/* ADMIN */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  </HashRouter>,
);

// Encoder wrapper — reads session and passes userId to App
function EncoderApp() {
  const encoder = JSON.parse(sessionStorage.getItem("encoder") || "{}");
  const [view, setView] = useState("book");

  if (view === "bookings") {
    return (
      <>
        {/* Reuse the header with tabs by passing view/setView */}
        <EncoderBookings
          encoderId={encoder.id}
          encoderName={encoder.fullName}
          view={view}
          setView={setView}
        />
      </>
    );
  }

  return (
    <App
      submittedByUserId={encoder.id}
      encoderName={encoder.fullName}
      view={view}
      setView={setView}
    />
  );
}
