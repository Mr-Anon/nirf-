from bs4 import BeautifulSoup

def get_links_from_html(html_content):
    try:
        # Parse the HTML content
        soup = BeautifulSoup(html_content, 'html.parser')

        # Find all the 'a' (anchor) tags and extract the 'href' attribute
        links = [a.get('href') for a in soup.find_all('a')]

        return links

    except Exception as e:
        print(f"Error: {e}")
        return []

def save_unique_links_to_file(links, filename):
    unique_links = list(set(links))  # Convert to set to remove duplicates, then back to list
    with open(filename, 'w', encoding='utf-8') as file:
        for link in unique_links:
            file.write(link + '\n')

    print(f"Unique links saved to '{filename}'")

if __name__ == "__main__":
    # Replace 'input.html' with the path to your HTML file
    with open('webpage.html', 'r', encoding='utf-8') as html_file:
        html_content = html_file.read()

    # Replace 'links.txt' with the desired filename for the text file containing links
    links = get_links_from_html(html_content)

    if links:
        save_unique_links_to_file(links, 'links.txt')
    else:
        print("No links found in the HTML file.")
