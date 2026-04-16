# external-api-adapter

API REST en Node.js + TypeScript que consume la API financiera **Alpha Vantage** y expone endpoints propios con los datos transformados. Cada cotización se persiste en PostgreSQL como caché local.

**Endpoints:**
- `GET /health` – estado del servidor
- `GET /external-data` – cotizaciones de IBM, AAPL y MSFT
- `GET /external-data/quote/:symbol` – cotización de cualquier símbolo
- `GET /external-data/history` – cotizaciones guardadas en la base de datos

---

## Cómo ejecutarlo localmente

Requiere Docker instalado.

```bash
git clone <repo-url>
cd external-api-adapter

cp .env.example .env
# Agregar tu ALPHA_VANTAGE_API_KEY en .env

docker compose up --build
```

La API queda disponible en `http://localhost:3000`.

---

## API externa

[Alpha Vantage](https://www.alphavantage.co/) – endpoint `GLOBAL_QUOTE` para obtener cotizaciones bursátiles en tiempo real.

API key gratuita: <https://www.alphavantage.co/support/#api-key>

