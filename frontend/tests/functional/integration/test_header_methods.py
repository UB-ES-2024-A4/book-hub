import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def go_to_create_post(driver):
    create_post_element = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'path') and contains(@class, 'cursor-pointer') and text()='Create Post']"))
    )

    create_post_element.click()
    time.sleep(1)