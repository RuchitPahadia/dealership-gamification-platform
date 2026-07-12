from __future__ import annotations

import json
from pathlib import Path
from threading import RLock
from typing import Any


class ActionCatalogService:
    def __init__(self, catalog_path: Path) -> None:
        self.catalog_path = catalog_path
        self._lock = RLock()
        self._weights: dict[str, int] = {}
        self._last_mtime: float = -1.0
        self._load()

    def get_weights(self) -> dict[str, int]:
        self._refresh_if_modified()
        return dict(self._weights)

    def get_weight(self, action: str) -> int:
        self._refresh_if_modified()
        return int(self._weights.get(action, 0))

    def update_weights(self, updates: dict[str, int]) -> dict[str, int]:
        with self._lock:
            payload = self._read_payload()
            actions = payload.get("actions", [])
            existing = {item["action"]: item for item in actions if "action" in item}
            for action, weight in updates.items():
                if action in existing:
                    existing[action]["weight"] = int(weight)
                else:
                    actions.append({"action": action, "weight": int(weight)})
            payload["actions"] = sorted(actions, key=lambda item: item["action"])
            self.catalog_path.parent.mkdir(parents=True, exist_ok=True)
            self.catalog_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
            self._load()
            return dict(self._weights)

    def _refresh_if_modified(self) -> None:
        try:
            current_mtime = self.catalog_path.stat().st_mtime
        except FileNotFoundError:
            current_mtime = -1.0
        if current_mtime != self._last_mtime:
            self._load()

    def _load(self) -> None:
        with self._lock:
            payload = self._read_payload()
            self._weights = {
                str(item["action"]): int(item.get("weight", 0))
                for item in payload.get("actions", [])
                if "action" in item
            }
            try:
                self._last_mtime = self.catalog_path.stat().st_mtime
            except FileNotFoundError:
                self._last_mtime = -1.0

    def _read_payload(self) -> dict[str, Any]:
        if not self.catalog_path.exists():
            return {"actions": []}
        return json.loads(self.catalog_path.read_text(encoding="utf-8"))
