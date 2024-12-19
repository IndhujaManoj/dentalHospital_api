const Appointment = require("../models/Appointment");

// Create a new appointment
const createAppointment = async (req, res) => {
  const { name, date, time, phone, email, message } = req.body;

  // Validate request data
  if (!name || !date || !time || !phone || !email) {
    return res.status(400).json({ error: "All fields except 'message' are required" });
  }

  try {
    // Save the appointment to the database with status set to 'pending'
    const newAppointment = await Appointment.create({
      name,
      date,
      time,
      phone,
      email,
      message,
      status: "pending",  // Default status is 'pending'
    });

    res.status(201).json({
      message: "Appointment created successfully",
      data: newAppointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all appointments
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find(); // Fetch all appointments from the database
    res.status(200).json({ data: appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update appointment status (Admin only)
const updateAppointmentStatus = async (req, res) => {
  const { id, status } = req.body;

  // Validate request data
  if (!id || !status) {
    return res.status(400).json({ error: "Appointment ID and status are required" });
  }

  // Check if the provided status is valid
  const validStatuses = ["pending", "approved", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    // Update the appointment status
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status },  // Update the status field
      { new: true } // Return the updated appointment
    );

    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.status(200).json({
      message: "Appointment status updated successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
};
