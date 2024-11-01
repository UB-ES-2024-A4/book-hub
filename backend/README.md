# Backend

## Entorno Virtual [Poetry]
Esta sección guía al usuario a través de la instalación de MySQL, la creación de la base de datos `bookhubdb` y la configuración del archivo `.env`.
### Configuración de MySQL en Windows

#### Instalación de MySQL

1. **Descargar MySQL Installer**:
   Ve al [sitio oficial de MySQL](https://dev.mysql.com/downloads/installer/) y descarga el MySQL Installer para Windows.

2. **Ejecutar el Instalador**:
   Abre el instalador y selecciona la opción "Custom" para tener control sobre los componentes que deseas instalar.

3. **Seleccionar Componentes**:
   En la lista de productos, selecciona los siguientes componentes:
   - **MySQL Server**: Este es el servidor de base de datos.
   - **MySQL Workbench**: Una herramienta GUI para gestionar la base de datos.
   - **MySQL Shell**: Una herramienta de línea de comandos para interactuar con MySQL.
   - **MySQL Connector/Python o Router**: El conector para Python, si no lo tienes ya instalado.

4. **Configurar MySQL Server**:
   Durante la instalación, se te pedirá que configures el servidor MySQL:
   - **Tipo de Configuración**: Elige "Development Machine/Computer" para un entorno de desarrollo.
   - **Puerto**: 3306
   - **Autenticación**: Poner el usuario y contraseña de tu elección.
5. **Finalizar la Instalación**
### Creación de la Base de Datos

1. **Conectar a MySQL**:
   Abre una terminal y conecta a tu servidor MySQL usando el usuario root:
   ```bash
   mysql -u root -p
   ```
   o
   ```bash
      mysqlsh -u root -p
   ```
2. **Cambiar a SQL CODE**:
   ```bash
   \sql
   ```   

3. **Crear la Base de Datos**:
   Una vez conectado, crea la base de datos `bookhubdb`:
   ```sql
   CREATE DATABASE bookhubdb;
   ```

4. **Verificar la Base de Datos**:
   Asegúrate de que la base de datos ha sido creada listando todas las bases de datos:
   ```sql
   SHOW DATABASES;
   ```
Así se vería la terminal si siguen los pasos:

<img src="./mysql-u-root-p.png" alt="Creación de la base de datos" width="600"/>

## Init DB
Se ha creado una archivo en la ruta `backend/init_testing_database.sql` para facilitar llenar la base de datos con algunos datos basicos para hacer algunas pruebas.

Podeis tanto copiar las lineas que querais y pegarlas en la consola mysql, o si quereis introducir todo el archivo podeis hacerlo de las siguientes formas

**Desde la consola mysql**
```sql
source <ruta-archivo>
```

**Desde el terminal**
```bash
mysql -u <user> -p <database-name> < <ruta-archivo>
```

**Recordad hacer alembic upgrade head. Si da error, eliminad la base de datos y volvedla a crear**

## Modelo ER
**Esta incompleto, pronto se corregirá**
![Modelo ER](db_ER_model.png)


### Configuración del Archivo `.env`

Tienes que crear un archivo `.env` fuera de las carpetas backend o frontend. Debe estar correctamente 
configurado con los detalles de conexión a la base de datos. Un ejemplo válido sería:

Aquí usarás el nombre de usuario y contraseña que configuraste durante la instalación de MySQL y el puerto por defecto (3306).
```bash
APP_NAME='BookHub_API'
DB_HOST=localhost
DB_PORT=3306
DB_USER=YourUser
DB_PASSWORD=YourPassword
DB_NAME=bookhubdb
```

### Instalación de Poetry
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
