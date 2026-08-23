import React, { useState } from "react";
import { Lock, Mail, ArrowRight, Eye, EyeOff, AlertCircle, Building2, Landmark, ShieldAlert, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export default function LoginForm({ onLoginSuccess, onSwitchToSignUp, onOpenMinistryModal, onOpenRegionalModal }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleQuickFillAgency = () => {
    setEmail("project.agency@nhai.org");
    setPassword("Agency@Nhai2026");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.isMinistryLocked) {
        onOpenMinistryModal();
        return;
      }

      if (data.isRegionalLocked) {
        onOpenRegionalModal();
        return;
      }

      if (data.success && data.user) {
        onLoginSuccess(data.user);
      } else {
        setError(data.message || "Invalid Project Agency email or password.");
      }
    } catch (err) {
      // Fallback client login for presentation
      if (email.includes("morth") || email.includes("apex")) {
        onOpenMinistryModal();
        return;
      } else if (email.includes("regional") || email.includes("cala")) {
        onOpenRegionalModal();
        return;
      }

      onLoginSuccess({
        name: "Er. Vikramaditya Rao",
        email: email || "project.agency@nhai.org",
        profile: "project_agency",
        agencyName: "National Highways Authority of India (NHAI)"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Top Government Profiles Selector Cards */}
      <div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px"
        }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            🏛️ Government Authority Portals:
          </span>
          <span style={{ fontSize: "10.5px", color: "var(--accent-emerald)", fontWeight: "700" }}>
            2FA Protected 🔒
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {/* Ministry Apex Card Button */}
          <button
            type="button"
            onClick={onOpenMinistryModal}
            style={{
              padding: "12px 14px",
              background: "linear-gradient(135deg, rgba(217, 119, 6, 0.06) 0%, var(--bg-white) 100%)",
              border: "1.5px solid rgba(217, 119, 6, 0.25)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "4px",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(217, 119, 6, 0.08)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
              <span style={{ fontSize: "20px" }}>🏛️</span>
              <span style={{ fontSize: "10px", fontWeight: "800", color: "var(--accent-amber)", background: "rgba(217, 119, 6, 0.12)", padding: "2px 6px", borderRadius: "4px" }}>
                APEX 🔒
              </span>
            </div>
            <div style={{ fontSize: "13px", fontWeight: "800", color: "var(--royal-900)", marginTop: "2px" }}>
              Ministry Apex
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: "1.2" }}>
              National master pipeline & fast-track sanctions
            </div>
          </button>

          {/* Regional Officer Card Button */}
          <button
            type="button"
            onClick={onOpenRegionalModal}
            style={{
              padding: "12px 14px",
              background: "linear-gradient(135deg, var(--royal-50) 0%, var(--bg-white) 100%)",
              border: "1.5px solid var(--royal-200)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "4px",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(30, 58, 138, 0.08)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
              <span style={{ fontSize: "20px" }}>⚖️</span>
              <span style={{ fontSize: "10px", fontWeight: "800", color: "var(--royal-700)", background: "var(--royal-100)", padding: "2px 6px", borderRadius: "4px" }}>
                CALA 🔒
              </span>
            </div>
            <div style={{ fontSize: "13px", fontWeight: "800", color: "var(--royal-900)", marginTop: "2px" }}>
              Regional Officer
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: "1.2" }}>
              Ground verification, PAFs audit & hearings
            </div>
          </button>
        </div>
      </div>

      <div style={{ height: "1px", background: "var(--border-light)" }} />

      {/* Main Project Agency Sign In Form */}
      <div>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 10px",
          background: "var(--royal-50)",
          border: "1px solid var(--royal-100)",
          borderRadius: "var(--radius-full)",
          color: "var(--royal-700)",
          fontSize: "11px",
          fontWeight: "700",
          textTransform: "uppercase",
          marginBottom: "8px"
        }}>
          <span>🏗️</span> Project Agency Workspace
        </div>
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
          Agency Sign In
        </h2>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
          Sign in to access your Right-of-Way & corridor management desk.
        </p>
      </div>

      {/* 1-Click Demo Fill for Pitch */}
      <button
        type="button"
        onClick={handleQuickFillAgency}
        style={{
          padding: "9px 12px",
          background: "var(--bg-soft)",
          border: "1px dashed var(--border-medium)",
          borderRadius: "var(--radius-sm)",
          color: "var(--text-secondary)",
          fontSize: "12px",
          fontWeight: "600",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          transition: "all 0.2s ease"
        }}
      >
        <Sparkles size={13} style={{ color: "var(--royal-500)" }} />
        ⚡ 1-Click Auto-Fill Agency Credentials (Demo)
      </button>

      {error && (
        <div style={{
          padding: "10px 12px",
          background: "rgba(225, 29, 72, 0.06)",
          border: "1px solid rgba(225, 29, 72, 0.15)",
          borderRadius: "var(--radius-sm)",
          color: "var(--accent-rose)",
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div>
          <label className="gov-label">Agency Email / User ID</label>
          <input
            type="email"
            className="gov-input"
            placeholder="e.g. project.agency@nhai.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="gov-label">Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              className="gov-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "var(--text-dim)",
                cursor: "pointer"
              }}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-main"
          style={{ marginTop: "4px" }}
        >
          {loading ? "Authenticating..." : "Sign In to Agency Portal →"}
        </button>

        <div style={{ textAlign: "center", fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
          New Project Agency?{" "}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--royal-600)",
              fontWeight: "600",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            Register with Ministry Code
          </button>
        </div>
      </form>
    </div>
  );
}
