import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, LayoutDashboard, Map, GitMerge, ChevronDown, ChevronRight, 
  CheckCircle2, Clock, ShieldCheck, RefreshCw, X, Send, Sparkles, User, FileCheck
} from "lucide-react";
import confetti from "canvas-confetti";
import ProjectOverviewTab from "./tabs/ProjectOverviewTab";
import ProjectGISTab from "./tabs/ProjectGISTab";
import ProjectWorkflowTab from "./tabs/ProjectWorkflowTab";
import { WORKFLOW_STAGES, getSharedWorkflowStages, getSharedAuditLogs } from "../../data/gisAndWorkflowData";

export default function ProjectWorkspaceView({ project, onBack }) {
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'gis' | 'workflow'
  const [workflowExpanded, setWorkflowExpanded] = useState(true);
  const [selectedWorkflowStage, setSelectedWorkflowStage] = useState("proposal");
  const [selectedKhasraForGIS, setSelectedKhasraForGIS] = useState(null);
  
  // Shared Workflow & Field Verification Sync State
  const [stageList, setStageList] = useState(() => getSharedWorkflowStages());
  const [showSyncDrawer, setShowSyncDrawer] = useState(false);
  const [syncLogs, setSyncLogs] = useState(() => getSharedAuditLogs());
  const [lastSyncTime, setLastSyncTime] = useState("Just now");
  const [syncNotification, setSyncNotification] = useState("");

  const safeProject = project || {
    name: "Delhi–Mumbai Expressway (Package 4)",
    projectCode: "LA-2026-001",
    agency: "NHAI",
    state: "Gujarat",
    districts: ["Bharuch", "Vadodara", "Surat"],
    landRequiredAcres: "10,000 Acres",
    status: "Active"
  };

  const isOngoing = safeProject.status === "Active";

  const fetchSyncLogs = async () => {
    try {
      const res = await fetch("/api/assessments/sync-logs");
      const data = await res.json();
      if (data.success && data.logs && data.logs.length > 0) {
        setSyncLogs(data.logs);
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        return;
      }
    } catch (e) {}
    setSyncLogs(getSharedAuditLogs());
    setLastSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  useEffect(() => {
    fetchSyncLogs();
    const handleSync = () => {
      setStageList(getSharedWorkflowStages());
      fetchSyncLogs();
    };
    window.addEventListener("bhoomi_workflow_update", handleSync);
    window.addEventListener("bhoomi_audit_update", handleSync);
    window.addEventListener("storage", handleSync);
    const interval = setInterval(fetchSyncLogs, 8000);
    return () => {
      window.removeEventListener("bhoomi_workflow_update", handleSync);
      window.removeEventListener("bhoomi_audit_update", handleSync);
      window.removeEventListener("storage", handleSync);
      clearInterval(interval);
    };
  }, []);

  const handleSelectWorkflowStage = (stageId) => {
    setActiveTab("workflow");
    setSelectedWorkflowStage(stageId);
  };

  const handleNavigateToGIS = (khasraId) => {
    setSelectedKhasraForGIS(khasraId);
    setActiveTab("gis");
  };

  // Quick simulation trigger for testing live transparency
  const handleSimulateFieldUpdate = async (stageKey, title, summary) => {
    try {
      const res = await fetch("/api/assessments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectCode: project.projectCode,
          projectName: project.name,
          officerName: "Shri S. K. Verma, IAS",
          officerRole: "CALA / Sub-Divisional Magistrate",
          district: project.state || "Bharuch & Vadodara",
          stageId: stageKey,
          stageName: stageKey === "sia" ? "Social Impact Assessment (SIA)" : "Field Verification",
          actionType: title,
          changeSummary: summary
        })
      });

      const data = await res.json();
      if (data.success) {
        setSyncNotification(`⚡ Live Field Update from CALA Officer: ${title}`);
        setTimeout(() => setSyncNotification(""), 4500);
        fetchSyncLogs();
      }
    } catch (err) {
      setSyncNotification(`⚡ Live Field Update from CALA Officer: ${title}`);
      setTimeout(() => setSyncNotification(""), 4500);
      setSyncLogs(prev => [
        {
          id: "sync-" + Date.now(),
          projectCode: project.projectCode,
          projectName: project.name,
          officerName: "Shri S. K. Verma, IAS",
          officerRole: "CALA / Sub-Divisional Magistrate",
          district: "Bharuch & Vadodara",
          stageName: stageKey === "sia" ? "Social Impact Assessment (SIA)" : "Field Verification",
          actionType: title,
          changeSummary: summary,
          timestamp: new Date().toISOString(),
          status: "Verified & Sealed",
          digitalSealId: `CALA-SEAL-${Math.floor(10000 + Math.random() * 90000)}`
        },
        ...prev
      ]);
    }
  };

  return (
    <div className="ocean-bg-deep" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Tricolor Strip */}
      <div className="gov-strip" />

      {/* Live Sync Beacon Toast */}
      {syncNotification && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "24px",
          zIndex: 1000,
          padding: "14px 20px",
          background: "var(--royal-900)",
          color: "#ffffff",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-xl)",
          fontSize: "13px",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          borderLeft: "4px solid var(--accent-emerald)",
          animation: "fadeInUp 0.3s ease"
        }}>
          <Sparkles size={18} style={{ color: "#fbbf24" }} />
          <span>{syncNotification}</span>
        </div>
      )}

      {/* Top Header Row with Back Button, Project Title & Status */}
      <header style={{
        padding: "12px 28px",
        background: "var(--bg-white)",
        borderBottom: "1px solid var(--border-light)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        boxShadow: "var(--shadow-sm)",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* Back Button */}
          <button
            onClick={onBack}
            className="btn-secondary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 12px",
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--royal-700)",
              background: "var(--royal-50)",
              border: "1px solid var(--royal-100)"
            }}
          >
            <ArrowLeft size={15} /> All Projects
          </button>

          <div style={{ height: "20px", width: "1px", background: "var(--border-light)" }} />

          {/* Project Title */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "16px", fontWeight: "700", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
                {safeProject.name || "Project Name Unavailable"}
              </span>
              <span style={{
                fontSize: "10px",
                fontWeight: "700",
                color: "var(--royal-700)",
                background: "var(--royal-50)",
                padding: "2px 8px",
                borderRadius: "var(--radius-full)",
                fontFamily: "var(--font-mono)"
              }}>
                {safeProject.projectCode || "Code N/A"}
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              {safeProject.agency || "Implementing Agency"} • {safeProject.state || "State"} ({safeProject.districts && safeProject.districts.length > 0 ? safeProject.districts.join(", ") : (safeProject.state || "District")})
            </div>
          </div>
        </div>

        {/* Live Officer Sync Status Badge & Action */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Regional Officer Sync Pill */}
          <button
            onClick={() => setShowSyncDrawer(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "var(--radius-full)",
              background: "rgba(5, 150, 105, 0.08)",
              border: "1px solid rgba(5, 150, 105, 0.25)",
              fontSize: "11.5px",
              fontWeight: "700",
              color: "var(--accent-emerald)",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            title="Click to view Regional Officer Field Verification Audit Trail"
          >
            <span className="live-indicator" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-emerald)" }} />
            <span>⚡ Synced with Regional Officer (CALA)</span>
            <span style={{ background: "var(--accent-emerald)", color: "#ffffff", fontSize: "9px", padding: "1px 5px", borderRadius: "var(--radius-full)", marginLeft: "2px" }}>
              {syncLogs.length}
            </span>
          </button>

          {/* Status Indicator */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 12px",
            borderRadius: "var(--radius-full)",
            background: isOngoing ? "rgba(16, 185, 129, 0.08)" : "var(--bg-mist)",
            border: `1px solid ${isOngoing ? "rgba(16, 185, 129, 0.25)" : "var(--border-light)"}`,
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: isOngoing ? "var(--accent-emerald)" : "var(--text-muted)"
          }}>
            <span className={isOngoing ? "live-indicator" : ""} style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: isOngoing ? "var(--accent-emerald)" : "var(--text-dim)",
              boxShadow: isOngoing ? "0 0 8px rgba(16, 185, 129, 0.4)" : "none"
            }} />
            {project.statusLabel || (isOngoing ? "ONGOING" : "UPCOMING")}
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <main style={{ flex: 1, padding: "28px 20px", maxWidth: "1280px", width: "100%", margin: "0 auto" }}>
        
        {/* 2-Column Grid: Left Sidebar + Right Content */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: "24px",
          alignItems: "start"
        }}>
          
          {/* ==================== LEFT SIDEBAR ==================== */}
          <aside style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            position: "sticky",
            top: "84px"
          }}>
            <div className="glass-box" style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              padding: "16px"
            }}>
              <div style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                padding: "4px 8px 8px 8px",
                borderBottom: "1px solid var(--border-light)"
              }}>
                Project Navigation
              </div>

              {/* 1. Project Overview */}
              <button
                onClick={() => setActiveTab("overview")}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  background: activeTab === "overview" ? "var(--royal-700)" : "transparent",
                  color: activeTab === "overview" ? "#ffffff" : "var(--text-secondary)",
                  fontWeight: activeTab === "overview" ? "700" : "500",
                  fontSize: "13px",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "all 0.2s ease"
                }}
              >
                <LayoutDashboard size={16} />
                <span>Project Overview</span>
              </button>

              {/* 2. GIS */}
              <button
                onClick={() => setActiveTab("gis")}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  background: activeTab === "gis" ? "var(--royal-700)" : "transparent",
                  color: activeTab === "gis" ? "#ffffff" : "var(--text-secondary)",
                  fontWeight: activeTab === "gis" ? "700" : "500",
                  fontSize: "13px",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "all 0.2s ease"
                }}
              >
                <Map size={16} />
                <span>GIS</span>
              </button>

              {/* 3. Project Workflow (Expandable Menu with 8 Sub-items) */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <button
                  onClick={() => {
                    setActiveTab("workflow");
                    setWorkflowExpanded(!workflowExpanded);
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: "none",
                    background: activeTab === "workflow" ? "var(--royal-700)" : "transparent",
                    color: activeTab === "workflow" ? "#ffffff" : "var(--text-secondary)",
                    fontWeight: activeTab === "workflow" ? "700" : "500",
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <GitMerge size={16} />
                    <span>Project Workflow</span>
                  </div>
                  {workflowExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>

                {/* Sub-items list opening directly beneath Project Workflow */}
                {workflowExpanded && (
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    paddingLeft: "20px",
                    marginTop: "4px",
                    gap: "2px",
                    borderLeft: "2px solid var(--royal-100)",
                    marginLeft: "16px"
                  }}>
                    {stageList.map((st) => {
                      const isSubSelected = activeTab === "workflow" && selectedWorkflowStage === st.id;
                      const isDone = st.status.includes("Approved") || st.status.includes("100%") || st.status.includes("Sealed ✓") || st.status.includes("Published ✓") || st.status === "Published ✓" || st.status === "Completed ✓";
                      const isInProgress = !isDone && (st.status.includes("In Progress") || st.status.includes("In Review") || st.status.includes("Under Verification") || st.status.includes("Active") || st.status.includes("76%") || st.status.includes("85%"));

                      return (
                        <button
                          key={st.id}
                          onClick={() => handleSelectWorkflowStage(st.id)}
                          style={{
                            width: "100%",
                            padding: "6px 8px",
                            borderRadius: "4px",
                            border: "none",
                            background: isSubSelected ? "var(--royal-50)" : "transparent",
                            color: isSubSelected ? "var(--royal-800)" : "var(--text-secondary)",
                            fontWeight: isSubSelected ? "700" : "500",
                            fontSize: "11.5px",
                            cursor: "pointer",
                            textAlign: "left",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.15s ease"
                          }}
                        >
                          <span style={{
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            background: isDone ? "var(--accent-emerald)" : isInProgress ? "var(--accent-amber)" : "var(--text-dim)",
                            flexShrink: 0
                          }} />
                          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {st.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Live Field Officer Sync Status Card */}
            <div className="glass-box" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--royal-700)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Officer Site Transparency
                </div>
                <button
                  onClick={fetchSyncLogs}
                  style={{ background: "transparent", border: "none", color: "var(--text-dim)", cursor: "pointer" }}
                  title="Sync Now"
                >
                  <RefreshCw size={12} />
                </button>
              </div>

              <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                Connected to <b>CALA Revenue Desk (Bharuch)</b>. Field verifications reflect live.
              </div>

              <button
                onClick={() => setShowSyncDrawer(true)}
                className="btn-secondary"
                style={{ fontSize: "11.5px", padding: "7px 10px", width: "100%", justifyContent: "space-between" }}
              >
                <span>View Field Audit Trail</span>
                <span style={{ fontWeight: "700", color: "var(--accent-emerald)" }}>{syncLogs.length} updates</span>
              </button>
            </div>
          </aside>

          {/* ==================== RIGHT CONTENT ==================== */}
          <section style={{ flex: 1, minWidth: 0, animation: "fadeInUp 0.3s ease both" }}>
            {activeTab === "overview" && <ProjectOverviewTab project={safeProject} />}
            {activeTab === "gis" && (
              <ProjectGISTab
                project={safeProject}
                initialKhasraId={selectedKhasraForGIS}
              />
            )}
            {activeTab === "workflow" && (
              <ProjectWorkflowTab
                project={safeProject}
                currentStageId={selectedWorkflowStage}
                onSelectStage={(id) => setSelectedWorkflowStage(id)}
                onNavigateToGIS={handleNavigateToGIS}
              />
            )}
          </section>

        </div>
      </main>

      {/* ==================== REGIONAL OFFICER FIELD VERIFICATION AUDIT MODAL ==================== */}
      {showSyncDrawer && (
        <div className="modal-overlay" onClick={() => setShowSyncDrawer(false)}>
          <div
            className="glass-box modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "600px",
              width: "100%",
              background: "var(--bg-white)",
              overflow: "hidden",
              padding: "0"
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: "20px 24px",
              borderBottom: "1px solid var(--border-light)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "linear-gradient(135deg, var(--royal-50) 0%, var(--bg-soft) 100%)"
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <ShieldCheck size={18} style={{ color: "var(--accent-emerald)" }} />
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--accent-emerald)", textTransform: "uppercase" }}>
                    Live Synchronized Field Ledger
                  </span>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--royal-900)", marginTop: "2px", fontFamily: "var(--font-heading)" }}>
                  Regional Officer Assessment Verifications
                </h3>
              </div>

              <button
                onClick={() => setShowSyncDrawer(false)}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                Whenever a Regional Officer verifies or modifies an assessment report on site, the change is recorded here and synced live with the Project Agency workspace for total transparency.
              </div>

              {/* Simulate Field Update Action (Demo Helper) */}
              <div style={{
                padding: "12px 14px",
                background: "var(--bg-soft)",
                border: "1px dashed var(--border-medium)",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--royal-700)", textTransform: "uppercase" }}>
                  ⚡ Quick Demonstration: Trigger a Live Field Officer Verification
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => handleSimulateFieldUpdate("sia", "SIA Field Audit: Nabipur Village", "Verified 1,420 PAFs with 420 families saved via alignment curve optimization on site.")}
                    className="btn-secondary"
                    style={{ fontSize: "11px", padding: "6px 10px" }}
                  >
                    + Verify SIA Census (Nabipur)
                  </button>
                  <button
                    onClick={() => handleSimulateFieldUpdate("jms", "JMS Survey Confirmed: Khasra 143/B", "Field officer verified boundary demarcation and crop valuation for Khasra 143/B.")}
                    className="btn-secondary"
                    style={{ fontSize: "11px", padding: "6px 10px" }}
                  >
                    + Verify Khasra 143/B Survey
                  </button>
                </div>
              </div>

              {/* Logs List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "360px", overflowY: "auto", paddingRight: "4px" }}>
                {syncLogs.map((log) => (
                  <div
                    key={log.id}
                    style={{
                      padding: "12px 14px",
                      background: "var(--bg-soft)",
                      border: "1px solid var(--border-light)",
                      borderLeft: "3px solid var(--accent-emerald)",
                      borderRadius: "var(--radius-sm)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--royal-700)", background: "var(--royal-50)", padding: "1px 6px", borderRadius: "4px" }}>
                        {log.stageName}
                      </span>
                      <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--accent-emerald)" }}>
                        ✓ {log.status}
                      </span>
                    </div>

                    <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--royal-900)", marginTop: "2px" }}>
                      {log.actionType}
                    </div>

                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                      {log.changeSummary}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5px", color: "var(--text-dim)", marginTop: "4px", paddingTop: "4px", borderTop: "1px dashed var(--border-light)" }}>
                      <span>👤 {log.officerName} ({log.officerRole})</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: "16px 20px",
        fontSize: "12px",
        color: "var(--text-muted)",
        borderTop: "1px solid var(--border-light)",
        background: "var(--bg-white)",
        marginTop: "40px"
      }}>
        National Land Acquisition & Management Platform • PM Gati Shakti Master Plan • Government of India
      </footer>
    </div>
  );
}
