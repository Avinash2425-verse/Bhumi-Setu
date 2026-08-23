import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, Sparkles, TrendingUp, AlertTriangle, AlertCircle, 
  CheckCircle2, Clock, MapPin, Building2, Landmark, LogOut, 
  ArrowLeft, Search, Filter, Send, Layers, RefreshCw, Eye
} from "lucide-react";
import confetti from "canvas-confetti";
import { INITIAL_PROJECTS } from "../../data/projectsData";
import { getProjectWorkflow, calculateWorkflowMetrics, dispatchApproveStage, addActivityLog } from "../../data/workflowEngine";

export default function MinistryApexDashboard({ user, onLogout }) {
  const [activeView, setActiveView] = useState("overview"); // 'overview' | 'project_detail'
  const [selectedProject, setSelectedProject] = useState(INITIAL_PROJECTS[0]);
  const [actionSuccess, setActionSuccess] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'at_risk' | 'delayed'

  // National Projects Requiring Apex Attention
  const [escalatedProjects, setEscalatedProjects] = useState([
    {
      id: "esc-1",
      name: "DELHI–MUMBAI EXPRESSWAY (PACKAGE 4)",
      projectCode: "LA-2026-001",
      agency: "NHAI",
      district: "Bharuch, Vadodara, Surat",
      state: "Gujarat",
      status: "At Risk",
      statusBadge: "🟠 At Risk",
      statusColor: "var(--accent-amber)",
      stage: "R&R",
      stageLabel: "Rehabilitation & Resettlement",
      owner: "Regional Officer",
      pendingDays: "3 days",
      reason: "Beneficiary verification pending for 11 displaced agricultural tenant families",
      currentAction: "Verify PAF census and rehabilitation package",
      lastActivity: "23 Aug 2026, 02:15 PM",
      progress: [
        { name: "Proposal", done: true },
        { name: "SIA", done: true },
        { name: "Notification", done: true },
        { name: "Objections", done: true },
        { name: "R&R", current: true },
        { name: "Award", pending: true },
        { name: "Possession", pending: true }
      ]
    },
    {
      id: "esc-2",
      name: "Eastern Dedicated Freight Corridor (Phase 2)",
      projectCode: "LA-2026-002",
      agency: "DFCCIL",
      district: "Varanasi & Sasaram",
      state: "Uttar Pradesh & Bihar",
      status: "Delayed",
      statusBadge: "🔴 Delayed",
      statusColor: "#ef4444",
      stage: "Objections",
      stageLabel: "Objections & Hearings",
      owner: "Regional Officer",
      pendingDays: "7 days",
      reason: "Section 15 quasi-judicial hearing report pending disposal at District Revenue Cell",
      currentAction: "Publish Section 15 Hearing Disposal Gazette",
      lastActivity: "21 Aug 2026, 11:30 AM",
      progress: [
        { name: "Proposal", done: true },
        { name: "SIA", done: true },
        { name: "Notification", done: true },
        { name: "Objections", current: true },
        { name: "R&R", pending: true },
        { name: "Award", pending: true },
        { name: "Possession", pending: true }
      ]
    },
    {
      id: "esc-3",
      name: "Khavda Ultra-Mega Renewable Energy Park",
      projectCode: "LA-2026-003",
      agency: "SECI",
      district: "Kutch",
      state: "Gujarat",
      status: "At Risk",
      statusBadge: "🟠 At Risk",
      statusColor: "var(--accent-amber)",
      stage: "Preliminary Notification",
      stageLabel: "Preliminary Notification",
      owner: "Project Agency",
      pendingDays: "4 days",
      reason: "Underground petrochemical utility pipeline crossing right-of-user safety clearance pending",
      currentAction: "Obtain GAIL / IOCL inter-ministerial utility protocol",
      lastActivity: "22 Aug 2026, 04:45 PM",
      progress: [
        { name: "Proposal", done: true },
        { name: "SIA", done: true },
        { name: "Notification", current: true },
        { name: "Objections", pending: true },
        { name: "R&R", pending: true },
        { name: "Award", pending: true },
        { name: "Possession", pending: true }
      ]
    }
  ]);

  const showToast = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(""), 4500);
  };

  const handleOpenProject = (proj) => {
    setSelectedProject(proj);
    setActiveView("project_detail");
  };

  const handleIssueFastTrack = () => {
    const wf = getProjectWorkflow();
    if (wf.stages["proposal"]?.status !== "APPROVED") {
      dispatchApproveStage("proposal", {
        approvedBy: "Ministry Apex Screening Committee",
        officerRole: "Ministry Apex Sanction"
      });
    }
    addActivityLog({
      who: user?.name || "Ministry Apex Command",
      role: "Ministry Apex",
      what: `⚡ Issued Fast-Track Escalation Sanction & Statutory Clearance for ${selectedProject.name}`,
      stageKey: wf.currentStageKey || "proposal",
      stageName: "Ministry Sanction",
      status: "approved",
      roleColor: "var(--accent-amber)",
      roleBg: "rgba(217, 119, 6, 0.12)"
    });
    showToast(`⚡ Fast-Track Apex Clearance Issued for ${selectedProject.projectCode}! Statutory Escrow Unlocked.`);
  };

  const handleIssueDirective = () => {
    const wf = getProjectWorkflow();
    addActivityLog({
      who: user?.name || "Ministry Apex Command",
      role: "Ministry Apex",
      what: `📢 Dispatched National Fast-Track Expedite Directive for ${selectedProject.name}`,
      stageKey: wf.currentStageKey || "proposal",
      stageName: "Apex Directive",
      status: "directive",
      roleColor: "var(--royal-700)",
      roleBg: "var(--royal-50)"
    });
    showToast(`📢 Ministerial Expedite Directive Dispatched to Regional Officer & Project Agency!`);
  };

  // Workflow distribution stage counts
  const stageDistribution = [
    { name: "Proposal", count: 4, color: "var(--royal-600)" },
    { name: "SIA", count: 8, color: "var(--royal-700)" },
    { name: "Notification", count: 12, color: "var(--accent-amber)" },
    { name: "Objections", count: 6, color: "#8b5cf6" },
    { name: "R&R", count: 7, color: "var(--accent-teal)" },
    { name: "Award", count: 6, color: "var(--accent-emerald)" },
    { name: "Possession", count: 5, color: "#059669" }
  ];

  return (
    <div className="ocean-bg-deep" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Tricolor Strip */}
      <div className="gov-strip" />

      {/* Action Success Toast */}
      {actionSuccess && (
        <div style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          zIndex: 1000,
          padding: "14px 22px",
          background: "var(--royal-900)",
          color: "#ffffff",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-xl)",
          fontSize: "13.5px",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          borderLeft: "4px solid var(--accent-amber)",
          animation: "fadeInUp 0.3s ease"
        }}>
          <Sparkles size={18} style={{ color: "#fbbf24" }} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Header */}
      <header style={{
        padding: "14px 28px",
        background: "var(--bg-white)",
        borderBottom: "1px solid var(--border-light)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        boxShadow: "var(--shadow-sm)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "var(--radius-sm)",
            background: "rgba(217, 119, 6, 0.1)",
            border: "1.5px solid rgba(217, 119, 6, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-amber)"
          }}>
            <ShieldAlert size={22} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
                Ministry Apex Command Console
              </span>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--accent-amber)", fontFamily: "var(--font-heading)" }}>
                भूमि-सेतु
              </span>
              <span style={{
                fontSize: "10px",
                fontWeight: "800",
                background: "rgba(217, 119, 6, 0.12)",
                color: "var(--accent-amber)",
                border: "1px solid rgba(217, 119, 6, 0.3)",
                padding: "2px 8px",
                borderRadius: "var(--radius-full)",
                textTransform: "uppercase"
              }}>
                National Oversight 🏛️
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              National Land Acquisition Oversight, Delay Detection & Statutory Inter-Ministerial Escalations
            </div>
          </div>
        </div>

        {/* User Profile & Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--royal-900)" }}>
              {user?.name || "Dr. Rajeshwar Sharma, IAS"}
            </div>
            <div style={{ fontSize: "11px", color: "var(--accent-amber)", fontWeight: "600" }}>
              Secretary (MoRTH / Central Command)
            </div>
          </div>

          <button
            onClick={onLogout}
            className="btn-secondary"
            style={{ color: "var(--accent-rose)", borderColor: "rgba(225, 29, 72, 0.2)", padding: "6px 12px", fontSize: "12px" }}
          >
            <LogOut size={13} /> Log Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, padding: "26px 28px", maxWidth: "1320px", width: "100%", margin: "0 auto" }}>

        {/* ========================================================================= */}
        {/* VIEW 1: NATIONAL OVERSIGHT DASHBOARD (Summary, Distribution, Attention)  */}
        {/* ========================================================================= */}
        {activeView === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* 1. MINISTRY SUMMARY CARDS (4 KPIs) */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px"
            }}>
              {/* Active Projects */}
              <div className="glass-box" style={{ padding: "18px 20px", borderLeft: "4px solid var(--royal-600)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "var(--royal-700)", textTransform: "uppercase" }}>
                    Active Projects
                  </span>
                  <span style={{ fontSize: "18px" }}>🟢</span>
                </div>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--royal-900)", marginTop: "6px", fontFamily: "var(--font-heading)" }}>
                  48 <span style={{ fontSize: "13px", fontWeight: "500", color: "var(--text-muted)" }}>Corridors</span>
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--royal-700)", marginTop: "4px", fontWeight: "600" }}>
                  45,975 Acres Monitored Nationally
                </div>
              </div>

              {/* On Track */}
              <div className="glass-box" style={{ padding: "18px 20px", borderLeft: "4px solid var(--accent-emerald)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "var(--accent-emerald)", textTransform: "uppercase" }}>
                    On Track
                  </span>
                  <span style={{ fontSize: "18px" }}>✓</span>
                </div>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--accent-emerald)", marginTop: "6px", fontFamily: "var(--font-heading)" }}>
                  34 <span style={{ fontSize: "13px", fontWeight: "500", color: "var(--text-muted)" }}>Projects (71%)</span>
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "4px", fontWeight: "600" }}>
                  Meeting 60-day statutory targets
                </div>
              </div>

              {/* At Risk */}
              <div className="glass-box" style={{ padding: "18px 20px", borderLeft: "4px solid var(--accent-amber)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "var(--accent-amber)", textTransform: "uppercase" }}>
                    At Risk
                  </span>
                  <span style={{ fontSize: "18px" }}>🟠</span>
                </div>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--accent-amber)", marginTop: "6px", fontFamily: "var(--font-heading)" }}>
                  9 <span style={{ fontSize: "13px", fontWeight: "500", color: "var(--text-muted)" }}>Projects</span>
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--accent-amber)", marginTop: "4px", fontWeight: "600" }}>
                  Approaching statutory deadlines
                </div>
              </div>

              {/* Delayed */}
              <div className="glass-box" style={{ padding: "18px 20px", borderLeft: "4px solid #ef4444" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#ef4444", textTransform: "uppercase" }}>
                    Delayed
                  </span>
                  <span style={{ fontSize: "18px" }}>🔴</span>
                </div>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#ef4444", marginTop: "6px", fontFamily: "var(--font-heading)" }}>
                  5 <span style={{ fontSize: "13px", fontWeight: "500", color: "var(--text-muted)" }}>Projects</span>
                </div>
                <div style={{ fontSize: "11.5px", color: "#ef4444", marginTop: "4px", fontWeight: "600" }}>
                  Requires Apex Escalation Sanction
                </div>
              </div>
            </div>

            {/* 2. VISUAL WORKFLOW DISTRIBUTION */}
            <div className="glass-box" style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--royal-600)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Pipeline Velocity Distribution
                  </div>
                  <h3 style={{ fontSize: "17px", fontWeight: "800", color: "var(--royal-900)", marginTop: "2px", fontFamily: "var(--font-heading)" }}>
                    Visual Workflow Distribution across 48 National Projects
                  </h3>
                </div>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)" }}>
                  Proposal | SIA | Notification | Objections | R&R | Award | Possession
                </span>
              </div>

              {/* Visual Pipeline Stage Bars */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px" }}>
                {stageDistribution.map((stg) => (
                  <div
                    key={stg.name}
                    style={{
                      padding: "12px 14px",
                      background: "var(--bg-soft)",
                      border: "1px solid var(--border-light)",
                      borderTop: `3px solid ${stg.color}`,
                      borderRadius: "var(--radius-sm)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px"
                    }}
                  >
                    <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-secondary)" }}>
                      {stg.name}
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: "800", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
                      {stg.count} <span style={{ fontSize: "11px", fontWeight: "500", color: "var(--text-muted)" }}>Projects</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. PROJECTS REQUIRING ATTENTION (Escalation / Delay List) */}
            <div className="glass-box" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: "800", color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    National Escalations & Delay Monitoring
                  </div>
                  <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--royal-900)", marginTop: "2px", fontFamily: "var(--font-heading)" }}>
                    PROJECTS REQUIRING ATTENTION
                  </h3>
                </div>

                <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--accent-amber)", background: "rgba(217, 119, 6, 0.08)", padding: "4px 10px", borderRadius: "var(--radius-full)" }}>
                  ⚠ 3 High-Priority Delay Alerts
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {escalatedProjects.length === 0 ? (
                  <div style={{
                    padding: "32px 24px",
                    textAlign: "center",
                    background: "var(--bg-soft)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px dashed var(--border-medium)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <CheckCircle2 size={28} style={{ color: "var(--accent-emerald)" }} />
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--royal-900)" }}>
                      No National Escalations
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", maxWidth: "420px" }}>
                      All monitored national infrastructure corridors are progressing within statutory time limits.
                    </div>
                  </div>
                ) : (
                  escalatedProjects.map((proj) => (
                    <div
                      key={proj.id}
                      style={{
                        padding: "18px 20px",
                        background: "var(--bg-white)",
                        border: "1.5px solid var(--border-light)",
                        borderLeft: `4px solid ${proj.statusColor || "var(--royal-600)"}`,
                        borderRadius: "var(--radius-sm)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "16px",
                        flexWrap: "wrap"
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "11px", fontWeight: "800", padding: "2px 8px", borderRadius: "4px", background: proj.status === "Delayed" ? "rgba(225, 29, 72, 0.1)" : "rgba(217, 119, 6, 0.1)", color: proj.statusColor || "var(--accent-amber)" }}>
                            {proj.statusBadge || "Active"}
                          </span>
                          <h4 style={{ fontSize: "15px", fontWeight: "800", color: "var(--royal-900)", margin: 0 }}>
                            {proj.name || "Project Name Unavailable"}
                          </h4>
                          <span style={{ fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                            ({proj.projectCode || "Code N/A"})
                          </span>
                        </div>

                        <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
                          <span>Current Stage: <b style={{ color: "var(--royal-900)" }}>{proj.stage || "Stage Not Available"}</b></span>
                          <span>Current Owner: <b style={{ color: "var(--royal-900)" }}>{proj.owner || "Not Assigned"}</b></span>
                          <span>Pending Since: <b style={{ color: proj.statusColor || "var(--text-primary)" }}>{proj.pendingDays || "0 Days"}</b></span>
                        </div>

                        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                          <b>Reason:</b> {proj.reason || "Under regular statutory monitoring"}
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenProject(proj)}
                        className="btn-main"
                        style={{
                          padding: "8px 16px",
                          fontSize: "12px",
                          fontWeight: "700",
                          width: "auto",
                          whiteSpace: "nowrap"
                        }}
                      >
                        View Project ➔
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: MINISTRY PROJECT DETAIL VIEW                                      */}
        {/* ========================================================================= */}
        {activeView === "project_detail" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Top Back Button */}
            <div>
              <button
                onClick={() => setActiveView("overview")}
                className="btn-secondary"
                style={{ fontSize: "12px", padding: "6px 12px", display: "flex", alignItems: "center", gap: "6px" }}
              >
                <ArrowLeft size={14} /> Back to National Oversight
              </button>
            </div>

            {/* Project Header Card */}
            <div className="glass-box" style={{ padding: "22px 26px", background: "var(--bg-white)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--accent-amber)", textTransform: "uppercase" }}>
                    National Apex Project Monitoring
                  </div>
                  <h1 style={{ fontSize: "22px", fontWeight: "800", color: "var(--royal-900)", marginTop: "2px", fontFamily: "var(--font-heading)" }}>
                    {selectedProject.name}
                  </h1>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <span>Code: <b style={{ fontFamily: "var(--font-mono)" }}>{selectedProject.projectCode}</b></span>
                    <span>Agency: <b>{selectedProject.agency}</b></span>
                    <span>State: <b>{selectedProject.state}</b></span>
                    <span>District: <b>{selectedProject.district || "Ghaziabad"}</b></span>
                  </div>
                </div>

                <span style={{
                  fontSize: "12px",
                  fontWeight: "800",
                  padding: "4px 12px",
                  borderRadius: "var(--radius-full)",
                  background: selectedProject.status === "Delayed" ? "rgba(225, 29, 72, 0.1)" : "rgba(217, 119, 6, 0.12)",
                  color: selectedProject.statusColor || "var(--accent-amber)"
                }}>
                  {selectedProject.statusBadge || "🟠 At Risk"}
                </span>
              </div>

              {/* Project Progress Tracker */}
              <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--border-light)" }}>
                <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "10px" }}>
                  Project Progress Across Statutory Lifecycle:
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", overflowX: "auto", paddingBottom: "6px" }}>
                  {[
                    { name: "Proposal", done: true },
                    { name: "SIA", done: true },
                    { name: "Notification", done: true },
                    { name: "Objections", done: true },
                    { name: "R&R", current: true },
                    { name: "Award", pending: true },
                    { name: "Possession", pending: true }
                  ].map((stage, idx, arr) => (
                    <React.Fragment key={stage.name}>
                      <div style={{
                        padding: "6px 14px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "12px",
                        fontWeight: stage.current ? "800" : "600",
                        background: stage.done ? "var(--royal-50)" : stage.current ? "rgba(217, 119, 6, 0.12)" : "var(--bg-soft)",
                        color: stage.done ? "var(--royal-800)" : stage.current ? "var(--accent-amber)" : "var(--text-muted)",
                        border: stage.current ? "1.5px solid var(--accent-amber)" : "1px solid var(--border-light)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        whiteSpace: "nowrap"
                      }}>
                        <span>{stage.done ? "✓" : stage.current ? "🟡" : "○"}</span>
                        <span>{stage.name}</span>
                      </div>
                      {idx < arr.length - 1 && <span style={{ color: "var(--text-dim)", fontSize: "12px" }}>➔</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* 2-Column Grid: Left Project Bottleneck Metadata + Right Apex Action Desk */}
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "20px", alignItems: "start" }}>
              
              {/* Left Column: Delay Metadata Card */}
              <div className="glass-box" style={{ padding: "22px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: "800", color: "#ef4444", textTransform: "uppercase" }}>
                  Statutory Bottleneck Diagnosis
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: "800", color: "var(--royal-900)" }}>
                  Current Stage Delay Analysis
                </h3>

                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "12.5px",
                  background: "var(--bg-soft)",
                  padding: "16px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-light)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "6px", borderBottom: "1px dashed var(--border-light)" }}>
                    <span style={{ color: "var(--text-muted)" }}>Current Owner:</span>
                    <span style={{ fontWeight: "700", color: "var(--royal-900)" }}>{selectedProject.owner || "Regional Officer"}</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "6px", borderBottom: "1px dashed var(--border-light)" }}>
                    <span style={{ color: "var(--text-muted)" }}>Current Action:</span>
                    <span style={{ fontWeight: "700", color: "var(--royal-900)" }}>{selectedProject.currentAction || "Verify PAF census and rehabilitation package"}</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "6px", borderBottom: "1px dashed var(--border-light)" }}>
                    <span style={{ color: "var(--text-muted)" }}>Days Pending:</span>
                    <span style={{ fontWeight: "800", color: selectedProject.statusColor || "var(--accent-amber)" }}>{selectedProject.pendingDays || "3 Days"}</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "6px", borderBottom: "1px dashed var(--border-light)" }}>
                    <span style={{ color: "var(--text-muted)" }}>Delay Reason:</span>
                    <span style={{ fontWeight: "600", color: "var(--text-secondary)", textAlign: "right", maxWidth: "60%" }}>
                      {selectedProject.reason || "Field Gram Sabha query regarding 11 PAFs"}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "4px" }}>
                    <span style={{ color: "var(--text-muted)" }}>Last Activity:</span>
                    <span style={{ fontWeight: "600", color: "var(--text-dim)" }}>{selectedProject.lastActivity || "23 Aug 2026, 02:15 PM"}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Ministry Apex Interventions */}
              <div className="glass-box" style={{ padding: "22px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--accent-amber)", textTransform: "uppercase" }}>
                  Ministerial Interventions
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: "800", color: "var(--royal-900)" }}>
                  Issue National Directives & Clearances
                </h3>

                <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: "1.5", margin: 0 }}>
                  As Ministry Apex Command, invoke high-level powers to resolve inter-departmental conflicts, release escrow funds, and fast-track corridor approvals.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "6px" }}>
                  <button
                    type="button"
                    onClick={handleIssueFastTrack}
                    className="btn-main"
                    style={{
                      padding: "12px",
                      fontSize: "12.5px",
                      background: "linear-gradient(135deg, #d97706, #b45309)"
                    }}
                  >
                    ⚡ Issue Fast-Track Escalation Sanction
                  </button>

                  <button
                    type="button"
                    onClick={handleIssueDirective}
                    className="btn-secondary"
                    style={{
                      padding: "12px",
                      fontSize: "12.5px",
                      color: "var(--royal-800)",
                      borderColor: "var(--royal-300)"
                    }}
                  >
                    📢 Dispatch Ministerial Expedite Directive
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}
