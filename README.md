# Task Rules Engine (Flask)

This is a production-quality Flask backend for a Task Rules Engine, built with a focus on correctness, structure, and safe state transitions.

## Architecture

The system follows a layered architecture to ensure separation of concerns:

- **API Layer** (`backend/app/api/`): Flask routes that handle HTTP requests, validate input using Pydantic, and return structured JSON responses. Business logic is strictly kept out of this layer.
- **Service Layer** (`backend/app/services/`): Orchestrates business operations and enforces domain rules. This is the entry point for all data mutations.
- **Domain Layer** (`backend/app/domain/`): Contains the core invariants and rules of the system. This layer has no dependencies on external frameworks like Flask or SQLAlchemy.
- **Persistence Layer** (`backend/app/models/`): SQLAlchemy models for `User` and `Task`.
- **Schema Layer** (`backend/app/schemas/`): Pydantic models for robust data validation and serialization.

## Domain Rules (Enforced)

The system enforces three critical invariants:

1. **Rule 1 — Completion constraint**: A task cannot be marked as `completed` if the current date is before the task's `start_date`.
2. **Rule 2 — Assignment constraint**: A task cannot be assigned to a user whose status is `inactive`.
3. **Rule 3 — Overlap constraint**: A user cannot be assigned to two tasks that overlap in time (inclusive of start and end dates).

## Performance & Correctness

- **Validation**: Every request is validated by Pydantic before reaching the service layer.
- **Error Handling**: Domain rule violations return a consistent `HTTP 400` with a specific error code (`RULE_VIOLATION`) and a descriptive message.
- **Structured Logging**: Key events (task creation, assignment, status changes, and rule violations) are logged with a structured format for observability.
- **Testing**: A comprehensive suite of automated tests verifies both happy paths and every rule violation scenario.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Run the Application**:
   ```bash
   python -m app.main
   ```
   The server will start at `http://127.0.0.1:5000`.

## Test Instructions

To run the automated tests:
```bash
python -m pytest tests/test_tasks.py
```

## Extension Strategy

- **Adding New Rules**: New rules should be added as validation functions in `backend/app/domain/rules.py` and invoked by the `TaskService`.
- **Adding Task States**: Add the new state to the `TaskStatus` enum in `backend/app/models/models.py`. The Pydantic schemas will automatically handle the new enum value.
- **New Fields**: Add the field to the SQLAlchemy model and the corresponding Pydantic schemas.
