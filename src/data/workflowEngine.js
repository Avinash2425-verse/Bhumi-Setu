// ============================================================================
// BHOOMI SETU: CANONICAL SINGLE SOURCE OF TRUTH WORKFLOW STATE ENGINE
// ============================================================================

export const STAGE_KEYS = [
  "proposal",
  "sia",
  "preliminary-notification",
  "objections-hearing",
  "rnr",
  "compensation-award",
  "possession"
];

export const STAGE_DEFINITIONS = [
  {
    id: "proposal",
    name: "Project Proposal",
    stepNum: 1,
    shortName: "Proposal",
    statutoryRef: "Section 2(1) & DPR Sanction Mandate",
    defaultOwner: "Regional Officer",
    defaultAction: "Verify DPR, alignment feasibility & administrative sanction",
    summary: "Detailed Project Report (DPR), initial alignment boundaries, and administrative clearance submission."
  },
  {
    id: "sia",
    name: "Social Impact Assessment (SIA)",
    stepNum: 2,
    shortName: "SIA",
    statutoryRef: "Section 4 of RFCTLARR Act 2013",
    defaultOwner: "Project Agency",
    defaultAction: "Prepare & submit SIA Report and Project Affected Families (PAF) census",
    summary: "Public consultations, affected families census, socio-economic baseline, and mitigation matrix."
  },
  {
    id: "preliminary-notification",
    name: "Preliminary Notification",
    stepNum: 3,
    shortName: "Notification",
    statutoryRef: "Section 3A(1) of NH Act 1956 / Section 11 RFCTLARR",
    defaultOwner: "Regional Officer",
    defaultAction: "Publish Section 3A Gazette Notification in official Gazette and local dailies",
    summary: "Statutory declaration of government intention to acquire identified land parcels across villages."
  },
  {
    id: "objections-hearing",
    name: "Objections & Hearing",
    stepNum: 4,
    shortName: "Objections",
    statutoryRef: "Section 3C of NH Act 1956 / Section 15 RFCTLARR",
    defaultOwner: "Regional Officer",
    defaultAction: "Conduct quasi-judicial hearings and record Section 15 formal disposal orders",
    summary: "Quasi-judicial hearing of public objections, boundary disputes, and formal disposal orders."
  },
  {
    id: "rnr",
    name: "Rehabilitation & Resettlement (R&R)",
    stepNum: 5,
    shortName: "R&R",
    statutoryRef: "RFCTLARR Second & Third Schedules",
    defaultOwner: "Regional Officer & Project Agency",
    defaultAction: "Verify PAF entitlement packages, resettlement housing allotment & livelihoods",
    summary: "Resettlement housing plots, livelihood transition allowances, and community infrastructure works."
  },
  {
    id: "compensation-award",
    name: "Compensation & Award",
    stepNum: 6,
    shortName: "Compensation",
    statutoryRef: "Section 3G of NH Act 1956 & First Schedule",
    defaultOwner: "Regional Officer",
    defaultAction: "Declare Section 3G award and verify 100% Direct Benefit Transfer (DBT) disbursement",
    summary: "Land valuation assessment, award determination, 100% solatium, and Direct Benefit Transfer."
  },
  {
    id: "possession",
    name: "Possession & Handover",
    stepNum: 7,
    shortName: "Possession",
    statutoryRef: "Section 3E of NH Act 1956 / Section 38 RFCTLARR",
    defaultOwner: "Regional Officer",
    defaultAction: "Issue Section 3E encumbrance-free Right-of-Way (RoW) Handover Certificate",
    summary: "Physical encumbrance clearance, boundary demarcation pillars, and construction handover."
  }
];

