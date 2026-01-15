const express = require("express");
const router = express.Router();
const { adminLoginController } = require("../controllers/adminController");

// Admin login
router.post("/admin/login", adminLoginController);

module.exports = router;
