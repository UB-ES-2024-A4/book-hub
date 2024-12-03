import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from ..integration.test_signin_signup_methods import login
from ..config import driver

# Configuración del controlador de Selenium

driver.get("http://localhost:3000/sign-in")
login(driver, "Victor", "contraseña")
time.sleep(10)


def test_following_button_in_grid():
    # Esperar a que los botones de Follow/Following estén visibles en el grid
    follow_buttons = WebDriverWait(driver, 3).until(
        EC.presence_of_all_elements_located((By.XPATH,
                                             "//div[@class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 p-4']//button[contains(text(), 'Follow') or contains(text(), 'Following')]"))
    )

    # Verificar que cada botón sea 'Following'
    for button in follow_buttons:
        # Comprobar que el texto del botón sea 'Following' para los usuarios seguidos
        assert button.text.strip() == "Following", f"Error: El botón muestra {button.text.strip()} en lugar de 'Following'"

def test_disappear_post_when_unfollow():
    # Esperar a que el texto del usuario esté visible
    user_element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//span[text()='William']"))
    )
    # Encontrar el contenedor principal del usuario
    container = driver.find_element(By.XPATH, "//span[text()='William']/ancestor::div[contains(@class, 'flex items-center')]")
    # Buscar el botón de Following dentro del contenedor
    following_button = container.find_element(By.XPATH, ".//button[contains(text(), 'Following')]")
    following_button.click()
    # Verificar que el botón fue pulsado (por ejemplo, puede cambiar a 'Follow')
    assert following_button.text.strip() == "Follow", "El botón no cambió a 'Follow' después de hacer clic."
    # Recargar la pagina home
    driver.get("http://localhost:3000/home")
    time.sleep(2)

    #comprobar que todos los posts de ese usuario han desaparecido
    user = driver.find_elements(By.XPATH, "//span[text()='William']")
    time.sleep(1)
    assert len(user) == 0, "Los posts del usuario no han desaparecido después de dejar de seguirlo."

