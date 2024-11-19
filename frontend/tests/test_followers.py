from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

from test_followers_methods import go_to_sign_in_page, go_to_sign_up_page, sign_up, login, follow_user, unfollow_user

driver = webdriver.Chrome()
driver.get("http://localhost:3000")
go_to_sign_in_page(driver)
login(driver, "Victor", "contraseña")

def test_follow_user():
    follow_button = follow_user(driver)

    # Comprobar que el texto del botón ahora sea "Following"
    assert follow_button.text.strip() == "Following", "El botón no cambió a 'Following'."

def test_unfollow_user():
    unfollow_button = unfollow_user(driver)

    # Comprobar que el texto del botón ahora sea "Follow"
    assert unfollow_button.text.strip() == "Follow", "El botón no cambió a 'Follow'."