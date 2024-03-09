import os

def list_folders(directory):
    folder_names = []
    for root, dirs, files in os.walk(directory):
        for folder in dirs:
            folder_names.append(folder)
    return folder_names

# Replace 'path_to_your_folder' with the path to your folder
directory = './ScrapedPDFDataNew'
folders = list_folders(directory)
print("List of folder names:")
for folder in folders:
    print(folder)