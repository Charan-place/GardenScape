const express = require('express');
const router = express.Router();
const authenticateToken = require('./middleware/auth'); // Adjust the path as necessary
const Service = require('./models/Service'); // Adjust the path to your Service model

// Protected route example
router.get('/protected-route', authenticateToken, (req, res) => {
  res.send('This is a protected route!');
});

// Route to fetch services
router.get('/services', authenticateToken, async (req, res) => {
  try {
    const services = await Service.find(); // Assuming you're using Mongoose
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Error fetching services' });
  }
});

module.exports = router;
