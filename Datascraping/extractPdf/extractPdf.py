import os
from tabula import read_pdf
import pandas as pd

def pdf_to_excel(pdf_file_path, excel_file_path):
    # Read PDF file
    tables = read_pdf(pdf_file_path, pages='all')

    # Write each table to a separate sheet in the Excel file
    with pd.ExcelWriter(excel_file_path) as writer:
        for i, table in enumerate(tables):
            table.to_excel(writer, sheet_name=f'Sheet{i+1}')

# Parent folder containing subfolders with PDF files
parent_folder_path = "../"

# Iterate through all subfolders and files
for root, dirs, files in os.walk(parent_folder_path):
    for file in files:
        if file.endswith(".pdf"):
            pdf_file_path = os.path.join(root, file)
            subfolder_name = os.path.basename(root)  # Extract the name of the subfolder
            
            # Create a new folder to save Excel files if it doesn't exist
            output_folder = os.path.join(parent_folder_path, "output_excel_files")
            if not os.path.exists(output_folder):
                os.makedirs(output_folder)
            
            # Save all tables into the same sheet in an Excel file with subfolder name
            excel_file_path = os.path.join(output_folder, f"{subfolder_name}_tables.xlsx")
            pdf_to_excel(pdf_file_path, excel_file_path)
            
            print(f"Tables extracted from '{file}' and saved to '{excel_file_path}'.")

print("Extraction complete!")
