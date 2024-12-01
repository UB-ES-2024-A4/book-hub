import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from ..integration.test_signin_signup_methods import login

def setUp():
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000")
    driver.get("http://localhost:3000/sign-in")
    login(driver, "user_test", "contraseña")
    time.sleep(1)
    driver.get("http://localhost:3000/account")  # Navegar a la página de cuenta
    time.sleep(1)
    return driver

driver = setUp()
def tearDown(driver):
    time.sleep(1)
    driver.quit()

def test_find_edit_profile_button():
    time.sleep(1)
    driver.get("http://localhost:3000/account")
    edit_button = driver.find_element(By.XPATH, "//button[contains(text(),'Edit Profile')]")
    assert edit_button.is_enabled()  # Comprobar que el botón está habilitado
def test_click_edit_profile():
    driver.get("http://localhost:3000/account")
    edit_button = driver.find_element(By.XPATH, "//button[contains(text(),'Edit Profile')]")
    edit_button.click()
    time.sleep(1)
    # Verificar que los campos de edición están visibles
    assert driver.find_element(By.NAME, "first_name").is_displayed()
    assert driver.find_element(By.NAME, "last_name").is_displayed()
    assert driver.find_element(By.NAME, "username").is_displayed()
    assert driver.find_element(By.NAME, "biography").is_displayed()

def test_fill_and_save_changes():
    driver.get("http://localhost:3000/account")
    edit_button = driver.find_element(By.XPATH, "//button[contains(text(),'Edit Profile')]")
    edit_button.click()
    time.sleep(1)

    # Rellenar los campos
    first_name_input = driver.find_element(By.NAME, "first_name")
    last_name_input = driver.find_element(By.NAME, "last_name")
    username_input = driver.find_element(By.NAME, "username")
    bio_input = driver.find_element(By.NAME, "biography")

    first_name_input.clear()
    first_name_input.send_keys("New First Name")

    last_name_input.clear()
    last_name_input.send_keys("New Last Name")

    username_input.clear()
    username_input.send_keys("new_username")

    bio_input.clear()
    bio_input.send_keys("This is my updated bio.")

    # Hacer clic en Save Changes
    save_button = driver.find_element(By.XPATH, "//button[contains(text(),'Save Changes')]")
    save_button.click()
    time.sleep(1)

    # Verificar que los cambios se guardaron correctamente
    assert first_name_input.get_attribute("value") == "New First Name"
    assert last_name_input.get_attribute("value") == "New Last Name"
    assert username_input.get_attribute("value") == "new_username"
    assert bio_input.get_attribute("value") == "This is my updated bio."

def test_cancel_edit_profile():
    driver.get("http://localhost:3000/account")
    edit_button = driver.find_element(By.XPATH, "//button[contains(text(),'Edit Profile')]")
    edit_button.click()
    time.sleep(1)

    # Rellenar algunos campos
    first_name_input = driver.find_element(By.NAME, "first_name")
    first_name_input.clear()
    first_name_input.send_keys("Temporary First Name")

    # Hacer clic en Cancel
    cancel_button = driver.find_element(By.XPATH, "//button[contains(text(),'Cancel')]")
    cancel_button.click()
    time.sleep(1)

    # Verificar que no se han guardado los cambios
    first_name_input = driver.find_element(By.NAME, "first_name")
    assert first_name_input.get_attribute("value") != "Temporary First Name"

def test_find_Change_profile_picture_button():
    driver.get("http://localhost:3000/account")
    change_picture_button = driver.find_element(By.XPATH, "//button[contains(text(),'Change Profile Picture')]")
    assert change_picture_button.is_enabled()  # Comprobar que el botón está habilitado

def test_click_change_profile_picture():
    driver.get("http://localhost:3000/account")
    change_picture_button = driver.find_element(By.XPATH, "//button[contains(text(),'Change Profile Picture')]")
    change_picture_button.click()
    time.sleep(1)
    # Verificar que el modal de cambio de imagen está visible
    assert driver.find_element(By.XPATH, "//h2[contains(text(),'Change Profile Picture')").is_displayed()
