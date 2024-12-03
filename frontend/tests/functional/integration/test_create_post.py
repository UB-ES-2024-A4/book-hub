
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from ..integration.test_signin_signup_methods import login
#from ..integration.test_header_methods import go_to_create_post
from ..config import driver

driver.get("http://localhost:3000")
driver.get("http://localhost:3000/sign-in")
login(driver, "user_test", "contraseña")
time.sleep(1)

"""
def setup():
    driver.get("http://localhost:3000/home")
    go_to_create_post(driver)
setup()
def test_createPost():
    setup()
    book_title_input = driver.find_element(By.NAME, "title")
    book_title_input.send_keys("Test Book Title")

    author_input = driver.find_element(By.NAME, "author")
    author_input.send_keys("Test Author")

    description_input = driver.find_element(By.ID, "description")
    description_input.send_keys("This is a test description for the book.")

    post_description_input = driver.find_element(By.ID, "post_description")
    post_description_input.send_keys("These are my optional thoughts.")

    image_button = driver.find_element(By.XPATH, "//button[contains(text(),'Choose Image')]")
    image_button.click()

    create_post_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
    create_post_button.click()

"""