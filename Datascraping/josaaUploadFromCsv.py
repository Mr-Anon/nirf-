import requests
import json
import csv

url = "http://localhost:8000/api/addCutoff"
headers = {
    'Content-Type': 'application/json'
}

# Read data from CSV file and create a list of lists
csv_file_path = './output.csv'  # Update with the actual path to your CSV file
data_list = []

with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
    csv_reader = csv.reader(csvfile)
    for row in csv_reader:
        try:
            if 'P' in row[5]:
                opening_rank = int(float(row[5][:-1]))  # Assuming 'Opening Rank' is in the 6th column
            
            else:
                opening_rank = int(float(row[5]))  # Assuming 'Opening Rank' is in the 6th column
            if 'P' in row[6]:
                closing_rank = int(float(row[6][:-1]))  # Assuming 'Closing Rank' is in the 7th column
            
            else:
                closing_rank = int(float(row[6]))  # Assuming 'Closing Rank' is in the 7th column
            
        except ValueError:
            # Skip the row if 'Opening Rank' or 'Closing Rank' is not a valid integer
            print(f"Skipping row with non-numeric ranks: {row}")
            exit(0)
            # continue

        data_list.append({
            "institute_name": row[0],
            "Academic_Program_Name": row[1],
            "Quota": row[2],
            "Seat_Type": row[3],
            "Gender": row[4], 
            "Opening_Rank": opening_rank,
            "Closing_Rank": closing_rank
        })

for data in data_list:
    print(data)
    payload = json.dumps(data)
    response = requests.post(url, headers=headers, data=payload)
    
    print(response.text)
