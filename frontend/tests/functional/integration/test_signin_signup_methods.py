import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
def login(driver, username, password):
    # Esperar a que el campo de usuario esté presente y visible
    user_input = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.ID, "user"))
    )

    # Limpiar el campo y escribir "USER_TEST"
    user_input.clear()
    user_input.send_keys(username)

    # Esperar a que el campo de usuario esté presente y visible
    user_input = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.ID, "password"))
    )

    # Limpiar el campo y escribir "contraseña"
    user_input.clear()
    user_input.send_keys(password)

    # Esperar a que el botón esté presente y sea clickeable
    sign_in_button = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))
    )
    # Hacer clic en el botón
    sign_in_button.click()