// Initial Demonstration State (Requirement #19: Proposal SUBMITTED, all future stages LOCKED)
export const DEFAULT_WORKFLOW_STATE = {
  projectCode: "LA-2026-001",
  projectName: "DELHI–MUMBAI EXPRESSWAY (PACKAGE 4)",
  agency: "NHAI",
  state: "Gujarat",
  districts: ["Bharuch", "Vadodara", "Surat"],
  landRequiredAcres: "10,000 Acres",
  landAcquiredAcres: "0 Acres",
  currentStageKey: "proposal",
  stages: {
    "proposal": {
      id: "proposal",
      stepNum: 1,
      name: "Project Proposal",
      shortName: "Proposal",
      status: "SUBMITTED", // Initial: Agency has submitted DPR; waiting for Regional Officer / Ministry review
      statusLabel: "Submitted — Action Required",
      currentOwner: "Regional Officer",
      requiredAction: "Verify DPR, alignment feasibility & administrative sanction",
      submittedBy: "Project Agency",
      submittedTime: "Today • 10:00 AM",
      approvedBy: null,
      approvedAt: null,
      sealId: null,
      clarificationQuery: null,
      clarificationResponse: null,
      statutoryRef: "Section 2(1) & DPR Sanction Mandate",
      documents: [
        { name: "Detailed Project Report (DPR).pdf", status: "submitted" },
        { name: "Cadastral Alignment Feasibility Map.geojson", status: "submitted" }
      ]
    },
    "sia": {
      id: "sia",
      stepNum: 2,
      name: "Social Impact Assessment (SIA)",
      shortName: "SIA",
      status: "LOCKED", // Locked until Proposal is Approved
      statusLabel: "Locked — Previous Stage Incomplete",
      currentOwner: "Project Agency",
      requiredAction: "Unlock by completing Project Proposal stage",
      submittedBy: null,
      submittedTime: null,
      approvedBy: null,
      approvedAt: null,
      sealId: null,
      clarificationQuery: null,
      clarificationResponse: null,
      statutoryRef: "Section 4 of RFCTLARR Act 2013",
      documents: [
        { name: "SIA Comprehensive Report.pdf", status: "draft" },
        { name: "PAF Census & Gram Sabha Resolution.pdf", status: "draft" }
      ]
    },
    "preliminary-notification": {
      id: "preliminary-notification",
      stepNum: 3,
      name: "Preliminary Notification",
      shortName: "Notification",
      status: "LOCKED",
      statusLabel: "Locked — Previous Stage Incomplete",
      currentOwner: "Regional Officer",
      requiredAction: "Unlock by completing SIA stage",
      submittedBy: null,
      submittedTime: null,
      approvedBy: null,
      approvedAt: null,
      sealId: null,
      clarificationQuery: null,
      clarificationResponse: null,
      statutoryRef: "Section 3A(1) of NH Act 1956",
      documents: [
        { name: "Section 3A Gazette Schedule.pdf", status: "draft" }
      ]
    },
    "objections-hearing": {
      id: "objections-hearing",
      stepNum: 4,
      name: "Objections & Hearing",
      shortName: "Objections",
      status: "LOCKED",
      statusLabel: "Locked — Previous Stage Incomplete",
      currentOwner: "Regional Officer",
      requiredAction: "Unlock by completing Preliminary Notification",
      submittedBy: null,
      submittedTime: null,
      approvedBy: null,
      approvedAt: null,
      sealId: null,
      clarificationQuery: null,
      clarificationResponse: null,
      statutoryRef: "Section 3C of NH Act 1956",
      documents: [
        { name: "Section 15 Hearing Disposal Orders.pdf", status: "draft" }
      ]
    },
    "rnr": {
      id: "rnr",
      stepNum: 5,
      name: "Rehabilitation & Resettlement (R&R)",
      shortName: "R&R",
      status: "LOCKED",
      statusLabel: "Locked — Previous Stage Incomplete",
      currentOwner: "Regional Officer & Project Agency",
      requiredAction: "Unlock by completing Objections & Hearing stage",
      submittedBy: null,
      submittedTime: null,
      approvedBy: null,
      approvedAt: null,
      sealId: null,
      clarificationQuery: null,
      clarificationResponse: null,
      statutoryRef: "RFCTLARR Second & Third Schedules",
      documents: [
        { name: "R&R Scheme Award.pdf", status: "draft" }
      ]
    },
    "compensation-award": {
      id: "compensation-award",
      stepNum: 6,
      name: "Compensation & Award",
      shortName: "Compensation",
      status: "LOCKED",
      statusLabel: "Locked — Previous Stage Incomplete",
      currentOwner: "Regional Officer",
      requiredAction: "Unlock by completing R&R stage",
      submittedBy: null,
      submittedTime: null,
      approvedBy: null,
      approvedAt: null,
      sealId: null,
      clarificationQuery: null,
      clarificationResponse: null,
      statutoryRef: "Section 3G of NH Act 1956",
      documents: [
        { name: "Section 3G Award Determination.pdf", status: "draft" }
      ]
    },
    "possession": {
      id: "possession",
      stepNum: 7,
      name: "Possession & Handover",
      shortName: "Possession",
      status: "LOCKED",
      statusLabel: "Locked — Previous Stage Incomplete",
      currentOwner: "Regional Officer",
      requiredAction: "Unlock by completing Compensation & Award stage",
      submittedBy: null,
      submittedTime: null,
      approvedBy: null,
      approvedAt: null,
      sealId: null,
      clarificationQuery: null,
      clarificationResponse: null,
      statutoryRef: "Section 3E of NH Act 1956",
      documents: [
        { name: "Section 3E Possession Certificate.pdf", status: "draft" }
      ]
    }
  }
};

