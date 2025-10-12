# Levantar Docker (PostgreSQL)

Instrucciones mínimas para que toda la base quede igual en cada máquina.

## Requisito
- Docker Desktop instalado y corriendo.

## Ubicación
- Ejecutar los comandos en la raíz del repo, donde está `docker-compose.yml`.

## Comandos
- **Levantar la base**
```bash
docker compose up -d
```
- **Ver estado**
```bash
docker compose ps
```
- **Ver logs (útil la primera vez)**
```bash
docker logs redditclon_db --tail=100
```
- **Probar conexión desde el contenedor**
```bash
docker exec -it redditclon_db psql -U postgres -d redditclon -c "\\dt"
```
- **Detener**
```bash
docker compose down
```
- **Reset limpio (borra datos)**
```bash
docker compose down -v
docker compose up -d
```

## Parámetros estándar
- Host: `localhost`
- Puerto: `5432`
- Base: `redditclon`
- Usuario: `postgres`
- Password: `postgres`

## Nota (puerto ocupado)
- Si el `5432` del host está ocupado, cambia el mapeo en `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"
```
Y conecta el backend a `jdbc:postgresql://localhost:5433/redditclon`.
