import requests
import time
import random

url = "http://localhost:3000/temperature"

for data in range(1,100):
    data = {'timestamp':int(time.time()),
            'temperature':random.randint(50,90)}
    print (data)
    r = requests.post(url = url, data = data)
    print (str(r))
    time.sleep(1)
