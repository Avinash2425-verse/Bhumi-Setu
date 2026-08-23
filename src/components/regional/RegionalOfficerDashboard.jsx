import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, Clock, AlertTriangle, AlertCircle, FileText, 
  Search, ShieldCheck, ChevronRight, X, ArrowLeft, Send, 
  Sparkles, Layers, MapPin, Eye, Check, RefreshCw, LogOut,
  Calendar, FileCheck, CheckSquare, Square, CornerDownRight,
  ZoomIn, ZoomOut, Compass, Maximize, ArrowRight, ShieldAlert
} from "lucide-react";
import confetti from "canvas-confetti";
import { INITIAL_PROJECTS } from "../../data/projectsData";
import { SIMPLE_GIS_BLOCKS, WORKFLOW_STAGES, getSharedWorkflowStages, saveSharedWorkflowStages, saveSharedAuditLog } from "../../data/gisAndWorkflowData";
import { getProjectWorkflow, dispatchApproveStage, dispatchRequestClarification, dispatchRejectStage } from "../../data/workflowEngine";

// Comprehensive Stage-Specific Data for Sequential Workflow Handover
const STAGE_CONFIG = {
  "sia": {
    stageId: "sia",
    stageIndex: 1, // 0-based index in 7-stage workflow
    stageName: "Social Impact Assessment (SIA)",
    shortName: "SIA",
    nextStageId: "preliminary-notification",
    nextStageName: "Preliminary Notification",
    nextTaskTitle: "Section 3A Gazette Schedule & Revenue Boundaries Verification Required",
    nextTaskStage: "Notification",
    submission: {
      scope: "124.6 Acres (48 Cadastral Parcels)",
      paf: "1,420 Families (420 saved by alignment curvature optimization)",
      vulnerable: "115 Families (Titleless & Marginal Farmers)",
      engineer: "Er. Vikramaditya Rao (NHAI)"
    },
    documents: [
      { key: "sia-report", name: "SIA Report.pdf", size: "4.8 MB", date: "23 Aug 2026, 10:32 AM" },
      { key: "paf-list", name: "Affected Family List.pdf", size: "2.1 MB", date: "23 Aug 2026, 10:35 AM" },
      { key: "consultation-report", name: "Public Consultation Report.pdf", size: "3.4 MB", date: "23 Aug 2026, 10:40 AM" }
    ],
    checklist: [
      { id: "c1", label: "Project information verified against DPR alignment" },
      { id: "c2", label: "Land requirement verified (124.6 Acres cadastral survey)" },
      { id: "c3", label: "Affected family information verified with village Gram Sabha" },
      { id: "c4", label: "Required statutory EIA/SIA documents submitted" }
    ],
    statusCard: {
      currentStage: "Stage 2: SIA",
      statusText: "🟡 Under Verification",
      owner: "Regional Officer (CALA)",
      actionRequired: "Verify SIA documents & census",
      nextStage: "Preliminary Notification"
    }
  },
  "preliminary-notification": {
    stageId: "preliminary-notification",
    stageIndex: 2,
    stageName: "Preliminary Notification",
    shortName: "Notification",
    nextStageId: "objections-hearing",
    nextStageName: "Objections & Hearings",
    nextTaskTitle: "Objection OBJ-021: Section 15 Hearing Disposal & Record Verification",
    nextTaskStage: "Hearings",
    submission: {
      scope: "124.6 Acres across 6 Revenue Villages (Nabipur, Samni, Karjan, etc.)",
      paf: "Objection Window: 30 Days Statutory Window",
      vulnerable: "Gazette Notification Ref: 3482E / NH-58-EXP",
      engineer: "Er. Vikramaditya Rao (NHAI)"
    },
    documents: [
      { key: "notif-gazette", name: "Draft Section 3A Gazette Schedule.pdf", size: "3.2 MB", date: "23 Aug 2026, 11:50 AM" },
      { key: "boundary-map", name: "Cadastral Boundary Alignment Map.pdf", size: "6.8 MB", date: "23 Aug 2026, 11:52 AM" },
      { key: "revenue-schedule", name: "6 Village Khasra Schedule.pdf", size: "2.9 MB", date: "23 Aug 2026, 11:55 AM" }
    ],
    checklist: [
      { id: "c1", label: "Section 3A Gazette notification schedule formatted & vetted" },
      { id: "c2", label: "6 Village survey boundary demarcations verified" },
      { id: "c3", label: "Public 30-day objection window gazette schedule confirmed" },
      { id: "c4", label: "District Collectorate revenue authentication sealed" }
    ],
    statusCard: {
      currentStage: "Stage 3: Preliminary Notification",
      statusText: "🟡 Under Verification",
      owner: "Regional Officer (CALA)",
      actionRequired: "Verify Section 3A Gazette schedule and publish",
      nextStage: "Objections & Hearings"
    }
  },
  "objections-hearing": {
    stageId: "objections-hearing",
    stageIndex: 3,
    stageName: "Objections & Hearings",
    shortName: "Objections",
    nextStageId: "compensation-award",
    nextStageName: "Compensation & Award",
    nextTaskTitle: "Section 3G Award & Solatium DBT Disbursal Verification",
    nextTaskStage: "Compensation",
    submission: {
      scope: "27 Objections (18 Resolved, 6 Scheduled, 3 Under Quasi-Judicial Review)",
      paf: "Section 15 Quasi-Judicial Hearings Conducted",
      vulnerable: "Disputed Khasras: 145/C (Canal Overlap), 143/B (Tree Valuation)",
      engineer: "Shri S. K. Verma, IAS (Hearing Officer)"
    },
    documents: [
      { key: "hearing-minutes", name: "Section 15 Hearing Disposal Orders.pdf", size: "4.1 MB", date: "23 Aug 2026, 12:15 PM" },
      { key: "dispute-evidence", name: "Khasra 145/C Canal Alignment Report.pdf", size: "3.5 MB", date: "23 Aug 2026, 12:20 PM" },
      { key: "solatium-valuation", name: "Horticulture Tree Solatium Addendum.pdf", size: "1.8 MB", date: "23 Aug 2026, 12:22 PM" }
    ],
    checklist: [
      { id: "c1", label: "Section 15 quasi-judicial hearings concluded & recorded" },
      { id: "c2", label: "Boundary overlap claim on Khasra 145/C disposed with alignment adjustment" },
      { id: "c3", label: "Tree solatium valuation vetted by Horticulture Dept" },
      { id: "c4", label: "Formal Section 3D declaration draft prepared" }
    ],
    statusCard: {
      currentStage: "Stage 4: Objections & Hearings",
      statusText: "🟡 Under Verification",
      owner: "Regional Officer (Hearing Officer)",
      actionRequired: "Record final hearing disposal orders",
      nextStage: "Compensation & Award"
    }
  },
  "compensation-award": {
    stageId: "compensation-award",
    stageIndex: 4,
    stageName: "Compensation & Award",
    shortName: "Award",
    nextStageId: "rnr",
    nextStageName: "Rehabilitation & Resettlement",
    nextTaskTitle: "11 PAF Rehabilitation Package & Entitlements Verification Required",
    nextTaskStage: "R&R",
    submission: {
      scope: "₹180.8 Cr Award Declared (76% ₹137.4 Cr Disbursed via PFMS/DBT)",
      paf: "First Schedule 100% Solatium & 12% Additional Market Value Added",
      vulnerable: "Escrow Account: State Bank of India CALA Ghaziabad Branch",
      engineer: "Er. Vikramaditya Rao (NHAI)"
    },
    documents: [
      { key: "award-declaration", name: "Section 3G Statutory Award Declaration.pdf", size: "5.4 MB", date: "23 Aug 2026, 01:10 PM" },
      { key: "dbt-scroll", name: "PFMS DBT Electronic Payment Scroll.pdf", size: "4.2 MB", date: "23 Aug 2026, 01:15 PM" },
      { key: "solatium-sheet", name: "100% Solatium Multiplier Calculation Sheet.pdf", size: "2.6 MB", date: "23 Aug 2026, 01:20 PM" }
    ],
    checklist: [
      { id: "c1", label: "Section 3G award determined per RFCTLARR First Schedule" },
      { id: "c2", label: "100% Solatium and 12% interest calculated accurately" },
      { id: "c3", label: "Aadhaar-linked DBT account validation completed" },
      { id: "c4", label: "Payment gateway PFMS statutory reconciliation certified" }
    ],
    statusCard: {
      currentStage: "Stage 5: Compensation & Award",
      statusText: "🟡 Under Verification",
      owner: "Regional Officer & Project Agency",
      actionRequired: "Verify Section 3G Award & Solatium DBT disbursals",
      nextStage: "Rehabilitation & Resettlement (R&R)"
    }
  },
  "rnr": {
    stageId: "rnr",
    stageIndex: 5,
    stageName: "Rehabilitation & Resettlement",
    shortName: "R&R",
    nextStageId: "possession",
    nextStageName: "Possession & Handover",
    nextTaskTitle: "Section 3E Physical Possession & 124.6 Acre RoW Demarcation Handover",
    nextTaskStage: "Possession",
    submission: {
      scope: "438 Displaced PAFs (72 Resettlement Housing Units Constructed)",
      paf: "Livelihood grant: ₹50,000 per family + 1-year subsistence annuity",
      vulnerable: "11 excluded tenant families validated with Samni Gram Sabha resolution",
      engineer: "Administrator R&R / NHAI"
    },
    documents: [
      { key: "rnr-entitlement", name: "Approved R&R Scheme & Second Schedule Matrix.pdf", size: "4.7 MB", date: "23 Aug 2026, 02:00 PM" },
      { key: "resettlement-allotment", name: "Resettlement Colony Housing Allotment Deeds.pdf", size: "3.9 MB", date: "23 Aug 2026, 02:05 PM" },
      { key: "gram-sabha-cert", name: "Samni Village Gram Sabha Authenticated Resolution.pdf", size: "1.9 MB", date: "23 Aug 2026, 02:10 PM" }
    ],
    checklist: [
      { id: "c1", label: "R&R scheme approved per RFCTLARR Second & Third Schedules" },
      { id: "c2", label: "72 Resettlement housing plots physically demarcated" },
      { id: "c3", label: "11 vulnerable PAF special assistance package credited" },
      { id: "c4", label: "Administrator R&R completion certificate countersigned" }
    ],
    statusCard: {
      currentStage: "Stage 6: Rehabilitation & Resettlement",
      statusText: "🟡 Under Verification",
      owner: "Project Agency & Administrator R&R",
      actionRequired: "Verify 11 PAF Rehabilitation Package & Entitlements",
      nextStage: "Possession & Handover"
    }
  },
  "possession": {
    stageId: "possession",
    stageIndex: 6,
    stageName: "Possession & Handover",
    shortName: "Possession",
    nextStageId: null,
    nextStageName: "Fully Acquired & Handed Over ✓",
    nextTaskTitle: null,
    nextTaskStage: null,
    submission: {
      scope: "124.6 Acres (48 Cadastral Parcels Fully Acquired & Cleared)",
      paf: "Physical Right of Way (RoW) Demarcation Complete",
      vulnerable: "All 3 Dispute Parcels Disposed & Compensated",
      engineer: "Er. Vikramaditya Rao (NHAI)"
    },
    documents: [
      { key: "possession-memo", name: "Section 3E Statutory Possession Memo.pdf", size: "3.8 MB", date: "23 Aug 2026, 03:00 PM" },
      { key: "row-certificate", name: "124.6 Acre Encumbrance-Free RoW Certificate.pdf", size: "4.5 MB", date: "23 Aug 2026, 03:05 PM" },
      { key: "benchmark-survey", name: "RCC Boundary Pillar Geotagged Survey.pdf", size: "5.1 MB", date: "23 Aug 2026, 03:10 PM" }
    ],
    checklist: [
      { id: "c1", label: "Physical encumbrance removal verified on ground" },
      { id: "c2", label: "RCC boundary benchmark pillars inspected along corridor" },
      { id: "c3", label: "Joint inspection memo signed by CALA and Project Agency" },
      { id: "c4", label: "Project corridor officially handed over to NHAI for construction" }
    ],
    statusCard: {
      currentStage: "Stage 7: Possession & Handover",
      statusText: "🟢 Completed ✓",
      owner: "Project Agency (Construction Ready)",
      actionRequired: "All Statutory Stages Completed (RoW Handover Complete)",
      nextStage: "Commence Civil Construction 🚀"
    }
  }
};

