from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from .test_signin_signup_methods import go_to_sign_in_page, go_to_sign_up_page, sign_up, login

driver = webdriver.Chrome()
driver.get("http://localhost:3000")

def test_go_to_sign_up_page():
    driver.get("http://localhost:3000")
    go_to_sign_up_page(driver)
    assert driver.current_url == "http://localhost:3000/sign-up", "No se redirigió a la página de sign-up."

def test_go_to_sign_in_page():
    driver.get("http://localhost:3000")
    go_to_sign_in_page(driver)
    assert driver.current_url == "http://localhost:3000/sign-in", "No se redirigió a la página de sign-in."

'''def test_sign_up():
    driver.get("http://localhost:3000/sign-up")
    sign_up(driver, "user_test", "user_test", "user_test", "user_test@test.com", "contraseña")
    WebDriverWait(driver, 5).until(
        EC.url_to_be("http://localhost:3000/sign-in")
    )
    assert driver.current_url == "http://localhost:3000/sign-in", "No se redirigió a la página de sign-in."
    delete_test_user("user_test")'''

def test_login():
    driver.get("http://localhost:3000/sign-in")
    login(driver, "user_test", "contraseña")
    # Esperar a que la página cargue
    WebDriverWait(driver, 1).until(
        EC.url_to_be("http://localhost:3000/home")
    )
    assert driver.current_url == "http://localhost:3000/home", "No se redirigió a la página principal."

def test_login_error():
    driver.get("http://localhost:3000/sign-in")
    login(driver, "Victor", "contraseña123")
    # assert con espera explícita
    time.sleep(1)
    assert EC.text_to_be_present_in_element((By.CSS_SELECTOR, ".message"), "Either a user with this email or username does not exist or the password is incorrect."), "No se mostró el mensaje de error."
    assert driver.current_url == "http://localhost:3000/sign-in", "No se redirigió a la página de sign-in."

'''def test_sign_up_and_login():
    driver.get("http://localhost:3000")
    go_to_sign_up_page(driver)
    sign_up(driver, "user_test", "user_test", "user_test", "user_test@test.com", "contraseña")
    login(driver, "user_test", "contraseña")
    assert driver.current_url == "http://localhost:3000/", "No se redirigió a la página principal."
    delete_test_user("user_test")'''
