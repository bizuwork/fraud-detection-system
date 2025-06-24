const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Test route
app.get("/api", (req, res) => {
  res.json({ message: "Backend API is running!" });
});

// Fraud detection route
app.post("/fraud-check", (req, res) => {
  const { amount, isNewUser, location, deviceFingerprint } = req.body;

  // Basic heuristic fraud detection logic
  let riskLevel = "safe";
  let confidence = 0.9;

  // Simple rules
  if (amount > 2000) {
    riskLevel = "fraud";
    confidence = 0.98;
  } else if (isNewUser && amount > 500) {
    riskLevel = "suspicious";
    confidence = 0.75;
  } else if (location === "high-risk") {
    riskLevel = "suspicious";
    confidence = 0.65;
  } else if (!deviceFingerprint) {
    riskLevel = "suspicious";
    confidence = 0.6;
  }

  res.json({
    riskLevel,
    confidence,
    timestamp: new Date().toISOString(),
    matchDetails: {
      highAmount: amount > 2000,
      newUserFlagged: isNewUser && amount > 500,
      locationFlagged: location === "high-risk",
      missingDeviceFingerprint: !deviceFingerprint,
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});