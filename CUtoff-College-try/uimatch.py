import requests
from fuzzywuzzy import fuzz
from PyQt5.QtWidgets import QApplication, QLabel, QPushButton, QVBoxLayout, QWidget, QMessageBox

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

if data1 is None or data2 is None:
    print("Failed to retrieve data from one or both APIs.")
    exit()

# Extract the name attributes
names1 = {item['name']: item for item in data1['college']}
names2 = {item['institute_name']: item for item in data2['cutoff']}

# Find potential matching names based on similarity using fuzzy matching
potential_matches = []
confirmed_matches = []

for name1 in names1.keys():
    for name2 in names2.keys():
        if name1.replace(',','').replace(' ','').lower() in name2.replace(',','').replace(' ','').lower() or \
           name2.replace(',','').replace(' ','').lower() in name1.replace(',','').replace(' ','').lower():
            confirmed_matches.append([name1, name2])
        else:
            if name1 not in [i[0] for i in confirmed_matches]:
                similarity = fuzz.token_set_ratio(name1, name2)
                if similarity > 75:  # Adjust the threshold as needed
                    potential_matches.append([name1, name2])

# Initialize the set of matched name2
matched_name2 = set(name2 for _, name2 in confirmed_matches)
current_match_index = -1

class MatchConfirmationApp(QWidget):
    def __init__(self):
        super().__init__()
        self.initUI()
        self.show_next_match()

    def initUI(self):
        self.layout = QVBoxLayout()

        self.label = QLabel("", self)
        self.layout.addWidget(self.label)

        self.yes_button = QPushButton("Yes", self)
        self.yes_button.clicked.connect(lambda: self.handle_response('yes'))
        self.layout.addWidget(self.yes_button)

        self.no_button = QPushButton("No", self)
        self.no_button.clicked.connect(lambda: self.handle_response('no'))
        self.layout.addWidget(self.no_button)

        self.back_button = QPushButton("Back", self)
        self.back_button.clicked.connect(self.show_previous_match)
        self.layout.addWidget(self.back_button)

        self.setLayout(self.layout)
        self.setWindowTitle('Match Confirmation')

    def handle_response(self, response):
        global current_match_index
        if response == 'yes':
            confirmed_matches.append(potential_matches[current_match_index])
            # Remove name2 from further matching
            matched_name2.add(potential_matches[current_match_index][1])
        current_match_index += 1
        self.show_next_match()

    def show_next_match(self):
        global current_match_index
        while current_match_index < len(potential_matches):
            if potential_matches[current_match_index][1] not in matched_name2:
                break
            current_match_index += 1

        if current_match_index < len(potential_matches):
            self.current_match = potential_matches[current_match_index]
            self.label.setText(f"Do these names match?\n1. {self.current_match[0]}\n2. {self.current_match[1]}")
        else:
            QMessageBox.information(self, "Finished", "All matches processed.")
            with open("confirmed_matches.txt", "w") as file:
                for name1, name2 in confirmed_matches:
                    file.write(f"API 1: {names1[name1]['name']}\n")
                    file.write(f"API 2: {names2[name2]['institute_name']}\n\n")
            self.close()

    def show_previous_match(self):
        global current_match_index
        if current_match_index > 0:
            current_match_index -= 1
            self.current_match = potential_matches[current_match_index]
            self.label.setText(f"Do these names match?\n1. {self.current_match[0]}\n2. {self.current_match[1]}")
        else:
            QMessageBox.information(self, "Info", "This is the first match.")

if __name__ == '__main__':
    app = QApplication([])
    ex = MatchConfirmationApp()
    ex.show()
    app.exec_()