// Initial Activity Timeline
export const DEFAULT_ACTIVITY_LOGS = [
  {
    id: "act-1",
    who: "Project Agency",
    role: "Project Agency",
    what: "Created Project Proposal & uploaded Detailed Project Report (DPR)",
    when: "Today • 09:30 AM",
    stageKey: "proposal",
    stageName: "Project Proposal",
    status: "submitted",
    roleColor: "var(--royal-700)",
    roleBg: "var(--royal-50)"
  },
  {
    id: "act-2",
    who: "Project Agency",
    role: "Project Agency",
    what: "Submitted Project Proposal for Regional Officer statutory review",
    when: "Today • 10:00 AM",
    stageKey: "proposal",
    stageName: "Project Proposal",
    status: "submitted",
    roleColor: "var(--royal-700)",
    roleBg: "var(--royal-50)"
  }
];

// ============================================================================
// STATE ENGINE ACCESSORS & SYNCHRONIZATION
// ============================================================================

const STORAGE_KEY = "bhoomi_canonical_workflow_LA_2026_001";
const LOGS_KEY = "bhoomi_canonical_activity_logs";

export function getProjectWorkflow() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all 7 stages exist
      if (parsed && parsed.stages && STAGE_KEYS.every(k => parsed.stages[k])) {
        return parsed;
      }
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULT_WORKFLOW_STATE));
}

export function createDefaultProjectWorkflow(project = {}) {
  return {
    projectCode: project.projectCode || "LA-2026-001",
    projectName: project.name || "Project Name Unavailable",
    agency: project.agency || "Implementing Agency",
    state: project.state || "State",
    districts: project.districts || [],
    landRequiredAcres: project.landRequiredAcres || "0 Acres",
    landAcquiredAcres: "0 Acres",
    currentStageKey: "proposal",
    stages: {
      "proposal": {
        id: "proposal",
        stepNum: 1,
        name: "Project Proposal",
        shortName: "Proposal",
        status: "NOT_STARTED",
        statusLabel: "Draft — Not Started",
        currentOwner: "Project Agency",
        requiredAction: "Submit DPR and feasibility assessment",
        statutoryRef: "Section 2(1) & DPR Sanction Mandate",
        documents: []
      },
      "sia": {
        id: "sia",
        stepNum: 2,
        name: "Social Impact Assessment (SIA)",
        shortName: "SIA",
        status: "LOCKED",
        statusLabel: "Locked — Previous Stage Incomplete",
        currentOwner: "Not Assigned",
        requiredAction: "Unlock by completing Project Proposal stage",
        statutoryRef: "Section 4 of RFCTLARR Act 2013",
        documents: []
      },
      "preliminary-notification": {
        id: "preliminary-notification",
        stepNum: 3,
        name: "Preliminary Notification",
        shortName: "Notification",
        status: "LOCKED",
        statusLabel: "Locked — Previous Stage Incomplete",
        currentOwner: "Not Assigned",
        requiredAction: "Unlock by completing SIA stage",
        statutoryRef: "Section 3A(1) of NH Act 1956",
        documents: []
      },
      "objections-hearing": {
        id: "objections-hearing",
        stepNum: 4,
        name: "Objections & Hearing",
        shortName: "Objections",
        status: "LOCKED",
        statusLabel: "Locked — Previous Stage Incomplete",
        currentOwner: "Not Assigned",
        requiredAction: "Unlock by completing Preliminary Notification",
        statutoryRef: "Section 3C of NH Act 1956",
        documents: []
      },
      "rnr": {
        id: "rnr",
        stepNum: 5,
        name: "Rehabilitation & Resettlement (R&R)",
        shortName: "R&R",
        status: "LOCKED",
        statusLabel: "Locked — Previous Stage Incomplete",
        currentOwner: "Not Assigned",
        requiredAction: "Unlock by completing Objections & Hearing stage",
        statutoryRef: "RFCTLARR Second & Third Schedules",
        documents: []
      },
      "compensation-award": {
        id: "compensation-award",
        stepNum: 6,
        name: "Compensation & Award",
        shortName: "Compensation",
        status: "LOCKED",
        statusLabel: "Locked — Previous Stage Incomplete",
        currentOwner: "Not Assigned",
        requiredAction: "Unlock by completing R&R stage",
        statutoryRef: "Section 3G of NH Act 1956",
        documents: []
      },
      "possession": {
        id: "possession",
        stepNum: 7,
        name: "Possession & Handover",
        shortName: "Possession",
        status: "LOCKED",
        statusLabel: "Locked — Previous Stage Incomplete",
        currentOwner: "Not Assigned",
        requiredAction: "Unlock by completing Compensation & Award stage",
        statutoryRef: "Section 3E of NH Act 1956",
        documents: []
      }
    }
  };
}

