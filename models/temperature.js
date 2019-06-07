var mongoose = require('mongoose');

var Temperature = mongoose.model('Temperature', {
  timestamp: {
    type: String,
    required: true,
    unique: true
  },
  temperature: {
    type: String,
    required: true
  }
});

module.exports = {
  Temperature
};
