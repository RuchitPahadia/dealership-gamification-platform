# DealerXP

**Compete. Collaborate. Deliver.**

DealerXP is a gamified performance layer for a real car dealership. It sits on top of the existing lead → enquiry → booking → finance → invoice → delivery lifecycle, turns 2000+ raw operational events into a small set of scoring milestones, and surfaces them as XP, streaks, badges, quests, and leaderboards — designed to speed up cycle time and cross-department collaboration without rewarding busywork.

Built for the Carverse Mobility Technologies Dealership Gamification Hackathon.

---

## Table of Contents

- [Repository Structure](#repository-structure)
- [Current Status](#current-status)
- [Quick Start](#quick-start)
- [Feature Tour](#feature-tour)
- [Scoring Model & Anti-Gaming Design](#scoring-model--anti-gaming-design)
- [Tech Stack](#tech-stack)
- [Testing](#testing)
- [Known Issues / Roadmap](#known-issues--roadmap)
- [Team](#team)

---

## Repository Structure

```
DealerXP/
├── backend/           FastAPI backend — scoring, gamification, leaderboard,
│                      analytics, and admin engines; real dataset + CSV
│                      processing pipeline; pytest suite
├── frontend/          React + Vite + Tailwind frontend — currently runs
│                      standalone against in-browser localStorage state
├── shared/            action_catalog.json — single source of truth for the
│                      20 scoring actions and their weights
├── deployment/        Dockerfiles for backend and frontend
├── database/seed/     Script to replay sample data through the backend API
├── scripts/           Convenience wrappers (seed_db.sh)
├── docs/              demo_script.md — walkthrough script for presenting
├── docker-compose.yml Postgres + Redis + backend + frontend, one command
└── backend/tests/     Unit tests, including a dedicated anti-gaming suite
```

---

## Current Status

Being upfront about this because it affects how you should run and read the demo.

**Frontend runs standalone today.** It's built to operate entirely offline against `localStorage` — no backend, database, or network required. This is intentional: it makes the frontend instantly demoable and deployable to static hosting (Netlify, Vercel, GitHub Pages) with zero setup.

**Backend is a real, independently working system, not yet wired to the frontend.** The FastAPI backend has its own scoring engine, gamification engine, leaderboard engine, analytics service, and a genuine CSV → booking-lifecycle → scoring-event pipeline that runs against the actual organizer dataset (`backend/data/z_event_log_may_june_2026.csv` and friends). It has its own pytest suite, its own Docker setup, and runs correctly on its own.

**These two halves are not yet plugged into each other.** The frontend doesn't call the backend's REST API, and the backend's newest data pipeline has a couple of integration bugs (tracked below) that mean it currently falls back to a small hardcoded mock dataset rather than the real event log. Closing that gap is the active work in progress — see [Known Issues](#known-issues--roadmap).

If you just want to see the game: run the frontend. If you want to see the real scoring/anti-gaming engine working against real backend logic and tests: run the backend separately, or via `docker-compose up`.

---

## Quick Start

### Option A — Frontend only (fastest, no setup)

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Open `http://localhost:5173`. Fully interactive, nothing else required.

### Option B — Full stack via Docker

```bash
docker-compose up --build
```
This builds and runs Postgres, Redis, the FastAPI backend (`http://localhost:8000`, docs at `/docs`), and the frontend dev server (`http://localhost:5173`) together.

To load sample data into the running backend:
```bash
./scripts/seed_db.sh
```

### Option C — Backend only

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --app-dir ..
```

---

## Feature Tour

### 1. Booking Timeline & Inline Approvals
A linear "race track" visualizes a single booking's journey across 7 stages (Booking Created → Discount Approved → Finance Approved → Invoice Approved → RTO Request → PDI Completed → Delivered). Switch between bookings via a dropdown selector. Branch Managers can confirm pending booking requests inline, which immediately awards XP, updates leaderboards, and advances the timeline.

### 2. Admin Console
Live action-weight editor for the 20 scoring actions, plus an anti-gaming audit panel listing anomaly flags (High/Medium/Low severity) with resolution actions. Includes a quick booking-request creator for demoing the manager-approval flow.

### 3. Role-Based Navigation
- **Admin (Vikram)** → Admin Console + Analytics only
- **Sales DSE (Asha)** → Dashboard, leaderboard, DSE workspace, achievements, quests, profile
- **Finance Specialist (Rahul)** → Finance workspace, hides DSE-only menus

Profile pages dynamically reflect the active user's name, role, branch, streak, XP, and badges.

### 4. Demo-Critical Moments
- **Relay Bonus** — simulating a Finance approval that unblocks a DSE animates both users' XP counters jumping together with a connecting notification, demonstrating the core cross-department collaboration mechanic.
- **Cap Firing** — simulating repeated low-value actions (e.g. spammed notes) shows the point counter refuse to keep climbing, with a visible "Capped" indicator — the live proof that the anti-gaming design actually holds.

---

## Scoring Model & Anti-Gaming Design

Of 2000+ raw action types in the real dataset, exactly **20** are used for scoring (`shared/action_catalog.json`), selected by asking of each candidate action: does it move a booking forward or represent a real outcome, or is it just a data edit that can be repeated for free? Administrative/noise actions (e.g. field-update events) are deliberately excluded regardless of volume.

| Category | Examples | Why |
|---|---|---|
| High-value outcomes | `DELIVERED` (220), `ESCALATION_FREE_DELIVERY` (140), `ZERO_REWORK_BOOKING_BONUS` (140) | Real, externally-verified business outcomes — hardest to fake |
| Milestones | `FINANCE_APPROVED` (110), `FINANCE_APPROVED_FIRST_PASS` (130), `INVOICE_APPROVED` (120), `DOCUMENT_SET_COMPLETED` (95) | Occur ~once per booking, gate the next stage |
| Process/SLA signals | `CUSTOMER_FOLLOWUP_SLA_MET` (60), `FINANCE_APPROVAL_SLA_MET` (65) | Reward speed, not just completion |
| Entry actions | `BOOKING_CREATED` (30), `FOLLOW_UP_COMPLETED` (20) | Low weight by design — easy to do, so capped low so they can't dominate |
| Penalties | `REWORK_LOOP_TRIGGERED` (-90), `BOOKING_CANCELLED_AFTER_FINANCE` (-120) | Makes gaming the system actively costly, not just ineffective |

**Anti-gaming measures**, tested in `backend/tests/anti_gaming/`:
- Repeatable low-value actions are capped, not just low-weighted
- Rework loops and late-stage cancellations carry negative weight
- Live weight updates are supported without a redeploy, but audited
- Collusion-style patterns (e.g. a relay bonus firing without a real matching `DELIVERED` event) are flagged by a dedicated anomaly detector

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 18, React Router v6, Tailwind CSS, Framer Motion, Recharts, Lucide React |
| Backend | FastAPI, Pydantic, pandas (CSV/dataset processing) |
| Data | PostgreSQL, Redis (wired in `docker-compose.yml`; not yet the live path — see status above) |
| Testing | pytest |
| Containerization | Docker, Docker Compose |

---

## Testing

```bash
cd backend
pip install -r requirements.txt
pytest tests/ -v
```
Covers frozen API contracts, live weight updates, collusion-bonus detection, and mass-update caps.

---

## Known Issues / Roadmap

Tracked honestly rather than glossed over, since this is what's actively being closed out:

- [ ] `backend/requirements.txt` needs a cleanup pass (stray formatting from an edit) before a clean `pip install` will succeed
- [ ] The new CSV-based scoring pipeline (`backend/app/engines/scoring_engine.py`) needs its internal imports aligned with the rest of the backend's package layout so it actually loads instead of silently falling back to sample data
- [ ] Field naming needs to be finalized as one single contract across the scoring pipeline and the gamification/leaderboard engines (currently two conventions exist independently)
- [ ] Frontend → backend live wiring (swapping `localStorage` mock state for real API calls) is a deliberate next phase, not yet started
- [ ] `GET /admin/anomalies` — the anomaly-detection engine is implemented and unit-tested but not yet exposed via a route

---

## Team

Built by a 4-developer team across backend core (auth, ingestion, rule/scoring engine), backend gamification (leaderboard, analytics, admin, notifications), frontend player experience, and admin/DevOps/integration.

Copyright © Carverse Mobility Technologies Pvt Ltd
