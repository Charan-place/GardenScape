const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth'); // Your authentication middleware
const Order = require('../models/Order'); // Adjust according to your Order model path

// Route to get orders for the authenticated user
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you set user in req.user after authentication
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

module.exports = router;
