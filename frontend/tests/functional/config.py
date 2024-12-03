import time
from selenium import webdriver

from frontend.tests.functional.integration.test_signin_signup_methods import login

def getDriver():
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    driver = webdriver.Chrome(options=options)
    return driver

driver = getDriver()