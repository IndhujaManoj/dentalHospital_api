const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");

// Create a new appointment
router.post("/appointments", createAppointment);

// Get all appointments
router.get("/appointments", getAppointments);

// Admin route to update appointment status
router.put("/appointments/status", updateAppointmentStatus);

module.exports = router;
