import React from "react";
import { ShieldCheck, Clock, ArrowRight, UserCheck, CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";

export default function ActionTransparencyPanel({
  title = "ACTION & TRANSPARENCY",
  activities = [],
  currentAction = {
    role: "Regional Officer",
    action: "Review requested clarification",
    status: "pending" // 'pending' | 'in-progress' | 'completed'
  }
}) {
  return (
    <div style={{
      padding: "20px 22px",
      background: "var(--bg-white)",
      border: "1.5px solid var(--border-medium)",
      borderRadius: "var(--radius-md)",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      boxShadow: "var(--shadow-sm)"
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid var(--border-light)",
        paddingBottom: "10px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ShieldCheck size={16} style={{ color: "var(--royal-700)" }} />
          <span style={{
            fontSize: "12px",
            fontWeight: "800",
            color: "var(--royal-900)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontFamily: "var(--font-heading)"
          }}>
            {title}
          </span>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          fontSize: "10.5px",
          fontWeight: "700",
          color: "var(--accent-emerald)",
          background: "rgba(5, 150, 105, 0.08)",
          padding: "2px 8px",
          borderRadius: "var(--radius-full)"
        }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent-emerald)" }} />
          <span>Live Synced</span>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0px", position: "relative" }}>
        {activities.map((item, idx) => {
          const isRegionalOfficer = item.role.includes("Regional Officer") || item.role.includes("CALA") || item.role.includes("Hearing");
          const isDistrictAuth = item.role.includes("District");
          const isWarning = item.status === "warning" || (item.action && (item.action.includes("⚠") || item.action.includes("requested") || item.action.includes("Pending")));
          const isLast = idx === activities.length - 1;

          return (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: "12px",
                paddingBottom: isLast ? "4px" : "14px",
                position: "relative"
              }}
            >
              {/* Vertical connector line */}
              {!isLast && (
                <div style={{
                  position: "absolute",
                  left: "11px",
                  top: "22px",
                  bottom: "0",
                  width: "2px",
                  background: "var(--border-light)",
                  zIndex: 1
                }} />
              )}

              {/* Node Icon */}
              <div style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: isWarning 
                  ? "rgba(217, 119, 6, 0.12)" 
                  : isRegionalOfficer 
                    ? "rgba(5, 150, 105, 0.12)" 
                    : "rgba(30, 58, 138, 0.1)",
                color: isWarning 
                  ? "var(--accent-amber)" 
                  : isRegionalOfficer 
                    ? "var(--accent-emerald)" 
                    : "var(--royal-700)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "800",
                zIndex: 2,
                flexShrink: 0
              }}>
                {isWarning ? "⚠" : "✓"}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  color: isRegionalOfficer ? "var(--accent-emerald)" : isDistrictAuth ? "var(--accent-teal)" : "var(--royal-700)",
                  letterSpacing: "0.02em",
                  textTransform: "uppercase"
                }}>
                  {item.role}
                </div>

                <div style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: isWarning ? "var(--accent-amber)" : "var(--royal-900)",
                  marginTop: "2px",
                  lineHeight: "1.35"
                }}>
                  {item.action}
                </div>

                <div style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                  marginTop: "2px"
                }}>
                  {item.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CURRENT ACTION (WHO NEEDS TO ACT NEXT) */}
      {currentAction && (
        <div style={{
          padding: "14px 16px",
          background: "linear-gradient(135deg, rgba(217, 119, 6, 0.07) 0%, rgba(30, 58, 138, 0.05) 100%)",
          border: "1.5px solid rgba(217, 119, 6, 0.3)",
          borderRadius: "var(--radius-sm)",
          display: "flex",
          flexDirection: "column",
          gap: "6px"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <span style={{
              fontSize: "10.5px",
              fontWeight: "800",
              color: "var(--accent-amber)",
              letterSpacing: "0.08em",
              textTransform: "uppercase"
            }}>
              CURRENT ACTION
            </span>

            <span style={{
              fontSize: "10px",
              fontWeight: "700",
              color: "var(--royal-900)",
              background: "rgba(217, 119, 6, 0.18)",
              padding: "1px 7px",
              borderRadius: "4px"
            }}>
              Next Stakeholder
            </span>
          </div>

          <div style={{
            fontSize: "14px",
            fontWeight: "800",
            color: "var(--royal-900)",
            fontFamily: "var(--font-heading)"
          }}>
            {currentAction.role}
          </div>

          <div style={{
            fontSize: "12.5px",
            color: "var(--text-secondary)",
            fontWeight: "600",
            lineHeight: "1.35"
          }}>
            {currentAction.action}
          </div>
        </div>
      )}
    </div>
  );
}
