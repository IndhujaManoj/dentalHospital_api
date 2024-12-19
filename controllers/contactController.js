const ContactMessage = require('../models/ContactMessage');

// Handle contact form submission
const submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const newMessage = new ContactMessage({
      name,
      email,
      message,
    });

    await newMessage.save();
    res.status(201).json({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
};

module.exports = { submitContactForm };
