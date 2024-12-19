const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "pending", // Set default status as 'pending'
    enum: ["pending", "approved", "cancelled"], // Add more status as needed
  },
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
