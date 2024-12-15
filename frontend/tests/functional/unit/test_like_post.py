import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from ..integration.test_signin_signup_methods import login

# Configuración del controlador de Selenium
driver = webdriver.Chrome()

driver.get("http://localhost:3000/sign-in")
login(driver, "user_test", "contraseña")
time.sleep(2)

def test_like_button_exists_and_displays_count():
    # Esperar a que los posts estén visibles
    like_buttons = WebDriverWait(driver, 3).until(
        EC.presence_of_all_elements_located((By.XPATH, "//div[@class='flex gap-4']//button[1]"))
    )
    for like_button in like_buttons:
        # Verificar que el botón es visible
        assert like_button.is_displayed(), "The like button is not visible."
        # Verificar que el botón contiene un número de likes
        like_count = like_button.text.strip()
        print(like_count)
        assert like_count.isdigit(), f"The like count is not a number: {like_count}"

def test_like_button_increases_count():
    # Localizar el boton de like
    like_button = WebDriverWait(driver, 3).until(
        EC.presence_of_element_located((By.XPATH, "//div[@class='flex gap-4']//button[1]"))
    )
    # Obtener el número de likes antes de hacer clic
    initial_likes = int(like_button.text.strip())
    # Hacer clic en el botón de like
    like_button.click()
    time.sleep(1)  # Esperar que el contador se actualice
    # Obtener el número de likes después de hacer clic
    updated_likes = int(like_button.text.strip())
    assert updated_likes == initial_likes + 1, f"Expected {initial_likes + 1} likes but got {updated_likes}."

def test_likes_persist_after_reload():
    # Localizar el boton de like
    like_button = WebDriverWait(driver, 3).until(
        EC.presence_of_element_located((By.XPATH, "//div[@class='flex gap-4']//button[1]"))
    )
    # Obtener el número de likes antes de recargar
    initial_likes = int(like_button.text.strip())
    # Recargar la página
    driver.get("http://localhost:3000/home")
    time.sleep(3)  # Esperar a que la página se recargue
    # Localizar de nuevo el boton de like
    like_button = WebDriverWait(driver, 3).until(
        EC.presence_of_element_located((By.XPATH, "//div[@class='flex gap-4']//button[1]"))
    )
    # Verificar que el número de likes sigue siendo el mismo
    assert int(like_button.text.strip()) == initial_likes, "The like count did not persist after reloading."

def test_unlike_button_decreases_count():
    # Localizar el boton de like
    like_button = WebDriverWait(driver, 3).until(
        EC.presence_of_element_located((By.XPATH, "//div[@class='flex gap-4']//button[1]"))
    )
    # Obtener el número de likes antes de hacer clic
    initial_likes = int(like_button.text.strip())
    # Hacer clic en el botón de unlike
    like_button.click()
    time.sleep(1)  # Esperar que el contador se actualice
    # Obtener el número de likes después de hacer clic
    updated_likes = int(like_button.text.strip())
    assert updated_likes == initial_likes - 1, f"Expected {initial_likes - 1} likes but got {updated_likes}."

def test_unlikes_persist_after_reload():
    # Localizar el boton de like
    like_button = WebDriverWait(driver, 3).until(
        EC.presence_of_element_located((By.XPATH, "//div[@class='flex gap-4']//button[1]"))
    )
    # Obtener el número de likes antes de recargar
    initial_likes = int(like_button.text.strip())
    # Recargar la página
    driver.get("http://localhost:3000/home")
    time.sleep(3)  # Esperar a que la página se recargue
    # Localizar de nuevo el boton de like
    like_button = WebDriverWait(driver, 3).until(
        EC.presence_of_element_located((By.XPATH, "//div[@class='flex gap-4']//button[1]"))
    )
    # Verificar que el número de likes sigue siendo el mismo
    assert int(like_button.text.strip()) == initial_likes, "The unlike count did not persist after reloading."
    time.sleep(5)
    driver.quit()