export function saveProjectWorkflow(workflow) {
  try {
    if (!workflow) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(workflow));
    window.dispatchEvent(new CustomEvent("bhoomi_canonical_update", { detail: workflow }));
    window.dispatchEvent(new CustomEvent("bhoomi_workflow_update", { detail: workflow }));
  } catch (e) {}
}

export function getActivityLogs() {
  try {
    const saved = sessionStorage.getItem(LOGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULT_ACTIVITY_LOGS));
}

export function addActivityLog(entry) {
  try {
    if (!entry) return;
    const existing = getActivityLogs();
    const newLog = {
      id: "act-" + Date.now(),
      when: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " • Today",
      ...entry
    };
    const updated = [newLog, ...(Array.isArray(existing) ? existing : [])];
    sessionStorage.setItem(LOGS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("bhoomi_activity_update", { detail: updated }));
    window.dispatchEvent(new CustomEvent("bhoomi_audit_update", { detail: updated }));
    return newLog;
  } catch (e) {}
}

// ============================================================================
// DETERMINISTIC PROGRESS & STATUS CALCULATOR (Safe & Crash-Proof)
// ============================================================================

export function calculateWorkflowMetrics(inputWorkflow) {
  const workflow = (inputWorkflow && inputWorkflow.stages) ? inputWorkflow : getProjectWorkflow();
  const stages = workflow?.stages || DEFAULT_WORKFLOW_STATE.stages;
  let approvedCount = 0;
  let currentStageKey = "proposal";
  let activeFound = false;

  STAGE_KEYS.forEach((key) => {
    const st = stages?.[key] || DEFAULT_WORKFLOW_STATE.stages[key] || { status: "LOCKED" };
    if (st.status === "APPROVED" || st.status === "COMPLETED") {
      approvedCount++;
    } else if (!activeFound && st.status !== "LOCKED") {
      currentStageKey = key;
      activeFound = true;
    }
  });

  if (!activeFound && approvedCount === 7) {
    currentStageKey = "possession";
  }

  // Pure mathematical progress: approvedCount / 7 (0% -> 100%)
  const progressPct = Math.round((approvedCount / 7) * 1000) / 10;

  const currentStageObj = stages?.[currentStageKey] || DEFAULT_WORKFLOW_STATE.stages[currentStageKey] || {
    name: "Project Proposal",
    currentOwner: "Not Assigned",
    requiredAction: "Under Active Processing",
    status: "NOT_STARTED",
    statusLabel: "Active"
  };

  // Land Acquired calculated proportionally to approved possession/milestones
  let landAcquiredAcres = "0 Acres";
  let landAcquiredPct = 0;

  const possStatus = stages?.["possession"]?.status;
  const compStatus = stages?.["compensation-award"]?.status;
  const rnrStatus = stages?.["rnr"]?.status;
  const objStatus = stages?.["objections-hearing"]?.status;
  const prelimStatus = stages?.["preliminary-notification"]?.status;
  const siaStatus = stages?.["sia"]?.status;

  if (possStatus === "APPROVED" || possStatus === "COMPLETED") {
    landAcquiredAcres = "10,000 Acres (100% Possessed)";
    landAcquiredPct = 100;
  } else if (compStatus === "APPROVED" || rnrStatus === "APPROVED") {
    landAcquiredAcres = "8,500 Acres (85%)";
    landAcquiredPct = 85;
  } else if (objStatus === "APPROVED") {
    landAcquiredAcres = "6,000 Acres (60%)";
    landAcquiredPct = 60;
  } else if (prelimStatus === "APPROVED") {
    landAcquiredAcres = "3,500 Acres (35%)";
    landAcquiredPct = 35;
  } else if (siaStatus === "APPROVED") {
    landAcquiredAcres = "1,500 Acres (15%)";
    landAcquiredPct = 15;
  }

  return {
    approvedCount,
    totalStages: 7,
    progressPct,
    currentStageKey,
    currentStageName: currentStageObj.name || "Project Proposal",
    currentOwner: currentStageObj.currentOwner || "Not Assigned",
    requiredAction: currentStageObj.requiredAction || "Under Active Processing",
    currentStatus: currentStageObj.status || "NOT_STARTED",
    currentStatusLabel: currentStageObj.statusLabel || "Active",
    landAcquiredAcres,
    landAcquiredPct
  };
}

