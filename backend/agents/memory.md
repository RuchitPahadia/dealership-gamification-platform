# DealerXP Project Memory

This file is the working memory for future agent passes. Read it first, update it when the project meaningfully changes, and use only the `DealerXP` folder as project scope.

## Scope Rule

- Only inspect, reason about, and edit files under `DealerXP/`
- Ignore `gamification_platform/` completely
- Do not use `gamification_platform/` as architecture reference, source of truth, or implementation guide

## Current Project Map

- Active project root: `DealerXP/`
- Backend root: `DealerXP/backend`
- Shared scoring config: `DealerXP/shared/action_catalog.json`
- Agent memory folder: `DealerXP/backend/agents`

## Active Backend Shape

- Entry point: `DealerXP/backend/app/main.py`
- Framework: FastAPI
- Mounted route groups:
  - leaderboard routes
  - admin routes
  - dashboard routes
- Runtime wiring lives in `DealerXP/backend/app/services/runtime_state.py`

## What The Backend Currently Does

- Serves leaderboard data from `LeaderboardEngine`
- Serves dashboard summary data from `AnalyticsService`
- Allows live weight reads and updates through `ActionCatalogService`
- Applies scoring rules through `GamificationEngine`
- Keeps most runtime state in memory
- Uses `DealerXP/shared/action_catalog.json` as the action weight source of truth

## Important Implementation Truths

- `runtime_state.py` tries to import `backend.app.engines.scoring_engine.read_scoring_events`
- That file is currently missing under `DealerXP/backend/app/engines/`
- Because of that, `get_scoring_events()` falls back to hardcoded `mock_scoring_events`
- This means leaderboard and duel responses are currently mock-backed unless a real scoring event loader is added
- Dashboard summary is different: it reads from `DealerXP/backend/tests/fixtures/demo_dataset.csv`

## Core Backend Modules

- `app/engines/gamification_engine.py`
  - scores events from the shared action catalog
  - enforces mass-update caps for selected actions
  - gates `ZERO_REWORK_BOOKING_BONUS` until a real `DELIVERED` event exists
  - tracks XP, levels, streaks, and a few badges in memory
- `app/engines/leaderboard_engine.py`
  - builds individual, branch, and department leaderboard payloads
  - builds a simple DSE vs Finance duel
  - builds daily quest payloads
  - supports in-process cache with optional Redis
- `app/services/action_catalog_service.py`
  - reads and writes `shared/action_catalog.json`
  - hot-reloads weights when the file changes
- `app/services/analytics_service.py`
  - reads CSV fixture data
  - computes cycle time, action mix, and branch totals

## Shared Scoring Catalog

- File: `DealerXP/shared/action_catalog.json`
- Current catalog includes 20 actions
- Positive milestones include:
  - `BOOKING_CONFIRMED`
  - `BOOKING_CREATED`
  - `FINANCE_APPROVED`
  - `DOCUMENT_SET_COMPLETED`
  - `DELIVERED`
  - `ZERO_REWORK_BOOKING_BONUS`
- Negative actions include:
  - `BOOKING_CANCELLED_AFTER_FINANCE`
  - `REWORK_LOOP_TRIGGERED`

## Tests That Already Express Intent

- `tests/test_frozen_api_contracts.py`
  - locks response shapes for leaderboard, duel, and daily quests
- `tests/anti_gaming/test_mass_update_caps.py`
  - verifies rate-capping behavior
- `tests/anti_gaming/test_collusion_bonus.py`
  - verifies relay bonus gating on real delivery
- `tests/anti_gaming/test_live_weight_update.py`
  - verifies updated action weights apply on the next scoring call

## Known Gaps / Likely Next Work

- Add a real scoring event loader for the backend instead of mock fallback
- Decide the intended source for production scoring events inside `DealerXP`
- Replace in-memory runtime state if persistence or multi-instance deployment is needed
- Expand API coverage beyond current leaderboard/admin/dashboard endpoints

## Safe Working Assumptions For Future Passes

- Prefer editing `DealerXP/backend` unless the task clearly targets `DealerXP/shared`
- Keep `DealerXP/shared/action_catalog.json` backward compatible because tests and runtime services depend on it
- Preserve API contract shapes unless the user explicitly asks for contract changes
- If leaderboard output seems static, first check the missing scoring event loader path before debugging ranking logic

## Update Rule

When making meaningful architecture, routing, storage, or scoring changes:

1. Update this file in the same pass
2. Keep the "Important Implementation Truths" and "Known Gaps" sections current
3. Remove outdated assumptions instead of letting them accumulate
