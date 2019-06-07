import requests
import json
import time

url = "http://localhost:3000/temperature"


with open("THERM0001.json", 'r') as f:
    temp_data = json.load(f)


for data in temp_data:
    data = {'timestamp':str(data['ts']),
            'temperature':str(data['val'])}
    print (data)
    r = requests.post(url = url, data = data)
    print (str(r))
    time.sleep(1)
