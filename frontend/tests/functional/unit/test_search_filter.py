from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from test_followers_methods import login

# Inicializa el navegador
driver = webdriver.Chrome()

# Navega a la página de inicio de sesión e inicia sesión
driver.get("http://localhost:3000/sign-in")
login(driver, "Victor", "contraseña")
time.sleep(2)

def test_click_buttons():
    """
    Verifica que todos los botones con las etiquetas especificadas estén presentes en la página.
    """
    driver.get("http://localhost:3000/home")
    time.sleep(2)
    # Lista de etiquetas de botones que se van a buscar
    button_labels = ["Drama", "Comedia", "Terror", "Fantasía",
                     "Aventura", "Distopía", "Ciencia Ficción", "Romance", "Police"]

    # Verifica que cada botón exista
    for label in button_labels:
        button = WebDriverWait(driver, 3).until(
            EC.presence_of_element_located((By.XPATH, f"//div[text()='{label}']"))
        )
        assert button is not None, f"El botón con texto '{label}' no fue encontrado."

def test_check_post_tags_match_selected_buttons():
    """
    Verifica que las etiquetas visibles en los posts coincidan con los botones seleccionados.
    """
    # Timeout en segundos
    timeout_seconds = 10

    # Encuentra los botones pulsados y extrae sus etiquetas
    selected_buttons = WebDriverWait(driver, timeout_seconds).until(
        EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@class, 'hover:bg-blue-400') and contains(@class, 'bg-gray-600')]"))
    )
    selected_labels = [button.text for button in selected_buttons]

    # Encuentra todas las etiquetas visibles en los posts
    post_tags = WebDriverWait(driver, timeout_seconds).until(
        EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@class, 'flex flex-wrap')]/div"))
    )
    post_labels = [tag.text for tag in post_tags]

    # Verifica que todas las etiquetas de los posts estén en los botones seleccionados
    for label in post_labels:
        assert label in selected_labels, f"Etiqueta '{label}' en el post no corresponde a ningún botón pulsado."

