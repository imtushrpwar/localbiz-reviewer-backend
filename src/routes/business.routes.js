const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  createBusiness,
  getBusiness,
  updateBusiness,
  checkBusiness
} = require("../controllers/business.controller");

router.get("/check", auth, checkBusiness);
router.post("/", auth, createBusiness);

router.get("/", auth, getBusiness);
router.put("/", auth, updateBusiness);

module.exports = router;