// ============================================================================
// CANONICAL STATE TRANSITION DISPATCHERS (Pure Workflow Operations)
// ============================================================================

/**
 * 1. Submit Stage by Project Agency
 */
export function dispatchSubmitStage(stageKey, { submittedBy = "Project Agency", note = "" } = {}) {
  const wf = getProjectWorkflow();
  const stage = wf.stages[stageKey];
  if (!stage || stage.status === "LOCKED") return false;

  stage.status = "SUBMITTED";
  stage.statusLabel = "Submitted — Review Required";
  stage.submittedBy = submittedBy;
  stage.submittedTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " • Today";
  stage.lastUpdated = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " by " + submittedBy;
  stage.currentOwner = "Regional Officer";
  stage.requiredAction = `Verify and review ${stage.name} compliance dossier`;
  if (!Array.isArray(stage.activity)) stage.activity = [];
  stage.activity.unshift({
    role: "Project Agency",
    action: `Submitted ${stage.name} verification dossier ${note ? `(${note})` : ""}`,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " • Today"
  });

  saveProjectWorkflow(wf);

  addActivityLog({
    who: submittedBy,
    role: "Project Agency",
    what: `Submitted ${stage.name} verification dossier ${note ? `(${note})` : ""}`,
    stageKey,
    stageName: stage.name,
    status: "submitted",
    roleColor: "var(--royal-700)",
    roleBg: "var(--royal-50)"
  });

  return true;
}

/**
 * 2. Request Clarification by Regional Officer
 */
export function dispatchRequestClarification(stageKey, { query = "Clarification required on submitted records", requestedBy = "Regional Officer" } = {}) {
  const wf = getProjectWorkflow();
  const stage = wf.stages[stageKey];
  if (!stage) return false;

  stage.status = "CLARIFICATION_REQUIRED";
  stage.statusLabel = "Clarification Requested";
  stage.clarificationQuery = query;
  stage.lastUpdated = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " by " + requestedBy;
  stage.currentOwner = "Project Agency";
  stage.requiredAction = `Respond to query: ${query}`;
  if (!Array.isArray(stage.activity)) stage.activity = [];
  stage.activity.unshift({
    role: "Regional Officer",
    action: `Requested clarification on ${stage.name}: "${query}"`,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " • Today"
  });

  saveProjectWorkflow(wf);

  addActivityLog({
    who: requestedBy,
    role: "Regional Officer",
    what: `Requested clarification on ${stage.name}: "${query}"`,
    stageKey,
    stageName: stage.name,
    status: "query",
    roleColor: "var(--accent-amber)",
    roleBg: "rgba(217, 119, 6, 0.1)"
  });

  return true;
}

/**
 * 3. Resubmit Stage Response by Project Agency
 */
export function dispatchResubmitStage(stageKey, { response = "Uploaded corrected records as requested", submittedBy = "Project Agency" } = {}) {
  const wf = getProjectWorkflow();
  const stage = wf.stages[stageKey];
  if (!stage) return false;

  stage.status = "RESUBMITTED";
  stage.statusLabel = "Resubmission Received — Review Required";
  stage.clarificationResponse = response;
  stage.lastUpdated = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " by " + submittedBy;
  stage.currentOwner = "Regional Officer";
  stage.requiredAction = `Verify corrected resubmission for ${stage.name}`;
  if (!Array.isArray(stage.activity)) stage.activity = [];
  stage.activity.unshift({
    role: "Project Agency",
    action: `Resubmitted ${stage.name}: "${response}"`,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " • Today"
  });

  saveProjectWorkflow(wf);

  addActivityLog({
    who: submittedBy,
    role: "Project Agency",
    what: `Resubmitted ${stage.name}: "${response}"`,
    stageKey,
    stageName: stage.name,
    status: "resubmitted",
    roleColor: "var(--royal-700)",
    roleBg: "var(--royal-50)"
  });

  return true;
}

