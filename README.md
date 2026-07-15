# DealerXP

**Compete. Collaborate. Deliver.**

DealerXP is a gamified performance and analytics layer built on top of a real-world car dealership's operational pipeline. It sits on top of the existing lead → enquiry → booking → finance → invoice → delivery lifecycle, aggregates thousands of raw events into highly impactful scoring milestones, and surfaces them as XP, streaks, badges, quests, and leaderboards — designed to speed up cycle time and foster cross-department collaboration without rewarding busywork.

Built for the Carverse Mobility Technologies Dealership Gamification Gamified Dashboard Hackathon.

---

## 📖 Table of Contents

- [Repository Structure](#repository-structure)
- [System Architecture & Integration Status](#system-architecture--integration-status)
- [Quick Start](#quick-start)
- [Core Game Mechanics & Logic](#core-game-mechanics--logic)
- [Backend Ingestion & Scoring Logic](#backend-ingestion--scoring-logic)
- [Anti-Gaming Design & Guardrails](#anti-gaming-design--guardrails)
- [Employee Progression & Rank Tiers](#employee-progression--rank-tiers)
- [Tech Stack](#tech-stack)
- [Testing](#testing)
- [Team](#team)

---

## 📂 Repository Structure

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

## ⚡ System Architecture & Integration Status

DealerXP is **fully integrated and wired together**.
* **Vite API Proxying**: The frontend uses a local Vite development server proxy (`/api` routes mapped to `http://127.0.0.1:8000`) to query the FastAPI backend directly during execution.
* **Resilient Fallback Handling**: If the backend is offline, the React API client automatically falls back to in-browser storage state (`localStorage`), ensuring the application remains interactive and demoable under any environment constraints.
* **Refactored Data Pipeline**: All backend Python modules (such as the scoring and leaderboard engines) have been updated to use unified `app.data` path layouts, ensuring seamless startup without dependency resolution issues.

---

## 🚀 Quick Start

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

## 🎮 Core Game Mechanics & Logic

DealerXP is designed to model high-performance behaviors using engaging game elements that drive tangible business value.

### 1. Booking Lifecycle "Race Track"
* Visualizes a single booking's progress across **7 key milestones** (Booking Created → Discount Approved → Finance Approved → Invoice Approved → RTO Request → PDI Completed → Delivered).
* The timeline is rendered dynamically as a racetrack, featuring a sports car emoji that moves forward to the right as stages complete.
* Advances in the lifecycle trigger immediate XP rewards for the executing employee.

### 2. Customer Delight Multiplier (Review Bonus)
* **Mechanic**: Simulating customer reviews rewards executives for high customer satisfaction.
* **Star Ratings Mapping**:
  * ⭐⭐⭐⭐⭐ (5 Stars) $\rightarrow$ **1.05x Multiplier**
  * ⭐⭐⭐⭐ (4 Stars) $\rightarrow$ **1.03x Multiplier**
  * ⭐⭐⭐ (3 Stars) $\rightarrow$ **1.01x Multiplier**
* **Application**: The multiplier is stored on the user's active state. The bonus is automatically applied to boost their **next lifecycle delivery event** (`DELIVERED` action) and then resets. This connects direct customer feedback to employee payouts.

### 3. Relay Collaboration Bonus
* **Mechanic**: Points are awarded when handoffs between departments are completed quickly.
* **Incentive**: If a Sales DSE forwards a booking and a Finance Specialist completes the finance approval stage, both receive a **Relay Collaboration Bonus** to encourage alignment.

---

## ⚙️ Backend Ingestion & Scoring Logic

The backend scoring engine parses and processes real-world operational logs to calculate gamification states.

### 1. Ingestion Pipeline
* Parses thousands of raw transactional database logs (`z_event_log_may_june_2026.csv`) and matches them with employees (`z_employees.csv`) and locations (`z_locations.csv`).
* Maps events to exactly **20 core gamified actions** defined in the central configuration repository: `shared/action_catalog.json`.

### 2. Dynamic Point Scaling & Variance Management
* **The Problem**: Raw accumulated scores in car dealerships suffer from massive variance. Top branches or long-tenured executives have thousands of points, while newcomers remain at zero, leading to low engagement.
* **The Solution**: An advanced **linear normalization scaling algorithm** in `leaderboard_engine.py` maps raw accumulated scores between **`80 XP` and `520 XP`**. 
  $$\text{Scaled XP} = 80 + \frac{\text{Raw XP} - \text{Min Raw XP}}{\text{Max Raw XP} - \text{Min Raw XP}} \times 440$$
* **Outcome**: Compresses score variance while preserving executive rankings. This creates a balanced competitive environment where rank promotions feel achievable.

---

## 🛡️ Anti-Gaming Design & Guardrails

To prevent employees from "gaming" the leaderboard, the backend includes runtime guardrails:

### 1. Rate Capping (Spam Prevention)
* **The Problem**: Repeatable low-effort actions (e.g., adding arbitrary `BOOKING_NOTE_ADDED` events) can be farmed for infinite XP.
* **The Guardrail**: High-frequency repeatable actions are rate-limited to **5 additions daily**. Once capped, the engine awards 0 points for subsequent triggers and flags the action as `"CAPPED"` in the UI to guide the employee back to high-impact operational work.

### 2. Collusion Detection
* **The Problem**: Sales and Finance employees could collude to repeatedly trigger relay actions to farm handoff bonuses without doing real work.
* **The Guardrail**: The backend maps the transaction chain. A handoff relay bonus is only unlocked if a **real delivery lifecycle stage** is advanced. Logging dummy notes or duplicate approvals without advancing the car delivery lifecycle yields 0 points and triggers collusion warnings.

---

## 🏆 Employee Progression & Rank Tiers

Progression represents an employee's career and skill growth, measured by scaled XP points.

### Rank Tiers (100 XP Brackets)
Each rank represents a 100-point achievement threshold:

| Rank Badge | Rank Tier | Point Bracket |
| :---: | :--- | :--- |
| 🪨 | **Iron** | 0 – 99 XP |
| 🥉 | **Bronze** | 100 – 199 XP |
| 🥈 | **Silver** | 200 – 299 XP |
| 🟡 | **Gold** | 300 – 399 XP |
| 💎 | **Platinum** | 400 – 499 XP |
| 💠 | **Diamond** | 500+ XP |

### Integration Cleanliness
* **Synchronized Calculations**: The 100-point ranking system is mapped consistently across the backend engines, individual leaderboards, branch leaderboards, scorecard components, and lobby Competitive Profiles.
* **Badges**: Badges scale and transition seamlessly between light and dark modes.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, React Router v6, Tailwind CSS, Framer Motion, Recharts, Lucide React |
| **Backend** | FastAPI, Pydantic, Pandas (CSV processing & ingestion pipeline) |
| **Database & Cache** | PostgreSQL, Redis |
| **Testing** | Pytest |
| **Containerization** | Docker, Docker Compose |

---

## 🧪 Testing

Run the backend test suite covering the scoring model contracts, cap triggers, weight tuning, and collusion anomaly check gates:
```bash
cd backend
pip install -r requirements.txt
pytest tests/ -v
```

---

## 👥 Team

Built by a 4-developer team across backend core (auth, ingestion, rule/scoring engine), backend gamification (leaderboard, analytics, admin, notifications), frontend player experience, and admin/DevOps/integration.

Copyright © Carverse Mobility Technologies Pvt Ltd
