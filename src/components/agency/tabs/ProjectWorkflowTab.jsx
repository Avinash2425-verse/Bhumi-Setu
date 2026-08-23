import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, Clock, FileText, Users, ShieldCheck, Download, 
  Upload, Send, HelpCircle, Sparkles, ArrowRight, UserCheck, 
  Layers, CheckSquare, MessageSquare, AlertTriangle, FileCheck,
  MapPin, ExternalLink, Lock
} from "lucide-react";
import confetti from "canvas-confetti";
import { 
  getProjectWorkflow, calculateWorkflowMetrics, 
  dispatchSubmitStage, dispatchResubmitStage, 
  STAGE_DEFINITIONS, DEFAULT_WORKFLOW_STATE
} from "../../../data/workflowEngine";
import ActionTransparencyPanel from "../../common/ActionTransparencyPanel";

class StageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Workflow Stage Rendering Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "36px 24px",
          textAlign: "center",
          background: "var(--bg-white)",
          borderRadius: "var(--radius-md)",
          border: "1px dashed var(--border-medium)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px"
        }}>
          <AlertTriangle size={32} style={{ color: "var(--accent-amber)" }} />
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--royal-900)" }}>
            Workflow information unavailable
          </h3>
          <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: 0 }}>
            The requested stage information is temporarily unavailable or updating.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ProjectWorkflowTab({ project, currentStageId, onSelectStage, onNavigateToGIS }) {
  const [workflow, setWorkflow] = useState(() => getProjectWorkflow());
  const [toastMessage, setToastMessage] = useState("");
  const [selectedObjectionId, setSelectedObjectionId] = useState("OBJ-021");

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

  const metrics = calculateWorkflowMetrics(workflow);

  const rawStageId = (currentStageId || "proposal").toLowerCase().trim();

  // Robust normalized stage matcher
  const isProposal = rawStageId === "proposal" || rawStageId.includes("proposal");
  const isSIA = !isProposal && (rawStageId === "sia" || rawStageId.includes("sia") || rawStageId.includes("social"));
  const isPrelimNotification = !isProposal && !isSIA && (rawStageId === "preliminary-notification" || rawStageId.includes("prelim") || rawStageId.includes("notif"));
  const isObjectionsHearing = !isProposal && !isSIA && !isPrelimNotification && (rawStageId === "objections-hearing" || rawStageId.includes("object") || rawStageId.includes("hearing"));
  const isCompensationAward = !isProposal && !isSIA && !isPrelimNotification && !isObjectionsHearing && (rawStageId === "compensation-award" || rawStageId.includes("compensat") || rawStageId.includes("award") || rawStageId.includes("solatium"));
  const isRnR = !isProposal && !isSIA && !isPrelimNotification && !isObjectionsHearing && !isCompensationAward && (rawStageId === "rnr" || rawStageId.includes("rnr") || rawStageId.includes("rehab") || rawStageId.includes("resettle"));
  const isPossession = !isProposal && !isSIA && !isPrelimNotification && !isObjectionsHearing && !isCompensationAward && !isRnR && (rawStageId === "possession" || rawStageId.includes("possess") || rawStageId.includes("handover"));

  const currentStageDef = STAGE_DEFINITIONS.find(s => {
    if (isProposal) return s.id === "proposal";
    if (isSIA) return s.id === "sia";
    if (isPrelimNotification) return s.id === "preliminary-notification";
    if (isObjectionsHearing) return s.id === "objections-hearing";
    if (isCompensationAward) return s.id === "compensation-award";
    if (isRnR) return s.id === "rnr";
    if (isPossession) return s.id === "possession";
    return s.id === rawStageId;
  }) || STAGE_DEFINITIONS[0];

  const stages = workflow?.stages || DEFAULT_WORKFLOW_STATE.stages;
  const currentStageObj = stages[currentStageDef.id] || { status: "NOT_STARTED", statusLabel: "Active" };

  const stageProposal = stages["proposal"] || DEFAULT_WORKFLOW_STATE.stages["proposal"] || {};
  const stageSIA = stages["sia"] || DEFAULT_WORKFLOW_STATE.stages["sia"] || {};
  const stagePrelim = stages["preliminary-notification"] || DEFAULT_WORKFLOW_STATE.stages["preliminary-notification"] || {};
  const stageObj = stages["objections-hearing"] || DEFAULT_WORKFLOW_STATE.stages["objections-hearing"] || {};
  const stageComp = stages["compensation-award"] || DEFAULT_WORKFLOW_STATE.stages["compensation-award"] || {};
  const stageRnR = stages["rnr"] || DEFAULT_WORKFLOW_STATE.stages["rnr"] || {};
  const stagePossession = stages["possession"] || DEFAULT_WORKFLOW_STATE.stages["possession"] || {};

  const isProposalDone = stageProposal.status === "APPROVED" || stageProposal.status === "COMPLETED";
  const isSIADone = stageSIA.status === "APPROVED" || stageSIA.status === "COMPLETED";
  const isPrelimDone = stagePrelim.status === "APPROVED" || stagePrelim.status === "COMPLETED";
  const isObjDone = stageObj.status === "APPROVED" || stageObj.status === "COMPLETED";
  const isCompDone = stageComp.status === "APPROVED" || stageComp.status === "COMPLETED";
  const isRnRDone = stageRnR.status === "APPROVED" || stageRnR.status === "COMPLETED";
  const isPossessionDone = stagePossession.status === "APPROVED" || stagePossession.status === "COMPLETED";

  const objectionsList = [
    {
      id: "OBJ-021",
      khasraTarget: "Khasra 145/C",
      applicant: "Raj Kumar",
      issue: "Land ownership",
      statusBadge: "🟡 Hearing",
      statusType: "hearing",
      description: "Landowner disputes the recorded parcel boundary.",
      submitted: "19 Aug",
      hearing: "25 Aug",
      agencyStatus: "Evidence Submitted ✓",
      officerStatus: "Verification ✓",
      hearingStatus: "Hearing Scheduled",
      pendingAction: "🟡 Regional Officer must record hearing decision"
    },
    {
      id: "OBJ-018",
      khasraTarget: "Khasra 143/B",
      applicant: "S. Sharma",
      issue: "Compensation",
      statusBadge: "🟢 Resolved",
      statusType: "resolved",
      description: "Claim for additional fruit-bearing tree valuation.",
      submitted: "12 Aug",
      hearing: "20 Aug",
      agencyStatus: "Horticulture Evidence Uploaded ✓",
      officerStatus: "Valuation Verified ✓",
      hearingStatus: "Disposed & Solatium Added ✓",
      pendingAction: "🟢 Resolved — Official disposal order issued"
    },
    {
      id: "OBJ-027",
      khasraTarget: "Khasra 145/C",
      applicant: "A. Khan",
      issue: "Land boundary",
      statusBadge: "🔴 Pending",
      statusType: "pending",
      description: "Boundary line alignment overlap with canal drain.",
      submitted: "21 Aug",
      hearing: "28 Aug",
      agencyStatus: "Canal Demarcation Map Filed ✓",
      officerStatus: "Site Inspection Pending ⚠",
      hearingStatus: "Summons Awaited",
      pendingAction: "🔴 Regional Officer site inspection required before hearing"
    }
  ];

  const selectedObjection = objectionsList.find(o => o.id === selectedObjectionId) || objectionsList[0];

  return (
    <div className="glass-box" style={{
      padding: "26px",
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 1000,
          padding: "12px 18px",
          background: "var(--royal-900)",
          color: "#ffffff",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-xl)",
          fontSize: "13px",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderLeft: "4px solid var(--accent-emerald)",
          animation: "fadeInUp 0.3s ease"
        }}>
          <Sparkles size={16} style={{ color: "#fbbf24" }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Quick Switcher Strip */}
      <div style={{
        display: "flex",
        gap: "6px",
        overflowX: "auto",
        paddingBottom: "4px",
        borderBottom: "1px solid var(--border-light)"
      }}>
        {STAGE_DEFINITIONS.map((st) => {
          const isSelected = st.id === currentStageDef.id;
          const stObj = workflow.stages[st.id] || { status: "LOCKED" };
          const isDone = stObj.status === "APPROVED" || stObj.status === "COMPLETED";
          const isInProgress = stObj.status === "SUBMITTED" || stObj.status === "UNDER_REVIEW" || stObj.status === "RESUBMITTED" || stObj.status === "CLARIFICATION_REQUIRED";
          const isLocked = stObj.status === "LOCKED";

          return (
            <button
              key={st.id}
              onClick={() => onSelectStage && onSelectStage(st.id)}
              style={{
                padding: "6px 10px",
                borderRadius: "var(--radius-sm)",
                border: isSelected ? "1.5px solid var(--royal-600)" : "1px solid var(--border-light)",
                background: isSelected ? "var(--royal-50)" : "var(--bg-white)",
                color: isSelected ? "var(--royal-800)" : isLocked ? "var(--text-dim)" : "var(--text-secondary)",
                fontWeight: isSelected ? "700" : "500",
                fontSize: "11.5px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                transition: "all 0.15s ease"
              }}
            >
              {isLocked ? (
                <Lock size={10} style={{ color: "var(--text-dim)" }} />
              ) : (
                <span style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: isDone ? "var(--accent-emerald)" : isInProgress ? "var(--accent-amber)" : "var(--royal-500)"
                }} />
              )}
              <span>{st.stepNum}. {st.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* CLARIFICATION REQUIRED BANNER */}
      {currentStageObj.status === "CLARIFICATION_REQUIRED" && (
        <div style={{
          padding: "16px 20px",
          background: "rgba(245, 158, 11, 0.08)",
          border: "1.5px solid rgba(245, 158, 11, 0.3)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <AlertTriangle size={20} style={{ color: "#d97706", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#b45309" }}>
                Action Required: Regional Officer Clarification Requested
              </div>
              <div style={{ fontSize: "12px", color: "#92400e", marginTop: "2px" }}>
                Query: "{currentStageObj.clarificationQuery || "Please review and verify affected families list"}"
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              dispatchResubmitStage(currentStageDef.id, { response: "Uploaded corrected records and Gram Sabha verification", submittedBy: "Project Agency" });
              setToastMessage(`✓ Response to clarification submitted for ${currentStageDef.name}`);
              setTimeout(() => setToastMessage(""), 4500);
            }}
            className="btn-main"
            style={{
              padding: "8px 14px",
              fontSize: "12px",
              background: "linear-gradient(135deg, #d97706, #b45309)",
              whiteSpace: "nowrap"
            }}
          >
            Upload Corrections & Resubmit ➔
          </button>
        </div>
      )}

      {/* NOT STARTED / READY FOR SUBMISSION BANNER */}
      {currentStageObj.status === "NOT_STARTED" && (
        <div style={{
          padding: "16px 20px",
          background: "rgba(2, 132, 199, 0.06)",
          border: "1.5px solid rgba(2, 132, 199, 0.25)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px"
        }}>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--royal-900)" }}>
              Stage Active: Ready for Project Agency Submission
            </div>
            <div style={{ fontSize: "12px", color: "var(--royal-700)", marginTop: "2px" }}>
              Upload statutory compliance documents and submit for Regional Officer verification.
            </div>
          </div>
          <button
            onClick={() => {
              dispatchSubmitStage(currentStageDef.id, { submittedBy: "Project Agency", note: "Dossier uploaded with digital signatures" });
              setToastMessage(`✓ ${currentStageDef.name} submitted for Regional Officer verification!`);
              setTimeout(() => setToastMessage(""), 4500);
            }}
            className="btn-main"
            style={{
              padding: "8px 16px",
              fontSize: "12px",
              whiteSpace: "nowrap"
            }}
          >
            Submit {currentStageDef.shortName} Dossier ➔
          </button>
        </div>
      )}

      <StageErrorBoundary>
        {/* ==================== 1. STAGE 1: PROPOSAL ==================== */}
        {isProposal && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
                {project?.name || "Delhi–Mumbai Expressway (Package 4)"}
              </h2>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
                {project?.projectCode || "LA-2026-001"}
              </div>
            </div>

            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              background: isProposalDone ? "rgba(5, 150, 105, 0.08)" : "rgba(217, 119, 6, 0.08)",
              border: isProposalDone ? "1px solid rgba(5, 150, 105, 0.25)" : "1px solid rgba(217, 119, 6, 0.25)",
              color: isProposalDone ? "var(--accent-emerald)" : "var(--accent-amber)",
              fontSize: "12px",
              fontWeight: "700"
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: isProposalDone ? "var(--accent-emerald)" : "var(--accent-amber)" }} />
              <span>Proposal Status → {isProposalDone ? "Approved & Clearance Sealed ✓" : "Submitted — Under Regional Review"}</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
            <div style={{ padding: "14px 16px", background: "var(--bg-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", borderLeft: "4px solid var(--royal-600)" }}>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>124.6 Acres</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>Land Required</div>
            </div>

            <div style={{ padding: "14px 16px", background: "var(--bg-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", borderLeft: "4px solid var(--accent-emerald)" }}>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>6</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>Villages</div>
            </div>

            <div style={{ padding: "14px 16px", background: "var(--bg-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", borderLeft: "4px solid var(--accent-amber)" }}>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>438</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>Affected Families</div>
            </div>

            <div style={{ padding: "14px 16px", background: "var(--bg-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", borderLeft: "4px solid var(--royal-500)" }}>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>₹2,450 Cr</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>Project Cost</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px", alignItems: "stretch" }}>
            <div style={{ padding: "18px 20px", background: "var(--bg-white)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--royal-900)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Project Agency Submission
              </div>
              <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                NHAI has submitted the proposal for acquisition of 124.6 acres for regional highway expansion.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "2px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-primary)", padding: "9px 12px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)" }}>
                  <span>📄</span>
                  <span style={{ fontWeight: "600" }}>DPR Uploaded</span>
                  <span style={{ color: "var(--accent-emerald)", fontWeight: "700", marginLeft: "auto" }}>✓</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-primary)", padding: "9px 12px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)" }}>
                  <span>📄</span>
                  <span style={{ fontWeight: "600" }}>Land Requirement Map Uploaded</span>
                  <span style={{ color: "var(--accent-emerald)", fontWeight: "700", marginLeft: "auto" }}>✓</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-primary)", padding: "9px 12px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)" }}>
                  <span>📄</span>
                  <span style={{ fontWeight: "600" }}>Administrative Approval</span>
                  {isProposalDone ? (
                    <span style={{ color: "var(--accent-emerald)", fontWeight: "700", fontSize: "12px", marginLeft: "auto" }}>Verified & Approved ✓</span>
                  ) : (
                    <span style={{ color: "var(--accent-amber)", fontWeight: "600", fontSize: "12px", marginLeft: "auto" }}>Pending Review</span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ padding: "18px 20px", background: "var(--bg-white)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "14px" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--royal-900)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "12px" }}>
                  Regional Officer Review
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--accent-emerald)", fontWeight: "600" }}>
                    <span>✓</span>
                    <span>Project details verified</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--accent-emerald)", fontWeight: "600" }}>
                    <span>✓</span>
                    <span>Land requirement verified</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: isProposalDone ? "var(--accent-emerald)" : "var(--accent-amber)", fontWeight: "600" }}>
                    <span>{isProposalDone ? "✓" : "⚠"}</span>
                    <span>{isProposalDone ? "Administrative approval verified & sealed" : "Administrative approval pending"}</span>
                  </div>
                </div>
              </div>

              <div style={{
                padding: "10px 14px",
                background: isProposalDone ? "rgba(5, 150, 105, 0.08)" : "rgba(217, 119, 6, 0.08)",
                border: isProposalDone ? "1px solid rgba(5, 150, 105, 0.25)" : "1px solid rgba(217, 119, 6, 0.2)",
                borderRadius: "var(--radius-sm)",
                fontSize: "12.5px",
                fontWeight: "700",
                color: isProposalDone ? "var(--accent-emerald)" : "var(--accent-amber)"
              }}>
                {isProposalDone ? "Stage Approved ✓ — In-Principle Sanction Sealed" : "Next Action: Verify administrative approval"}
              </div>
            </div>
          </div>

          {/* Action & Transparency Reusable Panel */}
          <ActionTransparencyPanel
            activities={[
              { role: "Project Agency", action: "Submitted DPR & Land Requirement Map", time: "10:42 AM" },
              { role: "Regional Officer", action: "Verified project details & land requirement", time: "10:57 AM" },
              ...(isProposalDone ? [
                { role: "Regional Officer", action: "✓ Verified & Approved Administrative Sanction (Passed)", time: stageProposal.lastUpdated || "11:15 AM" }
              ] : [
                { role: "Project Agency", action: "Uploaded Administrative Approval for review", time: "11:10 AM" }
              ])
            ]}
            currentAction={isProposalDone ? {
              role: "Project Agency",
              action: "Stage 2: Social Impact Assessment (SIA) in progress"
            } : {
              role: "Regional Officer",
              action: "Verify administrative approval & issue in-principle sanction"
            }}
          />
        </div>
      )}

      {/* ==================== 2. STAGE 2: SOCIAL IMPACT ASSESSMENT (SIA) ==================== */}
      {isSIA && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
                Social Impact Assessment
              </h2>
            </div>

            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              background: isSIADone ? "rgba(5, 150, 105, 0.08)" : "rgba(217, 119, 6, 0.08)",
              border: isSIADone ? "1px solid rgba(5, 150, 105, 0.25)" : "1px solid rgba(217, 119, 6, 0.25)",
              color: isSIADone ? "var(--accent-emerald)" : "var(--accent-amber)",
              fontSize: "12.5px",
              fontWeight: "700"
            }}>
              <span>Status: {isSIADone ? "Approved & Cleared ✓" : "Under Verification 🟡"}</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
            <div style={{ padding: "16px", background: "var(--bg-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", borderLeft: "4px solid var(--royal-600)" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>438</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>Affected Families</div>
            </div>

            <div style={{ padding: "16px", background: "var(--bg-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", borderLeft: "4px solid var(--accent-amber)" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--accent-amber)", fontFamily: "var(--font-heading)" }}>72</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>Families Requiring Relocation</div>
            </div>

            <div style={{ padding: "16px", background: "var(--bg-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", borderLeft: "4px solid var(--accent-teal)" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--accent-teal)", fontFamily: "var(--font-heading)" }}>31</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>Structures Affected</div>
            </div>
          </div>

          <div style={{
            padding: "20px 24px",
            background: "var(--bg-white)",
            border: "1px solid var(--border-light)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            flexDirection: "column",
            gap: "14px"
          }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--royal-900)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              A simple Impact Breakdown
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 120px", alignItems: "center", gap: "14px", fontSize: "13px" }}>
                <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>Agricultural Land</span>
                <div style={{ height: "16px", background: "var(--bg-mist)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: "84.6%", height: "100%", background: "#059669", borderRadius: "4px" }} />
                </div>
                <span style={{ fontWeight: "800", color: "#059669", textAlign: "right" }}>84.6 acres</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 120px", alignItems: "center", gap: "14px", fontSize: "13px" }}>
                <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>Residential</span>
                <div style={{ height: "16px", background: "var(--bg-mist)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: "31%", height: "100%", background: "#2563eb", borderRadius: "4px" }} />
                </div>
                <span style={{ fontWeight: "800", color: "#2563eb", textAlign: "right" }}>31 structures</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 120px", alignItems: "center", gap: "14px", fontSize: "13px" }}>
                <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>Commercial</span>
                <div style={{ height: "16px", background: "var(--bg-mist)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: "12%", height: "100%", background: "#d97706", borderRadius: "4px" }} />
                </div>
                <span style={{ fontWeight: "800", color: "#d97706", textAlign: "right" }}>12 structures</span>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{
              padding: "18px 20px",
              background: "var(--bg-white)",
              border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--royal-900)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                SIA Document
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "700", color: "var(--royal-900)" }}>
                <span>📄</span>
                <span>SIA Report</span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Submitted by Project Agency</div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: "700", color: isSIADone ? "var(--accent-emerald)" : "var(--accent-amber)", marginTop: "4px" }}>
                <span>{isSIADone ? "Verified & Sealed by Regional Officer ✓" : "Under Verification by Regional Officer 🟡"}</span>
              </div>
            </div>

            <div style={{
              padding: "18px 20px",
              background: "var(--bg-white)",
              border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--royal-900)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Decision
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>SIA Recommendation</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "800", color: isSIADone ? "var(--accent-emerald)" : "var(--accent-amber)" }}>
                <span>{isSIADone ? "🟢" : "🟡"}</span>
                <span>{isSIADone ? "Proceed with Acquisition (Cleared ✓)" : "Review in Progress"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                <span>Regional Officer: <b>{isSIADone ? "Approved ✓" : "Reviewing"}</b></span>
                <span>Date: <b>23 Aug 2026</b></span>
              </div>
            </div>
          </div>

          {/* User's Action & Transparency Panel */}
          <ActionTransparencyPanel
            activities={isSIADone ? [
              { role: "Project Agency", action: "Submitted SIA Report & Affected Family Census", time: "18 Aug • 10:42 AM" },
              { role: "Regional Officer", action: "Verified SIA Report & Gram Sabha Consultations", time: "18 Aug • 11:15 AM" },
              { role: "Regional Officer", action: "✓ Verified & Approved SIA Report (Clearance Sealed)", time: stageSIA.lastUpdated || "23 Aug • 11:42 AM" }
            ] : [
              { role: "Project Agency", action: "Submitted SIA Report", time: "18 Aug • 10:42 AM" },
              { role: "Regional Officer", action: "Verified SIA Report", time: "18 Aug • 11:15 AM" },
              { role: "Project Agency", action: "Response requested (SIMP Mitigation measures)", time: "18 Aug • 11:32 AM", status: "warning" }
            ]}
            currentAction={isSIADone ? {
              role: "Project Agency",
              action: "Stage 3: Prepare & Submit Section 3A Preliminary Notification Gazette Draft (In Progress)"
            } : {
              role: "Regional Officer",
              action: "Review requested clarification & issue SIA clearance"
            }}
          />
        </div>
      )}

      {/* ==================== 3. STAGE 3: PRELIMINARY NOTIFICATION ==================== */}
      {isPrelimNotification && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
                Preliminary Notification
              </h2>
            </div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              background: isPrelimDone ? "rgba(5, 150, 105, 0.08)" : "rgba(217, 119, 6, 0.08)",
              border: isPrelimDone ? "1px solid rgba(5, 150, 105, 0.25)" : "1px solid rgba(217, 119, 6, 0.25)",
              color: isPrelimDone ? "var(--accent-emerald)" : "var(--accent-amber)",
              fontSize: "12.5px",
              fontWeight: "700"
            }}>
              <span>Status: {isPrelimDone ? "Published & Sealed ✓" : "Under Verification 🟡"}</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
            <div style={{ padding: "16px", background: "var(--bg-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", borderLeft: "4px solid var(--royal-600)" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>124.6 Acres</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>Notified Land</div>
            </div>

            <div style={{ padding: "16px", background: "var(--bg-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", borderLeft: "4px solid var(--accent-emerald)" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>6</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>Villages</div>
            </div>

            <div style={{ padding: "16px", background: "var(--bg-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", borderLeft: "4px solid var(--accent-amber)" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--accent-amber)", fontFamily: "var(--font-heading)" }}>30 Days</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>Objection Window</div>
            </div>
          </div>

          <div style={{
            padding: "20px 24px",
            background: "var(--bg-white)",
            border: "1px solid var(--border-light)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            flexDirection: "column",
            gap: "14px"
          }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--royal-900)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Main visual • Land Covered
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "center" }}>
              <div style={{
                background: "var(--bg-mist)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-md)",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "170px"
              }}>
                <svg viewBox="0 0 320 150" style={{ width: "100%", height: "100%", maxHeight: "150px" }}>
                  <path d="M 20,80 C 80,80 140,60 210,60 C 260,60 290,80 310,80" fill="none" stroke="rgba(30,58,138,0.15)" strokeWidth="36" strokeLinecap="round" />
                  <path d="M 20,80 C 80,80 140,60 210,60 C 260,60 290,80 310,80" fill="none" stroke="var(--royal-500)" strokeWidth="2.5" strokeDasharray="4,4" />
                  
                  <g transform="translate(40, 58)">
                    <rect width="40" height="26" rx="3" fill="#059669" fillOpacity="0.85" stroke="#ffffff" strokeWidth="1" />
                    <text x="20" y="17" fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle">V-A</text>
                  </g>
                  <g transform="translate(95, 45)">
                    <rect width="40" height="26" rx="3" fill="#2563eb" fillOpacity="0.85" stroke="#ffffff" strokeWidth="1" />
                    <text x="20" y="17" fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle">V-B</text>
                  </g>
                  <g transform="translate(155, 36)">
                    <rect width="44" height="28" rx="3" fill="#0d9488" fillOpacity="0.85" stroke="#ffffff" strokeWidth="1" />
                    <text x="22" y="18" fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle">V-C</text>
                  </g>
                  <g transform="translate(215, 46)">
                    <rect width="40" height="26" rx="3" fill="#d97706" fillOpacity="0.85" stroke="#ffffff" strokeWidth="1" />
                    <text x="20" y="17" fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle">V-D</text>
                  </g>
                </svg>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--royal-900)" }}>6 Villages</div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 12px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "12.5px" }}>
                  <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>Village A</span>
                  <span style={{ fontWeight: "700", color: "var(--royal-700)" }}>21.4 acres</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 12px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "12.5px" }}>
                  <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>Village B</span>
                  <span style={{ fontWeight: "700", color: "var(--royal-700)" }}>17.8 acres</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 12px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "12.5px" }}>
                  <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>Village C</span>
                  <span style={{ fontWeight: "700", color: "var(--royal-700)" }}>29.1 acres</span>
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--royal-600)", fontWeight: "700", paddingLeft: "4px" }}>
                  +3 more villages (Village D, E, F — 56.3 acres)
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.25fr", gap: "16px", alignItems: "stretch" }}>
            <div style={{
              padding: "18px 20px",
              background: "var(--bg-white)",
              border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "12px"
            }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--royal-900)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Notification
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "700", color: "var(--royal-900)" }}>
                  <span>📄</span>
                  <span>Preliminary Notification</span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                  Published: <b>16 Aug 2026</b>
                </div>
              </div>
              <button
                onClick={() => alert("Opening Verified Preliminary Notification Document (Gazette 3482E)...")}
                className="btn-main"
                style={{ fontSize: "12px", padding: "9px 14px", width: "auto", alignSelf: "flex-start" }}
              >
                View Document
              </button>
            </div>

            <div style={{
              padding: "18px 20px",
              background: "var(--bg-white)",
              border: "1.5px solid rgba(5, 150, 105, 0.3)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--royal-900)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Statutory Responsibility Chain
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "12px" }}>
                  <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>Project Agency</span>
                  <span style={{ fontWeight: "700", color: "var(--accent-emerald)" }}>🟢 Notification Draft Prepared</span>
                </div>
                <div style={{ textAlign: "center", color: "var(--royal-600)", fontWeight: "800", fontSize: "13px", lineHeight: "1" }}>↓</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "12px" }}>
                  <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>Regional Officer</span>
                  <span style={{ fontWeight: "700", color: isPrelimDone ? "var(--accent-emerald)" : "var(--accent-amber)" }}>{isPrelimDone ? "🟢 Verified & Authenticated ✓" : "🟡 Verification in Progress"}</span>
                </div>
                <div style={{ textAlign: "center", color: "var(--royal-600)", fontWeight: "800", fontSize: "13px", lineHeight: "1" }}>↓</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "12px" }}>
                  <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>District Authority</span>
                  <span style={{ fontWeight: "700", color: isPrelimDone ? "var(--accent-emerald)" : "var(--text-dim)" }}>{isPrelimDone ? "🟢 Published in Gazette ✓" : "⚪ Awaiting Authentication"}</span>
                </div>
              </div>

              <div style={{
                marginTop: "4px",
                padding: "8px 12px",
                background: "rgba(5, 150, 105, 0.08)",
                border: "1px solid rgba(5, 150, 105, 0.25)",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "11.5px",
                fontWeight: "700"
              }}>
                <span style={{ color: "var(--royal-900)" }}>{isPrelimDone ? "Preliminary Notification Published & Sealed ✓" : "Current Stage: Objection Window Open"}</span>
                <span style={{ color: "var(--accent-emerald)" }}>Deadline: 14 Sept 2026</span>
              </div>
            </div>
          </div>

          {/* Action & Transparency Reusable Panel */}
          <ActionTransparencyPanel
            activities={isPrelimDone ? [
              { role: "Project Agency", action: "Notification draft prepared for 6 villages", time: "14 Aug • 02:30 PM" },
              { role: "Regional Officer", action: "Verified survey numbers & boundary demarcations", time: "15 Aug • 11:00 AM" },
              { role: "District Authority", action: "✓ Published Gazette Notification 3482E (Verified & Sealed)", time: stagePrelim.lastUpdated || "16 Aug • 09:00 AM" }
            ] : [
              { role: "Project Agency", action: "Notification draft prepared for 6 villages", time: "14 Aug • 02:30 PM" },
              { role: "Regional Officer", action: "Reviewing survey boundary demarcations", time: "15 Aug • 11:00 AM", status: "warning" }
            ]}
            currentAction={isPrelimDone ? {
              role: "Regional Officer & Landowners",
              action: "Stage 4: 30-Day Public Objection & Quasi-Judicial Hearing Window Active"
            } : {
              role: "Regional Officer",
              action: "Verify survey numbers & authenticate Section 3A Gazette Schedule"
            }}
          />
        </div>
      )}

      {/* ==================== 4. STAGE 4: OBJECTIONS & HEARINGS ==================== */}
      {isObjectionsHearing && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
                Objections & Hearings
              </h2>
            </div>

            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              background: isObjDone ? "rgba(5, 150, 105, 0.08)" : "rgba(37, 99, 235, 0.08)",
              border: isObjDone ? "1px solid rgba(5, 150, 105, 0.25)" : "1px solid rgba(37, 99, 235, 0.25)",
              color: isObjDone ? "var(--accent-emerald)" : "var(--royal-700)",
              fontSize: "12.5px",
              fontWeight: "700"
            }}>
              <span>Status: {isObjDone ? "All 27 Objections Disposed & Sealed ✓" : "Active Hearings (18/27 Resolved)"}</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
            <div style={{ padding: "16px", background: "var(--bg-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", borderLeft: "4px solid var(--royal-600)" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>27</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>Objections Received</div>
            </div>

            <div style={{ padding: "16px", background: "var(--bg-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", borderLeft: "4px solid var(--accent-emerald)" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--accent-emerald)", fontFamily: "var(--font-heading)" }}>{isObjDone ? "27" : "18"}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>Resolved</div>
            </div>

            <div style={{ padding: "16px", background: "var(--bg-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", borderLeft: "4px solid var(--accent-amber)" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--accent-amber)", fontFamily: "var(--font-heading)" }}>{isObjDone ? "0" : "6"}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>Hearings Scheduled</div>
            </div>

            <div style={{ padding: "16px", background: "var(--bg-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", borderLeft: "4px solid #ef4444" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: isObjDone ? "var(--accent-emerald)" : "#ef4444", fontFamily: "var(--font-heading)" }}>{isObjDone ? "0" : "3"}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>Pending</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.25fr", gap: "16px", alignItems: "stretch" }}>
            <div style={{
              padding: "20px",
              background: "var(--bg-white)",
              border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--royal-900)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Main section • Recent Objections
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.4fr 1fr", padding: "6px 12px", fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", borderBottom: "1px solid var(--border-light)" }}>
                  <span>Applicant</span>
                  <span>Issue</span>
                  <span style={{ textAlign: "right" }}>Status</span>
                </div>

                {objectionsList.map((obj) => {
                  const isSelected = selectedObjection.id === obj.id;
                  return (
                    <div
                      key={obj.id}
                      onClick={() => setSelectedObjectionId(obj.id)}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1.2fr 1.4fr 1fr",
                        alignItems: "center",
                        padding: "10px 12px",
                        background: isSelected ? "var(--royal-50)" : "var(--bg-soft)",
                        border: isSelected ? "1.5px solid var(--royal-600)" : "1px solid var(--border-light)",
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer",
                        fontSize: "12.5px",
                        transition: "all 0.15s ease"
                      }}
                    >
                      <span style={{ fontWeight: "700", color: isSelected ? "var(--royal-900)" : "var(--text-primary)" }}>
                        {obj.applicant}
                      </span>
                      <span style={{ color: "var(--text-secondary)" }}>{obj.issue}</span>
                      <span style={{ textAlign: "right", fontWeight: "700", fontSize: "11.5px" }}>
                        {isObjDone ? "🟢 Resolved ✓" : obj.statusBadge}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "4px" }}>
                💡 Click any objection row above to view statutory hearing transparency details.
              </div>
            </div>

            <div style={{
              padding: "20px",
              background: "var(--bg-white)",
              border: "1.5px solid var(--border-medium)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "14px"
            }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "15px", fontWeight: "800", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
                    Objection #{selectedObjection.id}
                  </span>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "700" }}>{isObjDone ? "🟢 Resolved ✓" : selectedObjection.statusBadge}</span>
                    {onNavigateToGIS && (
                      <button
                        onClick={() => onNavigateToGIS(selectedObjection.khasraTarget || "Khasra 145/C")}
                        className="btn-secondary"
                        style={{ fontSize: "10.5px", padding: "3px 8px", gap: "3px" }}
                        title="Locate disputed parcel on Cadastral Map"
                      >
                        <MapPin size={12} /> View on Map
                      </button>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "6px", lineHeight: "1.4" }}>
                  {selectedObjection.description}
                </p>

                <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "var(--text-muted)", marginTop: "8px", paddingBottom: "10px", borderBottom: "1px dashed var(--border-light)" }}>
                  <span>Submitted: <b>{selectedObjection.submitted}</b></span>
                  <span>Hearing: <b>{selectedObjection.hearing}</b></span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ fontSize: "11.5px", fontWeight: "700", color: "var(--royal-900)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Responsibility
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "12px" }}>
                    <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>Project Agency</span>
                    <span style={{ fontWeight: "700", color: "var(--accent-emerald)" }}>{selectedObjection.agencyStatus}</span>
                  </div>

                  <div style={{ textAlign: "center", color: "var(--royal-600)", fontWeight: "800", fontSize: "12px", lineHeight: "1" }}>↓</div>

                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "12px" }}>
                    <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>Regional Officer</span>
                    <span style={{ fontWeight: "700", color: "var(--accent-emerald)" }}>{selectedObjection.officerStatus}</span>
                  </div>

                  <div style={{ textAlign: "center", color: "var(--royal-600)", fontWeight: "800", fontSize: "12px", lineHeight: "1" }}>↓</div>

                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "12px" }}>
                    <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>Hearing Officer</span>
                    <span style={{ fontWeight: "700", color: isObjDone ? "var(--accent-emerald)" : "var(--royal-700)" }}>{isObjDone ? "Disposal Orders Issued & Sealed ✓" : selectedObjection.hearingStatus}</span>
                  </div>
                </div>
              </div>

              <div style={{
                padding: "10px 14px",
                background: isObjDone ? "rgba(5, 150, 105, 0.08)" : "rgba(217, 119, 6, 0.08)",
                border: isObjDone ? "1px solid rgba(5, 150, 105, 0.25)" : "1px solid rgba(217, 119, 6, 0.25)",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                flexDirection: "column",
                gap: "2px"
              }}>
                <span style={{ fontSize: "10.5px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Pending action</span>
                <span style={{ fontSize: "12.5px", fontWeight: "700", color: isObjDone ? "var(--accent-emerald)" : "var(--accent-amber)" }}>
                  {isObjDone ? "🟢 All hearings concluded & Section 15 disposal sealed by Regional Officer" : selectedObjection.pendingAction}
                </span>
              </div>
            </div>
          </div>

          {/* Action & Transparency Reusable Panel */}
          <ActionTransparencyPanel
            activities={isObjDone ? [
              { role: "Project Agency", action: "Evidence & cross-verification maps submitted", time: "21 Aug • 11:30 AM" },
              { role: "Regional Officer", action: "Site inspection verified for disputed boundary", time: "22 Aug • 03:15 PM" },
              { role: "Hearing Officer", action: "✓ Quasi-judicial hearing orders signed & Section 15 disposal sealed", time: stageObj.lastUpdated || "Today • 12:15 PM" }
            ] : [
              { role: "Project Agency", action: "Evidence & cross-verification maps submitted", time: "21 Aug • 11:30 AM" },
              { role: "Regional Officer", action: "Site inspection verified for disputed boundary", time: "22 Aug • 03:15 PM" },
              { role: "Hearing Officer", action: "Scheduled quasi-judicial public hearing", time: "23 Aug • 09:15 AM" }
            ]}
            currentAction={isObjDone ? {
              role: "Project Agency",
              action: "Stage 5: Compute Section 3G Solatium Awards & PFMS DBT Disbursals (In Progress)"
            } : {
              role: "Regional Officer",
              action: "Record hearing decision & issue Section 3C disposal orders"
            }}
          />
        </div>
      )}

      {/* ==================== 5. STAGE 5: COMPENSATION & AWARD (Unified Single Portal) ==================== */}
      {isCompensationAward && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
                Compensation & Award
              </h2>
            </div>

            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              background: isCompDone ? "rgba(5, 150, 105, 0.08)" : "rgba(217, 119, 6, 0.08)",
              border: isCompDone ? "1px solid rgba(5, 150, 105, 0.25)" : "1px solid rgba(217, 119, 6, 0.25)",
              color: isCompDone ? "var(--accent-emerald)" : "var(--accent-amber)",
              fontSize: "12.5px",
              fontWeight: "700"
            }}>
              <span>Status: {isCompDone ? "100% Awards Disbursed & Reconciled ✓" : "76% Disbursed"}</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
            <div style={{ padding: "16px", background: "var(--bg-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", borderLeft: "4px solid var(--royal-600)" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>₹184.6 Cr</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>Total Award</div>
            </div>

            <div style={{ padding: "16px", background: "var(--bg-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", borderLeft: "4px solid var(--accent-emerald)" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--accent-emerald)", fontFamily: "var(--font-heading)" }}>{isCompDone ? "₹184.6 Cr" : "₹141.2 Cr"}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>Disbursed</div>
            </div>

            <div style={{ padding: "16px", background: "var(--bg-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", borderLeft: "4px solid var(--accent-amber)" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: isCompDone ? "var(--accent-emerald)" : "var(--accent-amber)", fontFamily: "var(--font-heading)" }}>{isCompDone ? "₹0.0 Cr" : "₹43.4 Cr"}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>Pending</div>
            </div>
          </div>

          <div style={{
            padding: "18px 20px",
            background: "var(--bg-white)",
            border: "1px solid var(--border-light)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--royal-900)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Progress
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)" }}>Compensation Disbursement</span>
              <span style={{ fontSize: "15px", fontWeight: "800", color: "var(--accent-emerald)" }}>{isCompDone ? "100%" : "76%"}</span>
            </div>

            <div style={{ height: "18px", background: "var(--bg-mist)", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--border-light)" }}>
              <div style={{
                width: isCompDone ? "100%" : "76%",
                height: "100%",
                background: "linear-gradient(90deg, #059669 0%, #10b981 100%)",
                borderRadius: "6px"
              }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px", alignItems: "stretch" }}>
            <div style={{
              padding: "20px",
              background: "var(--bg-white)",
              border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--royal-900)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Main section • Award Status
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "13px" }}>
                  <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>Award Preparation</span>
                  <span style={{ fontWeight: "800", color: "var(--accent-emerald)" }}>✓</span>
                </div>

                <div style={{ textAlign: "center", color: "var(--royal-600)", fontWeight: "800", fontSize: "13px", lineHeight: "1" }}>↓</div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "13px" }}>
                  <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>Officer Verification</span>
                  <span style={{ fontWeight: "800", color: "var(--accent-emerald)" }}>✓</span>
                </div>

                <div style={{ textAlign: "center", color: "var(--royal-600)", fontWeight: "800", fontSize: "13px", lineHeight: "1" }}>↓</div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "13px" }}>
                  <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>Award Approved</span>
                  <span style={{ fontWeight: "800", color: "var(--accent-emerald)" }}>✓</span>
                </div>

                <div style={{ textAlign: "center", color: "var(--royal-600)", fontWeight: "800", fontSize: "13px", lineHeight: "1" }}>↓</div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: isCompDone ? "rgba(5, 150, 105, 0.08)" : "rgba(217, 119, 6, 0.08)", border: isCompDone ? "1px solid rgba(5, 150, 105, 0.25)" : "1px solid rgba(217, 119, 6, 0.2)", borderRadius: "var(--radius-sm)", fontSize: "13px" }}>
                  <span style={{ fontWeight: "700", color: "var(--royal-900)" }}>Payment Processing</span>
                  <span style={{ fontWeight: "800", color: isCompDone ? "var(--accent-emerald)" : "var(--accent-amber)" }}>{isCompDone ? "✓ 100% Reconciled" : "🟡"}</span>
                </div>

                <div style={{ textAlign: "center", color: "var(--royal-600)", fontWeight: "800", fontSize: "13px", lineHeight: "1" }}>↓</div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "13px" }}>
                  <span style={{ fontWeight: "600", color: isCompDone ? "var(--accent-emerald)" : "var(--text-muted)" }}>Payment Completed</span>
                  <span style={{ color: isCompDone ? "var(--accent-emerald)" : "var(--text-dim)", fontSize: "11.5px", fontWeight: isCompDone ? "700" : "500" }}>{isCompDone ? "DBT Completed ✓" : "Awaiting DBT"}</span>
                </div>
              </div>
            </div>

            <div style={{
              padding: "20px",
              background: "var(--bg-white)",
              border: "1.5px solid var(--border-medium)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "14px"
            }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
                    Parcel P-102
                  </h3>
                  {onNavigateToGIS && (
                    <button
                      onClick={() => onNavigateToGIS("Khasra 142/A")}
                      className="btn-secondary"
                      style={{ fontSize: "11px", padding: "3px 8px", gap: "4px" }}
                      title="View Khasra 142/A on Cadastral Map"
                    >
                      <MapPin size={12} /> View on Map
                    </button>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "12.5px" }}>
                    <span style={{ color: "var(--text-muted)" }}>Owner:</span>
                    <span style={{ fontWeight: "700", color: "var(--royal-900)" }}>Raj Kumar</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "12.5px" }}>
                    <span style={{ color: "var(--text-muted)" }}>Area:</span>
                    <span style={{ fontWeight: "700", color: "var(--royal-900)" }}>2.4 Acres</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "12.5px" }}>
                    <span style={{ color: "var(--text-muted)" }}>Award:</span>
                    <span style={{ fontWeight: "800", color: "var(--accent-emerald)", fontSize: "14px" }}>₹84 Lakh</span>
                  </div>
                </div>
              </div>

              <div style={{
                padding: "10px 14px",
                background: isCompDone ? "rgba(5, 150, 105, 0.08)" : "rgba(217, 119, 6, 0.08)",
                border: isCompDone ? "1px solid rgba(5, 150, 105, 0.25)" : "1px solid rgba(217, 119, 6, 0.25)",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "12.5px",
                fontWeight: "700"
              }}>
                <span style={{ color: "var(--royal-900)" }}>Status:</span>
                <span style={{ color: isCompDone ? "var(--accent-emerald)" : "var(--accent-amber)" }}>{isCompDone ? "🟢 DBT Disbursed ✓" : "🟡 Payment Processing"}</span>
              </div>
            </div>
          </div>

          {/* Action & Transparency Reusable Panel */}
          <ActionTransparencyPanel
            activities={isCompDone ? [
              { role: "Regional Officer", action: "Award finalized under Section 3G (₹184.6 Cr)", time: "18 Aug • 04:00 PM" },
              { role: "Project Agency", action: "Disbursed 100% (₹184.6 Cr) DBT into landowner accounts", time: "20 Aug • 10:15 AM" },
              { role: "Regional Officer", action: "✓ Verified PFMS DBT Disbursals & Award Declaration Sealed", time: stageComp.lastUpdated || "Today • 01:10 PM" }
            ] : [
              { role: "Regional Officer", action: "Award finalized under Section 3G (₹184.6 Cr)", time: "18 Aug • 04:00 PM" },
              { role: "Project Agency", action: "Disbursed ₹141.2 Cr DBT into landowner accounts", time: "20 Aug • 10:15 AM" },
              { role: "Project Agency", action: "Batch DBT initiated for remaining 17 parcels", time: "Today • 09:30 AM", status: "warning" }
            ]}
            currentAction={isCompDone ? {
              role: "Project Agency",
              action: "Stage 6: Verify Rehabilitation & Resettlement (R&R) Packages (In Progress)"
            } : {
              role: "Regional Officer & Project Agency",
              action: "Disburse pending ₹43.4 Cr compensation awards"
            }}
          />
        </div>
      )}

      {/* ==================== 6. STAGE 6: REHABILITATION & RESETTLEMENT (R&R) ==================== */}
      {isRnR && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
                Rehabilitation & Resettlement
              </h2>
            </div>

            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              background: isRnRDone ? "rgba(5, 150, 105, 0.08)" : "rgba(217, 119, 6, 0.08)",
              border: isRnRDone ? "1px solid rgba(5, 150, 105, 0.25)" : "1px solid rgba(217, 119, 6, 0.25)",
              color: isRnRDone ? "var(--accent-emerald)" : "var(--accent-amber)",
              fontSize: "12.5px",
              fontWeight: "700"
            }}>
              <span>Status: {isRnRDone ? "100% Completed & Verified ✓" : "85% Completed"}</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
            <div style={{ padding: "16px", background: "var(--bg-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", borderLeft: "4px solid var(--royal-600)" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>438</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>Affected Families</div>
            </div>

            <div style={{ padding: "16px", background: "var(--bg-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", borderLeft: "4px solid var(--accent-amber)" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--accent-amber)", fontFamily: "var(--font-heading)" }}>72</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>Relocation Required</div>
            </div>

            <div style={{ padding: "16px", background: "var(--bg-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", borderLeft: "4px solid var(--accent-emerald)" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--accent-emerald)", fontFamily: "var(--font-heading)" }}>{isRnRDone ? "72" : "61"}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>R&R Completed</div>
            </div>

            <div style={{ padding: "16px", background: "var(--bg-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", borderLeft: "4px solid #ef4444" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: isRnRDone ? "var(--accent-emerald)" : "#ef4444", fontFamily: "var(--font-heading)" }}>{isRnRDone ? "0" : "11"}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", marginTop: "2px" }}>Pending</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px", alignItems: "stretch" }}>
            <div style={{
              padding: "20px",
              background: "var(--bg-white)",
              border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              gap: "18px"
            }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--royal-900)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Main visual • R&R Progress
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: "800", color: "var(--accent-emerald)" }}>
                    {isRnRDone ? "100% Completed ✓" : "85% Completed"}
                  </span>
                </div>

                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>
                  {isRnRDone ? "72 / 72 Families" : "61 / 72 Families"}
                </div>

                <div style={{ height: "18px", background: "var(--bg-mist)", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--border-light)" }}>
                  <div style={{
                    width: isRnRDone ? "100%" : "85%",
                    height: "100%",
                    background: "linear-gradient(90deg, #059669 0%, #10b981 100%)",
                    borderRadius: "6px"
                  }} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--royal-900)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Benefits
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "13px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>🏠</span>
                      <span style={{ fontWeight: "600" }}>Housing</span>
                    </div>
                    <span style={{ fontWeight: "800", color: "var(--royal-700)" }}>{isRnRDone ? "72/72" : "52/72"}</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "13px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>💰</span>
                      <span style={{ fontWeight: "600" }}>Financial Assistance</span>
                    </div>
                    <span style={{ fontWeight: "800", color: "var(--accent-emerald)" }}>{isRnRDone ? "72/72" : "68/72"}</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "13px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>💼</span>
                      <span style={{ fontWeight: "600" }}>Livelihood Support</span>
                    </div>
                    <span style={{ fontWeight: "800", color: isRnRDone ? "var(--accent-emerald)" : "var(--accent-amber)" }}>{isRnRDone ? "72/72" : "41/72"}</span>
                  </div>
                </div>

                {onNavigateToGIS && (
                  <button
                    onClick={() => onNavigateToGIS("Khasra 143/B")}
                    className="btn-secondary"
                    style={{ fontSize: "11.5px", padding: "7px 12px", gap: "6px", alignSelf: "flex-start", marginTop: "4px" }}
                  >
                    <MapPin size={13} /> View Resettlement Plots on GIS Map
                  </button>
                )}
              </div>
            </div>

            <div style={{
              padding: "20px",
              background: "var(--bg-white)",
              border: "1.5px solid rgba(5, 150, 105, 0.3)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "14px"
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--royal-900)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Responsibility panel
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "12.5px" }}>
                    <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>Project Agency</span>
                    <span style={{ fontWeight: "700", color: "var(--accent-emerald)" }}>R&R Plan Submitted ✓</span>
                  </div>

                  <div style={{ textAlign: "center", color: "var(--royal-600)", fontWeight: "800", fontSize: "13px", lineHeight: "1" }}>↓</div>

                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "12.5px" }}>
                    <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>Regional Officer</span>
                    <span style={{ fontWeight: "700", color: "var(--accent-emerald)" }}>Eligibility Verified ✓</span>
                  </div>

                  <div style={{ textAlign: "center", color: "var(--royal-600)", fontWeight: "800", fontSize: "13px", lineHeight: "1" }}>↓</div>

                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "12.5px" }}>
                    <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>District Authority</span>
                    <span style={{ fontWeight: "700", color: isRnRDone ? "var(--accent-emerald)" : "var(--accent-amber)" }}>{isRnRDone ? "All Packages Approved ✓" : "11 Cases Pending Approval"}</span>
                  </div>
                </div>
              </div>

              <div style={{
                padding: "12px 14px",
                background: isRnRDone ? "rgba(5, 150, 105, 0.08)" : "rgba(217, 119, 6, 0.08)",
                border: isRnRDone ? "1px solid rgba(5, 150, 105, 0.25)" : "1px solid rgba(217, 119, 6, 0.25)",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                fontWeight: "700",
                color: isRnRDone ? "var(--accent-emerald)" : "var(--accent-amber)"
              }}>
                <span>{isRnRDone ? "Status:" : "Alert:"}</span>
                <span>{isRnRDone ? "🟢 72/72 Families Verified & Resettled ✓" : "🟡 11 families require verification"}</span>
              </div>
            </div>
          </div>

          {/* Action & Transparency Reusable Panel */}
          <ActionTransparencyPanel
            activities={isRnRDone ? [
              { role: "Project Agency", action: "Submitted R&R scheme & housing allotment list", time: "15 Aug • 04:30 PM" },
              { role: "Administrator R&R", action: "Verified eligibility for all 72 PAF packages", time: "18 Aug • 02:00 PM" },
              { role: "Regional Officer", action: "✓ Approved R&R Completion Certificate (Verified & Sealed)", time: stageRnR.lastUpdated || "Today • 02:00 PM" }
            ] : [
              { role: "Project Agency", action: "Submitted R&R scheme & housing allotment list", time: "15 Aug • 04:30 PM" },
              { role: "Regional Officer", action: "Verified eligibility for 61/72 PAF packages", time: "18 Aug • 02:00 PM" },
              { role: "District Authority", action: "11 verification queries raised on non-titleholder claims", time: "20 Aug • 11:45 AM", status: "warning" }
            ]}
            currentAction={isRnRDone ? {
              role: "Project Agency & CALA",
              action: "Stage 7: Execute Final Physical Possession & RoW Handover"
            } : {
              role: "Regional Officer & Project Agency",
              action: "Complete field verification of 11 pending family benefit claims"
            }}
          />
        </div>
      )}

      {/* ==================== 7. STAGE 7: POSSESSION & HANDOVER ==================== */}
      {isPossession && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
              Possession & Handover
            </h2>
            {onNavigateToGIS && (
              <button
                onClick={() => onNavigateToGIS("Khasra 146/A")}
                className="btn-secondary"
                style={{ fontSize: "12px", padding: "6px 12px", gap: "5px" }}
              >
                <MapPin size={13} /> Open Cadastral GIS View
              </button>
            )}
          </div>

          {/* Huge Progress Indicator */}
          <div style={{
            padding: "24px 28px",
            background: "var(--bg-white)",
            border: "1px solid var(--border-light)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: "42px", fontWeight: "900", color: "var(--accent-emerald)", fontFamily: "var(--font-heading)", lineHeight: "1" }}>
                  {isPossessionDone ? "100%" : "76%"}
                </div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--royal-900)", marginTop: "4px" }}>
                  {isPossessionDone ? "124.6 / 124.6 Acres" : "94.7 / 124.6 Acres"}
                </div>
              </div>

              <div style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "var(--accent-emerald)",
                background: "rgba(5, 150, 105, 0.08)",
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                border: "1px solid rgba(5, 150, 105, 0.25)"
              }}>
                {isPossessionDone ? "RoW Handover Complete ✓" : "Possession Completed (76%)"}
              </div>
            </div>

            <div style={{ height: "22px", background: "var(--bg-mist)", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-light)" }}>
              <div style={{
                width: isPossessionDone ? "100%" : "76%",
                height: "100%",
                background: "linear-gradient(90deg, #059669 0%, #10b981 100%)",
                borderRadius: "8px"
              }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px", alignItems: "stretch" }}>
            <div style={{
              padding: "20px",
              background: "var(--bg-white)",
              border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "14px"
            }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--royal-900)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Map • Acquisition Area
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                  Show the acquisition area.
                </div>
              </div>

              <div style={{
                background: "var(--bg-mist)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-md)",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "180px"
              }}>
                <svg viewBox="0 0 340 140" style={{ width: "100%", height: "100%", maxHeight: "150px" }}>
                  <path d="M 20,70 C 80,70 140,50 210,50 C 260,50 300,70 320,70" fill="none" stroke="rgba(30,58,138,0.12)" strokeWidth="38" strokeLinecap="round" />
                  <path d="M 20,70 C 80,70 140,50 210,50 C 260,50 300,70 320,70" fill="none" stroke="var(--royal-400)" strokeWidth="2" strokeDasharray="4,4" />
                  
                  <g transform="translate(30, 48)">
                    <rect width="48" height="32" rx="4" fill="#059669" fillOpacity="0.9" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="24" y="20" fill="#ffffff" fontSize="9" fontWeight="800" textAnchor="middle">P-101 ✓</text>
                  </g>

                  <g transform="translate(90, 36)">
                    <rect width="50" height="32" rx="4" fill="#059669" fillOpacity="0.9" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="25" y="20" fill="#ffffff" fontSize="9" fontWeight="800" textAnchor="middle">P-102 ✓</text>
                  </g>

                  <g transform="translate(152, 28)">
                    <rect width="50" height="34" rx="4" fill={isPossessionDone ? "#059669" : "#d97706"} fillOpacity="0.9" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="25" y="21" fill="#ffffff" fontSize="9" fontWeight="800" textAnchor="middle">{isPossessionDone ? "P-103 ✓" : "P-103 🟡"}</text>
                  </g>

                  <g transform="translate(214, 38)">
                    <rect width="46" height="32" rx="4" fill={isPossessionDone ? "#059669" : "#ef4444"} fillOpacity="0.9" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="23" y="20" fill="#ffffff" fontSize="9" fontWeight="800" textAnchor="middle">{isPossessionDone ? "P-104 ✓" : "P-104 🔴"}</text>
                  </g>

                  <g transform="translate(272, 48)">
                    <rect width="48" height="32" rx="4" fill="#059669" fillOpacity="0.9" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="24" y="20" fill="#ffffff" fontSize="9" fontWeight="800" textAnchor="middle">P-105 ✓</text>
                  </g>
                </svg>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", flexWrap: "wrap", fontSize: "12px", fontWeight: "700" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>🟢</span>
                  <span style={{ color: "var(--accent-emerald)" }}>Possession Complete</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>🟡</span>
                  <span style={{ color: "var(--accent-amber)" }}>Pending</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>🔴</span>
                  <span style={{ color: "#ef4444" }}>Disputed</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{
                padding: "18px 20px",
                background: "var(--bg-white)",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}>
                <div style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--royal-900)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Final checklist
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", borderBottom: "1px solid var(--border-light)" }}>
                    <span>Requirement</span>
                    <span>Status</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "12.5px" }}>
                    <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>Compensation</span>
                    <span style={{ fontWeight: "800", color: "var(--accent-emerald)" }}>✓</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "12.5px" }}>
                    <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>R&R</span>
                    <span style={{ fontWeight: "800", color: "var(--accent-emerald)" }}>✓</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", fontSize: "12.5px" }}>
                    <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>Legal Verification</span>
                    <span style={{ fontWeight: "800", color: "var(--accent-emerald)" }}>✓</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", background: isPossessionDone ? "var(--bg-soft)" : "rgba(217, 119, 6, 0.08)", border: isPossessionDone ? "none" : "1px solid rgba(217, 119, 6, 0.2)", borderRadius: "var(--radius-sm)", fontSize: "12.5px" }}>
                    <span style={{ fontWeight: "700", color: "var(--royal-900)" }}>Possession</span>
                    <span style={{ fontWeight: "800", color: isPossessionDone ? "var(--accent-emerald)" : "var(--accent-amber)" }}>{isPossessionDone ? "✓ 100% Cleared" : "🟡"}</span>
                  </div>
                </div>
              </div>

              <div style={{
                padding: "18px 20px",
                background: "var(--bg-white)",
                border: isPossessionDone ? "1.5px solid rgba(5, 150, 105, 0.3)" : "1.5px solid rgba(217, 119, 6, 0.3)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--royal-900)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Final status
                </div>

                <div style={{ fontSize: "16px", fontWeight: "800", color: isPossessionDone ? "var(--accent-emerald)" : "var(--accent-amber)" }}>
                  {isPossessionDone ? "124.6 Acres Fully Handed Over ✓" : "29.9 Acres pending possession"}
                </div>

                <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                  <b>Reason:</b> {isPossessionDone ? "All 48 parcels encumbrance-free & demarcated" : "3 parcels under dispute"}
                </div>

                <div style={{ fontSize: "12px", color: isPossessionDone ? "var(--accent-emerald)" : "var(--royal-700)", fontWeight: "700", marginTop: "2px" }}>
                  {isPossessionDone ? "Ready for Civil Construction 🚀" : "Responsible: Regional Officer"}
                </div>
              </div>

            </div>

          </div>

          {/* Action & Transparency Reusable Panel */}
          <ActionTransparencyPanel
            activities={isPossessionDone ? [
              { role: "Regional Officer", action: "Issued Form-E 60-day notice to vacate for cleared chainages", time: "19 Aug • 10:00 AM" },
              { role: "Project Agency", action: "Demarcated 100% 124.6 Acres with RCC boundary pillars", time: "21 Aug • 04:00 PM" },
              { role: "Regional Officer", action: "✓ Section 3E Statutory Possession & RoW Clearance Handover Sealed", time: stagePossession.lastUpdated || "Today • 03:00 PM" }
            ] : [
              { role: "Regional Officer", action: "Issued Form-E 60-day notice to vacate for cleared chainages", time: "19 Aug • 10:00 AM" },
              { role: "Project Agency", action: "Demarcated 94.7 / 124.6 Acres with boundary pillars", time: "21 Aug • 04:00 PM" },
              { role: "Regional Officer", action: "Interim RoW Handover Certificate issued (76% cleared)", time: "Today • 11:30 AM" }
            ]}
            currentAction={isPossessionDone ? {
              role: "Project Agency (NHAI)",
              action: "Corridor Acquired & Ready for Civil Construction 🚀"
            } : {
              role: "Regional Officer",
              action: "Resolve 3 disputed parcels (29.9 Acres) & execute final Right-of-Way handover"
            }}
          />
        </div>
        )}
      </StageErrorBoundary>

    </div>
  );
}
