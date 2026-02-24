# Login: qué usamos, cómo funciona y cómo usarlo

## Qué se usó
- **Spring Security** para autenticación y autorización.
- **Spring Data JPA (Hibernate)** para acceder a usuarios/roles en la base.
- **BCrypt** para almacenar contraseñas de forma segura.
- **Flyway** para versionar el esquema (tablas `users`, `roles`, `users_roles`, y tablas de sesión `SPRING_SESSION*`).
- **Spring Session JDBC** para persistir la sesión en base de datos.

Rutas de código relevantes:
- Configuración de seguridad: `RedditClon-Backend/src/main/java/com/RedditClon_Backend/RedditClon_Backend/config/SecurityConfig.java`
- Seed de datos (usuarios y roles): `.../config/DevDataLoader.java`
- Log de inicio de sesión (tipo USER/ADMIN): `.../config/AuthEventsLogger.java`
- Entidades: `.../model/User.java`, `.../model/Role.java`
- Repositorios: `.../repository/UserRepository.java`, `.../repository/RoleRepository.java`
- Migraciones: `RedditClon-Backend/src/main/resources/db/migration/`

## Cómo funciona
1. **Migraciones al arrancar**: Flyway aplica `V1`, `V2`, `V3` para crear/ajustar tablas (`users`, `roles`, `users_roles`, `SPRING_SESSION*`).
2. **Seed de usuarios**: `DevDataLoader` asegura roles `USER` y `ADMIN` y crea usuarios si no existen:
   - `user` / `password` → rol `USER`
   - `admin` / `admin` → rol `ADMIN`
3. **Autenticación**:
   - El formulario en `/login` envía credenciales.
   - `UserDetailsService` carga usuario y roles desde DB.
   - Spring Security compara la contraseña usando **BCrypt**.
4. **Sesión**:
   - Si la autenticación es correcta, la sesión se guarda en tablas `SPRING_SESSION` y `SPRING_SESSION_ATTRIBUTES`.
5. **Autorización**:
   - `SecurityConfig` exige autenticación para todo excepto `/ping` y `/actuator/health`.
   - Los roles se mapean como `ROLE_USER` y `ROLE_ADMIN`.

## Cómo usarlo
1. **Arrancar base con Docker** (en la raíz del repo donde está `docker-compose.yml`):
   ```bash
   docker compose up -d
   ```
2. **Ejecutar backend** (desde `RedditClon-Backend/`):
   ```bash
   # Windows
   .\mvnw.cmd spring-boot:run
   ```
3. **Probar**:
   - Salud pública: `GET http://localhost:8080/ping` → "OK".
   - Login: `http://localhost:8080/login`
     - Usuario normal: `user` / `password`
     - Administrador: `admin` / `admin`
   - Al loguear, se imprime en consola el tipo de usuario (USER/ADMIN) por `AuthEventsLogger`.

## Diferenciar usuario normal vs admin
- Se distingue por el **rol** en DB.
- En código, se puede usar:
  - Por URL (en `SecurityConfig`):
    ```java
    // ejemplo (extender SecurityConfig)
    auth.requestMatchers("/admin/**").hasRole("ADMIN");
    auth.requestMatchers("/user/**").hasAnyRole("USER","ADMIN");
    ```
  - Por método:
    ```java
    @PreAuthorize("hasRole('ADMIN')")
    public void soloAdmins() { }
    ```

## Troubleshooting rápido
- **500 al loguear**: verificar que `V3__spring_session.sql` haya creado tablas `SPRING_SESSION*`.
- **Credenciales inválidas**: confirmar usuario/contraseña y que la contraseña esté en BCrypt (la crea `DevDataLoader`).
- **La app no conecta a DB**: revisar en `application.properties`:
  ```properties
  spring.datasource.url=jdbc:postgresql://localhost:5432/redditclon
  spring.datasource.username=postgres
  spring.datasource.password=postgres
  ```

## Extensiones futuras
- Endpoint protegido `/me` para devolver usuario autenticado.
- Swagger UI para probar endpoints.
