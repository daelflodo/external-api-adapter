# external-api-adapter

API REST en Node.js + TypeScript que consume la API financiera **Alpha Vantage** y expone endpoints propios con datos transformados. Cada cotización consultada se persiste en PostgreSQL a través de TypeORM.

---

## Tecnologías

- **Node.js** + **TypeScript**
- **Express.js** – framework HTTP
- **TypeORM** – ORM con entidades y `synchronize`
- **PostgreSQL** – base de datos relacional
- **Docker / Docker Compose** – entorno reproducible
- **Alpha Vantage API** – fuente de datos financieros

---

## Estructura del proyecto

```
src/
├── server.ts          # Punto de entrada: inicializa DB y levanta Express
├── app.ts             # Configuración de Express y registro de rutas
└── config/
    ├── env.ts         # Variables de entorno tipadas
    └── database.ts    # DataSource de TypeORM (PostgreSQL)
```

> Los módulos de negocio (`market/`) y los adaptadores externos se agregarán en el siguiente commit.

---

## Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/health` | Estado del servidor |

> Los endpoints `/external-data` se agregarán en el siguiente commit.

---

## Cómo ejecutarlo

### Opción A – Docker (recomendado)

Solo necesitas Docker instalado. Levanta PostgreSQL y la API con un único comando:

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd external-api-adapter

# 2. Crear el archivo de variables de entorno
cp .env.example .env
# Editar .env y agregar tu ALPHA_VANTAGE_API_KEY

# 3. Levantar todo
docker compose up --build
```

La base de datos se crea automáticamente. La API queda disponible en `http://localhost:3000`.

Para detener y limpiar:
```bash
docker compose down -v
```

---

### Opción B – Local con Node.js

Requiere Node.js >= 18 y PostgreSQL >= 14 corriendo en `localhost:5432`.

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Ajustar las variables DB_* según tu instalación de Postgres

# 3. Modo desarrollo (recarga automática)
npm run dev

# 4. O compilar y ejecutar
npm run build
npm start
```

---

## Variables de entorno

Copia `.env.example` a `.env` y completa los valores:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `ALPHA_VANTAGE_API_KEY` | API key de Alpha Vantage | `XXXXXXXXXXXXXXXX` |
| `ALPHA_VANTAGE_BASE_URL` | URL base de Alpha Vantage | `https://www.alphavantage.co/query` |
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USERNAME` | Usuario de PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `postgres` |
| `DB_DATABASE` | Nombre de la base de datos | `external_api_db` |

---

## API externa

**[Alpha Vantage](https://www.alphavantage.co/)** – datos financieros en tiempo real e históricos.

- Documentación: <https://www.alphavantage.co/documentation/>
- Obtener API key gratuita: <https://www.alphavantage.co/support/#api-key>

---

## Despliegue en Azure

### Azure App Service

```bash
az webapp create \
  --resource-group <mi-grupo> \
  --plan <mi-plan> \
  --name external-api-adapter \
  --runtime "NODE:20-lts"

az webapp config appsettings set \
  --name external-api-adapter \
  --resource-group <mi-grupo> \
  --settings \
    ALPHA_VANTAGE_API_KEY="<tu-key>" \
    ALPHA_VANTAGE_BASE_URL="https://www.alphavantage.co/query" \
    DB_HOST="<host-postgres-azure>" \
    DB_PORT="5432" \
    DB_USERNAME="<usuario>" \
    DB_PASSWORD="<password>" \
    DB_DATABASE="external_api_db" \
    PORT="8080"
```

Conectar el repositorio de GitHub en **Deployment Center** del portal para despliegue automático en cada push a `main`.

