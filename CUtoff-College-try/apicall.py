api1_data = []
api2_data = []

with open('./confirmed_matches.txt', 'r') as file:
    lines = file.readlines()
    for line in lines:
        if line.startswith('API 1:'):
            api1_data.append(line.replace('API 1:', '').strip())
        elif line.startswith('API 2:'):
            api2_data.append(line.replace('API 2:', '').strip())

print("API 1 data:")
print(api1_data)
print("\nAPI 2 data:")
print(api2_data)

import requests
import json

url = "http://localhost:8000/api/updateCodeToCuttoffId"

for cutoff, college in zip(api2_data, api1_data):
    payload = json.dumps({
        "cutoffName": cutoff,
        "collegeName": college
    })
    headers = {
        'Content-Type': 'application/json'
    }
    response = requests.request("POST", url, headers=headers, data=payload)
    print(response.text)

