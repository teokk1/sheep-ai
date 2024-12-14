from src.scraping_details.scrape_details import scrape_details
from src.scraping_urls.scrape_urls import scrape_urls
import os

base_url = "https://www.gov.uk/"

url_text_pairs = scrape_urls(base_url, max_urls=100)

filtered_url_text_pairs = [(url, text) for url, text in url_text_pairs if "tax" in url]

for url, text in filtered_url_text_pairs:
    print(f"Scraping {url}")
    full_text = scrape_details(url)

    # Create the directory if it doesn't exist
    file_path = f"data/{url.replace(base_url, '')}.txt"
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    with open(file_path, "w", encoding="utf-8") as file:
        file.write(full_text)
