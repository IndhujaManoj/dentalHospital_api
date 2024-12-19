const express = require("express");
const { registerUser, loginUser, getAllAppointments, deleteAppointment } = require("../controllers/userController");
const { authenticateUser, authorizeAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes
router.post("/register", registerUser); // Register user (admin/user)
router.post("/login", loginUser);       // Login (admin/user)

// Admin Routes
router.get("/admin/appointments", authenticateUser, authorizeAdmin, getAllAppointments);
router.delete("/admin/appointments/:id", authenticateUser, authorizeAdmin, deleteAppointment);

module.exports = router;
