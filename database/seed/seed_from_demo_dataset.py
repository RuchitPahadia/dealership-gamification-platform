"""
Replays a demo dataset CSV through POST {API_BASE}/actions/ingest, in timestamp order.

STATUS (as of this writing): the /actions/ingest endpoint does NOT exist yet in
backend/app/api/v1/ -- only admin, dashboard, and leaderboard routers are registered
in backend/app/api/v1/__init__.py. Running this script today will log a clear
"endpoint not found" error per row and exit cleanly; it is written now so it's
ready to run for real the moment Dev 1 ships ingestion.

Also flagging: the only demo_dataset.csv currently in the repo is
backend/tests/fixtures/demo_dataset.csv (10 rows, columns:
booking_id, action, user_id, department, branch, timestamp). That's a unit-test
fixture, not the 55-event dataset referenced in the Dev 4 brief. This script
defaults to that fixture but takes --csv to point at the real one once we have it,
and the row -> payload mapping below will need a second look once we know whether
ingest expects this shape or the fuller shape from the integration letter
(event_id, employee_name, location_code, points, is_real_delivery).

Idempotent/resumable: keeps a local state file of successfully-ingested row
hashes, so re-running after a partial failure only sends what's missing.

Usage:
    python database/seed/seed_from_demo_dataset.py
    python database/seed/seed_from_demo_dataset.py --csv path/to/demo_dataset.csv --api-base http://localhost:8000/api/v1
    python database/seed/seed_from_demo_dataset.py --reset-state   # forget progress, resend everything
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_CSV = REPO_ROOT / "backend" / "tests" / "fixtures" / "demo_dataset.csv"
STATE_FILE = Path(__file__).resolve().parent / ".seed_state.json"
DEFAULT_API_BASE = "http://localhost:8000/api/v1"


def row_hash(row: dict) -> str:
    """Stable idempotency key for a CSV row so re-runs don't double-ingest."""
    key = "|".join(str(row.get(field, "")) for field in ("booking_id", "action", "user_id", "timestamp"))
    return hashlib.sha256(key.encode("utf-8")).hexdigest()


def load_state() -> set[str]:
    if STATE_FILE.exists():
        return set(json.loads(STATE_FILE.read_text()))
    return set()


def save_state(sent: set[str]) -> None:
    STATE_FILE.write_text(json.dumps(sorted(sent), indent=2))


def load_rows(csv_path: Path) -> list[dict]:
    if not csv_path.exists():
        print(f"CSV not found at {csv_path}", file=sys.stderr)
        sys.exit(1)
    with csv_path.open("r", encoding="utf-8", newline="") as handle:
        rows = list(csv.DictReader(handle))
    rows.sort(key=lambda r: r.get("timestamp", ""))
    return rows


def to_payload(row: dict) -> dict:
    """
    Raw-action payload sent to /actions/ingest. Matches the current CSV columns
    (booking_id, action, user_id, department, branch, timestamp). Re-check this
    mapping against Dev 1's actual ingest contract once it exists -- this is the
    field-name-mismatch issue flagged separately (occurred_at/name vs
    timestamp/employee_name in the docs).
    """
    return {
        "booking_id": row.get("booking_id", ""),
        "action": row.get("action", ""),
        "user_id": row.get("user_id", ""),
        "department": row.get("department", ""),
        "branch": row.get("branch", ""),
        "timestamp": row.get("timestamp", ""),
        "idempotency_key": row_hash(row),
    }


def post_event(api_base: str, payload: dict) -> tuple[bool, str]:
    url = f"{api_base.rstrip('/')}/actions/ingest"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json", "Idempotency-Key": payload["idempotency_key"]},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            return True, f"{resp.status}"
    except urllib.error.HTTPError as exc:
        if exc.code == 404:
            return False, "404 - /actions/ingest is not implemented yet"
        return False, f"{exc.code} - {exc.read().decode('utf-8', errors='replace')[:200]}"
    except urllib.error.URLError as exc:
        return False, f"connection error - {exc.reason} (is the backend running?)"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--csv", type=Path, default=DEFAULT_CSV, help="Path to the demo dataset CSV")
    parser.add_argument("--api-base", default=DEFAULT_API_BASE, help="Base URL of the backend API")
    parser.add_argument("--reset-state", action="store_true", help="Ignore previous progress and resend everything")
    args = parser.parse_args()

    already_sent = set() if args.reset_state else load_state()
    rows = load_rows(args.csv)

    print(f"Loaded {len(rows)} rows from {args.csv}")
    print(f"{len(already_sent)} already recorded as sent in {STATE_FILE.name}")

    sent_count = 0
    skipped_count = 0
    failed_count = 0
    endpoint_missing = False

    for row in rows:
        payload = to_payload(row)
        key = payload["idempotency_key"]
        if key in already_sent:
            skipped_count += 1
            continue

        ok, detail = post_event(args.api_base, payload)
        if ok:
            already_sent.add(key)
            sent_count += 1
            print(f"  OK    {row.get('booking_id')} {row.get('action'):<25} -> {detail}")
        else:
            failed_count += 1
            print(f"  FAIL  {row.get('booking_id')} {row.get('action'):<25} -> {detail}")
            if "404" in detail:
                endpoint_missing = True
                break  # no point hammering a route that doesn't exist

    save_state(already_sent)

    print()
    print(f"Sent: {sent_count}  Skipped (already done): {skipped_count}  Failed: {failed_count}")
    if endpoint_missing:
        print("Stopped early: /actions/ingest returned 404. Re-run this script once Dev 1 ships ingestion --")
        print("progress so far is saved, so it will resume from where it left off.")
        sys.exit(2)


if __name__ == "__main__":
    main()
