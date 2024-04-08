import requests
from bs4 import BeautifulSoup
import re
import os
import time
import fitz  # PyMuPDF
va = True

def check_text_in_pdf_url(pdf_url, target_text):
    # Fetch the PDF content from the URL
    response = requests.get(pdf_url, timeout=2)
    response.raise_for_status()  # Raise an exception for HTTP errors
    
    # Create a BytesIO object to read the content
    pdf_content = response.content
    
    # Check if the PDF contains the target text
    return check_text_in_pdf_bytes(pdf_content, target_text)

def check_text_in_pdf_bytes(pdf_content, target_text):
    try:
        doc = fitz.open("pdf", pdf_content)
        
        for page_number in range(doc.page_count):
            page = doc[page_number]
            text = page.get_text()
            
            if target_text in text:
                print(f'caught')
                va = False
                return True
        
        return False
    except Exception as e:
        return False


os.system("mkdir ScrapedPDFDataNew")
def download_first_pdf_from_google(query,college):
    global va
    if va:
        time.sleep(3)
        # Construct the Google search URL
        google_search_url = f"https://www.google.com/search?q={query}"

        # Send an HTTP GET request to Google
        response = requests.get(google_search_url)
        print(response.status_code)

        if response.status_code == 200:
            # Parse the HTML content of the Google search page
            soup = BeautifulSoup(response.text, 'html.parser')

            # Find all the 1 in the search results
            links = soup.find_all("a")
            # print(links)
            for i in range(len(links)):
                link = links[i]
                # Check if the link contains ".pdf"
                if re.search(r'\.pdf', link.get('href', '')):
                    pdf_url = link.get('href')
                    pdf_url1 = re.sub(r'.*q=(.*\.pdf).*',r'\1',pdf_url)
                    # Download the PDF
                    try:
                        # print(pdf_url1)
                        target_text = "Data Submitted by Institution for India Rankings '2023'"
                        if check_text_in_pdf_url(pdf_url1, target_text):
                            os.system("mkdir ScrapedPDFDataNewduck/"+'"'+college+'"')
                            response = requests.get(pdf_url1)
                            if response.status_code == 200:
                                # Save the PDF to a local file
                                with open("ScrapedPDFDataNewduck/"+college+"/"+str(i)+".pdf", "wb") as pdf_file:
                                    pdf_file.write(response.content)

                                with open("ScrapedPDFDataNewduck/"+college+"/"+str(i)+".txt", "w") as file:
                                    # Write the text to the file
                                    # print("link")
                                    # print()
                                    # print(str( link.get('href', '')).split('/url?q=')[1].split('.pdf')[0] + '.pdf')
                                    file.write(str( link.get('href', '')).split('/url?q=')[1].split('.pdf')[0] + '.pdf')
                                    # print("sdfdsf")
                                    # print("First PDF downloaded successfully.")
                            # else:
                                # print("Failed to download the PDF.")
                    except Exception as e:
                        print(e)
            
        else:
            print("Failed to connect to Google.")
    else:
        print("college already searched")
    
import pandas as pd
import json

# url = "https://www.nirfindia.org/2023/OverallRankingALL.html"
url = "https://www.nirfindia.org/2023/OverallRanking.html"

# Scraping the html document to load the tabular list of institutes
df: pd.DataFrame = pd.read_html(url)[0][["Institute ID","Name", "City", "State"]]
df.columns = df.columns.str.lower()

result = df.to_json(orient="records")
parsed = json.loads(result)
college_participated = json.dumps(parsed, indent=4)
print(df)
def list_folders(directory):
    folder_names = []
    for root, dirs, files in os.walk(directory):
        for folder in dirs:
            folder_names.append(folder)
    return folder_names


directory1 = './ScrapedPDFDataNewduck'
folders1 = list_folders(directory1)

from bs4 import BeautifulSoup, SoupStrainer
import requests

page = requests.get(url)    
data = page.text
soup = BeautifulSoup(data)
links1 = []
for link in soup.find_all('a'):
    pdf_url2 = str(link.get('href'))    
    pdf_url3 = re.sub(r'.*q=(.*\.pdf).*',r'\1',pdf_url2)
    if '.pdf' in pdf_url3:
        print(pdf_url3)
        links1.append(pdf_url3)

print(df.keys())
for i in range(len(df)):
    if str(df['city'][i]) in str(df['name'][i]):
        college = str(df['name'][i]).split("More Details")[0].replace('`','')
    else:
        college = str(df['name'][i]).split("More Details")[0].replace('`','') +" "+str(df['city'][i]) 
    query = str(college) +" nirf 2023 filetype:pdf"
    print(college)
    if college not in folders1:
        va = True
        for link in links1:
            if str(df['institute id'][i]) in link: 
                os.system("mkdir ScrapedPDFDataNewduck/"+'"'+college+'"')
                response = requests.get(link)
                if response.status_code == 200:
                    # Save the PDF to a local file
                    with open("ScrapedPDFDataNewduck/"+college+"/"+str(i)+".pdf", "wb") as pdf_file:
                        pdf_file.write(response.content)

                    with open("ScrapedPDFDataNewduck/"+college+"/"+str(i)+".txt", "w") as file:
                        # Write the text to the file
                        # print("link")
                        # print()
                        # print(str( link.get('href', '')).split('/url?q=')[1].split('.pdf')[0] + '.pdf')
                        file.write(str(link))
        # download_first_pdf_from_google(query, college)
