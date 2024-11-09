const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    phoneNumber: { type: String },
    email: { type: String },
    area: { type: String },
    specialRequests: { type: String },
    status: { type: String, default: 'Pending' },
});

const Request = mongoose.model('Request', RequestSchema);
module.exports = Request;
