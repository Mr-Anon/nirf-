import os
import requests
from urllib.parse import urljoin

def download_pdfs(url, folder):
    response = requests.get(url)
    response.raise_for_status()

    if not os.path.exists(folder):
        os.makedirs(folder)

    for link in response.content.decode().split('"'):
        if link.endswith('.pdf'):
            pdf_url = urljoin(url, link)
            pdf_filename = os.path.join(folder, os.path.basename(pdf_url))
            with open(pdf_filename, 'wb') as f:
                pdf_response = requests.get(pdf_url)
                f.write(pdf_response.content)
                print(f"Downloaded: {pdf_filename}")

# Example usage
url = "https://www.nirfindia.org/2023/EngineeringRanking.html"  # Replace with your desired URL
folder = "./engg-pdfs"  # Replace with your desired folder path
download_pdfs(url, folder)