from bs4 import BeautifulSoup
import csv

# Replace 'your_file_path.html' with the actual path to your HTML file
file_path = './josaa.html'

# Read the content of the HTML file
with open(file_path, 'r', encoding='utf-8') as file:
    html_content = file.read()

# Parse the HTML content
soup = BeautifulSoup(html_content, 'html.parser')

# Locate the table element on the webpage (modify this according to your HTML structure)
table = soup.find('table')

# Check if the table is found
if table:
    # Create a CSV file to write the table data
    with open('output.csv', 'w', newline='', encoding='utf-8') as csvfile:
        csv_writer = csv.writer(csvfile)

        # Extract and write the header row to the CSV file
        header = [th.text.strip() for th in table.find_all('th')]
        csv_writer.writerow(header)

        # Extract and write the data rows to the CSV file
        for row in table.find_all('tr')[1:]:  # Skip the first row if it contains headers
            data = [td.text.strip() for td in row.find_all('td')]
            csv_writer.writerow(data)

    print("CSV file created successfully.")
else:
    print("Table not found in the HTML file.")
