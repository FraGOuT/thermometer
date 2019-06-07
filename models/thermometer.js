var mongoose = require('mongoose');

var Thermometer = mongoose.model('Thermometer', {
  timestamp: {
    type: String,
    required: true,
  },
  temperature: {
    type: String,
    required: true
  },
  serialNumber: {
    type: String,
    required: true,
  }
});

module.exports = {
  Thermometer
};
