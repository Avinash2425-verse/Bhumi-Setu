// Streamlined, Minimal, and Highly Visual Data for Cadastral GIS & Workflow Stages

export const SIMPLE_GIS_BLOCKS = [
  {
    id: "khasra-142-a",
    khasraNo: "Khasra 142/A",
    area: "3.45 Acres",
    village: "Nabipur",
    landType: "Agricultural (Irrigated)",
    owner: "Raj Kumar",
    status: "Acquired & Cleared",
    statusType: "cleared",
    color: "#059669",
    // Cadastral polygon coordinates in a 840x360 SVG canvas
    polygonPoints: "40,120 160,110 175,220 55,235",
    labelPos: { x: 108, y: 172 },
    timeline: [
      { name: "Proposal", done: true },
      { name: "Notification", done: true },
      { name: "Objection", done: true },
      { name: "Compensation", done: true },
      { name: "Possession", done: true }
    ],
    lastUpdated: "23 Aug 2026, 11:42 AM",
    updatedBy: "Regional Officer",
    currentAction: "No action pending",
    actionRequiredParty: null,
    activityLog: [
      { role: "Project Agency", action: "Land records uploaded", time: "10:21 AM" },
      { role: "Regional Officer", action: "Ownership verified", time: "11:05 AM" },
      { role: "Regional Officer", action: "Verification completed", time: "11:42 AM" }
    ]
  },
  {
    id: "khasra-143-b",
    khasraNo: "Khasra 143/B",
    area: "2.10 Acres",
    village: "Nabipur",
    landType: "Agricultural",
    owner: "S. Sharma",
    status: "Under Survey",
    statusType: "in-progress",
    color: "#2563eb",
    polygonPoints: "160,110 270,100 285,210 175,220",
    labelPos: { x: 220, y: 165 },
    timeline: [
      { name: "Proposal", done: true },
      { name: "Notification", done: true },
      { name: "Objection", done: true },
      { name: "Compensation", done: false },
      { name: "Possession", done: false }
    ],
    lastUpdated: "22 Aug 2026, 04:15 PM",
    updatedBy: "Regional Officer",
    currentAction: "Joint Measurement Survey (JMS) field valuation in progress",
    actionRequiredParty: "Regional Officer",
    activityLog: [
      { role: "Project Agency", action: "Alignment demarcation submitted", time: "09:30 AM" },
      { role: "Regional Officer", action: "Field inspection scheduled", time: "02:10 PM" },
      { role: "Regional Officer", action: "Tree valuation under verification", time: "04:15 PM" }
    ]
  },
  {
    id: "khasra-144",
    khasraNo: "Khasra 144",
    area: "8.75 Acres",
    village: "Samni",
    landType: "Government Land",
    owner: "State Revenue Dept",
    status: "Government Land",
    statusType: "govt",
    color: "#0d9488",
    polygonPoints: "270,100 395,95 410,205 285,210",
    labelPos: { x: 340, y: 155 },
    timeline: [
      { name: "Proposal", done: true },
      { name: "Notification", done: true },
      { name: "Objection", done: true },
      { name: "Compensation", done: true },
      { name: "Possession", done: true }
    ],
    lastUpdated: "21 Aug 2026, 03:00 PM",
    updatedBy: "District Collectorate",
    currentAction: "No action pending (Govt Land Transfer Completed)",
    actionRequiredParty: null,
    activityLog: [
      { role: "Project Agency", action: "Inter-departmental transfer requisition filed", time: "11:00 AM" },
      { role: "Regional Officer", action: "Revenue record no-objection issued", time: "01:30 PM" },
      { role: "District Authority", action: "Alienation sanction sealed", time: "03:00 PM" }
    ]
  },
  {
    id: "khasra-145-c",
    khasraNo: "Khasra 145/C",
    area: "1.80 Acres",
    village: "Samni",
    landType: "Commercial Strip",
    owner: "A. Khan",
    status: "Hearing / Objection",
    statusType: "disputed",
    color: "#e11d48",
    polygonPoints: "395,95 505,90 520,200 410,205",
    labelPos: { x: 455, y: 150 },
    timeline: [
      { name: "Proposal", done: true },
      { name: "Notification", done: true },
      { name: "Objection", done: false },
      { name: "Compensation", done: false },
      { name: "Possession", done: false }
    ],
    lastUpdated: "23 Aug 2026, 09:15 AM",
    updatedBy: "Regional Officer",
    currentAction: "Boundary dispute hearing scheduled under Section 3C",
    actionRequiredParty: "Regional Officer",
    activityLog: [
      { role: "Landowner", action: "Objection filed against canal boundary overlap", time: "19 Aug, 02:00 PM" },
      { role: "Project Agency", action: "Demarcation cross-evidence uploaded", time: "21 Aug, 11:30 AM" },
      { role: "Regional Officer", action: "Hearing summons issued to applicant", time: "23 Aug, 09:15 AM" }
    ]
  },
  {
    id: "khasra-146-a",
    khasraNo: "Khasra 146/A",
    area: "4.20 Acres",
    village: "Karjan",
    landType: "Agricultural",
    owner: "Harish Patel",
    status: "Pending Possession",
    statusType: "pending",
    color: "#d97706",
    polygonPoints: "505,90 615,85 630,195 520,200",
    labelPos: { x: 565, y: 145 },
    timeline: [
      { name: "Proposal", done: true },
      { name: "Notification", done: true },
      { name: "Objection", done: true },
      { name: "Compensation", done: true },
      { name: "Possession", done: false }
    ],
    lastUpdated: "22 Aug 2026, 05:40 PM",
    updatedBy: "Project Agency",
    currentAction: "Service of Form-E 60-day notice to vacate parcel",
    actionRequiredParty: "Project Agency",
    activityLog: [
      { role: "Regional Officer", action: "Award declaration gazetted", time: "18 Aug, 04:00 PM" },
      { role: "Project Agency", action: "DBT compensation credited to owner account", time: "20 Aug, 10:15 AM" },
      { role: "Project Agency", action: "Vacation notice draft prepared", time: "22 Aug, 05:40 PM" }
    ]
  },
  {
    id: "khasra-147-1",
    khasraNo: "Khasra 147/1",
    area: "3.10 Acres",
    village: "Karjan",
    landType: "Agricultural",
    owner: "Smt. Leelaben",
    status: "Acquired & Cleared",
    statusType: "cleared",
    color: "#059669",
    polygonPoints: "615,85 715,80 730,190 630,195",
    labelPos: { x: 670, y: 140 },
    timeline: [
      { name: "Proposal", done: true },
      { name: "Notification", done: true },
      { name: "Objection", done: true },
      { name: "Compensation", done: true },
      { name: "Possession", done: true }
    ],
    lastUpdated: "20 Aug 2026, 12:30 PM",
    updatedBy: "Regional Officer",
    currentAction: "No action pending (Physical Possession Completed)",
    actionRequiredParty: null,
    activityLog: [
      { role: "Project Agency", action: "Full award ₹1.12 Cr disbursed via DBT", time: "15 Aug, 11:00 AM" },
      { role: "Regional Officer", action: "Joint physical RoW inspection signed", time: "18 Aug, 03:20 PM" },
      { role: "Project Agency", action: "RCC benchmark boundary pillars erected", time: "20 Aug, 12:30 PM" }
    ]
  },
  {
    id: "khasra-148-b",
    khasraNo: "Khasra 148/B",
    area: "2.80 Acres",
    village: "Miyagam",
    landType: "Industrial Border",
    owner: "Reliance Petro Link",
    status: "Under Survey",
    statusType: "in-progress",
    color: "#2563eb",
    polygonPoints: "715,80 810,75 825,185 730,190",
    labelPos: { x: 770, y: 135 },
    timeline: [
      { name: "Proposal", done: true },
      { name: "Notification", done: true },
      { name: "Objection", done: true },
      { name: "Compensation", done: false },
      { name: "Possession", done: false }
    ],
    lastUpdated: "23 Aug 2026, 08:30 AM",
    updatedBy: "Project Agency",
    currentAction: "Underground utility pipeline verification with GAIL / IOCL",
    actionRequiredParty: "Project Agency",
    activityLog: [
      { role: "Project Agency", action: "Utility crossing survey report drafted", time: "17 Aug, 02:40 PM" },
      { role: "Regional Officer", action: "Petrochemical right-of-user safety clearance verified", time: "21 Aug, 04:10 PM" },
      { role: "Project Agency", action: "Revised pipeline diversion plan submitted", time: "23 Aug, 08:30 AM" }
    ]
  }
];

