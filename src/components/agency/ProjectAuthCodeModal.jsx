import React, { useState } from "react";
import { Lock, ShieldAlert, Sparkles, AlertCircle, X, KeyRound, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

export default function ProjectAuthCodeModal({ isOpen, project, onClose, onAuthSuccess }) {
  const targetCode = project?.projectAuthCode || "MORTH-NE4-8821";
  const [inputCode, setInputCode] = useState(targetCode);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync inputCode when target project changes
  React.useEffect(() => {
    if (project?.projectAuthCode) {
      setInputCode(project.projectAuthCode);
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const handleAutoFill = () => {
    setInputCode(targetCode);
    setError("");
    onAuthSuccess(project);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      onAuthSuccess(project);
      onClose();
      setLoading(false);
    }, 200);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-box modal-content" style={{
        width: "100%",
        maxWidth: "480px",
        border: "1px solid var(--border-medium)",
        boxShadow: "var(--shadow-xl)",
        overflow: "hidden",
        background: "var(--bg-white)"
      }}>
        {/* Top Amber Stripe */}
        <div style={{ height: "5px", background: "linear-gradient(90deg, var(--accent-amber), #fbbf24, #d97706)" }} />

        <div style={{ padding: "28px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
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
                <Lock size={24} />
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--accent-amber)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Project Security Clearance 🔒
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", marginTop: "2px", fontFamily: "var(--font-heading)" }}>
                  Enter Project Access Code
                </h3>
              </div>
            </div>

            <button
              onClick={() => {
                setError("");
                setInputCode("");
                onClose();
              }}
              style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Project Context Box */}
          <div style={{
            background: "var(--bg-soft)",
            border: "1px solid var(--border-light)",
            borderRadius: "var(--radius-md)",
            padding: "16px",
            marginBottom: "20px"
          }}>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.04em" }}>
              Target Protected Project:
            </div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "var(--royal-900)", marginTop: "4px" }}>
              {project.name}
            </div>
            <div style={{ fontSize: "12px", color: "var(--royal-600)", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
              Code: {project.projectCode} • {project.agency}
            </div>
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label className="gov-label" style={{ marginBottom: 0 }}>
                  Project Authorization Key / Access Code *
                </label>
                <button
                  type="button"
                  onClick={handleAutoFill}
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
                placeholder={`e.g. ${targetCode}`}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                required
                style={{ letterSpacing: "0.08em", fontFamily: "var(--font-mono)", fontWeight: "600" }}
              />
            </div>

            {/* 1-Click Demo Helper Pill */}
            <button
              type="button"
              onClick={handleAutoFill}
              style={{
                padding: "10px 14px",
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
              <Sparkles size={15} style={{ color: "var(--accent-amber)" }} />
              ⚡ Auto-Fill Authorized Code: <b>{targetCode}</b>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-main"
              style={{
                background: "linear-gradient(135deg, var(--accent-amber), #d97706)",
                marginTop: "4px",
                padding: "14px",
                boxShadow: "0 4px 14px rgba(217, 119, 6, 0.25)"
              }}
            >
              {loading ? "Verifying Authorization..." : "Verify & Unlock Project Details →"}
            </button>

            <div style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "center", lineHeight: "1.5", marginTop: "4px" }}>
              🛡️ Agency access permissions are strictly restricted to authorized project corridors.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
