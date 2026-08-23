import React, { useState, useEffect } from "react";
import { CheckCircle2, Lock, Clock, AlertTriangle, ArrowRight, UserCheck, ShieldCheck } from "lucide-react";
import { getProjectWorkflow, calculateWorkflowMetrics, STAGE_DEFINITIONS } from "../../../data/workflowEngine";

export default function ProjectOverviewTab({ project }) {
  const [workflow, setWorkflow] = useState(() => getProjectWorkflow());

  useEffect(() => {
    const handleSync = () => {
      setWorkflow(getProjectWorkflow());
    };
    window.addEventListener("bhoomi_canonical_update", handleSync);
    window.addEventListener("bhoomi_workflow_update", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("bhoomi_canonical_update", handleSync);
      window.removeEventListener("bhoomi_workflow_update", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  // Safe default project fallback (Requirement #4 & #9)
  const safeProject = project || {
    name: "Project Name Unavailable",
    projectCode: "LA-2026-001",
    agency: "Implementing Agency",
    state: "State",
    districts: ["District"],
    landRequiredAcres: "0 Acres",
    status: "Active"
  };

  const isTargetProject = safeProject.projectCode === "LA-2026-001" || safeProject.status === "Active";
  const metrics = calculateWorkflowMetrics(workflow);

  // If viewing an upcoming non-target project, display its static pipeline metrics
  const displayProgressPct = isTargetProject ? metrics.progressPct : (safeProject.overallProgressPct || 15);
  const displayLandAcquired = isTargetProject ? metrics.landAcquiredAcres : (safeProject.landAcquiredAcres || "0 Acres");
  const displayMilestone = isTargetProject 
    ? `${metrics.currentStageName || "Stage Not Available"} (${metrics.currentStatusLabel || "Active"})`
    : (safeProject.statutoryStage || "Pre-Feasibility & DPR Planning");

  const getStageStatusBadge = (st) => {
    if (!st || st.status === "LOCKED") {
      return {
        label: "🔒 Locked",
        bg: "var(--bg-mist)",
        border: "var(--border-light)",
        color: "var(--text-dim)",
        icon: <Lock size={12} />
      };
    }
    if (st.status === "APPROVED" || st.status === "COMPLETED") {
      return {
        label: "✓ Approved",
        bg: "rgba(5, 150, 105, 0.08)",
        border: "rgba(5, 150, 105, 0.25)",
        color: "var(--accent-emerald)",
        icon: <CheckCircle2 size={12} />
      };
    }
    if (st.status === "CLARIFICATION_REQUIRED") {
      return {
        label: "🟠 Clarification Required",
        bg: "rgba(245, 158, 11, 0.1)",
        border: "rgba(245, 158, 11, 0.3)",
        color: "#d97706",
        icon: <AlertTriangle size={12} />
      };
    }
    if (st.status === "SUBMITTED" || st.status === "RESUBMITTED" || st.status === "UNDER_REVIEW") {
      return {
        label: "🟡 Under Review",
        bg: "rgba(217, 119, 6, 0.08)",
        border: "rgba(217, 119, 6, 0.25)",
        color: "var(--accent-amber)",
        icon: <Clock size={12} />
      };
    }
    return {
      label: "○ Not Started",
      bg: "rgba(2, 132, 199, 0.08)",
      border: "rgba(2, 132, 199, 0.25)",
      color: "var(--royal-600)",
      icon: <span style={{ width: "8px", height: "8px", borderRadius: "50%", border: "2px solid var(--royal-600)" }} />
    };
  };

  return (
    <div className="glass-box" style={{
      padding: "32px",
      display: "flex",
      flexDirection: "column",
      gap: "28px"
    }}>
      
      {/* 1. PROJECT OVERVIEW METADATA SECTION */}
      <div>
        <div style={{
          fontSize: "13px",
          fontWeight: "700",
          color: "var(--royal-700)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: "14px"
        }}>
          PROJECT OVERVIEW
        </div>

        <div style={{
          height: "1px",
          background: "var(--border-light)",
          marginBottom: "18px"
        }} />

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px"
        }}>
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
              Project ID
            </div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
              {safeProject.projectCode || "LA-2026-001"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
              Implementing Agency
            </div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", marginTop: "4px" }}>
              {safeProject.agency || "Implementing Agency"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
              State
            </div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", marginTop: "4px" }}>
              {safeProject.state || "State Not Available"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
              Districts Covered
            </div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", marginTop: "4px" }}>
              {safeProject.districts && safeProject.districts.length > 0 ? `${safeProject.districts.length} Districts (${safeProject.districts.join(", ")})` : (safeProject.state || "State Wide")}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
              Land Required (Total)
            </div>
            <div style={{ fontSize: "16px", fontWeight: "800", color: "var(--accent-amber)", marginTop: "4px" }}>
              {safeProject.landRequiredAcres || "0 Acres"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
              Land Acquired (To Date)
            </div>
            <div style={{ fontSize: "16px", fontWeight: "800", color: "var(--accent-emerald)", marginTop: "4px" }}>
              {displayLandAcquired}
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: "1px", background: "var(--border-light)" }} />

      {/* 2. ACQUISITION PROGRESS SECTION (Derived Purely from Workflow State) */}
      <div>
        <div style={{
          fontSize: "13px",
          fontWeight: "700",
          color: "var(--royal-700)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: "14px"
        }}>
          OVERALL STATUTORY WORKFLOW PROGRESS
        </div>

        <div style={{ background: "var(--bg-soft)", padding: "20px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>
                Overall Land Acquisition Progress
              </span>
              <span style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "var(--royal-700)",
                background: "var(--royal-50)",
                padding: "2px 8px",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--royal-200)"
              }}>
                {metrics.approvedCount} / 7 Stages Approved
              </span>
            </div>
            <span style={{
              fontSize: "20px",
              fontWeight: "800",
              color: displayProgressPct >= 70 ? "var(--accent-emerald)" : displayProgressPct >= 30 ? "var(--royal-600)" : "var(--accent-amber)",
              fontFamily: "var(--font-heading)"
            }}>
              {displayProgressPct}%
            </span>
          </div>

          {/* Progress Bar Container */}
          <div style={{
            height: "12px",
            width: "100%",
            background: "var(--bg-mist)",
            borderRadius: "var(--radius-full)",
            overflow: "hidden",
            border: "1px solid var(--border-medium)"
          }}>
            <div className="progress-bar-fill" style={{
              height: "100%",
              width: `${displayProgressPct}%`,
              background: "linear-gradient(90deg, var(--royal-400) 0%, var(--royal-600) 50%, var(--accent-emerald) 100%)",
              borderRadius: "var(--radius-full)",
              transition: "width 0.6s ease"
            }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
            <span>0% Initiated</span>
            <span style={{ fontWeight: "700", color: "var(--royal-800)" }}>{metrics.approvedCount} of 7 Stages Approved ({displayProgressPct}%)</span>
            <span>100% Fully Possessed</span>
          </div>
        </div>
      </div>

      <div style={{ height: "1px", background: "var(--border-light)" }} />

      {/* 3. SYNCHRONIZED CURRENT OWNER & NEXT ACTION BANNER */}
      {isTargetProject && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
          background: "rgba(248, 250, 252, 0.9)",
          padding: "18px",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--royal-100)"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--radius-md)",
              background: "var(--royal-100)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--royal-700)",
              flexShrink: 0
            }}>
              <UserCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
                Current Stage & Owner
              </div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--royal-900)", marginTop: "2px" }}>
                {metrics.currentStageName}
              </div>
              <div style={{ fontSize: "12px", color: "var(--royal-700)", fontWeight: "600", marginTop: "1px" }}>
                Role: <b>{metrics.currentOwner}</b>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--radius-md)",
              background: "rgba(217, 119, 6, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-amber)",
              flexShrink: 0
            }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
                Required Action
              </div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)", marginTop: "2px", lineHeight: "1.4" }}>
                {metrics.requiredAction}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. 7 INDEPENDENT WORKFLOW STAGES BREAKDOWN */}
      <div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px"
        }}>
          <div style={{
            fontSize: "13px",
            fontWeight: "700",
            color: "var(--royal-700)",
            letterSpacing: "0.06em",
            textTransform: "uppercase"
          }}>
            7 INDEPENDENT WORKFLOW STAGES
          </div>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600" }}>
            Real-time synchronization across Agency, Officer & Ministry
          </span>
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>
          {STAGE_DEFINITIONS.map((def, idx) => {
            const st = workflow.stages[def.id] || { status: "LOCKED", statusLabel: "Locked" };
            const badge = getStageStatusBadge(st);
            const isApproved = st.status === "APPROVED" || st.status === "COMPLETED";
            const isActiveStage = metrics.currentStageKey === def.id;

            return (
              <div
                key={def.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 18px",
                  background: isApproved 
                    ? "rgba(5, 150, 105, 0.02)" 
                    : isActiveStage 
                    ? "rgba(2, 132, 199, 0.03)" 
                    : "var(--bg-white)",
                  borderRadius: "var(--radius-md)",
                  border: `1px solid ${isActiveStage ? "var(--royal-300)" : "var(--border-light)"}`,
                  borderLeft: `4px solid ${
                    isApproved 
                      ? "var(--accent-emerald)" 
                      : st.status === "CLARIFICATION_REQUIRED" 
                      ? "var(--accent-rose)" 
                      : st.status === "SUBMITTED" || st.status === "UNDER_REVIEW" || st.status === "RESUBMITTED" 
                      ? "var(--accent-amber)" 
                      : st.status === "NOT_STARTED" 
                      ? "var(--royal-500)" 
                      : "var(--border-medium)"
                  }`,
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "800",
                    background: isApproved ? "var(--accent-emerald)" : "var(--bg-mist)",
                    color: isApproved ? "#ffffff" : "var(--text-muted)"
                  }}>
                    {idx + 1}
                  </span>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)" }}>
                        {def.name}
                      </span>
                      {isActiveStage && (
                        <span style={{
                          fontSize: "10px",
                          fontWeight: "700",
                          background: "var(--royal-100)",
                          color: "var(--royal-800)",
                          padding: "1px 6px",
                          borderRadius: "4px"
                        }}>
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                      {def.statutoryRef}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  {st.sealId && (
                    <span style={{
                      fontSize: "10.5px",
                      fontFamily: "var(--font-mono)",
                      color: "var(--accent-emerald)",
                      background: "rgba(5, 150, 105, 0.08)",
                      padding: "2px 8px",
                      borderRadius: "var(--radius-full)"
                    }}>
                      🔒 {st.sealId}
                    </span>
                  )}
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "5px 12px",
                    borderRadius: "var(--radius-full)",
                    background: badge.bg,
                    border: `1px solid ${badge.border}`,
                    color: badge.color,
                    fontSize: "12px",
                    fontWeight: "700"
                  }}>
                    {badge.icon} {badge.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Latest Milestone Alert */}
      <div style={{
        padding: "14px 18px",
        background: "var(--royal-50)",
        border: "1px solid var(--royal-200)",
        borderRadius: "var(--radius-md)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "13px",
        color: "var(--royal-800)"
      }}>
        <CheckCircle2 size={18} style={{ color: "var(--royal-600)", flexShrink: 0 }} />
        <span>
          <b style={{ color: "var(--royal-900)" }}>Current Statutory Milestone:</b> {displayMilestone}
        </span>
      </div>

    </div>
  );
}
