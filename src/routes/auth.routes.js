const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Admin authentication routes
router.post("/admin/signup", authController.adminSignup);
router.post("/admin/login", authController.adminLogin);

module.exports = router;
