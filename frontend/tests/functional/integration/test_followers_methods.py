from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def follow_user(driver):
    # Esperar a que el texto del usuario "William" esté visible
    user_element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//span[text()='William']"))
    )

    # Encontrar el contenedor principal que incluye el usuario y el botón
    container = driver.find_element(By.XPATH, "//span[text()='William']/ancestor::div[contains(@class, 'flex items-center')]")

    # Dentro del contenedor, encontrar el botón "Follow"
    follow_button = container.find_element(By.XPATH, ".//button[contains(text(), 'Follow')]")

    # Verificar si el texto del botón es "Follow"
    if follow_button.text.strip() == "Follow":
        print("El botón dice 'Follow'. Haciendo clic...")
        follow_button.click()
    else:
        print(f"El botón ya está en estado '{follow_button.text.strip()}'. No se hace clic.")

    return follow_button

def unfollow_user(driver):
    # Esperar a que el texto del usuario "William" esté visible
    user_element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//span[text()='William']"))
    )

    # Encontrar el contenedor principal que incluye el usuario y el botón
    container = driver.find_element(By.XPATH, "//span[text()='William']/ancestor::div[contains(@class, 'flex items-center')]")

    # Dentro del contenedor, encontrar el botón "Following"
    follow_button = container.find_element(By.XPATH, ".//button[contains(text(), 'Following')]")

    # Verificar si el texto del botón es "Following"
    if follow_button.text.strip() == "Following":
        print("El botón dice 'Following'. Haciendo clic...")
        follow_button.click()
    else:
        print(f"El botón ya está en estado '{follow_button.text.strip()}'. No se hace clic.")

    return follow_button
