var express = require('express');
var bodyParser = require('body-parser');
const{ObjectID} = require('mongodb');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var{Temperature} = require('./models/temperature');
var{mongoose} = require('./db/mongoose');

const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.post('/todos', (req, res) => {
});

app.post('/temperature', (req, res) => {
  console.log('Redeived temperature reading');
  // console.dir(req);
  var timestamp = req.body.timestamp;
  var temperature = req.body.temperature;
  var data = {'timestamp':timestamp, 'temperature': temperature};
  console.log(data);

  var temperature = new Temperature({
    timestamp: req.body.timestamp,
    temperature: req.body.temperature
  })

  temperature.save().then((doc)=>{
    io.emit('realtime_thermometer_feed', data);
    res.status(200).send();
  },(err)=>{
    console.log('Data point not Added to mongo. Data= '+data)
    res.status(400).send(err);
  });

});

io.on('connection', function(socket){
  console.log("Connected to client");
});

http.listen(3000, function() {
  console.log(`Started on port ${port}`);
});

// module.exports = {app};
