import React, { useState, useEffect } from "react";
import { 
  Search, Filter, Plus, Minus, Compass, Maximize2, Minimize2, 
  MapPin, CheckCircle2, Clock, ShieldCheck, User, AlertTriangle, 
  Layers, ChevronRight, Sparkles, X, ArrowUpRight
} from "lucide-react";
import { SIMPLE_GIS_BLOCKS } from "../../../data/gisAndWorkflowData";

export default function ProjectGISTab({ project, initialKhasraId }) {
  const [parcels, setParcels] = useState(SIMPLE_GIS_BLOCKS);
  const [selectedParcel, setSelectedParcel] = useState(
    SIMPLE_GIS_BLOCKS.find(p => p.id === initialKhasraId || p.khasraNo.toLowerCase().includes((initialKhasraId || "").toLowerCase())) || SIMPLE_GIS_BLOCKS[0]
  );
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [villageFilter, setVillageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [landTypeFilter, setLandTypeFilter] = useState("all");

  // Map Controls State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapMode, setMapMode] = useState("map"); // 'map' | 'satellite'
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync initialKhasraId if passed dynamically from workflow tabs
  useEffect(() => {
    if (initialKhasraId) {
      const match = SIMPLE_GIS_BLOCKS.find(
        p => p.id === initialKhasraId || 
             p.khasraNo.toLowerCase().includes(initialKhasraId.toLowerCase()) ||
             initialKhasraId.toLowerCase().includes(p.khasraNo.toLowerCase())
      );
      if (match) {
        setSelectedParcel(match);
      }
    }
  }, [initialKhasraId]);

  // Filtering Logic
  const filteredParcels = parcels.filter(p => {
    const matchesSearch = 
      p.khasraNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.owner.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesVillage = villageFilter === "all" || p.village === villageFilter;
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesLandType = landTypeFilter === "all" || p.landType.toLowerCase().includes(landTypeFilter.toLowerCase());

    return matchesSearch && matchesVillage && matchesStatus && matchesLandType;
  });

  // Auto-select first matching parcel on search
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      const exactMatch = parcels.find(
        p => p.khasraNo.toLowerCase().includes(query.toLowerCase()) ||
             p.village.toLowerCase().includes(query.toLowerCase()) ||
             p.owner.toLowerCase().includes(query.toLowerCase())
      );
      if (exactMatch) {
        setSelectedParcel(exactMatch);
      }
    }
  };

  const handleZoom = (delta) => {
    setZoomLevel(prev => Math.min(Math.max(prev + delta, 0.8), 1.6));
  };

  const handleResetView = () => {
    setZoomLevel(1);
    setSearchQuery("");
    setVillageFilter("all");
    setStatusFilter("all");
    setLandTypeFilter("all");
  };

  return (
    <div className="glass-box" style={{
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    }}>
      
      {/* ==================== 1. SUMMARY ROW (4 COMPACT CARDS) ==================== */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
        gap: "12px"
      }}>
        <div style={{
          padding: "12px 14px",
          background: "var(--bg-white)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-light)",
          borderLeft: "4px solid var(--royal-600)"
        }}>
          <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
            124.6 Acres
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>
            Total Land
          </div>
        </div>

        <div style={{
          padding: "12px 14px",
          background: "var(--bg-white)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-light)",
          borderLeft: "4px solid var(--royal-500)"
        }}>
          <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
            48
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>
            Total Parcels
          </div>
        </div>

        <div style={{
          padding: "12px 14px",
          background: "var(--bg-white)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-light)",
          borderLeft: "4px solid var(--accent-emerald)"
        }}>
          <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--accent-emerald)", fontFamily: "var(--font-heading)" }}>
            31
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>
            Acquired
          </div>
        </div>

        <div style={{
          padding: "12px 14px",
          background: "var(--bg-white)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-light)",
          borderLeft: "4px solid var(--accent-amber)"
        }}>
          <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--accent-amber)", fontFamily: "var(--font-heading)" }}>
            7
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>
            Pending Action
          </div>
        </div>
      </div>

      {/* ==================== 2. SEARCH & COMPACT FILTERS ==================== */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "10px",
        padding: "12px 16px",
        background: "var(--bg-soft)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-light)"
      }}>
        {/* Search Box */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "var(--bg-white)",
          border: "1px solid var(--border-medium)",
          borderRadius: "var(--radius-sm)",
          padding: "6px 12px",
          flex: "1 1 240px",
          maxWidth: "340px"
        }}>
          <Search size={15} style={{ color: "var(--royal-600)" }} />
          <input
            type="text"
            placeholder="Search Parcel / Khasra / Village..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "12.5px",
              width: "100%",
              color: "var(--text-primary)"
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-dim)", padding: 0 }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {/* Village Filter */}
          <select
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
            style={{
              padding: "6px 10px",
              fontSize: "12px",
              fontWeight: "600",
              color: "var(--text-secondary)",
              background: "var(--bg-white)",
              border: "1px solid var(--border-medium)",
              borderRadius: "var(--radius-sm)",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="all">Village: All</option>
            <option value="Nabipur">Nabipur</option>
            <option value="Samni">Samni</option>
            <option value="Karjan">Karjan</option>
            <option value="Miyagam">Miyagam</option>
          </select>

          {/* Acquisition Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "6px 10px",
              fontSize: "12px",
              fontWeight: "600",
              color: "var(--text-secondary)",
              background: "var(--bg-white)",
              border: "1px solid var(--border-medium)",
              borderRadius: "var(--radius-sm)",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="all">Status: All</option>
            <option value="Acquired & Cleared">Acquired & Cleared</option>
            <option value="Under Survey">Under Survey</option>
            <option value="Pending Possession">Pending Possession</option>
            <option value="Hearing / Objection">Hearing / Objection</option>
            <option value="Government Land">Government Land</option>
          </select>

          {/* Land Type Filter */}
          <select
            value={landTypeFilter}
            onChange={(e) => setLandTypeFilter(e.target.value)}
            style={{
              padding: "6px 10px",
              fontSize: "12px",
              fontWeight: "600",
              color: "var(--text-secondary)",
              background: "var(--bg-white)",
              border: "1px solid var(--border-medium)",
              borderRadius: "var(--radius-sm)",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="all">Land Type: All</option>
            <option value="Agricultural">Agricultural</option>
            <option value="Commercial">Commercial</option>
            <option value="Government">Government Land</option>
            <option value="Industrial">Industrial</option>
          </select>
        </div>
      </div>

      {/* ==================== 3. GIS CADASTRAL MAP CANVAS & CONTROLS ==================== */}
      <div style={{
        background: mapMode === "satellite" ? "#0f172a" : "var(--bg-mist)",
        border: "1.5px solid var(--border-medium)",
        borderRadius: "var(--radius-md)",
        position: "relative",
        minHeight: isFullscreen ? "540px" : "360px",
        overflow: "hidden",
        boxShadow: "inset 0 1px 4px rgba(0,0,0,0.04)",
        transition: "all 0.3s ease"
      }}>
        
        {/* Floating Top-Right GIS Controls */}
        <div style={{
          position: "absolute",
          top: "14px",
          right: "14px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          {/* Map / Satellite Toggle */}
          <div style={{
            display: "flex",
            background: "var(--bg-white)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-medium)",
            padding: "2px",
            boxShadow: "var(--shadow-sm)"
          }}>
            <button
              onClick={() => setMapMode("map")}
              style={{
                padding: "4px 8px",
                fontSize: "11px",
                fontWeight: "700",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
                background: mapMode === "map" ? "var(--royal-700)" : "transparent",
                color: mapMode === "map" ? "#ffffff" : "var(--text-secondary)"
              }}
            >
              Map
            </button>
            <button
              onClick={() => setMapMode("satellite")}
              style={{
                padding: "4px 8px",
                fontSize: "11px",
                fontWeight: "700",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
                background: mapMode === "satellite" ? "var(--royal-700)" : "transparent",
                color: mapMode === "satellite" ? "#ffffff" : "var(--text-secondary)"
              }}
            >
              Satellite
            </button>
          </div>

          {/* Zoom & Locate Button Group */}
          <div style={{
            display: "flex",
            background: "var(--bg-white)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-medium)",
            boxShadow: "var(--shadow-sm)",
            overflow: "hidden"
          }}>
            <button
              onClick={() => handleZoom(0.15)}
              title="Zoom In"
              style={{ padding: "6px 8px", border: "none", background: "transparent", cursor: "pointer", color: "var(--royal-800)", borderRight: "1px solid var(--border-light)" }}
            >
              <Plus size={14} />
            </button>
            <button
              onClick={() => handleZoom(-0.15)}
              title="Zoom Out"
              style={{ padding: "6px 8px", border: "none", background: "transparent", cursor: "pointer", color: "var(--royal-800)", borderRight: "1px solid var(--border-light)" }}
            >
              <Minus size={14} />
            </button>
            <button
              onClick={handleResetView}
              title="Reset / Locate"
              style={{ padding: "6px 8px", border: "none", background: "transparent", cursor: "pointer", color: "var(--royal-800)", borderRight: "1px solid var(--border-light)" }}
            >
              <Compass size={14} />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title="Fullscreen Toggle"
              style={{ padding: "6px 8px", border: "none", background: "transparent", cursor: "pointer", color: "var(--royal-800)" }}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
        </div>

        {/* Map Cadastral SVG Surface */}
        <div style={{
          width: "100%",
          height: "100%",
          padding: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${zoomLevel})`,
          transformOrigin: "center center",
          transition: "transform 0.2s ease"
        }}>
          <svg viewBox="0 0 860 320" style={{ width: "100%", height: "100%", maxHeight: isFullscreen ? "500px" : "320px" }}>
            
            {/* Background Cadastral Grid Lines */}
            <g opacity={mapMode === "satellite" ? "0.15" : "0.4"}>
              <line x1="0" y1="80" x2="860" y2="80" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1="160" x2="860" y2="160" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1="240" x2="860" y2="240" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="200" y1="0" x2="200" y2="320" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="420" y1="0" x2="420" y2="320" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="640" y1="0" x2="640" y2="320" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />
            </g>

            {/* Acquisition Road Buffer Corridor (Double Buffer) */}
            <path
              d="M 20,165 C 180,165 260,145 420,145 C 580,145 660,165 840,165"
              fill="none"
              stroke={mapMode === "satellite" ? "rgba(255,255,255,0.08)" : "rgba(30, 58, 138, 0.08)"}
              strokeWidth="76"
              strokeLinecap="round"
            />

            {/* Prominent Project Alignment Road Line */}
            <path
              d="M 20,165 C 180,165 260,145 420,145 C 580,145 660,165 840,165"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="5"
            />
            <path
              d="M 20,165 C 180,165 260,145 420,145 C 580,145 660,165 840,165"
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="2.5"
              strokeDasharray="8,6"
            />

            {/* Cadastral Land Parcels (Polygons with Boundaries) */}
            {parcels.map((parcel) => {
              const isSelected = selectedParcel?.id === parcel.id;
              const isFilteredIn = filteredParcels.some(p => p.id === parcel.id);
              const opacity = isFilteredIn ? (isSelected ? 0.96 : 0.8) : 0.25;

              return (
                <g
                  key={parcel.id}
                  onClick={() => setSelectedParcel(parcel)}
                  style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                >
                  {/* Selected Parcel Glow / Ring */}
                  {isSelected && (
                    <polygon
                      points={parcel.polygonPoints}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="8"
                      strokeOpacity="0.75"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Parcel Cadastral Polygon Shape */}
                  <polygon
                    points={parcel.polygonPoints}
                    fill={parcel.color}
                    fillOpacity={opacity}
                    stroke={isSelected ? "#0f172a" : "#ffffff"}
                    strokeWidth={isSelected ? "3" : "1.8"}
                    strokeLinejoin="round"
                  />

                  {/* Khasra Number (Main Label) */}
                  <text
                    x={parcel.labelPos.x}
                    y={parcel.labelPos.y - 4}
                    fill="#ffffff"
                    fontSize="11.5"
                    fontWeight="800"
                    textAnchor="middle"
                    fontFamily="var(--font-heading)"
                    filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.5))"
                  >
                    {parcel.khasraNo}
                  </text>

                  {/* Land Area (Secondary Information) */}
                  <text
                    x={parcel.labelPos.x}
                    y={parcel.labelPos.y + 11}
                    fill="#ffffff"
                    fontSize="9.5"
                    fontWeight="600"
                    textAnchor="middle"
                    opacity="0.95"
                    filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.4))"
                  >
                    {parcel.area}
                  </text>

                  {/* Village Badge Mini Dot */}
                  <circle
                    cx={parcel.labelPos.x}
                    cy={parcel.labelPos.y + 21}
                    r="2.5"
                    fill="#ffffff"
                    opacity="0.8"
                  />
                </g>
              );
            })}

            {/* Alignment Road Legend Annotation in Map */}
            <g transform="translate(30, 290)">
              <rect width="180" height="22" rx="4" fill="rgba(15, 23, 42, 0.75)" />
              <line x1="8" y1="11" x2="32" y2="11" stroke="#fbbf24" strokeWidth="3" />
              <text x="38" y="15" fill="#ffffff" fontSize="9.5" fontWeight="700">Project RoW Corridor (45m)</text>
            </g>
          </svg>
        </div>
      </div>

      {/* ==================== 4. CLEAN & COMPACT LEGEND ==================== */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap",
        padding: "10px 16px",
        background: "var(--bg-soft)",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--border-light)",
        fontSize: "12px",
        color: "var(--text-secondary)"
      }}>
        <span style={{ fontWeight: "700", color: "var(--royal-900)" }}>Legend:</span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#059669" }} />
          <span>🟢 Acquired & Cleared</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#2563eb" }} />
          <span>🔵 Under Survey</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#d97706" }} />
          <span>🟠 Pending Possession</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#e11d48" }} />
          <span>🔴 Hearing / Objection</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#0d9488" }} />
          <span>🔷 Government Land</span>
        </div>
      </div>

      {/* ==================== 5. SELECTED PARCEL DETAIL CARD & TRANSPARENCY ==================== */}
      {selectedParcel && (
        <div style={{
          padding: "22px 24px",
          background: "var(--bg-white)",
          border: "1.5px solid var(--border-medium)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          boxShadow: "var(--shadow-sm)"
        }}>
          
          {/* Header Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{
                width: "14px",
                height: "14px",
                borderRadius: "3px",
                background: selectedParcel.color
              }} />
              <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
                {selectedParcel.khasraNo}
              </h3>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>
                ({selectedParcel.village})
              </span>
            </div>

            <span style={{
              fontSize: "12.5px",
              fontWeight: "700",
              padding: "5px 12px",
              borderRadius: "var(--radius-full)",
              background: `${selectedParcel.color}15`,
              color: selectedParcel.color,
              border: `1px solid ${selectedParcel.color}35`
            }}>
              {selectedParcel.status}
            </span>
          </div>

          {/* Key Parcel Attributes */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "14px",
            padding: "14px 16px",
            background: "var(--bg-soft)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-light)"
          }}>
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
                Village
              </div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--royal-900)", marginTop: "2px" }}>
                {selectedParcel.village}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
                Area
              </div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--royal-900)", marginTop: "2px" }}>
                {selectedParcel.area}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
                Land Type
              </div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--royal-900)", marginTop: "2px" }}>
                {selectedParcel.landType}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
                Owner
              </div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--royal-900)", marginTop: "2px" }}>
                {selectedParcel.owner}
              </div>
            </div>
          </div>

          {/* Compact Acquisition Progress Timeline */}
          <div>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--royal-900)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "8px" }}>
              Acquisition Progress Timeline
            </div>
            
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              overflowX: "auto",
              padding: "10px 14px",
              background: "var(--bg-white)",
              border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-sm)"
            }}>
              {selectedParcel.timeline?.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    fontWeight: step.done ? "700" : "500",
                    color: step.done ? "var(--accent-emerald)" : "var(--text-dim)",
                    whiteSpace: "nowrap"
                  }}>
                    <span>{step.done ? "✓" : "○"}</span>
                    <span>{step.name}</span>
                  </div>
                  {idx < selectedParcel.timeline.length - 1 && (
                    <span style={{ color: step.done ? "var(--accent-emerald)" : "var(--text-dim)", fontWeight: "800", fontSize: "12px" }}>
                      →
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Transparency Information & Audit Trail */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "16px",
            alignItems: "stretch"
          }}>
            {/* Activity & Transparency Log */}
            <div style={{
              padding: "14px 16px",
              background: "var(--bg-soft)",
              border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--royal-900)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Activity & Transparency
                </span>
                <span style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                  Last Updated: {selectedParcel.lastUpdated}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px" }}>
                {selectedParcel.activityLog?.map((log, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "6px 8px",
                      background: "var(--bg-white)",
                      borderRadius: "4px",
                      borderLeft: `3px solid ${log.role === "Regional Officer" ? "var(--accent-emerald)" : "var(--royal-600)"}`
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontWeight: "700", color: log.role === "Regional Officer" ? "var(--accent-emerald)" : "var(--royal-700)" }}>
                        {log.role}
                      </span>
                      <span>→</span>
                      <span style={{ color: "var(--text-secondary)" }}>{log.action}</span>
                    </div>
                    <span style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "11px" }}>
                      {log.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Action / Pending Responsibility Panel */}
            <div style={{
              padding: "14px 16px",
              background: "var(--bg-white)",
              border: `1.5px solid ${selectedParcel.actionRequiredParty ? "rgba(217, 119, 6, 0.3)" : "rgba(5, 150, 105, 0.3)"}`,
              borderRadius: "var(--radius-sm)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "10px"
            }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--royal-900)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Action Status & Stakeholder
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                  Updated By: <b>{selectedParcel.updatedBy}</b>
                </div>

                <div style={{
                  marginTop: "10px",
                  padding: "8px 10px",
                  background: selectedParcel.actionRequiredParty ? "rgba(217, 119, 6, 0.08)" : "rgba(5, 150, 105, 0.08)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "12.5px",
                  fontWeight: "600",
                  color: selectedParcel.actionRequiredParty ? "var(--accent-amber)" : "var(--accent-emerald)"
                }}>
                  {selectedParcel.currentAction}
                </div>
              </div>

              <div style={{
                fontSize: "11.5px",
                fontWeight: "700",
                display: "flex",
                justifyContent: "space-between",
                color: "var(--royal-900)"
              }}>
                <span>Current Action Required:</span>
                <span style={{
                  color: selectedParcel.actionRequiredParty ? "var(--royal-800)" : "var(--accent-emerald)",
                  background: selectedParcel.actionRequiredParty ? "var(--royal-100)" : "rgba(5, 150, 105, 0.12)",
                  padding: "2px 8px",
                  borderRadius: "4px"
                }}>
                  {selectedParcel.actionRequiredParty || "None (Cleared)"}
                </span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
