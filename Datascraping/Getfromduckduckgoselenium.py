import os
import time
import re
import requests
import pandas as pd
from bs4 import BeautifulSoup
from s
elenium import webdriver

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
                return True
        
        return False
    except Exception as e:
        return False

def download_first_pdf_from_duckduckgo(query, college):
    global va
    if "Yogda Satsang College" in college:
        va = True
    if va:
        time.sleep(3)
        # Construct the DuckDuckGo search URL
        duckduckgo_search_url = f"https://duckduckgo.com/?q={query.replace(' ','+')}&ia=web"
        print(duckduckgo_search_url)

        # Use Selenium WebDriver to interact with DuckDuckGo
        driver = webdriver.Chrome()  # Make sure you have the ChromeDriver executable in your PATH
        driver.get(duckduckgo_search_url)

        # Parse the HTML content of the DuckDuckGo search page
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # Find all the links in the search results
        links = soup.find_all("a")
        print(links)
        
        for i, link in enumerate(links):
            # Check if the link contains ".pdf"
            if re.search(r'\.pdf', link.get('href', '')):
                pdf_url = link.get('href')
                pdf_url1 = re.sub(r'.*q=(.*\.pdf).*', r'\1', pdf_url)
                
                # Download the PDF
                try:
                    target_text = "Submitted Institute Data for NIRF'2023'"
                    if check_text_in_pdf_url(pdf_url1, target_text):
                        os.makedirs(f"ScrapedPDFDataNewduck/{college}", exist_ok=True)
                        response = requests.get(pdf_url1)
                        if response.status_code == 200:
                            # Save the PDF to a local file
                            with open(f"ScrapedPDFDataNewduck/{college}/{i}.pdf", "wb") as pdf_file:
                                pdf_file.write(response.content)

                            with open(f"ScrapedPDFDataNewduck/{college}/{i}.txt", "w") as file:
                                # Write the text to the file
                                print("link")
                                print()
                                print(str(link.get('href', '')).split('/url?q=')[1].split('.pdf')[0] + '.pdf')
                                file.write(str(link.get('href', '')).split('/url?q=')[1].split('.pdf')[0] + '.pdf')
                                print("sdfdsf")
                                # print("First PDF downloaded successfully.")
                except Exception as e:
                    print(e)

        driver.quit()

if __name__ == "__main__":
    os.system("mkdir ScrapedPDFDataNewduck")
    va = False

    url = "https://www.nirfindia.org/2023/CollegeRankingALL.html"

    # Scraping the html document to load the tabular list of institutes
    df = pd.read_html(url)[0][["Name", "City", "State"]]
    df.columns = df.columns.str.lower()

    result = df.to_json(orient="records")
    parsed = json.loads(result)
    college_participated = json.dumps(parsed, indent=4)
    print(df)

    for i in range(len(df)):
        if str(df['city'][i]) in str(df['name'][i]):
            college = str(df['name'][i])
        else:
            college = str(df['name'][i]) + " " + str(df['city'][i])
        query = str(college) + " nirf 2023 filetype:pdf"
        print(college)
        download_first_pdf_from_duckduckgo(query, college)
