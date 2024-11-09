const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
  },
  actionOne: {
    type: String,
    required: true,
  },
  actionTwo: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
// const mongoose = require('mongoose');

// const serviceSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Service = mongoose.model('Service', serviceSchema);

// module.exports = Service;