/**
 * 4. Verify & Approve Stage by Regional Officer / Competent Authority
 * Strict Rule #18: Modifies ONLY this stage, unlocks ONLY the immediate next stage as ACTIVE/NOT_STARTED.
 * Future stages beyond nextIndex REMAIN LOCKED.
 */
export function dispatchApproveStage(stageKey, { approvedBy = "Shri S. K. Verma, IAS", officerRole = "CALA / Sub-Divisional Magistrate", sealId = null } = {}) {
  const wf = getProjectWorkflow();
  const stage = wf.stages[stageKey];
  if (!stage) return false;

  const digitalSealId = sealId || `CALA-SEAL-${Math.floor(10000 + Math.random() * 90000)}`;

  // 1. Approve ONLY current stage
  stage.status = "APPROVED";
  stage.statusLabel = "Approved & Sealed ✓";
  stage.approvedBy = approvedBy;
  stage.approvedAt = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " • Today";
  stage.lastUpdated = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " by Regional Officer";
  stage.sealId = digitalSealId;
  stage.currentOwner = "—";
  stage.requiredAction = "Stage Statutory Clearance Sealed";
  if (!Array.isArray(stage.activity)) stage.activity = [];
  stage.activity.unshift({
    role: "Regional Officer",
    action: `✓ Approved & issued statutory clearance seal (${digitalSealId}) for ${stage.name}`,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " • Today"
  });

  // 2. Unlock ONLY the next sequential stage
  const currIndex = STAGE_KEYS.indexOf(stageKey);
  const nextKey = currIndex >= 0 && currIndex + 1 < STAGE_KEYS.length ? STAGE_KEYS[currIndex + 1] : null;

  if (nextKey) {
    const nextDef = STAGE_DEFINITIONS[currIndex + 1];
    const nextStage = wf.stages[nextKey];

    // If next stage was locked, make it NOT_STARTED / ACTIVE
    if (nextStage && nextStage.status === "LOCKED") {
      nextStage.status = "NOT_STARTED";
      nextStage.statusLabel = "Active — Work Initiation Required";
      nextStage.currentOwner = nextDef.defaultOwner;
      nextStage.requiredAction = nextDef.defaultAction;
      nextStage.lastUpdated = "Just Now (Live Synced)";
    }
    wf.currentStageKey = nextKey;
  }

  saveProjectWorkflow(wf);

  addActivityLog({
    who: approvedBy,
    role: "Regional Officer",
    what: `✓ Approved & issued statutory clearance seal (${digitalSealId}) for ${stage.name}`,
    stageKey,
    stageName: stage.name,
    status: "approved",
    digitalSealId,
    roleColor: "var(--accent-emerald)",
    roleBg: "rgba(5, 150, 105, 0.12)"
  });

  return true;
}

/**
 * 5. Reject Stage by Regional Officer
 */
export function dispatchRejectStage(stageKey, { reason = "Non-compliance with statutory norms", rejectedBy = "Regional Officer" } = {}) {
  const wf = getProjectWorkflow();
  const stage = wf.stages[stageKey];
  if (!stage) return false;

  stage.status = "REJECTED";
  stage.statusLabel = "Returned with Objections";
  stage.lastUpdated = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " by " + rejectedBy;
  stage.currentOwner = "Project Agency";
  stage.requiredAction = `Address non-compliance objection: ${reason}`;
  if (!Array.isArray(stage.activity)) stage.activity = [];
  stage.activity.unshift({
    role: "Regional Officer",
    action: `✕ Rejected & returned ${stage.name}: "${reason}"`,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " • Today"
  });

  saveProjectWorkflow(wf);

  addActivityLog({
    who: rejectedBy,
    role: "Regional Officer",
    what: `✕ Rejected & returned ${stage.name}: "${reason}"`,
    stageKey,
    stageName: stage.name,
    status: "rejected",
    roleColor: "var(--accent-rose)",
    roleBg: "rgba(225, 29, 72, 0.1)"
  });

  return true;
}

/**
 * Reset to Canonical Default State
 */
export function resetWorkflowToDefault() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(LOGS_KEY);
    window.dispatchEvent(new CustomEvent("bhoomi_canonical_update", { detail: DEFAULT_WORKFLOW_STATE }));
    window.dispatchEvent(new CustomEvent("bhoomi_workflow_update", { detail: DEFAULT_WORKFLOW_STATE }));
  } catch (e) {}
}
