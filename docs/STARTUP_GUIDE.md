# Guía de Inicio Rápido - RedditClon

Este documento explica cómo levantar el proyecto RedditClon paso a paso, incluyendo Docker, backend y frontend, en el orden correcto.

## Prerrequisitos
- **Docker**: Asegúrate de tener Docker instalado y corriendo.
- **Java 17+ y Maven**: Para el backend (instala desde el sitio oficial si es necesario).
- **Node.js (v18+)**: Para el frontend (instala desde el sitio oficial o usa nvm).
- **Git**: Para clonar o navegar el repositorio.

## Pasos para Levantar el Proyecto

### 1. Levantar Docker (Base de Datos)
Docker se encarga de la base de datos PostgreSQL. Esto debe hacerse primero para que el backend pueda conectarse.

- Abre una terminal en la raíz del proyecto (`c:\Users\marcl\OneDrive\Escritorio\Proyectos\RedditClon`).
- Ejecuta el siguiente comando:
  ```
  docker-compose up -d
  ```
  - Esto inicia el contenedor de la base de datos en segundo plano.
  - Espera a que esté listo (puede tomar unos minutos la primera vez). Puedes verificar con:
    ```
    docker-compose ps
    ```
    O esperar a que aparezca "healthy" en el estado.

- **Qué sucede**: Se crea una base de datos PostgreSQL llamada `redditclon` con usuario `postgres` y contraseña `postgres`. El backend se conectará automáticamente a ella.

### 2. Levantar el Backend
Una vez que la DB esté corriendo, levanta el backend en Java.

- Navega al directorio del backend:
  ```
  cd RedditClon-Backend
  ```
- Ejecuta el siguiente comando para compilar y correr la aplicación:
  ```
  mvn spring-boot:run
  ```
  - Esto compila el proyecto con Maven y lo inicia en `http://localhost:8080`.
  - Espera a que aparezcan logs indicando que el servidor está corriendo (busca "Started RedditClonBackendApplication").

- **Qué sucede**: El backend (Spring Boot) se conecta a la DB de Docker, crea tablas automáticamente y carga usuarios de prueba (usuario: `user` / contraseña: `password`; admin: `admin` / contraseña: `admin`).

### 3. Levantar el Frontend
Con el backend corriendo, levanta el frontend en React/TypeScript.

- Abre una nueva terminal y navega al directorio del frontend:
  ```
  cd RedditClon-Frontend
  ```
- Ejecuta el siguiente comando para instalar dependencias y correr el servidor de desarrollo:
  ```
  npm install
  npm run dev
  ```
  - `npm install` instala las dependencias (solo la primera vez).
  - `npm run dev` inicia el servidor en `http://localhost:5173`.
  - El servidor se recarga automáticamente con cambios.

- **Qué sucede**: El frontend se conecta al backend y permite login/autenticación.

## Acceso al Frontend y Próximos Pasos
- Abre tu navegador y ve a `http://localhost:5173`.
- Aparecerá la pantalla de login del frontend.
- **Información de usuarios de prueba**:
  - **Usuario normal**: Username: `user`, Password: `password`
  - **Administrador**: Username: `admin`, Password: `admin`
- Inicia sesión con uno de estos usuarios para ver el dashboard correspondiente (unificado para ambos roles).
- El dashboard mostrará el tipo de usuario (USER o ADMIN) y permitirá cerrar sesión.

## Notas Adicionales
- **Orden importante**: Siempre sigue el orden DB → Backend → Frontend para evitar errores de conexión.
- **Parar servicios**:
  - Backend: Presiona `Ctrl+C` en la terminal.
  - Frontend: Presiona `Ctrl+C` en su terminal.
  - Docker: `docker-compose down` para detener la DB.
- **Problemas comunes**:
  - Si la DB no inicia, verifica que el puerto 5432 esté libre.
  - Si el backend falla, asegúrate de que Java/Maven estén instalados.
  - Si el frontend falla, verifica Node.js y ejecuta `npm install` nuevamente.
- Para más detalles, revisa los archivos `README.md` en cada subdirectorio.

¡Disfruta explorando RedditClon!
