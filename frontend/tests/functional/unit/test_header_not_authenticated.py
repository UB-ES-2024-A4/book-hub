import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from ..config import driver

driver.get("http://localhost:3000")

def test_click_bookhub_button():
    driver.get("http://localhost:3000/home")  # Navegar a la página de inicio
    # Esperar a que el enlace "BookHub" sea clickeable
    bookhub_link = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "a[href='/home']"))
    )
    # Hacer clic en el enlace "BookHub"
    bookhub_link.click()

    # Verificar que la URL cambió a la página de explorer (aunque ya estemos en ella, es para confirmar que se hizo clic)
    WebDriverWait(driver, 5).until(
        EC.url_to_be("http://localhost:3000/explorer")
    )
    assert driver.current_url == "http://localhost:3000/explorer", "No se redirigió correctamente al Explorer después de hacer clic en BookHub."

def test_click_explorer_button():
    driver.get("http://localhost:3000/home")  # Navegar a la página de inicio
    # Esperar a que el botón de "Explorer" esté clickeable
    explorer_button = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "a[href='/explorer']"))
    )
    # Hacer clic en el botón de "Explorer"
    explorer_button.click()

    # Verificar que la URL cambió a la página del explorador
    WebDriverWait(driver, 5).until(
        EC.url_to_be("http://localhost:3000/explorer")
    )
    assert driver.current_url == "http://localhost:3000/explorer", "No se redirigió correctamente al Explorer después de hacer clic en Explorer."

def test_click_account_button():
    driver.get("http://localhost:3000/home")  # Navegar a la página de inicio
    # Esperar a que el enlace de "Account" sea clickeable
    account_button = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "a[href='/account']"))
    )
    # Hacer clic en el enlace de "Account"
    account_button.click()

    # Verificar que la URL cambió a la página de inicio de sesión
    WebDriverWait(driver, 5).until(
        EC.url_to_be("http://localhost:3000/sign-in")
    )
    assert driver.current_url == "http://localhost:3000/sign-in", "No se redirigió correctamente a la página de inicio de sesión después de hacer clic en Account."
