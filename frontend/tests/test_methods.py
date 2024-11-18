from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


def go_to_account_page(driver):
    # Esperamos a que cargue la página y hacemos click en el botón account
    account_link = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "a[href='/account']"))
    )
    account_link.click()

    WebDriverWait(driver, 5).until(
        EC.url_to_be("http://localhost:3000/auth/sign-in")
    )