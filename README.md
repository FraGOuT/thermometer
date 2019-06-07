# Thermometer Data Gatherer

### Steps to run
- Run `npm install` to install the required packages.
- Install mongodb and create a db called `Thermostat`
- Start the node server via - `node server.js`
- Go to `http://localhost:3000/upload` to upload files. The name of the file is considered to the serial number of the thermometer.
- Go to `http://localhost:3000/dashboard/<thermometer-serial-number>` to view the dashboard with a temperature chart with data of 1 year for that thermometer. The chart will update in real-time if the endpoint `http://localhost:3000/temperature` receives data in realtime (via POST action) with all the required data.
- To simulate realtime sending of temperatures, run the sim.py file.(Steps given below)

### Steps to simulate realtime data gather. 
- A python script is added `sim.py` that hits the endpoint `http://localhost:3000/thermometer/<thermometer-serial-number>` for gathering temperature data.
- You can change the default serial number on line number 10.
- To run it `python sim.py`


### Data required for http://localhost:3000/temperature endpoint
Below mentioned fields are required
- timestamp
- temperature
- serialNumber (of the thermometer)