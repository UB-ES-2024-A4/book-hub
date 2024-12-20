"""
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

from .test_followers_methods import follow_user, unfollow_user
from .test_signin_signup_methods import go_to_sign_in_page, go_to_sign_up_page, sign_up, login
from ..config import driver

driver.get("http://localhost:3000/sign-in")
login(driver, "Victor", "contraseña")

def test_follow_user():
    follow_button = follow_user(driver)

    # Comprobar que el texto del botón ahora sea "Following"
    assert follow_button.text.strip() == "Following", "El botón no cambió a 'Following'."

def test_unfollow_user():
    unfollow_button = unfollow_user(driver)

    # Comprobar que el texto del botón ahora sea "Follow"
    assert unfollow_button.text.strip() == "Follow", "El botón no cambió a 'Follow'."

def test_follow_and_unfollow_user():
    follow_button = follow_user(driver)
    # Comprobar que el texto del botón ahora sea "Following"
    assert follow_button.text.strip() == "Following", "El botón no cambió a 'Following'."

    unfollow_button = unfollow_user(driver)
    # Comprobar que el texto del botón ahora sea "Follow"
    assert unfollow_button.text.strip() == "Follow", "El botón no cambió a 'Follow'."
"""