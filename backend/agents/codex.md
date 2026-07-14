Project Rules

- Never modify gamification_engine.py
- Never modify leaderboard_engine.py
- Never modify analytics_service.py
- Never modify runtime_state.py
- Never modify notification_service.py
- Never modify API routes
- Never modify tests unless requested

Only work inside:

backend/app/data/

backend/app/engines/scoring_engine.py

Always preserve:

read_scoring_events()

Output schema:

event_id
booking_id
user_id
employee_name
department
branch
location_code
action
points
timestamp
is_real_delivery

Use ActionCatalogService.

Never hardcode action weights.

Prefer pandas vectorized operations over iterrows().

Follow PEP-8.

Use Python 3.10.

Do not invent new architecture.

Keep changes minimal.