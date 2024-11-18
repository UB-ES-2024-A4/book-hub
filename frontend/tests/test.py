from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

from test_methods import go_to_account_page

driver = webdriver.Chrome()
driver.get("http://localhost:3000/home")

def test_go_to_account_page():
    driver.get("http://localhost:3000/home")

    go_to_account_page(driver)

    # Comprobar si la URL actual es la esperada
    assert driver.current_url == "http://localhost:3000/auth/sign-in", "No estás en la página de account."