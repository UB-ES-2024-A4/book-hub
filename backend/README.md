# Backend

## Entorno Virtual [Poetry]

### Instalación
Usaremos la última versión de Poetry (1.8.2 a la fecha de este documento). Si no lo tienes instalado, puedes seguir la guía de instalación [aquí](https://python-poetry.org/docs/#installing-with-pipx).

### Instalación de dependencias
Siempre utilizaremos la última versión de las dependencias, a menos que se indique lo contrario. Todas las dependencias están descritas en el archivo `pyproject.toml`. Para instalarlas en el entorno virtual, ejecuta el siguiente comando:

```bash
# Desde el directorio backend/
poetry install
```

### Añadir dependencias
Para agregar una nueva dependencia al proyecto, usa el siguiente comando:

```bash
poetry add <dependencia>
```

Los cambios deberían reflejarse automáticamente en el archivo `pyproject.toml`.

## Levantar el Backend

### Para acceso local
Para iniciar el backend y acceder desde la máquina local:

```bash
poetry run uvicorn app.main:app # --reload (opcional)
```

### Para acceso en red
Para iniciar el backend y hacerlo accesible desde la red:

```bash
poetry run uvicorn app.main:app -h 0.0.0.0 -p <port>
```

## Control de versiones de la base de datos [Alembic]

Usamos Alembic para gestionar el control de versiones de la base de datos. Después de cada *merge*, revisa que las versiones estén correctamente enlazadas en la carpeta `backend/alembic/versions/`. Si detectas algún error, puedes editar manualmente los archivos de versiones y ajustar los IDs para que coincidan. Si eliminas alguna versión, asegúrate también de eliminarla de la base de datos MySQL, donde encontrarás una tabla llamada `alembic_versions`.

Cada cambio en la base de datos debe reflejarse en el historial de Alembic. Para aplicar un cambio, utiliza los siguientes comandos:

```bash
alembic revision -m "<Nombre del cambio>"
alembic upgrade head
```

## Archivo `.env`
El archivo `.env` debe seguir el siguiente formato:

### **Plantilla del archivo `.env`**
```bash
APP_NAME='<Nombre de la APP>'
DATABASE_URL='mysql+pymysql://<username>:<password>@<host>:<port>/<database>'
```

Un ejemplo válido sería:

```bash
APP_NAME='BookHub_API'
DATABASE_URL='mysql+pymysql://MyUsername:MyPassword@localhost:3306/bookhubdb'
```

Por defecto, MySQL corre en el puerto `3306` y el host es la máquina local (`localhost`).

## Estructura de directorios

### API
Aquí se encuentra el código de todos los endpoints. Cada sección de la API se organiza en un archivo distinto (por ejemplo: `users.py`, `books.py`). Los routers y la aplicación de FastAPI también están aquí.

### Models
Este directorio contiene los modelos de la base de datos. Cada archivo representa una tabla de la base de datos.

### Core
Este directorio incluye los archivos de configuración del proyecto. La clase `Settings` se encarga de gestionar parámetros de configuración durante el arranque de la aplicación o durante su ejecución, actuando como un objeto central para gestionar esta información a lo largo de los módulos.
