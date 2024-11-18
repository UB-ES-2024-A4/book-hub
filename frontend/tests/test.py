from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

from test_methods import go_to_sign_in_page, go_to_sign_up_page, sign_up

driver = webdriver.Chrome()
driver.get("http://localhost:3000/home")

def test_go_to_sign_in_page():
    driver.get("http://localhost:3000/home")

    go_to_sign_in_page(driver)

    # Comprobar si la URL actual es la esperada
    assert driver.current_url == "http://localhost:3000/auth/sign-in", "No estás en la página de sign-in."

def test_go_to_sign_up_page():
    driver.get("http://localhost:3000/home")

    go_to_sign_in_page(driver)

    go_to_sign_up_page(driver)

    # Comprobar si la URL actual es la esperada
    assert driver.current_url == "http://localhost:3000/auth/sign-up", "No estás en la página de sign-up."
def test_sign_up():
    driver.get("http://localhost:3000/home")

    go_to_sign_in_page(driver)

    go_to_sign_up_page(driver)

    sign_up(driver, "test_user", "test_user", "test_user", "test_user@gmail.com", "TestPassword123")

    WebDriverWait(driver, 5).until(
        EC.url_to_be("http://localhost:3000/auth/sign-in")
    )

    # Comprobar si la URL actual es la esperada
    assert driver.current_url == "http://localhost:3000/auth/sign-in", "No estás en la página de sign-in."