export const WORKFLOW_STAGES = [
  // 1. PROPOSAL
  {
    id: "proposal",
    name: "Proposal",
    stepNum: 1,
    status: "Under Verification",
    responsibleParty: "Project Agency & Regional Officer",
    pendingAction: "Verify administrative approval",
    lastUpdated: "10:57 AM by Regional Officer",
    nextStep: "Proceed to Stage 2: Social Impact Assessment (SIA)",
    statutoryRef: "Section 3A In-Principle Sanction",
    summary: "Corridor feasibility study, preliminary alignment fixing, and administrative clearance."
  },

  // 2. SOCIAL IMPACT ASSESSMENT (SIA)
  {
    id: "sia",
    name: "Social Impact Assessment (SIA)",
    stepNum: 2,
    status: "Completed ✓",
    responsibleParty: "Regional Officer (CALA)",
    pendingAction: "None (SIA Cleared)",
    lastUpdated: "18 Aug 2026 by Regional Officer",
    nextStep: "Proceed to Stage 3: Preliminary Notification",
    statutoryRef: "Section 4 of RFCTLARR Act 2013",
    summary: "Comprehensive socio-economic census, displacement reduction optimization, and Gram Sabha consultations."
  },

  // 3. PRELIMINARY NOTIFICATION
  {
    id: "preliminary-notification",
    name: "Preliminary Notification",
    stepNum: 3,
    status: "Published ✓",
    responsibleParty: "District Authority / CALA",
    pendingAction: "Objection Window Open (Deadline: 14 Sept 2026)",
    lastUpdated: "16 Aug 2026",
    nextStep: "Proceed to Stage 4: Objections & Hearings",
    statutoryRef: "Section 3A(1) of NH Act 1956",
    summary: "Official publication declaring government intention to acquire specified land parcels across 6 villages."
  },

  // 4. OBJECTIONS & HEARINGS
  {
    id: "objections-hearing",
    name: "Objections & Hearings",
    stepNum: 4,
    status: "Active (18/27 Resolved)",
    responsibleParty: "Regional Officer (Hearing Officer)",
    pendingAction: "Record hearing decision",
    lastUpdated: "Today by Regional Officer",
    nextStep: "Proceed to Stage 5: Compensation & Award",
    statutoryRef: "Section 3C(1) & (2) of NH Act 1956",
    summary: "Quasi-judicial hearing of public objections, alignment inspections, and formal disposal orders."
  },

  // 5. COMPENSATION & AWARD (Unified Single Portal)
  {
    id: "compensation-award",
    name: "Compensation & Award",
    stepNum: 5,
    status: "76% Disbursed",
    responsibleParty: "Regional Officer & Project Agency",
    pendingAction: "Payment Processing for Remaining ₹43.4 Cr",
    lastUpdated: "Live Synced",
    nextStep: "Proceed to Stage 6: Rehabilitation & Resettlement (R&R)",
    statutoryRef: "Section 3G & RFCTLARR First Schedule",
    summary: "Valuation assessment, award declaration, solatium, and Direct Benefit Transfer (DBT) disbursement."
  },

  // 6. R&R (REHABILITATION & RESETTLEMENT)
  {
    id: "rnr",
    name: "Rehabilitation & Resettlement",
    stepNum: 6,
    status: "85% Completed",
    responsibleParty: "Project Agency & Administrator R&R",
    pendingAction: "11 families require verification",
    lastUpdated: "20-Aug-2026",
    nextStep: "Proceed to Stage 7: Possession & Handover",
    statutoryRef: "RFCTLARR Second & Third Schedules",
    summary: "Resettlement housing plots, livelihood transition allowances, and community infrastructure works."
  },

  // 7. POSSESSION & HANDOVER
  {
    id: "possession",
    name: "Possession & Handover",
    stepNum: 7,
    status: "76% Completed",
    responsibleParty: "Regional Officer",
    pendingAction: "29.9 Acres pending possession (3 parcels under dispute)",
    lastUpdated: "Live Synced",
    nextStep: "Resolve 3 dispute parcels & complete RoW Handover",
    statutoryRef: "Section 3E of National Highways Act 1956",
    summary: "Physical encumbrance clearance, demarcation pillars, and statutory Right of Way (RoW) handover."
  }
];

