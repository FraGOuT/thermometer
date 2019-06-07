var express = require('express');
var bodyParser = require('body-parser');
const{ObjectID} = require('mongodb');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var{Thermometer} = require('./models/thermometer');
var{mongoose} = require('./db/mongoose');
const multer = require('multer');
const fs = require('fs');
const hbs = require('hbs');

app.set('view engine','hbs');

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
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

app.get('/', (req, res) => {
  res.send("Data gathering for thermometer")
});

app.get('/dashboard/:id', (req, res) => {
  var serialNumber = req.params.id
  res.render('dashboard.hbs',{
    serialNumber: serialNumber
  });
});

app.get('/thermometer/:id',(req,res) => {
  var serialNumber = req.params.id
  var d = new Date();
  d.setFullYear(d.getFullYear() - 1);
  var startTimeStamp = Math.round(d.getTime() / 1000);
  var query = { timestamp: { $gte: startTimeStamp}, serialNumber: serialNumber };
  Thermometer.find(query, function(err, temp){
    if(err) throw new Error(err);
    if(!temp) 
      console.log('No data found for the past 1 year');
    else
      console.log(temp);
      res.send(temp)
  });
});


app.get('/upload',(req,res) => {
  res.sendFile('public/upload.html', { root: __dirname });
});

//Uploading multiple files
app.post('/upload', upload.array('myFiles', maxFileBatchSize), (req, res, next) => {
  const files = req.files
  if (!files) {
    const error = new Error('Please choose files');
    error.httpStatusCode = 400;
    return next(error);
  }
  // console.log(files);
  for(var file of files) {
    //Process the file in an async manner
    console.log("Processing File - "+file.path)
    fs.readFile(file.path, (err, data) => {  
      if (err) throw err;
      let temperature_data = JSON.parse(data);
      // console.log(temperature_data);
      for(var data in temperature_data){
        data = temperature_data[data]
        var thermometer = new Thermometer({
          timestamp: data.ts,
          temperature: data.val,
          serialNumber: file.originalname
        })
        thermometer.save().then((doc)=>{
          // console.log('Data Point Saved');
        },(err)=>{
          console.log('Data point not saved');
          console.log(err);
        });
      };
    });
  }
  res.send("Files Uploaded Successfully")
})

app.post('/thermometer/', (req, res) => {
  console.log('Redeived temperature reading');
  var timestamp = req.body.timestamp;
  var temperature = req.body.temperature;
  var serialNumber = req.body.serialNumber;
  var data = {'timestamp':timestamp, 'temperature': temperature, 'serialNumber': serialNumber};
  // console.log(data);

  var thermometer = new Thermometer({
    timestamp: req.body.timestamp,
    temperature: req.body.temperature,
    serialNumber: req.body.serialNumber
  })
  thermometer.save().then((doc)=>{
    io.emit('realtime_thermometer_feed-'+serialNumber, data);
    res.status(200).send();
  },(err)=>{
    console.log('Data point not Added to mongo')
    res.status(400).send(err);
  });
});


io.on('connection', function(socket){
  console.log("Connected to client");
});

http.listen(3000, function() {
  console.log(`Started on port ${port}`);
});
