const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const Contact = require("../models/ContactMessage");

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  // Validate inputs
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Save contact message to the database
    const newContact = await Contact.create({
      name,
      email,
      message,
    });

    // Send email to admin using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use Gmail as the email service
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });

    // Email options
    const mailOptions = {
      from: email, // Sender's email (from the form)
      to: process.env.ADMIN_EMAIL, // Admin's email (recipient)
      subject: `New Contact Form Submission from ${name}`,
      text: `You have received a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Respond with success message
    res.status(201).json({
      message: "Message sent successfully, and details saved!",
      data: newContact,
      success:true
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Admin
router.get("/contact", async (req, res) => {
  try {
    // Fetch all contact messages from the database
    const contactMessages = await Contact.find();

    // Check if there are no messages
    if (contactMessages.length === 0) {
      return res.status(404).json({ message: "No contact messages found" });
    }

    // Respond with the retrieved messages
    res.status(200).json({
      message: "Contact messages retrieved successfully",
      data: contactMessages,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Admin
router.delete("/contact/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the contact message by ID and delete it
    const deletedContact = await Contact.findByIdAndDelete(id);

    // Check if contact message exists
    if (!deletedContact) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    // Respond with success message
    res.status(200).json({
      message: "Contact message deleted successfully",
      data: deletedContact,

    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
