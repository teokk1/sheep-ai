import csv
from urllib.parse import urljoin

from bs4 import BeautifulSoup
from src.tools.selenium_driver import get_driver


def scrape_urls(base_url: str, max_urls: int = 1000):
    """
    Scrape urls from the web and return a list of url and text pairs.
    """
    driver = get_driver()

    found_urls = set()
    urls_currently_in_queue_or_already_visited = set()

    url_text_pairs = [(base_url, "Home")]
    counter = 0
    urls_queue = [base_url]
    while urls_queue:
        counter += 1
        print(f"Scraping {counter} urls")

        if len(url_text_pairs) > max_urls:
            break

        url = urls_queue.pop(0)

        if not url.startswith(base_url):
            continue

        print(f"Scraping {url}")
        try:
            driver.get(url)
            page_source = driver.page_source
        except Exception as e:
            print(f"    Error scraping {url}: {e}")
            continue

        soup = BeautifulSoup(page_source, "html.parser")

        links = soup.find_all("a")

        for link in links:
            url = link.get("href")
            text = " ".join(link.stripped_strings)
            full_url = urljoin(base_url, url)

            if full_url not in urls_currently_in_queue_or_already_visited:
                urls_queue.append(full_url)
                urls_currently_in_queue_or_already_visited.add(full_url)

                url_text_pairs.append((full_url, text))
                if len(url_text_pairs) % 1000 == 0:
                    _write_to_csv(url_text_pairs, f"links_{len(url_text_pairs)}.csv")

        found_urls.add(full_url)

    _write_to_csv(url_text_pairs, f"links_{len(url_text_pairs)}.csv")

    try:
        driver.quit()
    except Exception as e:
        print(f"    Error quitting driver: {e}")

    return url_text_pairs


def _write_to_csv(url_text_pairs, file_name: str):
    with open(file_name, "w", newline="", encoding="utf-8") as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerow(["Text", "URL"])

        for url, text in url_text_pairs:
            csvwriter.writerow([text, url])
