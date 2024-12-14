from selenium import webdriver


def get_driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--disable-blink-features")
    options.add_argument("--disable-blink-features=AutomationControlled")

    driver = webdriver.Remote(
        command_executor=f"http://localhost:4444/wd/hub", options=options
    )

    return driver
