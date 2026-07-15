# DealerXP

**Compete. Collaborate. Deliver.**

DealerXP is a gamified performance and analytics layer built on top of a real-world car dealership's operational pipeline. It sits on top of the existing lead → enquiry → booking → finance → invoice → delivery lifecycle, aggregates thousands of raw events into highly impactful scoring milestones, and surfaces them as XP, streaks, badges, quests, and leaderboards — designed to speed up cycle time and foster cross-department collaboration without rewarding busywork.

Built for the Carverse Mobility Technologies Dealership Gamification Hackathon.

---

## Table of Contents

- [Repository Structure](#repository-structure)
- [System Architecture & Integration Status](#system-architecture--integration-status)
- [Quick Start](#quick-start)
- [Key Features & Highlights](#key-features--highlights)
- [Scoring Model & Anti-Gaming Design](#scoring-model--anti-gaming-design)
- [Tech Stack](#tech-stack)
- [Testing](#testing)
- [Recent Bug Fixes & Refactoring](#recent-bug-fixes--refactoring)
- [Team](#team)

---

## Repository Structure

```
DealerXP/
├── backend/           FastAPI backend — scoring, gamification, leaderboard,
│                      analytics, and admin engines; real dataset + CSV
│                      processing pipeline; pytest suite
├── frontend/          React 18 + Vite + Tailwind frontend — fully interactive,
│                      wired to backend API endpoints with localStorage fallbacks
├── shared/            action_catalog.json — single source of truth for the
│                      20 scoring actions and their weights
├── deployment/        Dockerfiles for backend and frontend
├── database/seed/     Script to replay sample data through the backend API
├── scripts/           Convenience wrappers (seed_db.sh)
├── docs/              demo_script.md — walkthrough script for presenting
└── docker-compose.yml Postgres + Redis + backend + frontend, one command
```

---

## System Architecture & Integration Status

DealerXP is **fully integrated and wired together**.
* **Vite API Proxying**: The frontend uses a local Vite development server proxy (`/api` routes mapped to `http://127.0.0.1:8000`) to query the FastAPI backend directly during execution.
* **Resilient Fallback Handling**: If the backend is offline, the React API client automatically falls back to in-browser storage state (`localStorage`), ensuring the application remains interactive and demoable under any environment constraints.
* **Refactored Data Pipeline**: All backend Python modules (such as the scoring and leaderboard engines) have been updated to use unified `app.data` path layouts, ensuring seamless startup without dependency resolution issues.

---

## Quick Start

### Option A — Full Stack (Recommended)
Launch the entire environment containing the frontend, backend, database, and Redis cache in one command:
```bash
docker-compose up --build
```
This serves:
* **Frontend**: `http://localhost:5173`
* **Backend API Docs (Swagger)**: `http://localhost:8000/docs`

To seed the database with transactional data:
```powershell
# On Windows PowerShell
.\scripts\seed_db.sh
```

### Option B — Frontend standalone
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Open `http://localhost:5173`. Works out-of-the-box using local storage mock state when the backend is not running.

### Option C — Backend standalone
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000 --reload
```

---

## Key Features & Highlights

### 1. Booking Timeline & Race Track
* A linear **"race track"** visualizes a single booking's journey across 7 stages (Booking Created → Discount Approved → Finance Approved → Invoice Approved → RTO Request → PDI Completed → Delivered).
* **Branch Managers** can view and approve pending bookings inline, instantly advancing the booking timeline and awarding XP to DSEs.
* **Adaptive Theme Support**: The Race Track interface features a responsive light theme design that transitions smoothly out of dark mode when switching to light theme.

### 2. Leaderboard Scope Switching
* Displays real-time organizational performance metrics.
* **Individual Standing**: Rankings of individual sales executives (DSEs) and finance closer executives.
* **Branch Standing**: Inter-branch standings comparing location performances. 
* *Bug Fix*: Resolves state pollution by verifying location datasets, dynamically filtering employee IDs/names from the branch calculations on the backend, and resetting the rendering state in the custom React query hook.

### 3. Role-Based Navigation
* **Admin (Vikram)**: Gains exclusive access to the Admin Console, Action Weight Editor, and aggregate Analytics pages.
* **Sales DSE (Asha)**: Personal workspaces displaying daily quests, active point streaks, earned badges, and personal profile details.
* **Finance Specialist (Rahul)**: Focused workspace optimized for completing finance milestones.

### 4. Admin Console & Analytics
* **Runtime Catalog Tuning**: Adjust point weights for the 20 core scoring actions inside `shared/action_catalog.json` on the fly without rebooting.
* **KPI Trackers**: Dashboard summaries displaying key metrics like cycle time and action mix.

---

## Scoring Model & Anti-Gaming Design

From over 2,000 raw transactional event signatures in the CSV dump, exactly **20 core actions** are mapped for gamified scoring. 

### Core Gamification Rules
* **High-value outcomes** (e.g. `DELIVERED`, `ZERO_REWORK_BOOKING_BONUS`) receive high point weights because they translate to external business value.
* **Process milestones** (e.g. `FINANCE_APPROVED_FIRST_PASS`, `SLA_MET`) reward cycle-time efficiency.
* **Low-value spammables** (e.g. `BOOKING_NOTE_ADDED`) have low weights and are capped to prevent repetitive farming.
* **Penalties** (e.g. `REWORK_LOOP_TRIGGERED`, `BOOKING_CANCELLED`) apply negative points to discourage gaming.

### Anti-Gaming Guardrails
* **Anti-Gaming Caps**: Once an employee triggers a repeatable action too many times, the scoring engine caps their gains and flags a "Capped" visual alert.
* **Anomaly Detection**: Flags collusion behavior (such as executing relay approval actions without matching lifecycle completions) as anomalies.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, React Router v6, Tailwind CSS, Framer Motion, Recharts, Lucide React |
| **Backend** | FastAPI, Pydantic, Pandas (CSV processing & ingestion pipeline) |
| **Database & Cache** | PostgreSQL, Redis |
| **Testing** | Pytest |
| **Containerization** | Docker, Docker Compose |

---

## Testing

Run the backend test suite covering the scoring model contracts, cap triggers, weight tuning, and collusion anomaly check gates:
```bash
cd backend
pip install -r requirements.txt
pytest tests/ -v
```

---

## Recent Bug Fixes & Refactoring

1. **Dashboard Blank Screen**: Resolved a client-side bundle mapping issue on the main `/dashboard` page to restore seamless dashboard loading.
2. **Race Track Light Mode**: Redesigned UI classes on the timeline components to properly support white layouts when light mode is selected.
3. **Leaderboard State Cleanliness**: 
   * Fixed a hook execution bug in `useLeaderboard.js` that previously caused individual executive standings to pollute the top of the **Branch Standing** list during active scope fetches.
   * Added backend validation filtering inside `leaderboard_engine.py` to prevent employee names from appearing in aggregated branch metrics.
4. **Scoring Engine Import Imports**: Fixed Python import namespaces within `scoring_engine.py` so that imports properly resolve relative to the `app` root package structure.

---

## Team

Built by a 4-developer team across backend core (auth, ingestion, rule/scoring engine), backend gamification (leaderboard, analytics, admin, notifications), frontend player experience, and admin/DevOps/integration.

Copyright © Carverse Mobility Technologies Pvt Ltd
