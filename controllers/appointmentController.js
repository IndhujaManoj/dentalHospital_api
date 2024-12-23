// const Appointment = require("../models/Appointment");

// // Create a new appointment
// const createAppointment = async (req, res) => {
//   const { name, date, time, phone, email, message } = req.body;

//   // Validate request data
//   if (!name || !date || !time || !phone || !email) {
//     return res.status(400).json({ error: "All fields except 'message' are required" });
//   }

//   try {
//     // Check if the selected time slot is already booked for the specific date
//     const existingAppointment = await Appointment.findOne({ date, time });

//     if (existingAppointment) {
//       return res.status(400).json({ error: "The selected time slot is already booked." });
//     }

//     // Save the appointment to the database with status set to 'pending'
//     const newAppointment = await Appointment.create({
//       name,
//       date,
//       time,
//       phone,
//       email,
//       message,
//       status: "pending", // Default status is 'pending'
//     });

//     res.status(201).json({
//       success: true,
//       message: "Appointment created successfully",
//       data: newAppointment,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // Get all appointments
// const getAppointments = async (req, res) => {
//   try {
//     const appointments = await Appointment.find(); // Fetch all appointments from the database
//     res.status(200).json({ data: appointments });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // Update appointment status (Admin only)
// const updateAppointmentStatus = async (req, res) => {
//   const { id, status } = req.body;

//   // Validate request data
//   if (!id || !status) {
//     return res.status(400).json({ error: "Appointment ID and status are required" });
//   }

//   // Check if the provided status is valid
//   const validStatuses = ["pending", "approved", "cancelled"];
//   if (!validStatuses.includes(status)) {
//     return res.status(400).json({ error: "Invalid status" });
//   }

//   try {
//     // confirm the appointment by admin
//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       id,
//       { status },  // Update the status field
//       { new: true } // Return the updated appointment
//     );

//     if (!updatedAppointment) {
//       return res.status(404).json({ error: "Appointment not found" });
//     }

//     res.status(200).json({
//       message: "Appointment status updated successfully",
//       data: updatedAppointment,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // Function to get available slots for a specific date
// const getAvailableSlots = async (req, res) => {
//   const { date } = req.query; // Get the date from the query parameter
//   const timeSlots = [
//     "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
//     "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
//     "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
//     "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM", "09:00 PM"
//   ];

//   try {
//     // Find all appointments for the specified date
//     const appointmentsForDate = await Appointment.find({ date });

//     // Extract the times of the booked appointments
//     const bookedSlots = appointmentsForDate.map(appointment => appointment.time);

//     // Filter the time slots to find the available ones
//     const availableSlots = timeSlots.filter(slot => !bookedSlots.includes(slot));

//     return res.status(200).json({ availableSlots, bookedSlots }); // Return both available and booked slots
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };



// module.exports = {
//   createAppointment,
//   getAppointments,
//   updateAppointmentStatus,
//   getAvailableSlots, // Export the new function
// };



const AWS = require('aws-sdk');
const Appointment = require("../models/Appointment");

// Configure AWS SDK for SNS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION, // Ensure the region is 'ap-south-1'
});

const sns = new AWS.SNS();

// Function to send SMS via AWS SNS Topic
const sendSms = (message) => {
  const params = {
    Message: message,
    TopicArn: 'arn:aws:sns:ap-south-1:381492101582:AppointmentNotifications', 
  };

  return sns.publish(params).promise();
};

// Create a new appointment
const createAppointment = async (req, res) => {
  const { name, date, time, phone, email, message } = req.body;

  // Validate request data
  if (!name || !date || !time || !phone || !email) {
    return res.status(400).json({ error: "All fields except 'message' are required" });
  }

  try {
    // Check if the selected time slot is already booked for the specific date
    const existingAppointment = await Appointment.findOne({ date, time });

    if (existingAppointment) {
      return res.status(400).json({ error: "The selected time slot is already booked." });
    }

    // Save the appointment to the database with status set to 'pending'
    const newAppointment = await Appointment.create({
      name,
      date,
      time,
      phone,
      email,
      message,
      status: "pending", // Default status is 'pending'
    });

    res.status(201).json({
      success: true,
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

    // Send SMS if the appointment is approved
    if (status === "approved") {
      const message = `Your appointment for ${updatedAppointment.date} at ${updatedAppointment.time} has been confirmed.`;
      await sendSms(message); // Send SMS to all subscribers of the topic
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

// Function to get available slots for a specific date
const getAvailableSlots = async (req, res) => {
  const { date } = req.query; // Get the date from the query parameter
  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
    "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM", "09:00 PM"
  ];

  try {
    // Find all appointments for the specified date
    const appointmentsForDate = await Appointment.find({ date });

    // Extract the times of the booked appointments
    const bookedSlots = appointmentsForDate.map(appointment => appointment.time);

    // Filter the time slots to find the available ones
    const availableSlots = timeSlots.filter(slot => !bookedSlots.includes(slot));

    return res.status(200).json({ availableSlots, bookedSlots }); // Return both available and booked slots
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  getAvailableSlots,
};
