from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


def go_to_sign_in_page(driver):
    # Esperamos a que cargue la página y hacemos click en el botón account
    account_link = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "a[href='/account']"))
    )
    account_link.click()

    WebDriverWait(driver, 5).until(
        EC.url_to_be("http://localhost:3000/auth/sign-in")
    )


def go_to_sign_up_page(driver):
    # Esperamos a que cargue la página y hacemos click en el botón sign-up
    sign_up_link = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "a[href='/auth/sign-up']"))
    )
    sign_up_link.click()

    WebDriverWait(driver, 5).until(
        EC.url_to_be("http://localhost:3000/auth/sign-up")
    )

def sign_up(driver, username, first_name, last_name, email, password):
    # Esperar a que el campo de nombre de usuario esté presente y visible
    username_input = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.NAME, "username"))
    )
    # Limpiar el campo y escribir el nombre de usuario
    username_input.clear()
    username_input.send_keys(username)

    # Esperar a que el campo de nombre esté presente y visible
    first_name_input = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.NAME, "first_name"))
    )
    # Limpiar el campo y escribir el primer nombre
    first_name_input.clear()
    first_name_input.send_keys(first_name)

    # Esperar a que el campo de apellido esté presente y visible
    last_name_input = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.NAME, "last_name"))
    )
    # Limpiar el campo y escribir el apellido
    last_name_input.clear()
    last_name_input.send_keys(last_name)

    # Esperar a que el campo de email esté presente y visible
    email_input = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.NAME, "email"))
    )
    # Limpiar el campo y escribir el email
    email_input.clear()
    email_input.send_keys(email)

    # Esperar a que el campo de contraseña esté presente y visible
    password_input = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.NAME, "password"))
    )
    # Limpiar el campo y escribir la contraseña
    password_input.clear()
    password_input.send_keys(password)

    # Esperar a que el botón de registro esté presente y sea clickeable
    sign_up_button = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))
    )
    # Hacer clic en el botón de registro
    sign_up_button.click()