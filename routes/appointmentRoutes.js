const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  getAvailableSlots
} = require("../controllers/appointmentController");

// Create a new appointment
router.post("/appointments", createAppointment);

// Get all appointments
router.get("/appointments", getAppointments);

// Admin route to update appointment status
router.put("/appointments/status", updateAppointmentStatus);


// Route to get booked slots for a specific date
router.get("/appointments/booked-slots", getAvailableSlots); // New route for fetching booked slots
module.exports = router;
