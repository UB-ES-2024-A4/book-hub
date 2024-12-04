import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from ..config import driver

time.sleep(2)

def test_type_username_field():
    driver.get("http://localhost:3000/sign-up")  # Navegar a la página de registro
    # Esperar a que el campo de nombre de usuario esté presente y visible
    username_input = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.NAME, "username"))
    )
    # Limpiar el campo y escribir un nombre de usuario
    username_input.clear()
    username_input.send_keys("user_test")

    # Verificar que el campo de nombre de usuario contiene el valor correcto
    assert username_input.get_attribute("value") == "user_test", "El valor en el campo de nombre de usuario no es correcto."

def test_type_first_name_field():
    driver.get("http://localhost:3000/sign-up")  # Navegar a la página de registro
    # Esperar a que el campo de primer nombre esté presente y visible
    first_name_input = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.NAME, "first_name"))
    )
    # Limpiar el campo y escribir un primer nombre
    first_name_input.clear()
    first_name_input.send_keys("John")

    # Verificar que el campo de primer nombre contiene el valor correcto
    assert first_name_input.get_attribute("value") == "John", "El valor en el campo de primer nombre no es correcto."

def test_type_last_name_field():
    driver.get("http://localhost:3000/sign-up")  # Navegar a la página de registro
    # Esperar a que el campo de apellido esté presente y visible
    last_name_input = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.NAME, "last_name"))
    )
    # Limpiar el campo y escribir un apellido
    last_name_input.clear()
    last_name_input.send_keys("Doe")

    # Verificar que el campo de apellido contiene el valor correcto
    assert last_name_input.get_attribute("value") == "Doe", "El valor en el campo de apellido no es correcto."

def test_type_email_field():
    driver.get("http://localhost:3000/sign-up")  # Navegar a la página de registro
    # Esperar a que el campo de correo electrónico esté presente y visible
    email_input = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.NAME, "email"))
    )
    # Limpiar el campo y escribir un correo electrónico
    email_input.clear()
    email_input.send_keys("user_test@test.com")

    # Verificar que el campo de correo electrónico contiene el valor correcto
    assert email_input.get_attribute("value") == "user_test@test.com", "El valor en el campo de correo electrónico no es correcto."

def test_type_password_field():
    driver.get("http://localhost:3000/sign-up")  # Navegar a la página de registro
    # Esperar a que el campo de contraseña esté presente y visible
    password_input = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.NAME, "password"))
    )
    # Limpiar el campo y escribir una contraseña
    password_input.clear()
    password_input.send_keys("password123")

    # Verificar que el campo de contraseña contiene el valor correcto
    assert password_input.get_attribute("value") == "password123", "El valor en el campo de contraseña no es correcto."

# Test para identificar el botón de registro (sin hacer clic)
def test_identify_sign_up_button():
    driver.get("http://localhost:3000/sign-up")  # Navegar a la página de registro
    # Esperar a que el botón de registro esté presente
    sign_up_button = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "button[type='submit']"))
    )
    # Verificar que el botón de registro está presente (sin hacer clic)
    assert sign_up_button.is_displayed(), "El botón de registro no está visible."