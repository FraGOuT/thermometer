var express = require('express');
var bodyParser = require('body-parser');
const{ObjectID} = require('mongodb');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var{Temperature} = require('./models/temperature');
var{mongoose} = require('./db/mongoose');
const multer = require('multer');
const fs = require('fs');

const fileUploadDirName = 'uploads';
const maxFileBatchSize = 20;

const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, fileUploadDirName)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
var upload = multer({ storage: storage })

app.get('/temperature',function(req,res){
  var d = new Date();
  d.setFullYear(d.getFullYear() - 1);
  var startTimeStamp = Math.round(d.getTime() / 1000);
  var query = { timestamp: { $gte: startTimeStamp} };
  Temperature.find(query, function(err, temp){
    if(err) throw new Error(err);
    if(!temp) 
      console.log('No data found for the past 1 year');
    else
      res.send(temp)
  });
});


app.get('/upload',function(req,res){
  res.sendFile('public/upload.html', { root: __dirname });
});

//Uploading multiple files
app.post('/uploadBatch', upload.array('myFiles', maxFileBatchSize), (req, res, next) => {
  const files = req.files
  if (!files) {
    const error = new Error('Please choose files');
    error.httpStatusCode = 400;
    return next(error);
  }
  console.log(files);
  for(var file of files) {
    //Process the file in an async manner
    fs.readFile(file.path, (err, data) => {  
      console.log("Process File - "+file.path)
      if (err) throw err;
      let temperature_data = JSON.parse(data);
      console.log(temperature_data);
      for(var data in temperature_data){
        data = temperature_data[data]
        var temperature = new Temperature({
          timestamp: data.ts,
          temperature: data.val
        })
        temperature.save().then((doc)=>{
          console.log('Data Point Saved');
        },(err)=>{
          console.log('Data point not saved');
        });
      };
    });
  }
  res.send("Files Uploaded Successfully")
})

app.post('/temperature', (req, res) => {
  console.log('Redeived temperature reading');
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
