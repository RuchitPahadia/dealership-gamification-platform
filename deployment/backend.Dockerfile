# Build context is the repo root (see docker-compose.yml), because
# backend/app/services/runtime_state.py resolves paths as:
#   REPO_ROOT = Path(__file__).resolve().parents[3]
#   CATALOG_PATH = REPO_ROOT / "shared" / "action_catalog.json"
# so /app must contain both backend/ and shared/ at the same level as in git.

FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend/ backend/
COPY shared/ shared/

EXPOSE 8000

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
