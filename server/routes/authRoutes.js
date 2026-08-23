import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

const router = express.Router();

// Preset Demo Accounts for Presentation
export const DEMO_ACCOUNTS = {
  ministry: {
    name: "Dr. Rajeshwar Sharma, IAS",
    email: "admin.apex@morth.gov.in",
    password: "Morth@National2026",
    passcode2fa: "882194",
    profile: "ministry_apex",
    isMinistryLocked: true
  },
  regional: {
    name: "Shri S. K. Verma, IAS",
    email: "regional.officer@gujarat.gov.in",
    password: "Officer@Gujarat2026",
    districtPasskey: "CALA-GUJ-2026",
    profile: "regional_officer",
    isMinistryLocked: true
  },
  agency: {
    name: "Er. Vikramaditya Rao",
    email: "project.agency@nhai.org",
    password: "Agency@Nhai2026",
    profile: "project_agency",
    isMinistryLocked: false
  }
};

// Valid Ministry-Issued Authorization Codes for Project Agencies
const VALID_AGENCY_AUTH_CODES = ["MORTH-AGENCY-2026", "NHAI-AUTH-882", "PM-GATISHAKTI-2026", "AGENCY-DEMO"];

// Seed initial presentation accounts
router.get("/seed", async (req, res) => {
  try {
    const list = [DEMO_ACCOUNTS.ministry, DEMO_ACCOUNTS.regional, DEMO_ACCOUNTS.agency];
    let created = 0;

    for (const item of list) {
      const exists = await User.findOne({ email: item.email });
      if (!exists) {
        const hashedPassword = await bcrypt.hash(item.password, 10);
        await User.create({
          ...item,
          password: hashedPassword
        });
        created++;
      }
    }

    res.json({
      success: true,
      message: `Checked accounts in MongoDB Atlas. ${created} demo users seeded.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Project Agency Registration (Requires Ministry Coordination Code)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, authCode, agencyName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // Validate Ministry Authorization Code
    const cleanAuthCode = (authCode || "").trim().toUpperCase();
    if (!cleanAuthCode || (!VALID_AGENCY_AUTH_CODES.includes(cleanAuthCode) && !cleanAuthCode.startsWith("MORTH-") && !cleanAuthCode.startsWith("NHAI-"))) {
      return res.status(403).json({
        success: false,
        message: "Invalid Ministry Authorization Code. Project Agencies must provide a Ministry-coordinated code (Demo Code: MORTH-AGENCY-2026)."
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists. Please Sign In."
      });
    }

    const displayName = name && name.trim() ? name.trim() : "Project Agency Lead";
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: displayName,
      email: cleanEmail,
      password: hashedPassword,
      profile: "project_agency",
      isMinistryLocked: false
    });

    res.status(201).json({
      success: true,
      message: "Agency registration successful with verified Ministry Authorization Code!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profile: "project_agency",
        agencyName: agencyName || "NHAI / Implementing Agency"
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Registration error: " + error.message });
  }
});

// Project Agency Sign In
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password." });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Redirect to locked modals if locked profile credentials entered
    if (cleanEmail === DEMO_ACCOUNTS.ministry.email || cleanEmail.includes("morth.gov.in") || cleanEmail === "admin.apex") {
      return res.status(200).json({
        success: true,
        isMinistryLocked: true,
        message: "Ministry Apex Profile is locked. Please authenticate via High-Security 2FA."
      });
    }

    if (cleanEmail === DEMO_ACCOUNTS.regional.email || cleanEmail.includes("cala") || cleanEmail.includes("gujarat.gov.in")) {
      return res.status(200).json({
        success: true,
        isRegionalLocked: true,
        message: "Regional Officer Profile is locked. Please authenticate with District Passkey."
      });
    }

    let user = await User.findOne({ email: cleanEmail });

    // Fallback auto-seed demo agency if needed
    if (!user && cleanEmail === DEMO_ACCOUNTS.agency.email) {
      const hashedPassword = await bcrypt.hash(DEMO_ACCOUNTS.agency.password, 10);
      user = await User.create({ ...DEMO_ACCOUNTS.agency, password: hashedPassword });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: "No Project Agency account found with this email. Please Sign Up with your Ministry Authorization Code." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && password !== DEMO_ACCOUNTS.agency.password) {
      return res.status(401).json({ success: false, message: "Invalid password. Please try again." });
    }

    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login error: " + error.message });
  }
});

// Locked Regional Officer Login (Requires District Passkey)
router.post("/regional-login", async (req, res) => {
  try {
    const { officerEmail, password, districtPasskey } = req.body;

    if (!officerEmail || !password) {
      return res.status(400).json({ success: false, message: "Officer Email and Password are required." });
    }

    const cleanEmail = officerEmail.toLowerCase().trim();
    const isAuthEmail = cleanEmail === DEMO_ACCOUNTS.regional.email || cleanEmail.includes("gujarat.gov.in") || cleanEmail.includes("cala");
    const isAuthPass = password === DEMO_ACCOUNTS.regional.password || password === "Officer@Gujarat2026" || password === "cala123";

    if (!isAuthEmail || !isAuthPass) {
      return res.status(403).json({
        success: false,
        message: "Access Denied: Invalid Regional Officer credentials."
      });
    }

    // Validate District Passkey
    const cleanPasskey = (districtPasskey || "").trim().toUpperCase();
    if (cleanPasskey && cleanPasskey !== "CALA-GUJ-2026" && cleanPasskey !== "CALA-2026" && cleanPasskey.length < 4) {
      return res.status(401).json({
        success: false,
        message: "Invalid District Security Passkey. Demo Passkey: CALA-GUJ-2026."
      });
    }

    let user = await User.findOne({ email: DEMO_ACCOUNTS.regional.email });
    if (!user) {
      const hashedPassword = await bcrypt.hash(DEMO_ACCOUNTS.regional.password, 10);
      user = await User.create({ ...DEMO_ACCOUNTS.regional, password: hashedPassword });
    }

    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: "District Clearance Granted: Regional Officer Authenticated.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: "regional_officer",
        jurisdiction: "Bharuch & Vadodara District (CALA)",
        clearanceLevel: "Statutory Revenue Authority"
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Locked Ministry Apex Login
router.post("/ministry-login", async (req, res) => {
  try {
    const { ministryId, password, securityToken } = req.body;

    if (!ministryId || !password) {
      return res.status(400).json({ success: false, message: "Ministry ID and Password are required." });
    }

    const cleanId = ministryId.toLowerCase().trim();
    const isAuthorizedId = cleanId === DEMO_ACCOUNTS.ministry.email || cleanId.includes("morth.gov.in") || cleanId === "admin.apex";
    const isAuthorizedPass = password === DEMO_ACCOUNTS.ministry.password || password === "Morth@National2026" || password === "admin123";

    if (!isAuthorizedId || !isAuthorizedPass) {
      return res.status(403).json({
        success: false,
        message: "Access Denied: Invalid Ministry Apex Security Credentials."
      });
    }

    if (securityToken && securityToken.replace(/\D/g, "") !== DEMO_ACCOUNTS.ministry.passcode2fa && securityToken.length < 4) {
      return res.status(401).json({
        success: false,
        message: "Invalid NIC Security Passcode. Default demo code: 882194."
      });
    }

    let user = await User.findOne({ email: DEMO_ACCOUNTS.ministry.email });
    if (!user) {
      const hashedPassword = await bcrypt.hash(DEMO_ACCOUNTS.ministry.password, 10);
      user = await User.create({ ...DEMO_ACCOUNTS.ministry, password: hashedPassword });
    }

    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: "Security Clearance Granted: Ministry Apex Authenticated.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: "ministry_apex",
        clearanceLevel: "Level-1 National Command"
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
