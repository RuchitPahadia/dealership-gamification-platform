# DealerXP

Compete. Collaborate. Deliver.

**DealerXP** is a gamified performance monitoring platform designed to sit on top of a car dealership's existing workflow systems. It tracks real operational milestones (Sales, Finance, Accounts, PDI, RTO, and Delivery) and translates them into points (XP), active streaks, quests, and branch leaderboards to incentivize dealership teams, reduce cycle times, and prevent low-effort spamming (gaming).

---

## 📂 Repository Structure

This repository is structured as a monorepo containing both backend and frontend modules:

*   **`/frontend`**: React + Vite + Tailwind CSS frontend application. **Note: The frontend is configured in standalone mock-first mode, storing all operational state dynamically in `localStorage` in the browser. It requires zero backend servers or database setup to run, making it plug-and-play and ready for instant static hosting (Netlify, Vercel, GitHub Pages).**
*   **`/backend`**: FastAPI backend containing the core scoring engine, anti-gaming logic, anomaly detection service, and API endpoints (for reference/use by backend team).
*   **`/shared`**: Shared configurations and catalog references.

---

## ✨ Standalone Frontend Features & Workflows

Our frontend is 100% interactive and operates fully offline using custom `localStorage` state management. Key demo workflows include:

### 1. Booking Timeline & Inline Approvals
*   **Linear "Race Track" Centerpiece:** Visualizes a single car booking's journey across 7 critical workflow stages (Booking Created, Discount Approved, Finance Approved, Invoice Approved, RTO Request, PDI Completed, Delivered).
*   **Dropdown Selector:** Let's you switch timelines between different bookings (e.g. `b100`, or custom requested bookings) dynamically.
*   **Manager Approval (Inline Confirm):** Logged-in Branch Managers (Vikram) can view outstanding pending booking requests on the timeline page and click **"Confirm Booking Request"**. This updates the status to confirmed, awards the DSE (Asha) **30 XP** immediately, updates individual/branch leaderboards, and advances the Race Track stage to "Created"!

### 2. Admin Console & Quick Request Creator
*   **Action Weight Editor:** Displays weights for scoring actions with inline edit capabilities, saving configurations globally in the local state.
*   **Anti-Gaming Audit Panel:** Lists real-time anomaly log cards (High/Medium/Low severity risk flags) with action triggers to resolve flags.
*   **Quick Booking Creator:** Managers can simulate a new booking creation request on behalf of the DSE (Asha). This adds the booking as `PENDING` to the state, triggers a real-time pending notification badge in the sidebar, and lets the manager select and approve it from the timeline.

### 3. Role-Based Navigation & Dynamic Profiles
*   **Menu Access Control:** 
    *   **Admin (Vikram):** Only sees and accesses the **Admin Console** and **Analytics** tabs, redirecting directly to `/admin` upon login.
    *   **Sales DSE (Asha):** Sees the dashboard, leaderboard, DSE workspace, achievements, quests, and profile page.
    *   **Finance Specialist (Rahul):** Sees their dedicated Finance Workspace while hiding DSE-specific menus.
*   **Dynamic Profiles:** The profile page dynamically updates names, roles, emails, branches, streak days, XP, and badges based on the active user's credentials and local store.

### 4. Demo-Critical Animations
*   **Relay Bonus Moment:** Click the *Simulate Finance Approval* trigger on the centerpiece timeline. When a Finance approval unblocks a DSE, both users' XP counters animate and jump together, displaying a connecting "Relay Bonus" notification.
*   **Cap Firing Moment:** Click the *Add Note* trigger. If a DSE tries to spam repeatable notes/comments, the point counter stops increasing and triggers a "Capped" visual risk indicator in the scoreboard.

---

## 🚀 Frontend Quick Start

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18+ recommended)

### Run Locally
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install --legacy-peer-deps
    ```
3.  Launch the local development server:
    ```bash
    npm run dev
    ```
4.  Open the local server URL (usually `http://localhost:5173/`).

### Production Build (For Deployment)
To compile the production bundles for Netlify/Vercel/GitHub Pages:
```bash
npm run build
```

---

## 🛠️ Technology Stack
*   **Core:** React 18, React Router v6
*   **Styling:** Tailwind CSS, Vanilla CSS
*   **Animation:** Framer Motion, CSS Keyframes
*   **Icons:** Lucide React
*   **Charts:** Recharts
