import express from "express";

const router = express.Router();

// In-memory initial sync logs for presentation & transparency
let syncLogs = [
  {
    id: "sync-101",
    projectCode: "LA-2026-001",
    projectName: "DELHI–MUMBAI EXPRESSWAY (PACKAGE 4)",
    officerName: "Shri S. K. Verma, IAS",
    officerRole: "Competent Authority Land Acquisition (CALA)",
    district: "Bharuch & Vadodara",
    stageId: "sia",
    stageName: "Social Impact Assessment (SIA)",
    actionType: "SIA Ground Verification & PAF Count Audit",
    changeSummary: "Field census audit completed for Nabipur & Samni. Verified 1,420 PAFs with 420 families saved via 45m curve shift.",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: "Verified & Sealed",
    digitalSealId: "CALA-BHR-SEAL-88219"
  },
  {
    id: "sync-102",
    projectCode: "LA-2026-001",
    projectName: "DELHI–MUMBAI EXPRESSWAY (PACKAGE 4)",
    officerName: "Smt. Meera Trivedi, GAS",
    officerRole: "District Land Revenue Officer (DLRO)",
    district: "Bharuch",
    stageId: "preliminary-notification",
    stageName: "Preliminary Notification",
    actionType: "Section 3A Physical Notices Certification",
    changeSummary: "Certified physical affixation of Form-A notices at all 48 Gram Panchayat Chavdis and Mamlatdar Bhavans.",
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    status: "Verified & Sealed",
    digitalSealId: "DLRO-BHR-SEAL-49210"
  },
  {
    id: "sync-103",
    projectCode: "LA-2026-001",
    projectName: "DELHI–MUMBAI EXPRESSWAY (PACKAGE 4)",
    officerName: "Shri Rajesh Solanki",
    officerRole: "Chief Cadastral Field Surveyor",
    district: "Vadodara (Karjan Taluka)",
    stageId: "gis",
    stageName: "GIS & Cadastral Mapping",
    actionType: "JMS Ground Survey Confirmation for Khasra 146/A",
    changeSummary: "Boundary coordinates and double-crop asset valuation validated on DGPS system on site.",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: "Verified & Sealed",
    digitalSealId: "SURV-VAD-SEAL-11029"
  }
];

// GET /api/assessments/sync-logs
router.get("/sync-logs", (req, res) => {
  const { projectCode } = req.query;
  if (projectCode) {
    const filtered = syncLogs.filter(l => l.projectCode === projectCode);
    return res.json({ success: true, logs: filtered });
  }
  return res.json({ success: true, logs: syncLogs });
});

// POST /api/assessments/verify
router.post("/verify", (req, res) => {
  const {
    projectCode = "LA-2026-001",
    projectName = "DELHI–MUMBAI EXPRESSWAY (PACKAGE 4)",
    officerName = "Shri S. K. Verma, IAS",
    officerRole = "Competent Authority Land Acquisition (CALA)",
    district = "Bharuch & Vadodara",
    stageId = "sia",
    stageName = "Social Impact Assessment",
    actionType = "Field Verification",
    changeSummary = "Assessment verified and synchronized with Project Agency workspace."
  } = req.body;

  const newLog = {
    id: "sync-" + Date.now(),
    projectCode,
    projectName,
    officerName,
    officerRole,
    district,
    stageId,
    stageName,
    actionType,
    changeSummary,
    timestamp: new Date().toISOString(),
    status: "Verified & Sealed",
    digitalSealId: `CALA-SEAL-${Math.floor(10000 + Math.random() * 90000)}`
  };

  syncLogs.unshift(newLog);

  res.status(201).json({
    success: true,
    message: "Field assessment report submitted & synchronized live with Project Agency layout.",
    log: newLog
  });
});

export default router;
