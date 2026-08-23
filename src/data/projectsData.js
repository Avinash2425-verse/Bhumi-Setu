// Projects Data with detailed Land Acquisition, R&R, Compensation and Possession Metrics

export const INITIAL_PROJECTS = [
  // ==================== CENTRAL GOVERNMENT PROJECTS ====================
  {
    id: "proj-c1",
    name: "DELHI–MUMBAI EXPRESSWAY (PACKAGE 4)",
    projectCode: "LA-2026-001",
    projectAuthCode: "MORTH-NE4-8821",
    govLevel: "central",
    status: "Active", // Active Central Project
    statusLabel: "ONGOING",
    ministry: "Ministry of Road Transport & Highways (MoRTH)",
    agency: "NHAI",
    state: "Gujarat",
    districtsCount: 3,
    districts: ["Bharuch", "Vadodara", "Surat"],
    lengthKm: 380,
    landRequiredAcres: "10,000 Acres",
    landAcquiredAcres: "7,500 Acres",
    overallProgressPct: 75,
    compensationPct: 72,
    rnrPct: 54,
    possessionPct: 41,
    statutoryStage: "Section 3D Declaration Gazetted",
    stageNumber: 4,
    description: "8-lane greenfield access-controlled expressway corridor under PM Gati Shakti National Master Plan.",
    keyMilestone: "Joint Measurement Survey completed in Bharuch; Section 3G Award determination underway."
  },
  {
    id: "proj-c2",
    name: "EASTERN DEDICATED FREIGHT CORRIDOR (PHASE 2)",
    projectCode: "LA-2026-002",
    projectAuthCode: "DFCCIL-EDFC-7714",
    govLevel: "central",
    status: "Upcoming", // 1 Upcoming Central Project
    statusLabel: "UPCOMING",
    ministry: "Ministry of Railways",
    agency: "DFCCIL",
    state: "Uttar Pradesh & Bihar",
    districtsCount: 3,
    districts: ["Varanasi", "Chandauli", "Sasaram"],
    lengthKm: 420,
    landRequiredAcres: "8,900 Acres",
    landAcquiredAcres: "1,200 Acres",
    overallProgressPct: 15,
    compensationPct: 18,
    rnrPct: 10,
    possessionPct: 8,
    statutoryStage: "Pre-Notification & SIA DPR Alignment",
    stageNumber: 1,
    description: "Proposed high-speed heavy haul railway corridor connecting industrial hubs to freight terminals.",
    keyMilestone: "Alignment feasibility and Social Impact Assessment (SIA) draft under review."
  },

  // ==================== STATE GOVERNMENT PROJECTS ====================
  {
    id: "proj-s1",
    name: "DHOLERA SIR MEGA INDUSTRIAL EXPRESSWAY LINK",
    projectCode: "LA-2026-102",
    projectAuthCode: "DICDL-SIR-9932",
    govLevel: "state",
    status: "Upcoming", // 1 Upcoming State Project
    statusLabel: "UPCOMING",
    ministry: "Industries & Mines Dept, Govt of Gujarat",
    agency: "DICDL",
    state: "Gujarat",
    districtsCount: 2,
    districts: ["Ahmedabad", "Dholera"],
    lengthKm: 109,
    landRequiredAcres: "5,430 Acres",
    landAcquiredAcres: "650 Acres",
    overallProgressPct: 12,
    compensationPct: 15,
    rnrPct: 8,
    possessionPct: 5,
    statutoryStage: "Draft Town Planning Scheme Review",
    stageNumber: 1,
    description: "Proposed smart industrial access corridor connecting Ahmedabad to Dholera Greenfield Smart City.",
    keyMilestone: "Corridor boundary demarcation and land parcel list under government review."
  },

  // ==================== DISTRICT LEVEL PROJECTS ====================
  {
    id: "proj-d1",
    name: "ANKLESHWAR GIDC 220KV SUB-STATION CORRIDOR",
    projectCode: "LA-2026-202",
    projectAuthCode: "GETCO-ANK-8840",
    govLevel: "district",
    status: "Upcoming", // 1 Upcoming District Project
    statusLabel: "UPCOMING",
    ministry: "Gujarat Energy Transmission Corp (GETCO)",
    agency: "GETCO & CALA",
    state: "Gujarat",
    districtsCount: 1,
    districts: ["Bharuch"],
    lengthKm: 18,
    landRequiredAcres: "345 Acres",
    landAcquiredAcres: "45 Acres",
    overallProgressPct: 13,
    compensationPct: 15,
    rnrPct: 5,
    possessionPct: 4,
    statutoryStage: "Tower Footprint Demarcation",
    stageNumber: 1,
    description: "Proposed high-voltage power transmission corridor to feed chemical industrial clusters in Ankleshwar.",
    keyMilestone: "Tower base coordinates submitted to District Land Acquisition Cell for approval."
  }
];
