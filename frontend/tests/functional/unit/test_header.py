import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from ..integration.test_signin_signup_methods import login

driver = webdriver.Chrome()
driver.get("http://localhost:3000")

driver.get("http://localhost:3000/sign-in")
login(driver, "user_test", "contraseña")
time.sleep(1)
def test_click_bookhub_link():
    driver.get("http://localhost:3000/home")  # Navegar a la página de inicio
    # Esperar a que el enlace "BookHub" sea clickeable
    bookhub_link = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "a[href='/home']"))
    )
    # Hacer clic en el enlace "BookHub"
    bookhub_link.click()

    # Verificar que la URL cambió a la página de home
    WebDriverWait(driver, 5).until(
        EC.url_to_be("http://localhost:3000/home")
    )
    assert driver.current_url == "http://localhost:3000/home", "No se redirigió correctamente a Home después de hacer clic en BookHub."

def test_click_home_link():
    driver.get("http://localhost:3000/explorer")  # Navegar a la página de Explorer
    # Esperar a que el enlace "Home" sea clickeable
    home_link = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "a[href='/home']"))
    )
    # Hacer clic en el enlace "Home"
    home_link.click()

    # Verificar que la URL cambió a la página de home
    WebDriverWait(driver, 5).until(
        EC.url_to_be("http://localhost:3000/home")
    )
    assert driver.current_url == "http://localhost:3000/home", "No se redirigió correctamente a Home después de hacer clic en Home."

def test_click_explorer_link():
    driver.get("http://localhost:3000/home")  # Navegar a la página de Home
    # Esperar a que el enlace "Explorer" sea clickeable
    explorer_link = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "a[href='/explorer']"))
    )
    # Hacer clic en el enlace "Explorer"
    explorer_link.click()

    # Verificar que la URL cambió a la página de Explorer
    WebDriverWait(driver, 5).until(
        EC.url_to_be("http://localhost:3000/explorer")
    )
    assert driver.current_url == "http://localhost:3000/explorer", "No se redirigió correctamente a Explorer después de hacer clic en Explorer."

def test_identify_create_post_element():
    driver.get("http://localhost:3000/home")  # Navegar a la página de Home
    create_post_element = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "div.path.cursor-pointer.text-gray-600"))
    )
    assert create_post_element.is_displayed(), "El elemento 'Create Post' no está visible."

def test_click_account_link():
    driver.get("http://localhost:3000/home")  # Navegar a la página de Home
    # Esperar a que el enlace "Account" sea clickeable
    account_link = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "a[href='/account']"))
    )
    # Hacer clic en el enlace "Account"
    account_link.click()

    # Verificar que la URL cambió a la página de Account
    WebDriverWait(driver, 5).until(
        EC.url_to_be("http://localhost:3000/account")
    )
    assert driver.current_url == "http://localhost:3000/account", "No se redirigió correctamente a Account después de hacer clic en Account."
