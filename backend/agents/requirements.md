# DealerXP Backend - Developer 1 Requirements

## Role

You are responsible for the **Event Processing Pipeline**.

Do NOT modify any gamification, leaderboard, analytics, notification, or API logic.

Your responsibility ends at producing scoring events.

---

# Project Architecture

```
Raw CSVs
    │
    ▼
CSV Loader
    │
    ▼
Event Processor
    │
    ▼
Booking Builder
    │
    ▼
Scoring Engine
    │
    ▼
runtime_state.py
    │
    ▼
Gamification Engine
    │
    ▼
Leaderboard
    │
    ▼
REST APIs
```

---

# Existing Components (DO NOT MODIFY)

These modules are already implemented.

```
backend/app/engines/gamification_engine.py

backend/app/engines/leaderboard_engine.py

backend/app/services/runtime_state.py

backend/app/services/action_catalog_service.py

backend/app/services/analytics_service.py

backend/app/services/notification_service.py

backend/app/api/
```

Do not modify these files unless explicitly requested.

---

# Your Scope

You own only:

```
backend/app/data/

    csv_loader.py

    event_processor.py

    booking_builder.py

backend/app/engines/

    scoring_engine.py
```

---

# Datasets

Located in

```
backend/data/
```

Files

```
z_event_log_may_june_2026.csv

z_employees.csv

z_locations.csv
```

---

# CSV Schema

## Event Log

Columns

```
id
group_id
stage
categories
department
username
user_id
enquiry_no
location_code
message
action_code
source
created_date
```

---

## Employee Master

Join

```
events.user_id

=

employees.id
```

Important columns

```
id
name
department
designation
```

---

## Location Master

Join

```
events.location_code

=

locations.location_code
```

Important columns

```
location_code
location_name
```

---

# Booking Identifier

Unique booking

```
booking_id =
location_code + "_" + enquiry_no
```

This identifier must remain stable.

---

# Action Weights

Do NOT hardcode points.

Always use

```
backend/app/services/action_catalog_service.py
```

which loads

```
shared/action_catalog.json
```

Retrieve weights using

```
ActionCatalogService.get_weight(action)
```

---

# Scoring Actions

Only actions present inside

```
shared/action_catalog.json
```

should generate scoring events.

Ignore every other action.

---

# Output Contract

Expose

```
read_scoring_events()
```

inside

```
backend/app/engines/scoring_engine.py
```

Return

```
list[dict]
```

Each dictionary must contain

```
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
```

No additional fields.

Do not rename these fields.

---

# Scoring Rules

```
points =
ActionCatalogService.get_weight(action)
```

Skip actions whose weight is zero or missing.

```
is_real_delivery =
(action == "DELIVERED")
```

---

# Coding Guidelines

* Python 3.10+
* Follow PEP-8.
* Keep modules small and focused.
* Avoid duplicated logic.
* Prefer Pandas vectorized operations over `iterrows()`.
* Do not hardcode file paths.
* Do not hardcode action weights.
* Keep functions pure where possible.
* Raise meaningful exceptions instead of silently swallowing errors.
* Add type hints for public functions.

---

# Testing

Before committing, verify:

* CSVs load successfully.
* Employee join works.
* Location join works.
* Booking IDs are generated correctly.
* `read_scoring_events()` returns a non-empty `list[dict]`.
* The schema exactly matches the required contract.
* `runtime_state.py` successfully consumes the generated scoring events without modification.

---

# Current Progress

Completed:

* CSV Loader
* Event Processor

Remaining:

* Booking Builder
* Scoring Engine
* Integration Testing
* Runtime Validation
