from src.scraping_details.scrape_details import scrape_details
from src.scraping_urls.scrape_urls import scrape_urls
import os
import json

base_url = "https://www.gov.uk/"

url_text_pairs = scrape_urls(base_url, max_urls=20000)

filtered_url_text_pairs = [(url, text) for url, text in url_text_pairs if "tax" in url]

for url, text in filtered_url_text_pairs:
    if base_url not in url:
        print(f"Skipping {url} because it's not a subpage of {base_url}")
        continue

    print(f"Scraping {url}")
    full_text = scrape_details(url)

    # Replace "/" in the URL to prevent subfolder creation
    sanitized_url = url.replace(base_url, "").replace("/", "_")

    # Create the directory for each URL
    dir_path = f"data/{sanitized_url}"
    os.makedirs(dir_path, exist_ok=True)

    # Save the full text in a file
    file_path = os.path.join(dir_path, "content.txt")
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(full_text)

    # Save metadata in a JSON file
    metadata = {"url": url, "url_text": text}
    metadata_path = os.path.join(dir_path, "metadata.json")
    with open(metadata_path, "w", encoding="utf-8") as json_file:
        json.dump(metadata, json_file, indent=4)
