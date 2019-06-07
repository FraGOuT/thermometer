var mongoose = require('mongoose');

var databaseName = 'Thermostat'

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/'+databaseName);

module.exports = {
  mongoose
}
