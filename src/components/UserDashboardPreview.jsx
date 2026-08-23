import React from "react";
import { LogOut, CheckCircle2, ShieldCheck, Landmark, Building2 } from "lucide-react";

export default function UserDashboardPreview({ user, onLogout }) {
  const getProfileMeta = () => {
    switch (user.profile) {
      case "ministry_apex":
        return {
          title: "Ministry Apex Command (MoRTH)",
          icon: "🏛️",
          color: "#f59e0b",
          badgeBg: "rgba(245, 158, 11, 0.15)",
          badgeBorder: "rgba(245, 158, 11, 0.4)",
          desc: "National Corridor Oversight, Sanctions & Macro Policy"
        };
      case "project_agency":
        return {
          title: "Project Implementing Agency (NHAI)",
          icon: "🏗️",
          color: "#c084fc",
          badgeBg: "rgba(168, 85, 247, 0.15)",
          badgeBorder: "rgba(168, 85, 247, 0.4)",
          desc: "Right-of-Way (RoW) Alignment, Chainage & Possession"
        };
      default:
        return {
          title: "Regional Officer (State / District CALA)",
          icon: "⚖️",
          color: "#38bdf8",
          badgeBg: "rgba(56, 189, 248, 0.15)",
          badgeBorder: "rgba(56, 189, 248, 0.4)",
          desc: "Khasra Joint Measurement, Statutory Gazette & DBT Awards"
        };
    }
  };

  const meta = getProfileMeta();

  return (
    <div className="glass-box" style={{
      maxWidth: "600px",
      width: "100%",
      padding: "28px",
      border: `1px solid ${meta.color}55`,
      boxShadow: `0 0 30px ${meta.color}20`
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <div style={{
            width: "52px",
            height: "52px",
            borderRadius: "12px",
            background: meta.badgeBg,
            border: `1px solid ${meta.badgeBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "26px"
          }}>
            {meta.icon}
          </div>

          <div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: "700",
              textTransform: "uppercase",
              background: meta.badgeBg,
              color: meta.color,
              border: `1px solid ${meta.badgeBorder}`
            }}>
              <ShieldCheck size={12} />
              {meta.title}
            </div>

            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#ffffff", marginTop: "4px" }}>
              {user.name}
            </h2>
            <div style={{ fontSize: "13px", color: "#94a3b8" }}>
              {user.email}
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="btn-secondary"
          style={{ color: "#fca5a5", borderColor: "rgba(239, 68, 68, 0.3)" }}
        >
          <LogOut size={14} /> Log Out / Switch
        </button>
      </div>

      <div style={{
        marginTop: "20px",
        padding: "14px",
        background: "rgba(255, 255, 255, 0.03)",
        borderRadius: "10px",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        fontSize: "13px",
        color: "#cbd5e1"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#10b981", fontWeight: "600", marginBottom: "4px" }}>
          <CheckCircle2 size={16} /> Authenticated Successfully
        </div>
        <div>
          <b>Profile Scope:</b> {meta.desc}
        </div>
      </div>
    </div>
  );
}
