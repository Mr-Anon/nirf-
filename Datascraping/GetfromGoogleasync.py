import aiohttp
import asyncio
import os
import re
import time
from bs4 import BeautifulSoup
import pandas as pd
import json
import fitz  # PyMuPDF

semaphore = asyncio.Semaphore(10)

async def check_text_in_pdf_url(pdf_url, target_text):
    async with semaphore:
        async with aiohttp.ClientSession() as session:
            async with session.get(pdf_url, timeout=2) as response:
                response.raise_for_status()
                pdf_content = await response.read()
                return await check_text_in_pdf_bytes(pdf_content, target_text)

async def check_text_in_pdf_bytes(pdf_content, target_text):
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

async def download_first_pdf_from_google(query, college):
    global va
    if "Bethuadahari College" in college:
        va = True
    if va:
        time.sleep(3)
        # Construct the Google search URL
        google_search_url = f"https://www.google.com/search?q={query}"

        async with aiohttp.ClientSession() as session:
            async with session.get(google_search_url) as response:
                print(response.status)

                if response.status == 200:
                    soup = BeautifulSoup(await response.text(), 'html.parser')
                    links = soup.find_all("a")

                    tasks = []
                    for i, link in enumerate(links):
                        if re.search(r'\.pdf', link.get('href', '')):
                            pdf_url = link.get('href')
                            pdf_url1 = re.sub(r'.*q=(.*\.pdf).*', r'\1', pdf_url)
                            tasks.append(download_pdf(pdf_url1, college, i))

                    await asyncio.gather(*tasks)
                else:
                    print("Failed to connect to Google.")
    else:
        print("college already searched")

async def download_pdf(pdf_url, college, i):
    target_text = "Submitted Institute Data for NIRF'2023'"
    if await check_text_in_pdf_url(pdf_url, target_text):
        os.makedirs(f"ScrapedPDFDataNew/{college}", exist_ok=True)
        async with aiohttp.ClientSession() as session:
            async with session.get(pdf_url) as response:
                if response.status == 200:
                    # Save the PDF to a local file
                    with open(f"ScrapedPDFDataNew/{college}/{i}.pdf", "wb") as pdf_file:
                        pdf_file.write(await response.read())

                    with open(f"ScrapedPDFDataNew/{college}/{i}.txt", "w") as file:
                        # Write the text to the file
                        file.write(f"{pdf_url.split('/url?q=')[1].split('.pdf')[0]}.pdf")
                        print("First PDF downloaded successfully.")
                # else:
                    # print("Failed to download the PDF.")

async def main():
    url = "https://www.nirfindia.org/2023/CollegeRankingALL.html"
    df = pd.read_html(url)[0][["Name", "City", "State"]]
    df.columns = df.columns.str.lower()

    result = df.to_json(orient="records")
    parsed = json.loads(result)
    college_participated = json.dumps(parsed, indent=4)

    print(df)
    tasks = [download_first_pdf_from_google(str(college) + " nirf 2023 pdf", college) for college in df.apply(lambda x: x['name'] if str(x['city']) in str(x['name']) else f"{x['name']} {x['city']}", axis=1)]
    await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main())
