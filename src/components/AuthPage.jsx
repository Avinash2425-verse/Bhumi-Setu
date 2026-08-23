import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import MinistryModal from "./MinistryModal";
import RegionalOfficerModal from "./RegionalOfficerModal";
import UserDashboardPreview from "./UserDashboardPreview";

export default function AuthPage({ currentUser, onLogin, onLogout }) {
  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'signup'
  const [isMinistryOpen, setIsMinistryOpen] = useState(false);
  const [isRegionalOpen, setIsRegionalOpen] = useState(false);

  if (currentUser) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div className="gov-strip" />
        
        <header style={{
          padding: "16px 24px",
          background: "var(--bg-white)",
          borderBottom: "1px solid var(--border-light)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "22px" }}>🏛️</span>
            <div>
              <div style={{ fontSize: "16px", fontWeight: "800", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
                BHOOMI SETU <span style={{ color: "var(--accent-amber)", fontWeight: "700" }}>भूमि-सेतु</span>
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                National Land Acquisition & Management System
              </div>
            </div>
          </div>

          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            User: <b style={{ color: "var(--text-primary)" }}>{currentUser.name}</b>
          </div>
        </header>

        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <UserDashboardPreview user={currentUser} onLogout={onLogout} />
        </main>
      </div>
    );
  }

  return (
    <div className="ocean-bg" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Tricolor Strip */}
      <div className="gov-strip" />

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "50px 20px"
      }}>
        <div style={{
          maxWidth: "1080px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "50px",
          alignItems: "center"
        }}>
          {/* LEFT SIDE: Branding & Explanation */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "10px", animation: "fadeInUp 0.6s ease both" }}>
            {/* Government Tag */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              background: "var(--royal-50)",
              border: "1px solid var(--royal-100)",
              borderRadius: "var(--radius-full)",
              width: "fit-content"
            }}>
              <span style={{ fontSize: "14px" }}>🇮🇳</span>
              <span style={{
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.06em",
                color: "var(--royal-700)",
                textTransform: "uppercase"
              }}>
                Government of India • PM Gati Shakti
              </span>
            </div>

            {/* Web Page Name: BHOOMI SETU */}
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px", flexWrap: "wrap" }}>
                <h1 style={{
                  fontSize: "44px",
                  fontWeight: "700",
                  color: "var(--royal-900)",
                  fontFamily: "var(--font-heading)",
                  lineHeight: "1.15"
                }}>
                  Bhoomi Setu
                </h1>
                <span style={{
                  fontSize: "26px",
                  fontWeight: "600",
                  color: "var(--accent-amber)",
                  fontFamily: "var(--font-heading)"
                }}>
                  भूमि-सेतु
                </span>
              </div>

              {/* Description Lines */}
              <p style={{
                fontSize: "16px",
                color: "var(--text-secondary)",
                marginTop: "16px",
                lineHeight: "1.7",
                maxWidth: "480px"
              }}>
                A unified real-time national digital platform for transparent land acquisition, statutory monitoring, and decision support under <b>PM Gati Shakti</b> & the <b>RFCTLARR Act 2013</b>.
              </p>
              
              <p style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                marginTop: "10px",
                lineHeight: "1.65",
                maxWidth: "480px"
              }}>
                Streamlining statutory approvals, cadastral GIS corridor overlays, and transparent direct compensation management for national infrastructure projects.
              </p>
            </div>

            {/* Feature Highlights as Elegant Pills */}
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "4px"
            }}>
              {[
                { text: "RFCTLARR 2013 Awards", color: "var(--royal-700)", bg: "var(--royal-50)", border: "var(--royal-100)" },
                { text: "Real-Time Cadastral GIS", color: "var(--accent-teal)", bg: "rgba(13, 148, 136, 0.06)", border: "rgba(13, 148, 136, 0.15)" },
                { text: "Secure Role-Based Access", color: "var(--accent-amber)", bg: "rgba(217, 119, 6, 0.06)", border: "rgba(217, 119, 6, 0.15)" }
              ].map((tag, i) => (
                <span key={i} style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: tag.color,
                  background: tag.bg,
                  border: `1px solid ${tag.border}`,
                  padding: "5px 12px",
                  borderRadius: "var(--radius-full)",
                  letterSpacing: "0.01em"
                }}>
                  ✓ {tag.text}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Auth Card (Sign In / Sign Up) */}
          <div className="glass-box" style={{
            padding: "32px",
            animation: "fadeInUp 0.6s ease 0.15s both",
            background: "var(--bg-glass-strong)",
            boxShadow: "var(--shadow-xl), 0 0 60px rgba(59, 130, 246, 0.06)"
          }}>
            {/* Tab Switcher */}
            <div style={{
              display: "flex",
              background: "var(--bg-mist)",
              borderRadius: "var(--radius-md)",
              padding: "4px",
              marginBottom: "24px",
              border: "1px solid var(--border-light)"
            }}>
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  background: activeTab === "login" ? "var(--bg-white)" : "transparent",
                  color: activeTab === "login" ? "var(--royal-800)" : "var(--text-muted)",
                  fontWeight: activeTab === "login" ? "700" : "500",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: activeTab === "login" ? "var(--shadow-sm)" : "none"
                }}
              >
                Sign In (Agency & Staff)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("signup")}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  background: activeTab === "signup" ? "var(--bg-white)" : "transparent",
                  color: activeTab === "signup" ? "var(--accent-amber)" : "var(--text-muted)",
                  fontWeight: activeTab === "signup" ? "700" : "500",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: activeTab === "signup" ? "var(--shadow-sm)" : "none"
                }}
              >
                Sign Up (Project Agency)
              </button>
            </div>

            {/* Active Form */}
            {activeTab === "login" ? (
              <LoginForm
                onLoginSuccess={onLogin}
                onSwitchToSignUp={() => setActiveTab("signup")}
                onOpenMinistryModal={() => setIsMinistryOpen(true)}
                onOpenRegionalModal={() => setIsRegionalOpen(true)}
              />
            ) : (
              <SignUpForm
                onRegisterSuccess={onLogin}
                onSwitchToLogin={() => setActiveTab("login")}
              />
            )}
          </div>
        </div>
      </div>

      {/* Special Locked Ministry 2FA Modal */}
      <MinistryModal
        isOpen={isMinistryOpen}
        onClose={() => setIsMinistryOpen(false)}
        onLoginSuccess={onLogin}
      />

      {/* Special Locked Regional Officer Modal */}
      <RegionalOfficerModal
        isOpen={isRegionalOpen}
        onClose={() => setIsRegionalOpen(false)}
        onLoginSuccess={onLogin}
      />

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: "18px 20px",
        fontSize: "12px",
        color: "var(--text-dim)",
        borderTop: "1px solid var(--border-light)",
        background: "var(--bg-white)"
      }}>
        National Land Acquisition & Management Platform • Government of India
      </footer>
    </div>
  );
}