export default function RegionalOfficerDashboard({ user, onLogout }) {
  // Navigation: 'desk' (Control Desk) | 'projects' (Ongoing Projects) | 'workspace' (Project Review & Verification) | 'gis' (Cadastral GIS Map)
  const [activeView, setActiveView] = useState("desk");
  const [selectedProject, setSelectedProject] = useState(INITIAL_PROJECTS[0]);
  const [selectedTask, setSelectedTask] = useState(null);

  // Projects filter state
  const [projectTabFilter, setProjectTabFilter] = useState("all"); // 'all' | 'central' | 'state' | 'district'
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState("all"); // 'all' | 'active' | 'upcoming'

  // Active stage under review in Regional Officer workspace (default: 'sia')
  const [currentStageKey, setCurrentStageKey] = useState(() => {
    try {
      const savedKey = sessionStorage.getItem("bhoomi_current_stage_key");
      return savedKey && STAGE_CONFIG[savedKey] ? savedKey : "sia";
    } catch {
      return "sia";
    }
  });

  // Shared Workflow Stages State (Persisted across portals)
  const [sharedStages, setSharedStages] = useState(() => getSharedWorkflowStages());

  // Current stage configuration object
  const stageData = STAGE_CONFIG[currentStageKey] || STAGE_CONFIG["sia"];

  // Verification Checklist State
  const [checklistState, setChecklistState] = useState({
    c1: true,
    c2: true,
    c3: false,
    c4: true
  });

  // Document Verification State
  const [documentStatuses, setDocumentStatuses] = useState({
    "sia-report": "verified",
    "paf-list": "pending",
    "consultation-report": "verified"
  });

  // Clarification Modal State
  const [isClarificationOpen, setIsClarificationOpen] = useState(false);
  const [clarificationForm, setClarificationForm] = useState({
    issue: "Discrepancy in Affected Family List (11 PAFs missing Gram Sabha verification certificate)",
    message: "Please upload the authenticated Gram Sabha resolution from Samni village regarding the 11 excluded tenants.",
    responseRequiredBy: "27 Aug 2026, 05:00 PM"
  });

  // Toast & Modal Previews
  const [toastMessage, setToastMessage] = useState("");
  const [viewingDoc, setViewingDoc] = useState(null);

  // GIS State
  const [gisParcels, setGisParcels] = useState(SIMPLE_GIS_BLOCKS);
  const [gisSearch, setGisSearch] = useState("");
  const [selectedGisParcel, setSelectedGisParcel] = useState(SIMPLE_GIS_BLOCKS[1]); // Default Khasra 143/B
  const [gisZoom, setGisZoom] = useState(1);

  // Default initial operational items
  const DEFAULT_TIMELINE = [
    { who: "Project Agency", what: "Submitted SIA Report & Affected Family Census", when: "10:32 AM • 23 Aug 2026", status: "submitted", roleColor: "var(--royal-700)", roleBg: "var(--royal-50)" },
    { who: "Regional Officer", what: "Opened document for preliminary verification", when: "11:05 AM • 23 Aug 2026", status: "reviewed", roleColor: "var(--accent-amber)", roleBg: "rgba(217, 119, 6, 0.08)" },
    { who: "Regional Officer", what: "Requested clarification on Samni Gram Sabha PAF list", when: "11:18 AM • 23 Aug 2026", status: "query", roleColor: "var(--accent-amber)", roleBg: "rgba(217, 119, 6, 0.08)" },
    { who: "Project Agency", what: "Submitted corrected document with SDM endorsement", when: "12:04 PM • 23 Aug 2026", status: "resubmitted", roleColor: "var(--royal-700)", roleBg: "var(--royal-50)" }
  ];

  const DEFAULT_TASKS = [
    {
      id: "task-1",
      projectName: "Delhi–Mumbai Expressway (Package 4)",
      projectCode: "LA-2026-001",
      district: "Bharuch",
      agency: "NHAI",
      stage: "SIA",
      stageKey: "sia",
      stageLabel: "Social Impact Assessment",
      taskTitle: "SIA Report Verification Required",
      submittedBy: "Project Agency",
      submittedTime: "Today • 10:32 AM",
      priority: "high",
      status: "Action Required"
    },
    {
      id: "task-2",
      projectName: "Delhi–Mumbai Expressway (Package 4)",
      projectCode: "LA-2026-001",
      district: "Bharuch",
      agency: "NHAI",
      stage: "Land Records",
      stageKey: "sia",
      stageLabel: "Cadastral Survey (JMS)",
      taskTitle: "Ownership Verification Required (Khasra 143/B & 145/C)",
      submittedBy: "Project Agency",
      submittedTime: "Yesterday • 04:15 PM",
      priority: "medium",
      status: "Action Required"
    },
    {
      id: "task-3",
      projectName: "Delhi–Mumbai Expressway (Package 4)",
      projectCode: "LA-2026-001",
      district: "Bharuch",
      agency: "NHAI",
      stage: "Hearings",
      stageKey: "objections-hearing",
      stageLabel: "Objections & Hearings",
      taskTitle: "Objection OBJ-021: Hearing Scheduling Required",
      submittedBy: "Landowner (A. Khan)",
      submittedTime: "22 Aug • 09:15 AM",
      priority: "high",
      status: "Quasi-Judicial Action"
    },
    {
      id: "task-4",
      projectName: "DHOLERA SIR MEGA INDUSTRIAL EXPRESSWAY LINK",
      projectCode: "LA-2026-102",
      district: "Ahmedabad",
      agency: "DICDL",
      stage: "R&R",
      stageKey: "rnr",
      stageLabel: "Rehabilitation & Resettlement",
      taskTitle: "11 PAF Entitlement Package Verification Required",
      submittedBy: "Project Agency",
      submittedTime: "21 Aug • 02:40 PM",
      priority: "medium",
      status: "Action Required"
    }
  ];

  const DEFAULT_PASSED_TASKS = [
    {
      id: "task-prop-archived",
      stage: "Proposal",
      taskTitle: "Administrative Approval & Feasibility Verification",
      approvedBy: "Shri S. K. Verma, IAS",
      approvedAt: "20 Aug 2026, 04:30 PM",
      status: "Passed & Sealed ✓"
    }
  ];

  // Dynamic Activity Timeline (WHO -> WHAT -> WHEN)
  const [activityTimeline, setActivityTimeline] = useState(() => {
    try {
      const saved = sessionStorage.getItem("bhoomi_regional_activity_timeline");
      return saved ? JSON.parse(saved) : DEFAULT_TIMELINE;
    } catch {
      return DEFAULT_TIMELINE;
    }
  });

  // Operational Tasks in REQUIRES YOUR ACTION Stream
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = sessionStorage.getItem("bhoomi_regional_tasks");
      return saved ? JSON.parse(saved) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  // Passed / Completed Requests Archive
  const [passedTasks, setPassedTasks] = useState(() => {
    try {
      const saved = sessionStorage.getItem("bhoomi_regional_passed_tasks");
      return saved ? JSON.parse(saved) : DEFAULT_PASSED_TASKS;
    } catch {
      return DEFAULT_PASSED_TASKS;
    }
  });

  // Persist tasks and activity to sessionStorage across login/logout
  useEffect(() => {
    try {
      sessionStorage.setItem("bhoomi_regional_tasks", JSON.stringify(tasks));
    } catch (e) {}
  }, [tasks]);

  useEffect(() => {
    try {
      sessionStorage.setItem("bhoomi_regional_passed_tasks", JSON.stringify(passedTasks));
    } catch (e) {}
  }, [passedTasks]);

  useEffect(() => {
    try {
      sessionStorage.setItem("bhoomi_regional_activity_timeline", JSON.stringify(activityTimeline));
    } catch (e) {}
  }, [activityTimeline]);

  // Sync with localStorage on load
  useEffect(() => {
    const handleSync = () => {
      setSharedStages(getSharedWorkflowStages());
    };
    window.addEventListener("bhoomi_workflow_update", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("bhoomi_workflow_update", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4500);
  };

  // Handler to open project review workspace from task
  const handleReviewTask = (task) => {
    setSelectedTask(task);
    if (task.stageKey && STAGE_CONFIG[task.stageKey]) {
      setCurrentStageKey(task.stageKey);
    }
    const matchedProj = INITIAL_PROJECTS.find(p => p.projectCode === task.projectCode) || INITIAL_PROJECTS[0];
    setSelectedProject(matchedProj);
    setActiveView("workspace");
  };

  // Handler to open project review workspace directly from Ongoing Projects list
  const handleReviewProject = (proj) => {
    setSelectedProject(proj);
    const matchingTask = tasks.find(t => t.projectCode === proj.projectCode);
    if (matchingTask) {
      setSelectedTask(matchingTask);
      if (matchingTask.stageKey && STAGE_CONFIG[matchingTask.stageKey]) {
        setCurrentStageKey(matchingTask.stageKey);
      }
    } else {
      setSelectedTask(null);
      if (proj.stageNumber === 2) setCurrentStageKey("sia");
      else if (proj.stageNumber === 3) setCurrentStageKey("preliminary-notification");
      else if (proj.stageNumber === 4) setCurrentStageKey("objections-hearing");
      else if (proj.stageNumber === 5) setCurrentStageKey("compensation-award");
      else if (proj.stageNumber === 6) setCurrentStageKey("rnr");
      else if (proj.stageNumber === 7) setCurrentStageKey("possession");
      else setCurrentStageKey("sia");
    }
    setActiveView("workspace");
  };

  // Handler for verifying individual document
  const handleVerifyDoc = (docKey, docName) => {
    setDocumentStatuses(prev => ({ ...prev, [docKey]: "verified" }));
    showToast(`✓ Document "${docName}" marked as Verified`);
    setActivityTimeline(prev => [
      {
        who: "Regional Officer",
        what: `Verified document: ${docName}`,
        when: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " • Today",
        status: "verified",
        roleColor: "var(--accent-emerald)",
        roleBg: "rgba(5, 150, 105, 0.08)"
      },
      ...prev
    ]);
  };

  // =========================================================================
  // CORE ACTION: VERIFY & APPROVE (Passes current, rolls out next request)
  // =========================================================================
  const handleApproveStage = () => {
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });

    const currentKey = currentStageKey;
    const currentCfg = STAGE_CONFIG[currentKey];
    const nextKey = currentCfg?.nextStageId;
    const nextCfg = nextKey ? STAGE_CONFIG[nextKey] : null;

    // 1. Call central canonical workflow engine to approve ONLY this stage and unlock ONLY the next stage
    dispatchApproveStage(currentKey, {
      approvedBy: user?.name || "Shri S. K. Verma, IAS",
      officerRole: "CALA / Sub-Divisional Magistrate"
    });

    // Update shared workflow stages (Mark current stage as Approved / Completed ✓, and next as Active)
    const updatedStages = sharedStages.map(st => {
      if (st.id === currentKey || (currentKey === "sia" && st.id === "sia") || (currentKey === "preliminary-notification" && st.id === "preliminary-notification")) {
        return {
          ...st,
          status: "Approved ✓",
          pendingAction: "None (Stage Verified & Approved by Regional Officer)",
          lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " by Regional Officer"
        };
      }
      if (nextKey && st.id === nextKey) {
        return {
          ...st,
          status: "Under Verification",
          pendingAction: nextCfg?.statusCard?.actionRequired || "Under Verification by CALA",
          lastUpdated: "Just Now (Live Synced)"
        };
      }
      return st;
    });

    setSharedStages(updatedStages);
    saveSharedWorkflowStages(updatedStages);

    // Save to shared audit logs for Agency transparency ledger
    saveSharedAuditLog({
      id: "audit-" + Date.now(),
      projectCode: selectedProject.projectCode || "LA-2026-001",
      projectName: selectedProject.name || "Delhi–Mumbai Expressway (Package 4)",
      officerName: user?.name || "Shri S. K. Verma, IAS",
      officerRole: "CALA / Sub-Divisional Magistrate",
      district: selectedProject.state || "Bharuch",
      stageName: currentCfg?.stageName || "Social Impact Assessment (SIA)",
      actionType: `Stage Verification Approved: ${currentCfg?.shortName}`,
      changeSummary: `Verified statutory compliance & issued official clearance seal for ${currentCfg?.stageName}. In-principle statutory clearance passed.`,
      timestamp: new Date().toISOString(),
      status: "Verified & Sealed",
      digitalSealId: `CALA-SEAL-${Math.floor(10000 + Math.random() * 90000)}`
    });

    // 2. Add current task to Passed Archive and remove from pending tasks
    const approvedTaskTitle = selectedTask?.taskTitle || `${currentCfg?.stageName} Verification Request`;
    setPassedTasks(prev => [
      {
        id: "passed-" + Date.now(),
        stage: currentCfg?.shortName || "SIA",
        taskTitle: approvedTaskTitle,
        approvedBy: user?.name || "Shri S. K. Verma, IAS",
        approvedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " • Today",
        status: "Passed & Sealed ✓"
      },
      ...prev
    ]);

    // 3. Roll out the NEXT request in the "REQUIRES YOUR ACTION" stream
    let newTasksList = tasks.filter(t => t.id !== selectedTask?.id && t.stageKey !== currentKey);
    if (nextKey && nextCfg) {
      const nextIncomingTask = {
        id: "task-" + nextKey + "-" + Date.now(),
        projectName: selectedProject.name || "Delhi–Mumbai Expressway (Package 4)",
        projectCode: selectedProject.projectCode || "LA-2026-001",
        district: "Bharuch",
        agency: selectedProject.agency || "NHAI",
        stage: nextCfg.nextTaskStage || nextCfg.shortName,
        stageKey: nextKey,
        stageLabel: nextCfg.stageName,
        taskTitle: nextCfg.nextTaskTitle || `${nextCfg.stageName} Verification Required`,
        submittedBy: "Project Agency",
        submittedTime: "Just Now • Automated Handover",
        priority: "high",
        status: "Action Required"
      };

      newTasksList = [nextIncomingTask, ...newTasksList];
      setSelectedTask(nextIncomingTask);
      setCurrentStageKey(nextKey);
      try {
        sessionStorage.setItem("bhoomi_current_stage_key", nextKey);
      } catch (e) {}

      showToast(`🎉 ${currentCfg.shortName} Approved! Stage ${nextCfg.stageIndex + 1} (${nextCfg.shortName}) is now Active.`);
    } else {
      showToast(`🎉 Final Stage (${currentCfg.shortName}) Approved! Right of Way (RoW) Handover Complete!`);
    }

    setTasks(newTasksList);

    // 4. Update Activity & Transparency Timeline (WHO -> WHAT -> WHEN)
    setActivityTimeline(prev => [
      ...(nextCfg ? [{
        who: "Project Agency",
        what: `Submitted Stage ${nextCfg.stageIndex + 1} (${nextCfg.stageName}) verification dossier`,
        when: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " • Today",
        status: "submitted",
        roleColor: "var(--royal-700)",
        roleBg: "var(--royal-50)"
      }] : []),
      {
        who: "System",
        what: `⚡ Workflow Advanced: ${currentCfg.stageName} Marked as PASSED ✓`,
        when: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " • Today",
        status: "advance",
        roleColor: "var(--accent-emerald)",
        roleBg: "rgba(5, 150, 105, 0.12)"
      },
      {
        who: "Regional Officer",
        what: `✓ Verified & Approved ${currentCfg.stageName}. In-principle statutory clearance sealed.`,
        when: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " • Today",
        status: "approved",
        roleColor: "var(--accent-emerald)",
        roleBg: "rgba(5, 150, 105, 0.12)"
      },
      ...prev
    ]);
  };

  // Clarification Dispatch
  const handleSendClarification = (e) => {
    e.preventDefault();
    setIsClarificationOpen(false);
    showToast("⚠ Clarification Query Sent to Project Agency");

    dispatchRequestClarification(currentStageKey, {
      query: clarificationForm.issue || "Clarification required on submitted records",
      requestedBy: user?.name || "Regional Officer"
    });

    setActivityTimeline(prev => [
      {
        who: "Regional Officer",
        what: `⚠ Clarification Query Dispatched: ${clarificationForm.issue}`,
        when: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " • Today",
        status: "query",
        roleColor: "var(--accent-amber)",
        roleBg: "rgba(217, 119, 6, 0.1)"
      },
      ...prev
    ]);
  };

  // Rejection Handler
  const handleRejectStage = () => {
    if (window.confirm("Are you sure you want to return this submission with Formal Non-Compliance Objections?")) {
      showToast("✕ Submission Rejected & Returned to Project Agency");

      dispatchRejectStage(currentStageKey, {
        reason: "Non-compliance with statutory mandate",
        rejectedBy: user?.name || "Regional Officer"
      });

      setActivityTimeline(prev => [
        {
          who: "Regional Officer",
          what: `✕ Submission Rejected on ${stageData.stageName}: Non-compliance with statutory mandate.`,
          when: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " • Today",
          status: "rejected",
          roleColor: "var(--accent-rose)",
          roleBg: "rgba(225, 29, 72, 0.1)"
        },
        ...prev
      ]);
    }
  };

  // Filtered GIS parcels
  const filteredGisParcels = gisParcels.filter(p => 
    p.khasraNo.toLowerCase().includes(gisSearch.toLowerCase()) ||
    p.owner.toLowerCase().includes(gisSearch.toLowerCase()) ||
    p.village.toLowerCase().includes(gisSearch.toLowerCase())
  );

  return (
    <div className="ocean-bg-deep" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Tricolor Strip */}
      <div className="gov-strip" />

      {/* Action Toast Alert */}
      {toastMessage && (
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
          borderLeft: "4px solid var(--accent-emerald)",
          animation: "fadeInUp 0.3s ease"
        }}>
          <Sparkles size={18} style={{ color: "var(--accent-emerald)" }} />
          <span>{toastMessage}</span>
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
          <span style={{ fontSize: "24px" }}>⚖️</span>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
                Regional Officer Control Desk
              </span>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--royal-600)", fontFamily: "var(--font-heading)" }}>
                भूमि-सेतु
              </span>
              <span style={{
                fontSize: "10px",
                fontWeight: "700",
                background: "var(--royal-50)",
                color: "var(--royal-700)",
                border: "1px solid var(--royal-100)",
                padding: "2px 8px",
                borderRadius: "var(--radius-full)",
                textTransform: "uppercase"
              }}>
                CALA Revenue Authority
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Verification, Quasi-Judicial Hearings & Ground-Level Workflow Management
            </div>
          </div>
        </div>

        {/* Top View Navigation & User Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ display: "flex", background: "var(--bg-soft)", padding: "3px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-medium)" }}>
            <button
              onClick={() => setActiveView("desk")}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: activeView === "desk" ? "700" : "500",
                border: "none",
                borderRadius: "3px",
                background: activeView === "desk" ? "var(--royal-700)" : "transparent",
                color: activeView === "desk" ? "#ffffff" : "var(--text-secondary)",
                cursor: "pointer"
              }}
            >
              📋 Control Desk
            </button>

            <button
              onClick={() => setActiveView("projects")}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: activeView === "projects" ? "700" : "500",
                border: "none",
                borderRadius: "3px",
                background: activeView === "projects" ? "var(--royal-700)" : "transparent",
                color: activeView === "projects" ? "#ffffff" : "var(--text-secondary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              <span>📁 Ongoing Projects</span>
              <span style={{
                fontSize: "10px",
                fontWeight: "800",
                background: activeView === "projects" ? "rgba(255,255,255,0.25)" : "var(--royal-100)",
                color: activeView === "projects" ? "#ffffff" : "var(--royal-800)",
                padding: "1px 6px",
                borderRadius: "10px"
              }}>
                {INITIAL_PROJECTS.filter(p => p.status === "Active").length}
              </span>
            </button>

            <button
              onClick={() => setActiveView("gis")}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: activeView === "gis" ? "700" : "500",
                border: "none",
                borderRadius: "3px",
                background: activeView === "gis" ? "var(--royal-700)" : "transparent",
                color: activeView === "gis" ? "#ffffff" : "var(--text-secondary)",
                cursor: "pointer"
              }}
            >
              🗺️ Cadastral GIS
            </button>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)" }}>
              {user?.name || "Shri S. K. Verma, IAS"}
            </div>
            <div style={{ fontSize: "11px", color: "var(--royal-600)" }}>
              CALA / Sub-Divisional Magistrate (Ghaziabad)
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

      {/* Main Container */}
      <main style={{ flex: 1, padding: "24px 28px", maxWidth: "1320px", width: "100%", margin: "0 auto" }}>

        {/* ========================================================================= */}
        {/* VIEW 1: REGIONAL OFFICER CONTROL DESK (Summary Cards + Action Tasks Stream)*/}
        {/* ========================================================================= */}
        {activeView === "desk" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* 4 Compact Summary Cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px"
            }}>
              {/* Card 1: Pending Verification */}
              <div className="glass-box" style={{ padding: "18px 20px", borderLeft: "4px solid var(--royal-600)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--royal-700)", textTransform: "uppercase" }}>
                    Pending Verification
                  </span>
                  <span style={{ fontSize: "18px" }}>📋</span>
                </div>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--royal-900)", marginTop: "6px", fontFamily: "var(--font-heading)" }}>
                  {tasks.length} <span style={{ fontSize: "13px", fontWeight: "500", color: "var(--text-muted)" }}>Submissions</span>
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--royal-700)", marginTop: "4px", fontWeight: "600" }}>
                  {tasks.filter(t => t.priority === "high").length} High Priority • Auto Handover Active
                </div>
              </div>

              {/* Card 2: Active Ongoing Projects in Jurisdiction */}
              <div
                onClick={() => setActiveView("projects")}
                className="glass-box"
                style={{ padding: "18px 20px", borderLeft: "4px solid var(--royal-700)", cursor: "pointer", transition: "all 0.15s ease" }}
                title="Click to view all Ongoing Projects under Regional Jurisdiction"
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--royal-700)", textTransform: "uppercase" }}>
                    Ongoing Projects
                  </span>
                  <span style={{ fontSize: "18px" }}>📁</span>
                </div>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--royal-900)", marginTop: "6px", fontFamily: "var(--font-heading)" }}>
                  {INITIAL_PROJECTS.filter(p => p.status === "Active").length} <span style={{ fontSize: "13px", fontWeight: "500", color: "var(--text-muted)" }}>Active Corridors</span>
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--royal-700)", marginTop: "4px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>Under CALA Jurisdiction</span>
                  <span style={{ fontSize: "11px" }}>➔</span>
                </div>
              </div>

              {/* Card 3: Upcoming Hearings */}
              <div className="glass-box" style={{ padding: "18px 20px", borderLeft: "4px solid #8b5cf6" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#8b5cf6", textTransform: "uppercase" }}>
                    Upcoming Hearings
                  </span>
                  <span style={{ fontSize: "18px" }}>⚖️</span>
                </div>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--royal-900)", marginTop: "6px", fontFamily: "var(--font-heading)" }}>
                  4 <span style={{ fontSize: "13px", fontWeight: "500", color: "var(--text-muted)" }}>Scheduled</span>
                </div>
                <div style={{ fontSize: "11.5px", color: "#8b5cf6", marginTop: "4px", fontWeight: "600" }}>
                  Section 15 Quasi-Judicial
                </div>
              </div>

              {/* Card 4: Passed & Approved */}
              <div className="glass-box" style={{ padding: "18px 20px", borderLeft: "4px solid var(--accent-emerald)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--accent-emerald)", textTransform: "uppercase" }}>
                    Passed & Sealed ✓
                  </span>
                  <span style={{ fontSize: "18px" }}>✓</span>
                </div>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--accent-emerald)", marginTop: "6px", fontFamily: "var(--font-heading)" }}>
                  {passedTasks.length} <span style={{ fontSize: "13px", fontWeight: "500", color: "var(--text-muted)" }}>Stages</span>
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--accent-emerald)", marginTop: "4px", fontWeight: "600" }}>
                  Synced with Agency Portal
                </div>
              </div>
            </div>

            {/* REQUIRES YOUR ACTION Stream */}
            <div className="glass-box" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--royal-600)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Operational Action Stream
                  </div>
                  <h2 style={{ fontSize: "19px", fontWeight: "800", color: "var(--royal-900)", marginTop: "2px", fontFamily: "var(--font-heading)" }}>
                    REQUIRES YOUR ACTION
                  </h2>
                </div>
                <span style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: "600" }}>
                  {tasks.length} Actionable Items Pending Verification
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {tasks.length === 0 ? (
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
                      No pending actions
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", maxWidth: "420px" }}>
                      New submissions from Project Agencies will appear here.
                    </div>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        padding: "16px 18px",
                        background: "var(--bg-soft)",
                        border: "1px solid var(--border-light)",
                        borderLeft: task.priority === "high" ? "4px solid var(--accent-amber)" : "4px solid var(--royal-600)",
                        borderRadius: "var(--radius-sm)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "16px",
                        flexWrap: "wrap"
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "11px", fontWeight: "800", color: "var(--royal-800)", background: "var(--royal-50)", padding: "2px 8px", borderRadius: "4px" }}>
                            {task.stage || "Stage"}
                          </span>
                          <span style={{ fontSize: "13.5px", fontWeight: "800", color: "var(--royal-900)" }}>
                            {task.projectName || "Project Name Unavailable"}
                          </span>
                          <span style={{ fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                            ({task.projectCode || "Code N/A"})
                          </span>
                          {task.submittedTime && task.submittedTime.includes("Just Now") && (
                            <span style={{ fontSize: "10px", fontWeight: "800", background: "rgba(5, 150, 105, 0.12)", color: "var(--accent-emerald)", padding: "1px 6px", borderRadius: "3px" }}>
                              ⚡ NEW INCOMING REQUEST
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", marginTop: "2px" }}>
                          {task.taskTitle || "Verification Required"}
                        </div>

                        <div style={{ fontSize: "11px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "12px", marginTop: "2px" }}>
                          <span>Submitted by: <b style={{ color: "var(--text-secondary)" }}>{task.submittedBy || "Project Agency"}</b></span>
                          <span>•</span>
                          <span>{task.submittedTime || "Recently"}</span>
                          <span>•</span>
                          <span>District: <b>{task.district || "Jurisdiction Wide"}</b></span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleReviewTask(task)}
                        className="btn-main"
                        style={{
                          padding: "8px 18px",
                          fontSize: "12px",
                          fontWeight: "700",
                          width: "auto",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {task.stage === "Hearings" ? "Take Action ➔" : "Review ➔"}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* ONGOING PROJECTS IN REGIONAL JURISDICTION (Direct Access Cards)            */}
            {/* ========================================================================= */}
            <div className="glass-box" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--royal-600)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    CALA Statutory Jurisdiction
                  </div>
                  <h2 style={{ fontSize: "19px", fontWeight: "800", color: "var(--royal-900)", marginTop: "2px", fontFamily: "var(--font-heading)" }}>
                    Active & Ongoing Projects Under Jurisdiction
                  </h2>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button
                    onClick={() => setActiveView("projects")}
                    className="btn-secondary"
                    style={{ fontSize: "12px", padding: "6px 14px", color: "var(--royal-700)", fontWeight: "700" }}
                  >
                    View All Projects ({INITIAL_PROJECTS.length}) ➔
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "16px" }}>
                {INITIAL_PROJECTS.filter(p => p.status === "Active").map((proj) => {
                  const govBadge = proj.govLevel === "central" 
                    ? { label: "Central Govt", icon: "🇮🇳", color: "var(--accent-amber)", bg: "rgba(217, 119, 6, 0.08)" }
                    : proj.govLevel === "state"
                    ? { label: "State Govt", icon: "🏛️", color: "var(--royal-700)", bg: "var(--royal-50)" }
                    : { label: "District Level", icon: "📍", color: "var(--accent-teal)", bg: "rgba(13, 148, 136, 0.08)" };

                  return (
                    <div
                      key={proj.id}
                      style={{
                        padding: "20px",
                        background: "var(--bg-white)",
                        border: "1.5px solid var(--border-light)",
                        borderRadius: "var(--radius-md)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "14px",
                        boxShadow: "var(--shadow-sm)",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <div>
                        {/* Top Badge Strip */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            background: govBadge.bg,
                            color: govBadge.color,
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}>
                            <span>{govBadge.icon}</span>
                            <span>{govBadge.label}</span>
                          </span>

                          <span style={{
                            fontSize: "10.5px",
                            fontWeight: "800",
                            color: "var(--accent-emerald)",
                            background: "rgba(5, 150, 105, 0.1)",
                            padding: "2px 8px",
                            borderRadius: "var(--radius-full)",
                            border: "1px solid rgba(5, 150, 105, 0.2)"
                          }}>
                            ● ONGOING ACQUISITION
                          </span>
                        </div>

                        {/* Title & Code */}
                        <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--royal-900)", lineHeight: "1.3" }}>
                          {proj.name}
                        </h3>

                        <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "4px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                          <span>Code: <b style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{proj.projectCode}</b></span>
                          <span>•</span>
                          <span>Agency: <b style={{ color: "var(--royal-700)" }}>{proj.agency}</b></span>
                          <span>•</span>
                          <span>Districts: <b>{proj.districts ? proj.districts.join(", ") : proj.state}</b></span>
                        </div>

                        {/* Statutory Stage Pill */}
                        <div style={{
                          marginTop: "12px",
                          padding: "8px 12px",
                          background: "var(--bg-soft)",
                          border: "1px solid var(--border-medium)",
                          borderRadius: "var(--radius-sm)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600" }}>Statutory Stage:</span>
                          <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--royal-800)" }}>
                            {proj.statutoryStage || "Section 3A Preliminary Notification"}
                          </span>
                        </div>

                        {/* Progress Breakdown */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "12px" }}>
                          <div style={{ padding: "8px 10px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)" }}>
                            <div style={{ fontSize: "10.5px", color: "var(--text-muted)", fontWeight: "600" }}>Land Acquired</div>
                            <div style={{ fontSize: "13.5px", fontWeight: "800", color: "var(--royal-900)", marginTop: "2px" }}>
                              {proj.landAcquiredAcres} <span style={{ fontSize: "11px", color: "var(--accent-emerald)" }}>({proj.overallProgressPct}%)</span>
                            </div>
                          </div>

                          <div style={{ padding: "8px 10px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)" }}>
                            <div style={{ fontSize: "10.5px", color: "var(--text-muted)", fontWeight: "600" }}>Solatium Disbursed</div>
                            <div style={{ fontSize: "13.5px", fontWeight: "800", color: "var(--accent-emerald)", marginTop: "2px" }}>
                              {proj.compensationPct}% <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>DBT</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleReviewProject(proj)}
                        className="btn-main"
                        style={{
                          width: "100%",
                          padding: "9px 16px",
                          fontSize: "12.5px",
                          fontWeight: "700",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "6px",
                          marginTop: "6px"
                        }}
                      >
                        <span>Review & Verify Project</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PASSED & COMPLETED REQUESTS HISTORY */}
            {passedTasks.length > 0 && (
              <div className="glass-box" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px", background: "var(--bg-white)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "12px", fontWeight: "800", color: "var(--accent-emerald)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    ✓ Passed & Approved Requests Log ({passedTasks.length})
                  </div>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    Results Live Synced to Project Agency Portal
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {passedTasks.map((pt) => (
                    <div
                      key={pt.id}
                      style={{
                        padding: "10px 14px",
                        background: "rgba(5, 150, 105, 0.04)",
                        border: "1px solid rgba(5, 150, 105, 0.2)",
                        borderRadius: "var(--radius-sm)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "12px"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <CheckCircle2 size={16} style={{ color: "var(--accent-emerald)" }} />
                        <span style={{ fontWeight: "700", color: "var(--royal-900)" }}>Stage: {pt.stage}</span>
                        <span style={{ color: "var(--text-secondary)" }}>— {pt.taskTitle}</span>
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                        Sealed by: <b>{pt.approvedBy}</b> • {pt.approvedAt}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: DEDICATED ONGOING PROJECTS TAB (Full Project Grid & Filter Search)   */}
        {/* ========================================================================= */}
        {activeView === "projects" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            
            {/* Header with Search & Back Button */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--royal-600)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Regional Jurisdiction
                </div>
                <h1 style={{ fontSize: "22px", fontWeight: "800", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
                  Land Acquisition Projects in Region
                </h1>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                  Overseeing {INITIAL_PROJECTS.length} Infrastructure Corridors Across Central, State & District Authorities
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  onClick={() => setActiveView("desk")}
                  className="btn-secondary"
                  style={{ fontSize: "12px", padding: "7px 14px", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <ArrowLeft size={14} /> Back to Control Desk
                </button>
              </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="glass-box" style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", background: "var(--bg-white)" }}>
              {/* Category Filter Pills */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {[
                  { key: "all", label: "All Corridors", count: INITIAL_PROJECTS.length },
                  { key: "central", label: "Central Govt", count: INITIAL_PROJECTS.filter(p => p.govLevel === "central").length },
                  { key: "state", label: "State Govt", count: INITIAL_PROJECTS.filter(p => p.govLevel === "state").length },
                  { key: "district", label: "District Level", count: INITIAL_PROJECTS.filter(p => p.govLevel === "district").length }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setProjectTabFilter(tab.key)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "var(--radius-sm)",
                      border: projectTabFilter === tab.key ? "1.5px solid var(--royal-600)" : "1px solid var(--border-medium)",
                      background: projectTabFilter === tab.key ? "var(--royal-700)" : "var(--bg-soft)",
                      color: projectTabFilter === tab.key ? "#ffffff" : "var(--text-secondary)",
                      fontSize: "12px",
                      fontWeight: projectTabFilter === tab.key ? "700" : "500",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <span>{tab.label}</span>
                    <span style={{
                      fontSize: "10px",
                      fontWeight: "800",
                      padding: "1px 5px",
                      borderRadius: "8px",
                      background: projectTabFilter === tab.key ? "rgba(255,255,255,0.25)" : "var(--border-medium)",
                      color: projectTabFilter === tab.key ? "#ffffff" : "var(--text-muted)"
                    }}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div style={{ position: "relative", minWidth: "260px" }}>
                <Search size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
                <input
                  type="text"
                  placeholder="Search project name, code, district..."
                  value={projectSearchQuery}
                  onChange={(e) => setProjectSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "7px 12px 7px 32px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-medium)",
                    fontSize: "12px",
                    background: "var(--bg-soft)",
                    outline: "none"
                  }}
                />
              </div>
            </div>

            {/* Projects Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "18px" }}>
              {INITIAL_PROJECTS
                .filter(p => projectTabFilter === "all" || p.govLevel === projectTabFilter)
                .filter(p => {
                  if (!projectSearchQuery.trim()) return true;
                  const q = projectSearchQuery.toLowerCase();
                  return p.name.toLowerCase().includes(q) ||
                    p.projectCode.toLowerCase().includes(q) ||
                    p.state.toLowerCase().includes(q) ||
                    (p.districts && p.districts.some(d => d.toLowerCase().includes(q)));
                })
                .map((proj) => {
                  const govBadge = proj.govLevel === "central" 
                    ? { label: "Central Govt", icon: "🇮🇳", color: "var(--accent-amber)", bg: "rgba(217, 119, 6, 0.08)" }
                    : proj.govLevel === "state"
                    ? { label: "State Govt", icon: "🏛️", color: "var(--royal-700)", bg: "var(--royal-50)" }
                    : { label: "District Level", icon: "📍", color: "var(--accent-teal)", bg: "rgba(13, 148, 136, 0.08)" };

                  const isActive = proj.status === "Active";

                  return (
                    <div
                      key={proj.id}
                      className="glass-box"
                      style={{
                        padding: "22px",
                        background: "var(--bg-white)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "16px",
                        borderLeft: isActive ? "4px solid var(--accent-emerald)" : "4px solid var(--border-medium)"
                      }}
                    >
                      <div>
                        {/* Top Metadata */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            background: govBadge.bg,
                            color: govBadge.color,
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}>
                            <span>{govBadge.icon}</span>
                            <span>{govBadge.label}</span>
                          </span>

                          <span style={{
                            fontSize: "10.5px",
                            fontWeight: "800",
                            color: isActive ? "var(--accent-emerald)" : "var(--text-muted)",
                            background: isActive ? "rgba(5, 150, 105, 0.1)" : "var(--bg-soft)",
                            padding: "2px 8px",
                            borderRadius: "var(--radius-full)",
                            border: isActive ? "1px solid rgba(5, 150, 105, 0.2)" : "1px solid var(--border-light)"
                          }}>
                            {isActive ? "● ONGOING ACQUISITION" : "UPCOMING CORRIDOR"}
                          </span>
                        </div>

                        {/* Title & Code */}
                        <h3 style={{ fontSize: "16.5px", fontWeight: "800", color: "var(--royal-900)", lineHeight: "1.3" }}>
                          {proj.name}
                        </h3>

                        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                          <span>Code: <b style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{proj.projectCode}</b></span>
                          <span>•</span>
                          <span>Ministry: <b>{proj.agency}</b></span>
                          <span>•</span>
                          <span>Districts: <b>{proj.districts ? proj.districts.join(", ") : proj.state}</b></span>
                        </div>

                        {/* Description */}
                        <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "8px", lineHeight: "1.4" }}>
                          {proj.description}
                        </p>

                        {/* Statutory Stage Bar */}
                        <div style={{
                          marginTop: "12px",
                          padding: "8px 12px",
                          background: "var(--bg-soft)",
                          border: "1px solid var(--border-medium)",
                          borderRadius: "var(--radius-sm)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600" }}>Statutory Stage:</span>
                          <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--royal-800)" }}>
                            {proj.statutoryStage}
                          </span>
                        </div>

                        {/* 4 Multi Metrics */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "12px" }}>
                          <div style={{ padding: "8px 10px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)" }}>
                            <div style={{ fontSize: "10.5px", color: "var(--text-muted)", fontWeight: "600" }}>Land Acquired</div>
                            <div style={{ fontSize: "13px", fontWeight: "800", color: "var(--royal-900)", marginTop: "2px" }}>
                              {proj.landAcquiredAcres} <span style={{ fontSize: "11px", color: "var(--accent-emerald)" }}>({proj.overallProgressPct}%)</span>
                            </div>
                          </div>

                          <div style={{ padding: "8px 10px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)" }}>
                            <div style={{ fontSize: "10.5px", color: "var(--text-muted)", fontWeight: "600" }}>Compensation Disbursed</div>
                            <div style={{ fontSize: "13px", fontWeight: "800", color: "var(--accent-emerald)", marginTop: "2px" }}>
                              {proj.compensationPct}%
                            </div>
                          </div>

                          <div style={{ padding: "8px 10px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)" }}>
                            <div style={{ fontSize: "10.5px", color: "var(--text-muted)", fontWeight: "600" }}>R&R Settlement</div>
                            <div style={{ fontSize: "13px", fontWeight: "800", color: "var(--royal-700)", marginTop: "2px" }}>
                              {proj.rnrPct}%
                            </div>
                          </div>

                          <div style={{ padding: "8px 10px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)" }}>
                            <div style={{ fontSize: "10.5px", color: "var(--text-muted)", fontWeight: "600" }}>Physical Possession</div>
                            <div style={{ fontSize: "13px", fontWeight: "800", color: "var(--royal-900)", marginTop: "2px" }}>
                              {proj.possessionPct}%
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleReviewProject(proj)}
                        className="btn-main"
                        style={{
                          width: "100%",
                          padding: "10px 16px",
                          fontSize: "12.5px",
                          fontWeight: "700",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <span>Review & Verify Project Workspace</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: REGIONAL OFFICER PROJECT WORKSPACE & VERIFICATION SCREEN          */}
        {/* ========================================================================= */}
        {activeView === "workspace" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Top Back Button & GIS Jump */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <button
                onClick={() => setActiveView("desk")}
                className="btn-secondary"
                style={{ fontSize: "12px", padding: "6px 12px", display: "flex", alignItems: "center", gap: "6px" }}
              >
                <ArrowLeft size={14} /> Back to Control Desk
              </button>

              <button
                onClick={() => setActiveView("gis")}
                className="btn-secondary"
                style={{ fontSize: "12px", padding: "6px 14px", color: "var(--royal-700)" }}
              >
                🗺️ Open Project Cadastral GIS →
              </button>
            </div>

            {/* Project Header Card */}
            <div className="glass-box" style={{ padding: "20px 24px", background: "var(--bg-white)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--royal-600)", textTransform: "uppercase" }}>
                    Project Verification Workspace
                  </div>
                  <h1 style={{ fontSize: "22px", fontWeight: "800", color: "var(--royal-900)", marginTop: "2px", fontFamily: "var(--font-heading)" }}>
                    {selectedProject.name}
                  </h1>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <span>Code: <b style={{ fontFamily: "var(--font-mono)" }}>{selectedProject.projectCode}</b></span>
                    <span>District: <b>{selectedProject.districts ? selectedProject.districts.join(", ") : "Ghaziabad"}</b></span>
                    <span>Project Agency: <b>{selectedProject.agency}</b></span>
                    <span>State: <b>{selectedProject.state}</b></span>
                  </div>
                </div>

                <span style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  padding: "4px 12px",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(5, 150, 105, 0.1)",
                  color: "var(--accent-emerald)",
                  border: "1px solid rgba(5, 150, 105, 0.2)"
                }}>
                  ● Live Verification Session
                </span>
              </div>

              {/* 7-Stage Workflow Tracker Line (Highlighting current stage) */}
              <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--border-light)" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "10px" }}>
                  7-Stage Statutory Workflow Tracker:
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", overflowX: "auto", paddingBottom: "6px" }}>
                  {[
                    { key: "proposal", name: "Proposal", num: 1 },
                    { key: "sia", name: "SIA", num: 2 },
                    { key: "preliminary-notification", name: "Notification", num: 3 },
                    { key: "objections-hearing", name: "Objections", num: 4 },
                    { key: "compensation-award", name: "Award", num: 5 },
                    { key: "rnr", name: "R&R", num: 6 },
                    { key: "possession", name: "Possession", num: 7 }
                  ].map((stg, idx, arr) => {
                    const isCurrent = currentStageKey === stg.key;
                    const isPassed = stageData.stageIndex > (idx);

                    return (
                      <React.Fragment key={stg.key}>
                        <div
                          onClick={() => {
                            if (STAGE_CONFIG[stg.key]) {
                              setCurrentStageKey(stg.key);
                            }
                          }}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "12px",
                            fontWeight: isCurrent ? "800" : "600",
                            background: isPassed ? "var(--royal-50)" : isCurrent ? "rgba(217, 119, 6, 0.12)" : "var(--bg-soft)",
                            color: isPassed ? "var(--royal-800)" : isCurrent ? "var(--accent-amber)" : "var(--text-muted)",
                            border: isCurrent ? "1.5px solid var(--accent-amber)" : isPassed ? "1px solid var(--royal-200)" : "1px solid var(--border-light)",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            whiteSpace: "nowrap",
                            cursor: "pointer"
                          }}
                        >
                          <span>{isPassed ? "✓" : isCurrent ? "🟡" : "○"}</span>
                          <span>{stg.num}. {stg.name}</span>
                        </div>
                        {idx < arr.length - 1 && <span style={{ color: "var(--text-dim)", fontSize: "12px" }}>➔</span>}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2-Column Grid: Left Verification Screen & Checklist + Right Status & Activity Timeline */}
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "20px", alignItems: "start" }}>
              
              {/* Left Column: Verification Screen */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* 1. Submission Details */}
                <div className="glass-box" style={{ padding: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--royal-600)", textTransform: "uppercase" }}>
                      Stage {stageData.stageIndex + 1}: {stageData.stageName}
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--accent-amber)" }}>
                      ● Active Review Session
                    </span>
                  </div>

                  <h3 style={{ fontSize: "17px", fontWeight: "800", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
                    Project Agency Submission Details
                  </h3>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    background: "var(--bg-soft)",
                    padding: "14px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-light)"
                  }}>
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Total Acquisition Scope:</div>
                      <div style={{ fontSize: "13.5px", fontWeight: "700", color: "var(--royal-900)", marginTop: "2px" }}>
                        {stageData.submission.scope}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Affected Families / Details:</div>
                      <div style={{ fontSize: "13.5px", fontWeight: "700", color: "var(--royal-900)", marginTop: "2px" }}>
                        {stageData.submission.paf}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Statutory Compliance:</div>
                      <div style={{ fontSize: "13.5px", fontWeight: "700", color: "var(--royal-900)", marginTop: "2px" }}>
                        {stageData.submission.vulnerable}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Submitting Officer / Agency:</div>
                      <div style={{ fontSize: "13.5px", fontWeight: "700", color: "var(--royal-900)", marginTop: "2px" }}>
                        {stageData.submission.engineer}
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Documents */}
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>
                      Uploaded Documents from Existing Agency Workflow:
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {stageData.documents.map((doc) => {
                        const isVerified = documentStatuses[doc.key] === "verified";
                        return (
                          <div
                            key={doc.key}
                            style={{
                              padding: "10px 14px",
                              background: isVerified ? "rgba(5, 150, 105, 0.04)" : "var(--bg-white)",
                              border: isVerified ? "1px solid rgba(5, 150, 105, 0.2)" : "1px solid var(--border-light)",
                              borderRadius: "var(--radius-sm)",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: "8px"
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <FileText size={16} style={{ color: isVerified ? "var(--accent-emerald)" : "var(--royal-600)" }} />
                              <div>
                                <div style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--royal-900)" }}>
                                  {doc.name} {isVerified ? <span style={{ color: "var(--accent-emerald)", fontSize: "11px" }}>✓ Verified</span> : <span style={{ color: "var(--accent-amber)", fontSize: "11px" }}>● Uploaded</span>}
                                </div>
                                <div style={{ fontSize: "10.5px", color: "var(--text-dim)" }}>
                                  {doc.size} • {doc.date}
                                </div>
                              </div>
                            </div>

                            {/* Document Actions: View | Verify | Request Clarification */}
                            <div style={{ display: "flex", gap: "6px" }}>
                              <button
                                type="button"
                                onClick={() => setViewingDoc(doc)}
                                className="btn-secondary"
                                style={{ fontSize: "11px", padding: "4px 8px" }}
                              >
                                👁️ View
                              </button>

                              {!isVerified ? (
                                <button
                                  type="button"
                                  onClick={() => handleVerifyDoc(doc.key, doc.name)}
                                  className="btn-main"
                                  style={{ fontSize: "11px", padding: "4px 8px", width: "auto" }}
                                >
                                  ✓ Verify
                                </button>
                              ) : (
                                <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--accent-emerald)", padding: "4px 6px" }}>
                                  Sealed ✓
                                </span>
                              )}

                              <button
                                type="button"
                                onClick={() => setIsClarificationOpen(true)}
                                className="btn-secondary"
                                style={{ fontSize: "11px", padding: "4px 8px", color: "var(--accent-amber)" }}
                              >
                                ⚠ Clarify
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Verification Checklist */}
                  <div style={{ marginTop: "8px", paddingTop: "14px", borderTop: "1px solid var(--border-light)" }}>
                    <div style={{ fontSize: "12px", fontWeight: "800", color: "var(--royal-900)", marginBottom: "8px", textTransform: "uppercase" }}>
                      Verification Checklist:
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {stageData.checklist.map((item) => (
                        <label
                          key={item.id}
                          onClick={() => setChecklistState(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "12.5px",
                            color: checklistState[item.id] ? "var(--royal-900)" : "var(--text-secondary)",
                            fontWeight: checklistState[item.id] ? "700" : "500",
                            cursor: "pointer",
                            padding: "6px 10px",
                            borderRadius: "var(--radius-sm)",
                            background: checklistState[item.id] ? "var(--royal-50)" : "transparent"
                          }}
                        >
                          {checklistState[item.id] ? (
                            <CheckSquare size={16} style={{ color: "var(--accent-emerald)", flexShrink: 0 }} />
                          ) : (
                            <Square size={16} style={{ color: "var(--text-dim)", flexShrink: 0 }} />
                          )}
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 3. Officer Actions (Verify & Approve | Request Clarification | Reject) */}
                  <div style={{ marginTop: "12px", paddingTop: "16px", borderTop: "1px solid var(--border-light)" }}>
                    <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
                      Officer Action Decision:
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.2fr 0.8fr", gap: "10px" }}>
                      <button
                        type="button"
                        onClick={handleApproveStage}
                        className="btn-main"
                        style={{ padding: "10px 14px", fontSize: "12.5px" }}
                      >
                        ✓ Verify & Approve Stage
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsClarificationOpen(true)}
                        className="btn-secondary"
                        style={{ padding: "10px 14px", fontSize: "12.5px", color: "var(--accent-amber)", borderColor: "rgba(217, 119, 6, 0.3)" }}
                      >
                        ⚠ Request Clarification
                      </button>

                      <button
                        type="button"
                        onClick={handleRejectStage}
                        className="btn-secondary"
                        style={{ padding: "10px 14px", fontSize: "12.5px", color: "var(--accent-rose)", borderColor: "rgba(225, 29, 72, 0.3)" }}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Current Workflow Status Card & Transparency Timeline */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* CURRENT WORKFLOW STATUS CARD */}
                <div className="glass-box" style={{ padding: "20px", borderLeft: "4px solid var(--accent-amber)" }}>
                  <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--accent-amber)", textTransform: "uppercase" }}>
                    Current Workflow Status
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--royal-900)", marginTop: "2px" }}>
                    {stageData.statusCard.currentStage}
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px", fontSize: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "6px", borderBottom: "1px dashed var(--border-light)" }}>
                      <span style={{ color: "var(--text-muted)" }}>Current Stage:</span>
                      <span style={{ fontWeight: "700", color: "var(--royal-900)" }}>{stageData.shortName}</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "6px", borderBottom: "1px dashed var(--border-light)" }}>
                      <span style={{ color: "var(--text-muted)" }}>Status:</span>
                      <span style={{ fontWeight: "700", color: "var(--accent-amber)" }}>{stageData.statusCard.statusText}</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "6px", borderBottom: "1px dashed var(--border-light)" }}>
                      <span style={{ color: "var(--text-muted)" }}>Current Owner:</span>
                      <span style={{ fontWeight: "700", color: "var(--royal-800)" }}>{stageData.statusCard.owner}</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "6px", borderBottom: "1px dashed var(--border-light)" }}>
                      <span style={{ color: "var(--text-muted)" }}>Action Required:</span>
                      <span style={{ fontWeight: "700", color: "var(--royal-900)" }}>{stageData.statusCard.actionRequired}</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "6px", borderBottom: "1px dashed var(--border-light)" }}>
                      <span style={{ color: "var(--text-muted)" }}>Last Updated:</span>
                      <span style={{ fontWeight: "600", color: "var(--text-secondary)" }}>23 Aug 2026, 11:42 AM</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "4px" }}>
                      <span style={{ color: "var(--text-muted)" }}>Next Stage:</span>
                      <span style={{ fontWeight: "800", color: "var(--accent-emerald)" }}>{stageData.statusCard.nextStage} ➔</span>
                    </div>
                  </div>
                </div>

                {/* TRANSPARENCY / ACTIVITY TIMELINE (WHO -> WHAT -> WHEN) */}
                <div className="glass-box" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--royal-600)", textTransform: "uppercase" }}>
                        Action & Transparency Trail
                      </div>
                      <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--royal-900)", marginTop: "2px" }}>
                        Activity Timeline
                      </h3>
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--accent-emerald)" }}>
                      ⚡ Live Synced
                    </span>
                  </div>

                  <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                    Every event displays: <b>WHO → WHAT → WHEN</b>
                  </div>

                  {/* Timeline Items */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "420px", overflowY: "auto" }}>
                    {activityTimeline.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "10px 12px",
                          background: "var(--bg-soft)",
                          borderRadius: "var(--radius-sm)",
                          borderLeft: `3px solid ${item.roleColor}`,
                          display: "flex",
                          flexDirection: "column",
                          gap: "3px"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "10.5px", fontWeight: "800", color: item.roleColor, background: item.roleBg, padding: "1px 6px", borderRadius: "3px" }}>
                            {item.who}
                          </span>
                          <span style={{ fontSize: "10px", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                            {item.when}
                          </span>
                        </div>

                        <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-primary)", marginTop: "2px" }}>
                          {item.what}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: REGIONAL OFFICER CADASTRAL GIS MAPPING VIEW                       */}
        {/* ========================================================================= */}
        {activeView === "gis" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            
            {/* GIS Top Toolbar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  onClick={() => setActiveView("desk")}
                  className="btn-secondary"
                  style={{ fontSize: "12px", padding: "6px 12px", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <ArrowLeft size={14} /> Back to Control Desk
                </button>

                <div style={{ fontSize: "16px", fontWeight: "800", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
                  🗺️ Regional Officer Cadastral GIS Workspace
                </div>
              </div>

              {/* Search Khasra / Owner */}
              <div style={{ position: "relative", width: "260px" }}>
                <input
                  type="text"
                  className="gov-input"
                  placeholder="Search Khasra (e.g. 143/B, 145/C)..."
                  value={gisSearch}
                  onChange={(e) => setGisSearch(e.target.value)}
                  style={{ paddingLeft: "32px", fontSize: "12.5px" }}
                />
                <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
              </div>
            </div>

            {/* GIS Map & Parcel Details Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "18px", alignItems: "start" }}>
              
              {/* Cadastral Polygon Map Screen */}
              <div className="glass-box" style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--royal-700)" }}>
                    Cadastral Land Parcels & Acquisition Alignment
                  </span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button onClick={() => setGisZoom(z => Math.min(z + 0.15, 1.4))} className="btn-secondary" style={{ padding: "3px 8px", fontSize: "11px" }}>+</button>
                    <button onClick={() => setGisZoom(z => Math.max(z - 0.15, 0.8))} className="btn-secondary" style={{ padding: "3px 8px", fontSize: "11px" }}>-</button>
                  </div>
                </div>

                {/* SVG Cadastral Map */}
                <div style={{
                  width: "100%",
                  height: "360px",
                  background: "#0f172a",
                  borderRadius: "var(--radius-sm)",
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)"
                }}>
                  <svg
                    viewBox="0 0 860 360"
                    style={{
                      width: "100%",
                      height: "100%",
                      transform: `scale(${gisZoom})`,
                      transformOrigin: "center center",
                      transition: "transform 0.2s ease"
                    }}
                  >
                    {/* Background Grid */}
                    <defs>
                      <pattern id="cadastralGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="860" height="360" fill="url(#cadastralGrid)" />

                    {/* Corridor Track */}
                    <path
                      d="M 20 180 Q 220 160, 430 150 T 840 130"
                      fill="none"
                      stroke="rgba(245, 158, 11, 0.35)"
                      strokeWidth="50"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 20 180 Q 220 160, 430 150 T 840 130"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      strokeDasharray="8 5"
                    />

                    {/* Cadastral Parcel Polygons */}
                    {filteredGisParcels.map((parcel) => {
                      const isSelected = selectedGisParcel?.id === parcel.id;
                      return (
                        <g key={parcel.id} onClick={() => setSelectedGisParcel(parcel)} style={{ cursor: "pointer" }}>
                          <polygon
                            points={parcel.polygonPoints}
                            fill={parcel.color}
                            fillOpacity={isSelected ? "0.6" : "0.35"}
                            stroke={isSelected ? "#ffffff" : parcel.color}
                            strokeWidth={isSelected ? "3" : "1.5"}
                            style={{ transition: "all 0.2s ease" }}
                          />
                          <text
                            x={parcel.labelPos.x}
                            y={parcel.labelPos.y}
                            fill="#ffffff"
                            fontSize="11"
                            fontWeight="800"
                            textAnchor="middle"
                            style={{ pointerEvents: "none", textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
                          >
                            {parcel.khasraNo}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  <div style={{ position: "absolute", bottom: "10px", left: "12px", fontSize: "10.5px", color: "rgba(255,255,255,0.7)", background: "rgba(0,0,0,0.6)", padding: "3px 8px", borderRadius: "4px" }}>
                    Click any Khasra parcel to inspect acquisition status & officer actions
                  </div>
                </div>

                {/* Cadastral Legend */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", fontSize: "11px", paddingTop: "4px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><span style={{ width: "10px", height: "10px", background: "#059669", borderRadius: "2px" }} /> Acquired & Cleared</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><span style={{ width: "10px", height: "10px", background: "#2563eb", borderRadius: "2px" }} /> Under Survey</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><span style={{ width: "10px", height: "10px", background: "#d97706", borderRadius: "2px" }} /> Pending Possession</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><span style={{ width: "10px", height: "10px", background: "#e11d48", borderRadius: "2px" }} /> Disputed / Hearing</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><span style={{ width: "10px", height: "10px", background: "#0d9488", borderRadius: "2px" }} /> Govt Land</span>
                </div>
              </div>

              {/* Selected Parcel Acquisition Information & Action Card */}
              {selectedGisParcel && (
                <div className="glass-box" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--royal-600)", textTransform: "uppercase" }}>
                        Cadastral Parcel Details
                      </div>
                      <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--royal-900)", marginTop: "2px" }}>
                        {selectedGisParcel.khasraNo}
                      </h3>
                    </div>

                    <span style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      padding: "3px 8px",
                      borderRadius: "var(--radius-full)",
                      background: selectedGisParcel.statusType === "cleared" ? "rgba(5, 150, 105, 0.1)" : selectedGisParcel.statusType === "disputed" ? "rgba(225, 29, 72, 0.1)" : "rgba(37, 99, 235, 0.1)",
                      color: selectedGisParcel.color
                    }}>
                      ● {selectedGisParcel.status}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", background: "var(--bg-soft)", padding: "12px", borderRadius: "var(--radius-sm)" }}>
                    <div>Owner: <b style={{ color: "var(--text-primary)" }}>{selectedGisParcel.owner}</b></div>
                    <div>Area: <b>{selectedGisParcel.area}</b> ({selectedGisParcel.village} Village)</div>
                    <div>Land Classification: <b>{selectedGisParcel.landType}</b></div>
                    <div>Last Updated: <b>{selectedGisParcel.lastUpdated}</b></div>
                  </div>

                  {/* Current Action on Parcel */}
                  <div style={{
                    padding: "12px",
                    background: "rgba(217, 119, 6, 0.06)",
                    border: "1px solid rgba(217, 119, 6, 0.2)",
                    borderRadius: "var(--radius-sm)"
                  }}>
                    <div style={{ fontSize: "10.5px", fontWeight: "800", color: "var(--accent-amber)", textTransform: "uppercase" }}>
                      Current Action Required:
                    </div>
                    <div style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--royal-900)", marginTop: "3px" }}>
                      {selectedGisParcel.currentAction}
                    </div>
                  </div>

                  {/* Officer Action Trigger */}
                  <button
                    onClick={() => {
                      setActiveView("workspace");
                      showToast(`Opened verification workspace for ${selectedGisParcel.khasraNo}`);
                    }}
                    className="btn-main"
                    style={{ fontSize: "12px", padding: "10px" }}
                  >
                    Open Stage Verification for this Parcel ➔
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </main>

      {/* MODAL 1: REQUEST CLARIFICATION DRAWER */}
      {isClarificationOpen && (
        <div className="modal-overlay">
          <div className="glass-box modal-content" style={{ width: "100%", maxWidth: "500px", background: "var(--bg-white)", padding: "26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "20px" }}>⚠</span>
                <h3 style={{ fontSize: "17px", fontWeight: "800", color: "var(--royal-900)", fontFamily: "var(--font-heading)" }}>
                  Raise Clarification to Project Agency
                </h3>
              </div>
              <button onClick={() => setIsClarificationOpen(false)} style={{ background: "transparent", border: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>

            <form onSubmit={handleSendClarification} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label className="gov-label">Issue / Discrepancy Title</label>
                <input
                  type="text"
                  className="gov-input"
                  value={clarificationForm.issue}
                  onChange={(e) => setClarificationForm({ ...clarificationForm, issue: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="gov-label">Clarification Message & Instructions</label>
                <textarea
                  className="gov-input"
                  rows={3}
                  value={clarificationForm.message}
                  onChange={(e) => setClarificationForm({ ...clarificationForm, message: e.target.value })}
                  required
                  style={{ resize: "vertical" }}
                />
              </div>

              <div>
                <label className="gov-label">Response Required By (Statutory Timeline)</label>
                <input
                  type="text"
                  className="gov-input"
                  value={clarificationForm.responseRequiredBy}
                  onChange={(e) => setClarificationForm({ ...clarificationForm, responseRequiredBy: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button type="button" onClick={() => setIsClarificationOpen(false)} className="btn-secondary" style={{ fontSize: "12px" }}>Cancel</button>
                <button type="submit" className="btn-main" style={{ fontSize: "12px", width: "auto", padding: "8px 16px" }}>Send Clarification ➔</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DOCUMENT PREVIEW MODAL */}
      {viewingDoc && (
        <div className="modal-overlay">
          <div className="glass-box modal-content" style={{ width: "100%", maxWidth: "560px", background: "var(--bg-white)", padding: "26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FileText size={20} style={{ color: "var(--royal-600)" }} />
                <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--royal-900)" }}>
                  {viewingDoc.name}
                </h3>
              </div>
              <button onClick={() => setViewingDoc(null)} style={{ background: "transparent", border: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>

            <div style={{ padding: "20px", background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", border: "1px dashed var(--border-medium)", fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
              <div style={{ fontWeight: "700", color: "var(--royal-900)", marginBottom: "6px" }}>Official Document Content Preview:</div>
              <p>Certified statutory dossier submitted by Project Agency for {selectedProject.name} ({stageData.stageName}).</p>
              <p style={{ marginTop: "8px" }}>• Scope: {stageData.submission.scope}<br />• Compliance: {stageData.submission.vulnerable}<br />• Authenticated by Regional Officer CALA Desk.</p>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
              <button type="button" onClick={() => setViewingDoc(null)} className="btn-secondary" style={{ fontSize: "12px" }}>Close</button>
              <button
                type="button"
                onClick={() => {
                  handleVerifyDoc(viewingDoc.key, viewingDoc.name);
                  setViewingDoc(null);
                }}
                className="btn-main"
                style={{ fontSize: "12px", width: "auto" }}
              >
                ✓ Mark Document as Verified
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
