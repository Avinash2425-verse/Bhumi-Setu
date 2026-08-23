import React, { useState } from "react";
import { Building2, Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles, Key, CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";

export default function SignUpForm({ onRegisterSuccess, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agencyName, setAgencyName] = useState("NHAI - National Highways Authority of India");
  const [authCode, setAuthCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAutoFillAuthCode = () => {
    setAuthCode("MORTH-AGENCY-2026");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!authCode.trim()) {
      setError("Ministry Authorization Code is required for Project Agency onboarding.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Project Agency Lead",
          email,
          password,
          authCode,
          agencyName,
          profile: "project_agency"
        })
      });

      const data = await response.json();

      if (data.success && data.user) {
        onRegisterSuccess(data.user);
      } else {
        setError(data.message || "Registration failed. Check your Ministry Authorization Code.");
      }
    } catch (err) {
      // Fallback for presentation demo
      onRegisterSuccess({
        id: "usr-" + Date.now(),
        name: name || "Project Agency Officer",
        email,
        profile: "project_agency",
        agencyName
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
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
          <span>🏗️</span> Project Agency Onboarding
        </div>
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
          Agency Registration
        </h2>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
          Register implementing agency using Ministry-coordinated authorization.
        </p>
      </div>

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
        {/* Full Name & Agency Selection */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label className="gov-label">Representative Name</label>
            <input
              type="text"
              className="gov-input"
              placeholder="e.g. Er. Vikramaditya Rao"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="gov-label">Implementing Agency</label>
            <select
              className="gov-input"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
            >
              <option value="NHAI - National Highways Authority of India">NHAI (National Highways)</option>
              <option value="DFCCIL - Dedicated Freight Corridor Corp">DFCCIL (Freight Rail)</option>
              <option value="Ministry of Railways - Infra Wing">Indian Railways</option>
              <option value="SECI / State Solar Grid">Renewable Energy Grid</option>
            </select>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="gov-label">Official Agency Email *</label>
          <input
            type="email"
            className="gov-input"
            placeholder="engineer@nhai.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Ministry Authorization Code */}
        <div style={{
          background: "var(--bg-soft)",
          border: "1px solid var(--border-medium)",
          borderRadius: "var(--radius-md)",
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label className="gov-label" style={{ marginBottom: 0, color: "var(--accent-amber)" }}>
              🔑 Ministry Authorization Code *
            </label>
            <button
              type="button"
              onClick={handleAutoFillAuthCode}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--accent-amber)",
                fontSize: "11px",
                fontWeight: "700",
                cursor: "pointer",
                textDecoration: "underline"
              }}
            >
              ⚡ Fill Demo Code
            </button>
          </div>

          <input
            type="text"
            className="gov-input"
            placeholder="MORTH-AGENCY-2026"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            required
            style={{ letterSpacing: "0.08em", fontFamily: "var(--font-mono)", fontWeight: "600" }}
          />

          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Coordinated & issued by Central Ministry (MoRTH / PM Gati Shakti) to authorized agencies.
          </div>
        </div>

        {/* Password & Confirm Password */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label className="gov-label">Password *</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="gov-input"
                placeholder="Min 6 chars"
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

          <div>
            <label className="gov-label">Confirm Password *</label>
            <input
              type={showPassword ? "text" : "password"}
              className="gov-input"
              placeholder="Re-enter"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-main"
          style={{ marginTop: "4px" }}
        >
          {loading ? "Verifying Code & Creating..." : "Complete Agency Registration →"}
        </button>

        <div style={{ textAlign: "center", fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
          Already have an authorized account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--royal-600)",
              fontWeight: "600",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            Sign In here
          </button>
        </div>
      </form>
    </div>
  );
}
