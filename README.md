﻿![Pylint Score](https://github.com/UB-ES-2024-A4/book-hub/blob/PreProduction/.github/badges/pylint-badge.svg)  ![Tests Passing](https://github.com/UB-ES-2024-A4/book-hub/blob/PreProduction/.github/badges/tests-badge.svg)  ![Coverage Tests](https://github.com/UB-ES-2024-A4/book-hub/blob/PreProduction/.github/badges/coverage-badge.svg)

# Social Network Web App ( Book Hub )

## 2. Tecnologías a Utilizar
- **Frontend**: Next.js
- **Backend**: (A decidir por Backend)
- **Base de Datos**: MySQL (A decidir por Backend)
- **Deployment**: Vercel

Separar el **Frontend** y el **Backend** en el repositorio es una decisión lógica y facilita la organización del proyecto. Al mantener estos componentes en carpetas separadas, cada equipo puede enfocarse en su parte del proyecto sin confundirse con los archivos y configuraciones del otro equipo.

####  Esta es la estructura base que seguiríamos para todo el proyecto. (Está abierto a modificaciones, es sólo para ver cómo está organizado el proyecto)

### Estructura Sugerida del Repositorio

```
/proyecto-social-network
│
├── /frontend                   # Carpeta para el código del Frontend (Next.js)
│   ├── /public                 # Recursos estáticos (imágenes, fuentes)
│   ├── /components             # Componentes reutilizables de React
│   ├── /pages                  # Páginas de Next.js
│   ├── /styles                 # Archivos CSS o Styled Components
│   ├── /hooks                  # Custom Hooks si es necesario
│   ├── .env.local              # Variables de entorno locales (API, etc.)
│   ├── next.config.js          # Configuración específica de Next.js
│   ├── package.json            # Dependencias y scripts de npm o yarn
│   └── README.md               # Documentación específica del Frontend
│
├── /backend
│   ├── /app                # Lógica principal de la aplicación
│   │   ├── /routes         # Definición de las rutas de la API
│   │   ├── /models         # Modelos de la base de datos
│   │   ├── /schemas        # Esquemas de validación (para FastAPI)
│   │   ├── /services       # Lógica de negocio
│   │   └── /tests          # Pruebas unitarias e integración
│   ├── /migrations         # Migraciones de la base de datos (con Alembic o Flask-Migrate)
│   ├── config.py           # Configuraciones del proyecto
│   ├── requirements.txt    # Dependencias del proyecto
│   ├── app.py              # Punto de entrada de la aplicación (Flask/FastAPI)
│   └── README.md           # Documentación específica del backend
│
├── .gitignore                  # Ignorar archivos específicos (node_modules, .env, etc.)
├── README.md                   # Documentación general del proyecto
└── LICENSE                     # Licencia del proyecto (si se aplica)
```

### Descripción de la Estructura

#### 1. **Frontend**
   - **/frontend**: Todo el código relacionado con el frontend de la aplicación.
     - **/public**: Contiene archivos estáticos como imágenes o íconos que no cambian con frecuencia.
     - **/components**: Componentes de React que son reutilizables en distintas páginas.
     - **/pages**: Cada página de la aplicación Next.js. Next.js crea rutas basadas en esta estructura.
     - **/styles**: Archivos CSS o cualquier otro sistema de estilos que estés utilizando.
     - **.env.local**: Aquí puedes colocar las variables de entorno locales (como el endpoint del backend).
     - **next.config.js**: Archivo de configuración de Next.js para personalizar el comportamiento del framework.
     - **package.json**: Listado de dependencias y scripts de npm o yarn, como `npm run dev` para ejecutar el frontend en desarrollo.

#### 2. **Backend**
   - **/backend**: Contiene el código del backend desarrollado en Python (ya sea Flask o FastAPI).
     - **/app**: Esta carpeta puede contener las rutas de la API, controladores, y lógica central del backend.
     - **/models**: Modelos de datos que interactúan con la base de datos MySQL.
     - **/migrations**: Scripts de migración para mantener la base de datos actualizada con los cambios de esquema.
     - **/services**: Lógica de negocio que no está directamente vinculada a las rutas de la API.
     - **/tests**: Pruebas unitarias para las APIs o servicios backend.
     - **config.py**: Archivo donde defines la configuración del backend, como la conexión a la base de datos.
     - **requirements.txt**: Archivo con las dependencias de Python para ser instaladas mediante `pip`.
     - **app.py**: El punto de entrada de la API backend (el archivo que inicia la aplicación).
---

### Uso en el Proyecto

- **Frontend Developers** trabajarán dentro de la carpeta **/frontend**. Todas las tareas y pull requests relacionadas con el frontend se realizarán en esta carpeta.
- **Backend Developers** se enfocarán en **/backend**, donde definirán las APIs, la lógica del servidor y las interacciones con la base de datos.

---


## 3. Repositorios y Ramas
Cada miembro debe trabajar en su propia rama y hacer **Pull Requests** hacia la rama principal (**main**). 
- `main`: Rama principal del proyecto
Para un mejor entendimiento en el nombre de las ramas, se seguirá este formato:
- `frontend/feature-nombre`: Ramas de features para los frontends
- `backend/feature-nombre`: Ramas de features para los backends
- `devops/deploy-vercel`: Rama para el pipeline de despliegue.

Ejemplo: frontend/feature-auth => Rama que verificará la autentificación.

**Nota**: No se debe hacer merge directamente a la rama `main` sin revisión.

###  Guía para Hacer Pull Requests
1. Hacer commit en la rama correspondiente.
2. Asegurarse de que las pruebas funcionen correctamente.
3. Abrir un Pull Request hacia la rama `main`.
4. Esperar revisión antes del merge.

## 4. **Distribución de Tareas según los Roles**
Cada equipo (Frontend, Backend, DevOps) tendrán tareas claras y definidas en el 
README asignado a su carpeta. Es decir, “frontend/README” o “backend/README”.

#### a) **Frontend (3 Frontend Developers)**
Los **Frontend developers** se encargarán de construir la interfaz de usuario en **Next.js**. Algunos ejemplos de tareas que podremos tener al inicio son:

- **UI General (Maquetado)**: Estructura general de la app (Home, Perfil, Dashboard).
- **Autenticación y Registro**: Implementar formularios y validaciones.
- **Interacción Social**: Funcionalidades como "Me gusta", "Comentarios", "Guardar", “Denunciar”.
- **Responsive Design**: Adaptar la web para móviles y tabletas. (Con Tailwind, esto lo podemos ir haciendo mientras desarrollamos la web).


#### b) **Backend (3 Backend Developers)**
Los **Backend developers** trabajarán en la lógica del servidor con “El lenguaje elegido”, las APIs, y la integración con MySQL. Algunas tareas clave:

- **Autenticación**: Implementar el sistema de login/registro (Auth).
- **Gestión de usuarios**: CRUD de usuarios.
- **Publicaciones**: Crear y gestionar publicaciones (crear, editar, borrar).
- **Interacción con la base de datos**: Conectar el backend a MySQL y crear las migraciones necesarias. (Un usuario ejemplo)

Los backends también trabajan en ramas específicas, como `backend/feature-auth`, `backend/feature-posts`.

#### c) **DevOps (1 Developer)**
El **DevOps** developer se encargará de configurar el flujo de despliegue continuo con Vercel.

**Instrucciones**:
- Preparar la integración con **Vercel** para el despliegue automático de las ramas.
- Monitorear el ambiente y optimizar el rendimiento de la app. (Cuando Frontend y Backend modifiquen deberá asegurar que aún se puede hacer un Deployment)

Rama: `devops/deploy-vercel`. (Será único)

