const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  getInsights,
  generateInsightsAndSave,
} = require("../controllers/insights.controller");

router.get("/", auth, getInsights);
router.post("/generate", auth, generateInsightsAndSave);

module.exports = router;