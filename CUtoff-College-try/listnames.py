import requests

# Function to fetch data from an API
def fetch_data(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raises an HTTPError if the response code is 4xx or 5xx
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except requests.exceptions.ConnectionError as conn_err:
        print(f"Connection error occurred: {conn_err}")
    except requests.exceptions.Timeout as timeout_err:
        print(f"Timeout error occurred: {timeout_err}")
    except requests.exceptions.RequestException as req_err:
        print(f"An error occurred: {req_err}")
    return None

# URLs of the APIs
api_url_1 = 'http://localhost:8000/api/getAllCollegeUnranked'
api_url_2 = 'http://localhost:8000/api/getAllCutoff'

# Fetch data from both APIs
data1 = fetch_data(api_url_1)
data2 = fetch_data(api_url_2)



# for item in data2['cutoff']:
#     print(item['institute_name'])

# for item in data1['college']:
#     print(item['name'])

# Extract the name attributes
names1 = {item['name']: item for item in data1['college']}
names2 = {item['institute_name']: item for item in data2['cutoff']}
for i in names1.keys():
    print(i)
print('-------------------------------------------------------------------')
for i in names2.keys():
    print(i)