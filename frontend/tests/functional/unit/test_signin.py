import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from ..config import driver

time.sleep(1)

# Test para identificar el botón de inicio de sesión (sin hacer clic)
def test_identify_sign_in_button():
    driver.get("http://localhost:3000/sign-in")  # Navegar a la página de inicio de sesión
    # Esperar a que el botón de inicio de sesión esté presente
    sign_in_button = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "button[type='submit']"))
    )
    # Verificar que el botón de inicio de sesión está presente (sin hacer clic)
    assert sign_in_button.is_displayed(), "El botón de inicio de sesión no está visible."

def test_type_username_in_sign_in():
    driver.get("http://localhost:3000/sign-in")  # Navegar a la página de inicio de sesión
    # Esperar a que el campo de usuario esté presente y visible
    username_input = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.ID, "user"))
    )
    # Limpiar el campo y escribir el nombre de usuario
    username_input.clear()
    username_input.send_keys("user_test")

    # Verificar que el campo de nombre de usuario contiene el valor correcto
    assert username_input.get_attribute("value") == "user_test", "El valor en el campo de usuario no es correcto."

def test_type_password_in_sign_in():
    driver.get("http://localhost:3000/sign-in")  # Navegar a la página de inicio de sesión
    # Esperar a que el campo de contraseña esté presente y visible
    password_input = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.ID, "password"))
    )
    # Limpiar el campo y escribir la contraseña
    password_input.clear()
    password_input.send_keys("password123")

    # Verificar que el campo de contraseña contiene el valor correcto
    assert password_input.get_attribute("value") == "password123", "El valor en el campo de contraseña no es correcto."

