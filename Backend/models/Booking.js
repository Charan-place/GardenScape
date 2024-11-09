const mongoose = require('mongoose');

// Define the booking schema
const bookingSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    area: { type: Number, required: true },
    specialRequests: { type: String, default: '' }, // Optional field with a default value
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create the booking model
const Booking = mongoose.model('Booking', bookingSchema);

// Export the model for use in other parts of the application
module.exports = Booking;
