const ContactMessage = require('../models/ContactMessage');

// Handle contact form submission
const submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  // Validate incoming data
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'All fields are required.',
    });
  }

  try {
    // Create and save the new contact message
    const newMessage = new ContactMessage({
      name,
      email,
      message,
    });

    await newMessage.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully!',
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);

    // Return error response
    res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again later.',
    });
  }
};

module.exports = { submitContactForm };
