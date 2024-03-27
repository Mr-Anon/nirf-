import os
import pandas as pd

# Path to the folder containing Excel files
folder_path = './output_excel_files'

# Initialize an empty dictionary to store data from all sheets of all files
all_sheets_dict = {}

# Iterate over all files in the folder
for file_name in os.listdir(folder_path)[0:2]:
    if file_name.endswith('.xlsx'):  # Assuming all files are Excel files
        file_path = os.path.join(folder_path, file_name)
        print(file_name)
        # Read all sheets of the current file into a dictionary
        sheets_dict = pd.read_excel(file_path, sheet_name=None, engine='openpyxl')

        
        # Merge the current sheets into the main dictionary
        all_sheets_dict.update(sheets_dict)

# Now all_sheets_dict contains all sheets from all Excel files in the folder
# where keys are in the format 'file_name_sheet_name' and values are DataFrames
# You can access individual sheets like this:
# sheet1_data = all_sheets_dict['file1.xlsx_Sheet1']
# sheet2_data = all_sheets_dict['file2.xlsx_Sheet2']

for sheet_name, sheet_data in all_sheets_dict.items():
    print(f"Sheet: {sheet_name}")
    print(sheet_data)
    print("\n")


