# DealerXP Demo Script

Status note: this script is written against what's actually in the repo today
(confirmed by reading the code, not the blueprint's aspirational version).
Two things it assumes will be true by demo day but are NOT true yet:
- Live data flowing through `read_scoring_events()` instead of the hardcoded
  `mock_scoring_events` in `runtime_state.py`.
- `/admin/anomalies` wired up (the engine file exists, the route doesn't yet).

If those aren't ready in time, the fallback is noted inline at each step —
the mock data is realistic enough to demo the same story either way.

---

## 0. Setup (before judges arrive)

```
docker-compose up --build
./scripts/seed_db.sh   # will no-op with a clear message until /actions/ingest exists
```

Open frontend at `http://localhost:5173`. Log in via `LoginForm` as the DSE demo
user first (`AppLayout` reads `dealerxp_user_id` from localStorage).

---

## 1. Open on the Booking Timeline (`BookingTimelinePage.jsx`)

Narrate one booking's journey live using the `RaceTrack.jsx` visualization —
stages render via `StageNode.jsx`. Point out this is the "race track" concept
directly from the brief's Scenario 1.

- If live data: pick a real booking ID that's mid-lifecycle.
- If still on mock: booking `b100` (Sanjay Mehta / Hyundai Creta) in
  `client.js`'s `defaultState.timeline` is pre-built for this — `BOOKING_CREATED`
  and `DISCOUNT_APPROVED` already done, rest pending.

## 2. DSE Dashboard (`DseDashboardPage.jsx`)

Show quests (`QuestList.jsx`), streak (`StreakBadge.jsx`), and score
(`ScoreCard.jsx`) for the DSE user.

## 3. Trigger the Relay Bonus moment

Call `triggerRelayBonus()` (wired into `App.jsx` already, exposed as a demo
button). This marks `FINANCE_APPROVED` and `INVOICE_APPROVED` done on the
timeline, fires `RelayBonusFlash.jsx`, and bumps both the DSE's and Finance
user's points together. This is the single highest-value moment for the
15%-weighted collaboration criterion — narrate it explicitly as such.

## 4. Cut to Finance Dashboard (`FinanceDashboardPage.jsx`)

Show the duel status (`DuelStatus.jsx`) ticking after the relay bonus.

## 5. Leaderboard (`LeaderboardPage.jsx`)

Toggle individual vs. branch scope (`ScopeToggle.jsx`) to show the social/
competitive payoff.

## 6. Admin Panel (`AdminPanelPage.jsx`)

- Weight editor: change a weight live via `/admin/actions/weights` (PUT) and
  show it apply on the next scoring call — this is the maintainability story
  ("admins retune without redeploying").
- Anomaly panel: **only if `/admin/anomalies` is wired by demo day.** Otherwise
  skip this half or note it's "next sprint" — don't demo against the client.js
  mock as if it's live data, a technical judge may ask what's backing it.

## 7. Analytics Page (`AnalyticsPage.jsx`)

Cycle-time and action-mix charts from `/dashboard/summary`. Ties every mechanic
back to a real KPI (cycle time, not just engagement).

## 8. The anti-gaming proof (30 seconds, memorable close)

Call `triggerNoteSpam()` repeatedly (already wired in `App.jsx`) to show
`BOOKING_NOTE_ADDED` scoring normally, then hitting the cap — `CapFiringIndicator.jsx`
fires and the score visibly stops moving. This is the single most memorable
answer to the 20%-weighted anti-gaming criterion; don't cut it for time.

---

## Anticipated Q&A

- **"Why only DSE + Finance?"** → deliberate MVP scoping for depth; the schema
  (`action_catalog.json`, department-scoped rows) is designed so adding a
  department is a data change, not a rebuild.
- **"Is this running on real data?"** → answer honestly based on where
  integration actually landed by demo day. Don't imply live data if it's still
  `mock_scoring_events`.
- **"What stops two colluding employees?"** → `gamification_engine.py`'s
  collusion-bonus gate: `ZERO_REWORK_BOOKING_BONUS` only fires if a real
  `DELIVERED` event with `is_real_delivery=True` exists for that booking.

## Backup

Record a full run-through on video by Hour 36 in case of live-demo failure
(flaky wifi, docker issue, etc.) — attach alongside this script.
