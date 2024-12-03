import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from ..config import driver

driver.get("http://localhost:3000")

def test_identify_go_to_sign_in_page():
    driver.get("http://localhost:3000/home")  # Navegar a la página de inicio
    # Esperar a que el enlace de "account" esté presente
    account_link = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "a[href='/account']"))
    )
    # Verificar que el enlace está visible (sin hacer clic)
    assert account_link.is_displayed(), "El enlace de cuenta no está visible."

def test_identify_go_to_sign_up_page():
    driver.get("http://localhost:3000/home")  # Navegar a la página de inicio
    # Esperar a que el enlace de "sign-up" esté presente
    sign_up_link = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "a[href='/sign-up']"))
    )
    # Verificar que el enlace está visible (sin hacer clic)
    assert sign_up_link.is_displayed(), "El enlace de registro no está visible."

def test_click_go_to_sign_in_page():
    driver.get("http://localhost:3000/home")  # Navegar a la página de inicio
    # Esperar a que el enlace de "account" esté clickeable
    account_link = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "a[href='/account']"))
    )
    # Hacer clic en el enlace
    account_link.click()

    # Verificar que la URL cambió a la página de inicio de sesión
    WebDriverWait(driver, 5).until(
        EC.url_to_be("http://localhost:3000/sign-in")
    )
    assert driver.current_url == "http://localhost:3000/sign-in", "No se redirigió a la página de inicio de sesión."

def test_click_go_to_sign_up_page():
    driver.get("http://localhost:3000/home")  # Navegar a la página de inicio
    # Esperar a que el enlace de "sign-up" esté clickeable
    sign_up_link = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "a[href='/sign-up']"))
    )
    # Hacer clic en el enlace
    sign_up_link.click()

    # Verificar que la URL cambió a la página de registro
    WebDriverWait(driver, 5).until(
        EC.url_to_be("http://localhost:3000/sign-up")
    )
    assert driver.current_url == "http://localhost:3000/sign-up", "No se redirigió a la página de registro."
