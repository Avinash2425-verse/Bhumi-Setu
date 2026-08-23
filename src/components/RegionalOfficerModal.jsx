import React, { useState } from "react";
import { Lock, Landmark, Sparkles, AlertCircle, X, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";

export default function RegionalOfficerModal({ isOpen, onClose, onLoginSuccess }) {
  const [officerEmail, setOfficerEmail] = useState("");
  const [password, setPassword] = useState("");
  const [districtPasskey, setDistrictPasskey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleAutoFill = () => {
    setOfficerEmail("regional.officer@gujarat.gov.in");
    setPassword("Officer@Gujarat2026");
    setDistrictPasskey("CALA-GUJ-2026");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/regional-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ officerEmail, password, districtPasskey })
      });

      const data = await response.json();

      if (data.success && data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.message || "Invalid Regional Officer credentials.");
      }
    } catch (err) {
      // Fallback for presentation demo
      onLoginSuccess({
        name: "Shri S. K. Verma, IAS",
        email: officerEmail || "regional.officer@gujarat.gov.in",
        profile: "regional_officer",
        jurisdiction: "Bharuch & Vadodara District (CALA)",
        clearanceLevel: "Statutory Revenue Authority"
      });
      onClose();
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
        {/* Royal Blue Stripe */}
        <div style={{ height: "5px", background: "linear-gradient(90deg, var(--royal-400), var(--royal-600), var(--royal-800))" }} />

        <div style={{ padding: "28px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "var(--radius-md)",
                background: "var(--royal-50)",
                border: "1px solid var(--royal-100)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--royal-600)"
              }}>
                <Landmark size={24} />
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--royal-600)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  State / District Authority 🔒
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", marginTop: "2px", fontFamily: "var(--font-heading)" }}>
                  Regional Officer Profile
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
              <label className="gov-label">Official State / CALA Email (.gov.in)</label>
              <input
                type="email"
                className="gov-input"
                placeholder="regional.officer@gujarat.gov.in"
                value={officerEmail}
                onChange={(e) => setOfficerEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="gov-label">Officer Password</label>
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
                <label className="gov-label" style={{ marginBottom: 0 }}>District Security Passkey</label>
                <span style={{ fontSize: "11px", color: "var(--royal-500)" }}>Demo: CALA-GUJ-2026</span>
              </div>
              <input
                type="text"
                className="gov-input"
                placeholder="CALA-GUJ-2026"
                value={districtPasskey}
                onChange={(e) => setDistrictPasskey(e.target.value)}
                style={{ letterSpacing: "0.1em", fontFamily: "var(--font-mono)", fontWeight: "700" }}
              />
            </div>

            {/* 1-Click Auto Fill */}
            <button
              type="button"
              onClick={handleAutoFill}
              style={{
                padding: "12px",
                background: "var(--bg-soft)",
                border: "1px dashed var(--border-medium)",
                borderRadius: "var(--radius-sm)",
                color: "var(--royal-600)",
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
              ⚡ Auto-Fill Regional Officer Credentials (Demo)
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-main"
              style={{
                background: "linear-gradient(135deg, var(--royal-600), var(--royal-800))",
                marginTop: "6px",
                padding: "14px",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.25)"
              }}
            >
              {loading ? "Authenticating..." : "Unlock Regional Officer Desk →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
