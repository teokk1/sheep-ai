from src.scraping_details.scrape_details import scrape_details
from src.scraping_urls.scrape_urls import scrape_urls
import os
import json

base_url = "https://www.gov.uk/"
# base_url = "https://vlada.gov.hr/"

data_dir = f"data/{base_url.replace('https://', '').replace('.', '_')}"
os.makedirs(data_dir, exist_ok=True)
url_text_pairs = scrape_urls(base_url, max_urls=20000)

keywords = [
    "tax",
    "corporation",
    "association",
    "unincorporated",
    "porez",
    "dohodak",
    "zakon",
    "pravilnik",
    "tvrtka",
]
filtered_url_text_pairs = [
    (url, text)
    for url, text in url_text_pairs
    if any(keyword in url for keyword in keywords)
    or any(keyword in text for keyword in keywords)
]

if not filtered_url_text_pairs or len(filtered_url_text_pairs) == 0:
    print("No urls found")
    exit()

for index, (url, text) in enumerate(filtered_url_text_pairs):
    if base_url not in url:
        print(f"Skipping {url} because it's not a subpage of {base_url}")
        continue

    print(f"Scraping {url}; {index} / {len(filtered_url_text_pairs)}")
    full_text = scrape_details(url)

    # Replace "/" in the URL to prevent subfolder creation
    sanitized_url = url.replace(base_url, "").replace("/", "_")

    # Create the directory for each URL
    dir_path = os.path.join(data_dir, sanitized_url)
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
