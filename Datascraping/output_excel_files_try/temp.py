import pandas as pd

# Load the Excel file
file_path = '1.xlsx'
output_file_path = 'output_excel_file.xlsx'

# Read the Excel file
df = pd.read_excel(file_path)

# Initialize an Excel writer
writer = pd.ExcelWriter(output_file_path, engine='xlsxwriter')

# Function to count the number of non-empty cells in a row
def count_non_empty_cells(row):
    return sum(1 for cell in row if pd.notnull(cell))

# Find and save each table to a separate sheet
table_num = 1
start_row = None
prev_row_length = None
for i in range(len(df)):
    row = df.iloc[i]
    # Count the number of non-empty cells in the row
    row_length = count_non_empty_cells(row)
    # If it's the start of a new table
    if start_row is None:
        start_row = i
    # If the row length changes or it's the last row
    if row_length != prev_row_length or i == len(df) - 1:
        # End of current table
        end_row = i-1
        # Extract the table block
        table_block = df.iloc[start_row:end_row+1]
        # Write the table to a new sheet
        table_block.to_excel(writer, sheet_name=f'Table_{table_num}', index=False, header=False)
        # Increment table number
        table_num += 1
        # Update start_row for next table
        start_row = i
    # Update the previous row length
    prev_row_length = row_length

# Close the Excel writer
writer.close()
