from bs4 import BeautifulSoup
from src.tools.selenium_driver import get_driver


def scrape_details(url: str) -> str:
    """
    Scrape details from the web and return the full useful text.
    """
    driver = get_driver()

    driver.get(url)

    page_source = driver.page_source

    with open("page_content.html", "w", encoding="utf-8") as file:
        file.write(page_source)

    driver.quit()

    soup = BeautifulSoup(page_source, "html.parser")

    main_content = soup.find("main", {"role": "main"})

    full_text = ""
    if main_content:
        for element in main_content.find_all(
            ["h1", "h2", "h3", "h4", "h5", "h6", "p", "section"], recursive=True
        ):
            text = element.get_text(strip=True)
            if text:
                full_text += f"{element.name.upper()}: {text}\n"
    else:
        print("Main content not found.")

    return full_text
