"""
import time
from .test_signin_signup_methods import login
from .test_header_methods import go_to_create_post
from ..config import driver

driver.get("http://localhost:3000")

driver.get("http://localhost:3000/sign-in")
login(driver, "user_test", "contraseña")
time.sleep(1)

def test_identify_create_post_element():
    driver.get("http://localhost:3000/home")  # Navegar a la página de Home
    go_to_create_post(driver)
"""