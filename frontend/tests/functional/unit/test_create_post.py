from selenium.webdriver.common.by import By
from ..integration.test_header_methods import go_to_create_post
from frontend.tests.functional.config import driver


def setup():
    driver.get("http://localhost:3000/home")
    go_to_create_post(driver)
setup()
def test_fill_book_title():
    setup()
    book_title_input = driver.find_element(By.NAME, "title")
    book_title_input.send_keys("Test Book Title")
    assert book_title_input.get_attribute("value") == "Test Book Title"

def test_fill_author():
    setup()
    author_input = driver.find_element(By.NAME, "author")
    author_input.send_keys("Test Author")
    assert author_input.get_attribute("value") == "Test Author"

def test_fill_description():
    setup()
    description_input = driver.find_element(By.ID, "description")
    description_input.send_keys("This is a test description for the book.")
    assert description_input.get_attribute("value") == "This is a test description for the book."

def test_fill_post_description():
    setup()
    post_description_input = driver.find_element(By.ID, "post_description")
    post_description_input.send_keys("These are my optional thoughts.")
    assert post_description_input.get_attribute("value") == "These are my optional thoughts."

def test_find_image_button():
    setup()
    image_button = driver.find_element(By.XPATH, "//button[contains(text(),'Choose Image')]")
    assert image_button.is_enabled()  # Comprobar que el botón está habilitado
    image_button.click()
def test_click_create_post_button():
    setup()
    create_post_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
    assert create_post_button.is_enabled()  # Comprobar que el botón está habilitado
    create_post_button.click()