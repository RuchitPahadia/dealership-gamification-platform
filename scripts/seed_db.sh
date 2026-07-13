#!/usr/bin/env bash
# Waits for the backend to be up, then replays the demo dataset through /actions/ingest.
# Usage: ./scripts/seed_db.sh [api_base]
set -euo pipefail

API_BASE="${1:-http://localhost:8000/api/v1}"
HEALTH_URL="${API_BASE%/api/v1}/docs"
MAX_WAIT_SECONDS=60

echo "Waiting for backend at ${HEALTH_URL} ..."
elapsed=0
until curl -sf "${HEALTH_URL}" > /dev/null 2>&1; do
  if [ "${elapsed}" -ge "${MAX_WAIT_SECONDS}" ]; then
    echo "Backend did not come up within ${MAX_WAIT_SECONDS}s. Is 'docker-compose up' running?" >&2
    exit 1
  fi
  sleep 2
  elapsed=$((elapsed + 2))
done

echo "Backend is up. Seeding..."
python3 "$(dirname "$0")/../database/seed/seed_from_demo_dataset.py" --api-base "${API_BASE}"
