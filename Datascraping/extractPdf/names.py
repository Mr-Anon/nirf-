import os
from tabula import read_pdf
import pandas as pd

def merge_tables(tables, texts):
    merged_tables = []
    current_table = tables[0]
    current_text = texts[0]
    for next_table, next_text in zip(tables[1:], texts[1:]):
        # Check if there is any text between the current table and the next table
        if not any(is_text_between(table, next_table, current_text, next_text) for table in current_table):
            current_table = pd.concat([current_table, next_table], ignore_index=True)
            current_text += next_text
        else:
            merged_tables.append(current_table)
            current_table = next_table
            current_text = next_text
    merged_tables.append(current_table)
    return merged_tables

def is_text_between(table, next_table, current_text, next_text):
    # Extract bounding boxes of tables
    table_bbox = get_bbox(table)
    next_table_bbox = get_bbox(next_table)
    
    # Extract bounding box of text
    current_text_bbox = get_bbox(current_text)
    next_text_bbox = get_bbox(next_text)
    
    # Check if any text falls between the tables
    if any(check_overlap(bbox, table_bbox) for bbox in current_text_bbox):
        return True
    if any(check_overlap(bbox, next_table_bbox) for bbox in next_text_bbox):
        return True
    return False

def get_bbox(data):
    # Ensure that data is a DataFrame
    if isinstance(data, pd.DataFrame):
        return [(row['x'], row['y'], row['x'] + row['width'], row['y'] + row['height']) for _, row in data.iterrows()]
    elif isinstance(data, tuple):
        # If data is already a list of bounding box tuples, return it directly
        return data
    else:
        return []

def check_overlap(bbox, table_bbox):
    for t_bbox in table_bbox:
        if (bbox[0] >= t_bbox[0] and bbox[2] <= t_bbox[2]) or (bbox[1] >= t_bbox[1] and bbox[3] <= t_bbox[3]):
            return True
    return False

def extract_text_from_pages(pages):
    texts = []
    for page in pages:
        page_text = pd.DataFrame(page['data'])
        texts.append(page_text)
    return texts

def pdf_to_excel(pdf_file_path, excel_file_path):
    # Read PDF file
    tables = read_pdf(pdf_file_path, pages='all', multiple_tables=True)
    pages = read_pdf(pdf_file_path, pages='all', output_format='json')
    
    if not tables:
        print(f"No tables found in '{pdf_file_path}'. Skipping.")
        return

    # Extract text from each page
    texts = extract_text_from_pages(pages)

    # Merge tables based on the absence of text between them
    merged_tables = merge_tables(tables, texts)

    # Write merged tables to a single sheet in the Excel file
    with pd.ExcelWriter(excel_file_path) as writer:
        for i, merged_table in enumerate(merged_tables):
            merged_table.to_excel(writer, sheet_name=f'Sheet{i+1}', index=False)

    print(f"Tables extracted and saved from '{pdf_file_path}' to '{excel_file_path}'.")

# Parent folder containing subfolders with PDF files
parent_folder_path = "./2023"

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

print("Extraction complete!")
