import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/AdminPage";

function App() {
  const [user, setUser] = useState(() => {
    // Ambil user saat pertama kali render
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          user ? (
            user.role === "user" ? (
              <Dashboard />
            ) : (
              <Navigate to="/admin" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/admin"
        element={
          user ? (
            user.role === "admin" ? (
              <AdminPage />
            ) : (
              <Navigate to="/dashboard" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="*"
        element={
          <h1 className="text-center mt-10 text-2xl">
            404 - Halaman tidak ditemukan
          </h1>
        }
      />
    </Routes>
  );
}

export default App;
