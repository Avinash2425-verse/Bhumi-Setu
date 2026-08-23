import React, { useState } from "react";
import { Lock, ShieldAlert, Sparkles, AlertCircle, X } from "lucide-react";
import confetti from "canvas-confetti";

export default function MinistryModal({ isOpen, onClose, onLoginSuccess }) {
  const [ministryId, setMinistryId] = useState("");
  const [password, setPassword] = useState("");
  const [securityToken, setSecurityToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleAutoFill = () => {
    setMinistryId("admin.apex@morth.gov.in");
    setPassword("Morth@National2026");
    setSecurityToken("882194");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/ministry-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ministryId, password, securityToken })
      });

      const data = await response.json();

      if (data.success && data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.message || "Invalid Ministry Apex Credentials.");
      }
    } catch (err) {
      // Fallback verification for demo
      if (ministryId.includes("morth") || ministryId.includes("apex")) {
        onLoginSuccess({
          name: "Dr. Rajeshwar Sharma, IAS",
          email: ministryId || "admin.apex@morth.gov.in",
          profile: "ministry_apex",
          clearanceLevel: "Level-1 National Command"
        });
        onClose();
      } else {
        setError("Invalid Credentials. Please click 'Auto-Fill Demo Credentials'.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-box modal-content" style={{
        width: "100%",
        maxWidth: "460px",
        border: "1px solid var(--border-medium)",
        boxShadow: "var(--shadow-xl)",
        overflow: "hidden",
        background: "var(--bg-white)"
      }}>
        {/* Amber Header Accent */}
        <div style={{ height: "5px", background: "linear-gradient(90deg, var(--accent-amber), #fbbf24, #d97706)" }} />

        <div style={{ padding: "28px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "var(--radius-md)",
                background: "rgba(217, 119, 6, 0.08)",
                border: "1px solid rgba(217, 119, 6, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-amber)"
              }}>
                <ShieldAlert size={24} />
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--accent-amber)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Restricted Access 🔒
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", marginTop: "2px", fontFamily: "var(--font-heading)" }}>
                  Ministry Apex Profile
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "4px"
              }}
            >
              <X size={20} />
            </button>
          </div>

          {error && (
            <div style={{
              padding: "12px 14px",
              background: "rgba(225, 29, 72, 0.06)",
              border: "1px solid rgba(225, 29, 72, 0.15)",
              borderRadius: "var(--radius-sm)",
              color: "var(--accent-rose)",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px"
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span style={{ lineHeight: "1.4" }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label className="gov-label">Ministry Official ID</label>
              <input
                type="text"
                className="gov-input"
                placeholder="admin.apex@morth.gov.in"
                value={ministryId}
                onChange={(e) => setMinistryId(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="gov-label">Ministry Security Key</label>
              <input
                type="password"
                className="gov-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label className="gov-label" style={{ marginBottom: 0 }}>NIC 2FA Token (6 Digits)</label>
                <span style={{ fontSize: "11px", color: "var(--accent-amber)" }}>Demo: 882194</span>
              </div>
              <input
                type="text"
                className="gov-input"
                placeholder="882194"
                value={securityToken}
                onChange={(e) => setSecurityToken(e.target.value)}
                maxLength={6}
                style={{ letterSpacing: "0.2em", fontFamily: "var(--font-mono)", fontWeight: "700" }}
              />
            </div>

            {/* 1-Click Demo Fill */}
            <button
              type="button"
              onClick={handleAutoFill}
              style={{
                padding: "12px",
                background: "rgba(217, 119, 6, 0.05)",
                border: "1px dashed rgba(217, 119, 6, 0.3)",
                borderRadius: "var(--radius-sm)",
                color: "var(--accent-amber)",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s ease"
              }}
            >
              <Sparkles size={15} />
              ⚡ Auto-Fill Ministry Credentials (Demo)
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-main"
              style={{
                background: "linear-gradient(135deg, var(--accent-amber), #d97706)",
                marginTop: "6px",
                padding: "14px",
                boxShadow: "0 4px 14px rgba(217, 119, 6, 0.25)"
              }}
            >
              {loading ? "Authenticating..." : "Unlock Ministry Workspace →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
