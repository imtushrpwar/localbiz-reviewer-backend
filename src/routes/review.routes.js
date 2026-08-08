const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const { aiAssist } = require("../controllers/ai.controller");

const {
  getBusinessBySlug,
    submitReview,
    getBusinessReviews,
    dashboard,


} = require("../controllers/review.controller");

router.get("/dashboard", auth, dashboard);
router.get("/:slug", getBusinessBySlug);
router.get("/business/all", auth, getBusinessReviews);
router.post("/", submitReview);
router.post("/ai-assist", aiAssist);



module.exports = router;