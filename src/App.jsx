import React, { useState, useEffect } from "react";
import AuthPage from "./components/AuthPage";
import AgencyDashboard from "./components/agency/AgencyDashboard";
import RegionalOfficerDashboard from "./components/regional/RegionalOfficerDashboard";
import MinistryApexDashboard from "./components/ministry/MinistryApexDashboard";

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("bhoomi_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem("bhoomi_user", JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("bhoomi_user");
    } catch (e) {
      console.error(e);
    }
  };

  // Pre-seed backend presentation demo accounts
  useEffect(() => {
    fetch("/api/auth/seed")
      .then((res) => res.json())
      .then((data) => {
        console.log("MongoDB Seed Status:", data);
      })
      .catch((err) => {
        console.log("Backend offline or local mode:", err.message);
      });
  }, []);

  // 1. Ministry Apex Profile Dashboard
  if (currentUser && (currentUser.profile === "ministry_apex" || currentUser.profile === "ministry")) {
    return (
      <MinistryApexDashboard
        user={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  // 2. Regional Officer Profile Dashboard
  if (currentUser && (currentUser.profile === "regional_officer" || currentUser.profile === "regional")) {
    return (
      <RegionalOfficerDashboard
        user={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  // 3. Project Agency Profile Dashboard (or any authenticated profile fallback)
  if (currentUser) {
    return (
      <AgencyDashboard
        user={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  // 4. Main Auth & Landing Page
  return (
    <AuthPage
      currentUser={currentUser}
      onLogin={handleLogin}
      onLogout={handleLogout}
    />
  );
}