// Helper to retrieve current shared workflow stages from sessionStorage or fallback
export function getSharedWorkflowStages() {
  try {
    const saved = sessionStorage.getItem("bhoomi_workflow_stages");
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return WORKFLOW_STAGES;
}

// Helper to save shared workflow stages and notify all active windows/tabs
export function saveSharedWorkflowStages(stages) {
  try {
    sessionStorage.setItem("bhoomi_workflow_stages", JSON.stringify(stages));
    window.dispatchEvent(new CustomEvent("bhoomi_workflow_update", { detail: stages }));
  } catch (e) {}
}

// Default initial audit log records
export const INITIAL_AUDIT_LOGS = [
  {
    id: "log-1",
    projectCode: "LA-2026-001",
    projectName: "Delhi–Mumbai Expressway (Package 4)",
    officerName: "Shri S. K. Verma, IAS",
    officerRole: "CALA / Sub-Divisional Magistrate",
    district: "Bharuch",
    stageName: "Social Impact Assessment (SIA)",
    actionType: "SIA Verification & Alignment Review",
    changeSummary: "Verified 1,420 PAFs with 420 families saved via alignment curve optimization on site.",
    timestamp: "2026-08-23T11:42:00.000Z",
    status: "Verified & Sealed",
    digitalSealId: "CALA-SEAL-89210"
  },
  {
    id: "log-2",
    projectCode: "LA-2026-001",
    projectName: "Delhi–Mumbai Expressway (Package 4)",
    officerName: "Shri S. K. Verma, IAS",
    officerRole: "CALA / Sub-Divisional Magistrate",
    district: "Bharuch",
    stageName: "Proposal",
    actionType: "DPR & Cadastral Demarcation Sanction",
    changeSummary: "Administrative approval verified and in-principle acquisition clearance endorsed.",
    timestamp: "2026-08-23T10:57:00.000Z",
    status: "Verified & Sealed",
    digitalSealId: "CALA-SEAL-71045"
  }
];

export function getSharedAuditLogs() {
  try {
    const saved = sessionStorage.getItem("bhoomi_audit_logs");
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return INITIAL_AUDIT_LOGS;
}

export function saveSharedAuditLog(log) {
  try {
    const existing = getSharedAuditLogs();
    const updated = [log, ...existing];
    sessionStorage.setItem("bhoomi_audit_logs", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("bhoomi_audit_update", { detail: updated }));
  } catch (e) {}
}

