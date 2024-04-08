import os
from tabula import read_pdf
import pandas as pd

def extract_tables_with_titles(pdf_file_path):
    # Read PDF file
    tables = read_pdf(pdf_file_path, pages='all', output_format='json')

    tables_with_titles = []

    for table in tables:
        if 'data' in table:
            # Extract text from the cells
            table_data = [[cell['text'] for cell in row] for row in table['data']]
            # Extract text from the preceding element as title
            title = table['preceding'] if 'preceding' in table else None
            # Convert title to text
            title_text = title.get('text', '') if title else None
            tables_with_titles.append((title_text, table_data))

    return tables_with_titles

def pdf_to_excel(pdf_file_path, excel_file_path):
    tables_with_titles = extract_tables_with_titles(pdf_file_path)

    # Write each table to a separate sheet in the Excel file
    with pd.ExcelWriter(excel_file_path, engine='openpyxl') as writer:
        prev_df = None
        prev_title = None  # Initialize prev_title before the loop
        for i, (title, data) in enumerate(tables_with_titles):
            df = pd.DataFrame(data)
            if title:
                if prev_df is not None:
                    sheet_name = prev_title or f'Sheet{i}'  # Use default name if prev_title is None
                    prev_df.to_excel(writer, sheet_name=sheet_name, index=False)
                prev_df = df
                prev_title = title.strip()[:31]  # Limit sheet name to 31 characters
            else:
                if prev_df is not None:
                    prev_df = pd.concat([prev_df, df], ignore_index=True)
                else:
                    prev_df = df

        # Write the last table
        if prev_df is not None:
            # print(prev_df)
            sheet_name = prev_title or 'Sheet_last'  # Use default name if prev_title is None
            prev_df.to_excel(writer, sheet_name=sheet_name, index=False)

# Parent folder containing subfolders with PDF files
parent_folder_path = "../ScrapedPDFDataNewduck/"

# Iterate through all subfolders and files
for root, dirs, files in os.walk(parent_folder_path):
    for file in files:
        if file.endswith(".pdf"):
            pdf_file_path = os.path.join(root, file)
            subfolder_name = os.path.basename(root)  # Extract the name of the subfolder
            
            # Create a new folder to save Excel files if it doesn't exist
            output_folder = os.path.join(parent_folder_path, "output_excel_files_new")
            if not os.path.exists(output_folder):
                os.makedirs(output_folder)
            
            # Save all tables into the same sheet in an Excel file with subfolder name
            excel_file_path = os.path.join(output_folder, f"{subfolder_name}_tables.xlsx")
            pdf_to_excel(pdf_file_path, excel_file_path)
            
            print(f"Tables extracted from '{file}' and saved to '{excel_file_path}'.")


print("Extraction complete!")
