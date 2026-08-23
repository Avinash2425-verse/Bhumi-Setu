import React, { useState } from "react";
import { Search, Filter, Layers, MapPin, Building2, CheckCircle2, Clock, AlertTriangle, LogOut, ArrowRight, ShieldCheck, Milestone, Lock } from "lucide-react";
import { INITIAL_PROJECTS } from "../../data/projectsData";
import ProjectAuthCodeModal from "./ProjectAuthCodeModal";
import ProjectWorkspaceView from "./ProjectWorkspaceView";

export default function AgencyDashboard({ user, onLogout }) {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'central' | 'state' | 'district'
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'active' | 'upcoming'
  const [searchQuery, setSearchQuery] = useState("");
  
  // Security clearance and view state
  const [projectToUnlock, setProjectToUnlock] = useState(null); // Triggers Auth Code Modal
  const [activeProjectView, setActiveProjectView] = useState(null); // Displays Project Details View

  // Handler for clicking "Inspect Details" -> Always pops up Authentication Code Portal
  const handleInspectClick = (proj) => {
    setProjectToUnlock(proj);
  };

  // Handler on successful code verification -> Opens Project Workspace View
  const handleAuthSuccess = (unlockedProj) => {
    setActiveProjectView(unlockedProj);
  };

  // If a project is selected & unlocked, show the dedicated Project Workspace View
  if (activeProjectView) {
    return (
      <ProjectWorkspaceView
        project={activeProjectView}
        onBack={() => setActiveProjectView(null)}
      />
    );
  }

  // Filter projects by Tab, Status, and Search (Crash-Proof)
  const filteredProjects = (projects || []).filter((proj) => {
    if (!proj) return false;
    const matchesTab = activeTab === "all" || proj.govLevel === activeTab;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && proj.status === "Active") ||
      (statusFilter === "upcoming" && proj.status === "Upcoming");
    const nameStr = proj.name || "";
    const codeStr = proj.projectCode || "";
    const stateStr = proj.state || "";
    const matchesSearch =
      nameStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      codeStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stateStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (proj.districts && Array.isArray(proj.districts) && proj.districts.some(d => (d || "").toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesTab && matchesStatus && matchesSearch;
  });

  // Calculate project counts
  const totalCount = projects.length;
  const centralCount = projects.filter(p => p.govLevel === "central").length;
  const stateCount = projects.filter(p => p.govLevel === "state").length;
  const districtCount = projects.filter(p => p.govLevel === "district").length;

  const centralActive = projects.filter(p => p.govLevel === "central" && p.status === "Active").length;
  const centralUpcoming = projects.filter(p => p.govLevel === "central" && p.status === "Upcoming").length;

  const stateActive = projects.filter(p => p.govLevel === "state" && p.status === "Active").length;
  const stateUpcoming = projects.filter(p => p.govLevel === "state" && p.status === "Upcoming").length;

  const districtActive = projects.filter(p => p.govLevel === "district" && p.status === "Active").length;
  const districtUpcoming = projects.filter(p => p.govLevel === "district" && p.status === "Upcoming").length;

  const totalActive = projects.filter(p => p.status === "Active").length;
  const totalUpcoming = projects.filter(p => p.status === "Upcoming").length;

  const getGovBadge = (level) => {
    if (level === "central") {
      return { label: "Central Govt", icon: "🇮🇳", color: "var(--accent-amber)", bg: "rgba(217, 119, 6, 0.06)", border: "rgba(217, 119, 6, 0.15)" };
    }
    if (level === "state") {
      return { label: "State Govt", icon: "🏛️", color: "var(--royal-600)", bg: "var(--royal-50)", border: "var(--royal-100)" };
    }
    return { label: "District Level", icon: "📍", color: "var(--accent-teal)", bg: "rgba(13, 148, 136, 0.06)", border: "rgba(13, 148, 136, 0.15)" };
  };

  const statCards = [
    {
      key: "all",
      icon: <Layers size={16} />,
      label: "ALL CORRIDORS",
      color: "var(--royal-600)",
      borderColor: "var(--royal-500)",
      activeBg: "var(--royal-50)",
      count: totalCount,
      activeStat: `${totalActive} Active`,
      upcomingStat: `${totalUpcoming} Upcoming`,
      onClick: () => { setActiveTab("all"); setStatusFilter("all"); },
      isActive: activeTab === "all" && statusFilter === "all"
    },
    {
      key: "central",
      icon: <span>🇮🇳</span>,
      label: "CENTRAL GOVT",
      color: "var(--accent-amber)",
      borderColor: "#d97706",
      activeBg: "rgba(217, 119, 6, 0.06)",
      count: centralCount,
      activeStat: `${centralActive} Active`,
      upcomingStat: `${centralUpcoming} Upcoming`,
      onClick: () => setActiveTab("central"),
      isActive: activeTab === "central"
    },
    {
      key: "state",
      icon: <span>🏛️</span>,
      label: "STATE GOVT",
      color: "var(--royal-600)",
      borderColor: "var(--royal-400)",
      activeBg: "var(--royal-50)",
      count: stateCount,
      activeStat: `${stateActive} Active`,
      upcomingStat: `${stateUpcoming} Upcoming`,
      onClick: () => setActiveTab("state"),
      isActive: activeTab === "state"
    },
    {
      key: "district",
      icon: <span>📍</span>,
      label: "DISTRICT LEVEL",
      color: "var(--accent-teal)",
      borderColor: "#0d9488",
      activeBg: "rgba(13, 148, 136, 0.06)",
      count: districtCount,
      activeStat: `${districtActive} Active`,
      upcomingStat: `${districtUpcoming} Upcoming`,
      onClick: () => setActiveTab("district"),
      isActive: activeTab === "district"
    }
  ];

  return (
    <div className="ocean-bg-deep" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Tricolor Strip */}
      <div className="gov-strip" />

      {/* Top Navbar */}
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
          <span style={{ fontSize: "24px" }}>🏛️</span>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
                Bhoomi Setu
              </span>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--accent-amber)", fontFamily: "var(--font-heading)" }}>
                भूमि-सेतु
              </span>
              <span style={{
                fontSize: "10px",
                fontWeight: "700",
                background: "var(--royal-50)",
                color: "var(--royal-700)",
                border: "1px solid var(--royal-100)",
                padding: "2px 10px",
                borderRadius: "var(--radius-full)",
                marginLeft: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.06em"
              }}>
                Agency Dashboard
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              National Land Acquisition & Right-of-Way Monitoring Platform
            </div>
          </div>
        </div>

        {/* User Badge & Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)" }}>
              {user.name}
            </div>
            <div style={{ fontSize: "11px", color: "var(--royal-600)" }}>
              {user.agencyName || "NHAI / Implementing Agency"}
            </div>
          </div>

          <button
            onClick={onLogout}
            className="btn-secondary"
            style={{ color: "var(--accent-rose)", borderColor: "rgba(225, 29, 72, 0.15)", padding: "6px 12px", fontSize: "12px" }}
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main style={{ flex: 1, padding: "28px", maxWidth: "1320px", width: "100%", margin: "0 auto" }}>
        {/* Top Summary Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
          marginBottom: "28px"
        }}>
          {statCards.map((card) => (
            <div
              key={card.key}
              className="glass-box stat-card"
              onClick={card.onClick}
              style={{
                padding: "20px",
                borderLeft: `4px solid ${card.borderColor}`,
                cursor: "pointer",
                background: card.isActive ? card.activeBg : "var(--bg-glass-strong)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: card.color, fontSize: "12px", fontWeight: "700", letterSpacing: "0.04em" }}>
                {card.icon} {card.label}
              </div>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)", marginTop: "8px", fontFamily: "var(--font-heading)" }}>
                {card.count} <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--text-muted)" }}>Projects</span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--accent-teal)", fontWeight: "600", marginTop: "4px" }}>
                {card.activeStat} • {card.upcomingStat}
              </div>
            </div>
          ))}
        </div>

        {/* Section Header with Classification Tabs & Status Filter & Search */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "22px"
        }}>
          {/* Left Controls: Government Tabs + Status Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {/* Classification Filter Tabs */}
            <div style={{
              display: "flex",
              background: "var(--bg-white)",
              borderRadius: "var(--radius-md)",
              padding: "4px",
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-sm)"
            }}>
              {[
                { key: "all", label: `All (${projects.length})`, icon: null },
                { key: "central", label: `Central (${centralCount})`, icon: "🇮🇳" },
                { key: "state", label: `State (${stateCount})`, icon: "🏛️" },
                { key: "district", label: `District (${districtCount})`, icon: "📍" }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "var(--radius-sm)",
                    border: "none",
                    background: activeTab === tab.key ? "var(--royal-700)" : "transparent",
                    color: activeTab === tab.key ? "#ffffff" : "var(--text-muted)",
                    fontWeight: activeTab === tab.key ? "700" : "500",
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                  }}
                >
                  {tab.icon && <span>{tab.icon}</span>} {tab.label}
                </button>
              ))}
            </div>

            {/* Quick Status Toggle (Active vs Upcoming) */}
            <div style={{
              display: "flex",
              background: "var(--bg-white)",
              borderRadius: "var(--radius-md)",
              padding: "4px",
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-sm)"
            }}>
              {[
                { key: "all", label: "All Status", emoji: null },
                { key: "active", label: `Active (${totalActive})`, emoji: "🟢" },
                { key: "upcoming", label: `Upcoming (${totalUpcoming})`, emoji: "⏳" }
              ].map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => setStatusFilter(btn.key)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: "none",
                    background: statusFilter === btn.key ? "var(--bg-mist)" : "transparent",
                    color: statusFilter === btn.key ? "var(--royal-800)" : "var(--text-muted)",
                    fontWeight: statusFilter === btn.key ? "700" : "500",
                    fontSize: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  {btn.emoji && <span>{btn.emoji}</span>} {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div style={{ position: "relative", width: "260px" }}>
            <input
              type="text"
              className="gov-input"
              placeholder="Search projects or districts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "36px", paddingRight: "10px", fontSize: "13px" }}
            />
            <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
          </div>
        </div>

        {/* Projects Cards Grid / Empty State */}
        {filteredProjects.length === 0 ? (
          <div style={{
            padding: "48px 32px",
            textAlign: "center",
            background: "var(--bg-glass-strong)",
            borderRadius: "var(--radius-md)",
            border: "1px dashed var(--border-medium)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px"
          }}>
            <Building2 size={36} style={{ color: "var(--royal-500)" }} />
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--royal-900)" }}>
              No Active Projects
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", maxWidth: "420px", margin: 0 }}>
              Projects submitted through the Project Agency portal will appear here.
            </p>
            <button
              onClick={() => { setActiveTab("all"); setStatusFilter("all"); setSearchQuery(""); }}
              className="btn-main"
              style={{ fontSize: "12px", padding: "8px 16px", marginTop: "4px" }}
            >
              View Projects
            </button>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: "18px"
          }}>
            {filteredProjects.map((proj) => {
              const badge = getGovBadge(proj.govLevel);
              const isActive = proj.status === "Active";

              return (
                <div
                  key={proj.id}
                  className="glass-box project-card"
                  style={{
                    padding: "22px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: isActive ? "pointer" : "default",
                    borderLeft: isActive ? `4px solid var(--accent-emerald)` : `1px solid var(--border-light)`,
                    background: isActive ? "rgba(5, 150, 105, 0.03)" : "var(--bg-glass-strong)",
                    opacity: isActive ? 1 : 0.88
                  }}
                  onClick={() => isActive && handleInspectClick(proj)}
                >
                  <div>
                    {/* Top Badges Row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "12px" }}>
                      <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "4px 10px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "11px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        background: badge.bg,
                        color: badge.color,
                        border: `1px solid ${badge.border}`
                      }}>
                        <span>{badge.icon}</span> {badge.label}
                      </div>

                      {/* Active vs Upcoming Status Badge */}
                      <span style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        color: isActive ? "var(--accent-emerald)" : "var(--text-dim)",
                        background: isActive ? "rgba(5, 150, 105, 0.06)" : "var(--bg-soft)",
                        border: `1px solid ${isActive ? "rgba(5, 150, 105, 0.2)" : "var(--border-light)"}`,
                        padding: "4px 10px",
                        borderRadius: "var(--radius-full)"
                      }}>
                        {isActive ? "● Active" : "⏳ Upcoming"}
                      </span>
                    </div>

                    {/* Project Title */}
                    <h3 style={{ fontSize: "17px", fontWeight: "700", color: "var(--text-primary)", lineHeight: "1.35", fontFamily: "var(--font-heading)" }}>
                      {proj.name}
                    </h3>
                    <div style={{ fontSize: "12px", color: "var(--text-dim)", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
                      Code: {proj.projectCode}
                    </div>

                    {/* Location & Authority */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-secondary)", marginTop: "10px" }}>
                      <MapPin size={13} style={{ color: "var(--royal-500)", flexShrink: 0 }} />
                      <span>{proj.districts ? proj.districts.join(", ") : "Bharuch"} ({proj.state})</span>
                    </div>

                    {/* Sponsoring Authority */}
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                      <b style={{ color: "var(--text-secondary)" }}>Authority:</b> {proj.agency}
                    </div>

                    {/* Statutory Milestone */}
                    <div style={{
                      marginTop: "14px",
                      padding: "10px 14px",
                      background: "var(--bg-soft)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border-light)"
                    }}>
                      <div style={{ fontSize: "10px", fontWeight: "700", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        Statutory Milestone
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: "600", color: isActive ? "var(--royal-700)" : "var(--text-muted)", marginTop: "3px" }}>
                        {proj.statutoryStage}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div style={{
                    marginTop: "18px",
                    paddingTop: "14px",
                    borderTop: "1px solid var(--border-light)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>
                      Length: <b style={{ color: "var(--text-secondary)" }}>{proj.lengthKm} Km</b>
                    </div>

                    {isActive ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInspectClick(proj);
                        }}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--royal-600)",
                          fontSize: "12px",
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          transition: "color 0.2s ease"
                        }}
                      >
                        Inspect Details <ArrowRight size={14} />
                      </button>
                    ) : (
                      <div style={{
                        fontSize: "11.5px",
                        color: "var(--text-muted)",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}>
                        <Lock size={12} style={{ color: "var(--text-dim)" }} />
                        <span>Pipeline Corridor</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Project Authentication Code Interceptor Modal */}
      <ProjectAuthCodeModal
        isOpen={Boolean(projectToUnlock)}
        project={projectToUnlock}
        onClose={() => setProjectToUnlock(null)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: "18px 20px",
        fontSize: "12px",
        color: "var(--text-dim)",
        borderTop: "1px solid var(--border-light)",
        background: "var(--bg-white)",
        marginTop: "40px"
      }}>
        National Land Acquisition & Management Platform • Project Agency Operational Center • Government of India
      </footer>
    </div>
  );
}
