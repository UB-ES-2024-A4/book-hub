"""
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from ..integration.test_signin_signup_methods import login
from frontend.tests.functional.config import driver

# Configuración del controlador de Selenium

driver.get("http://localhost:3000/sign-in")
login(driver, "user_test", "contraseña")
time.sleep(1)

def test_identify_following_button():
    # Esperar a que el texto del usuario esté visible
    user_element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//span[text()='William']"))
    )
    # Encontrar el contenedor principal del usuario
    container = driver.find_element(By.XPATH, "//span[text()='William']/ancestor::div[contains(@class, 'flex items-center')]")
    # Buscar el botón de Following dentro del contenedor
    following_button = container.find_element(By.XPATH, ".//button[contains(text(), 'Following')]")
    assert following_button.is_displayed(), "El botón 'Following' no está visible."

def test_click_following_button():
    # Esperar a que el texto del usuario esté visible
    user_element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//span[text()='William']"))
    )
    # Encontrar el contenedor principal del usuario
    container = driver.find_element(By.XPATH, "//span[text()='William']/ancestor::div[contains(@class, 'flex items-center')]")
    # Buscar el botón de Following dentro del contenedor
    following_button = container.find_element(By.XPATH, ".//button[contains(text(), 'Following')]")
    following_button.click()

    # Verificar que el botón fue pulsado (por ejemplo, puede cambiar a 'Follow')
    assert following_button.text.strip() == "Follow", "El botón no cambió a 'Follow' después de hacer clic."
"""

'''def test_identify_follow_button():
    # Esperar a que el texto del usuario esté visible
    user_element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//span[text()='William']"))
    )
    # Encontrar el contenedor principal del usuario
    container = driver.find_element(By.XPATH, "//span[text()='William']/ancestor::div[contains(@class, 'flex items-center')]")
    # Buscar el botón de Follow dentro del contenedor
    follow_button = container.find_element(By.XPATH, ".//button[contains(text(), 'Follow')]")
    assert follow_button.is_displayed(), "El botón 'Follow' no está visible."

def test_click_follow_button():
    # Esperar a que el texto del usuario esté visible
    user_element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//span[text()='William']"))
    )
    # Encontrar el contenedor principal del usuario
    container = driver.find_element(By.XPATH, "//span[text()='William']/ancestor::div[contains(@class, 'flex items-center')]")
    # Buscar el botón de Follow dentro del contenedor
    follow_button = container.find_element(By.XPATH, ".//button[contains(text(), 'Follow')]")
    follow_button.click()
    # Verificar que el botón fue pulsado (por ejemplo, puede cambiar a 'Following')
    assert follow_button.text.strip() == "Following", "El botón no cambió a 'Following' después de hacer clic."'''
