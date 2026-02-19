# AI Guidance for Task Rules Engine

This document provides constraints and principles for AI-led maintenance and evolution of this codebase.

## Code Conventions

- **Stay Small**: Prefer small, single-purpose functions.
- **Explicit over Magic**: Avoid metaprogramming or overly clever decorators for internal logic. Use explicit service calls.
- **Layer Integrity**:
    - **API Layer**: No database queries, no rule logic. Only orchestration of validation -> service -> serialization.
    - **Service Layer**: Responsible for DB commits and rule orchestration.
    - **Domain Layer**: Pure logic. No dependencies on database or web framework.
- **Strong Typing**: Always use Python type hints. Use Pydantic for any data crossing the API boundary.

## Rule Enforcement Discipline

When adding new rules:
1. Define the invariant clearly in `domain/rules.py`.
2. Implement a validation function that raises `DomainException` on violation.
3. Integrate the call into `TaskService`.
4. Add a corresponding test case in `tests/test_tasks.py` that asserts a `400` response with `RULE_VIOLATION`.

## Testing Principles

- All business logic must be tested.
- Tests must use the `client` fixture to verify endpoints.
- Tests must be deterministic. Use fixed dates or offsets (e.g., `date.today()`) consistently.
- Ensure the test database is reset after each test (handled by `memory` DB and `conftest.py` setup).

## Forbidden Practices

- **Never** skip validation schemas for quick fixes.
- **Never** perform database operations directly in routes.
- **Never** swallow `DomainException` or return generic `500` errors for predictable rule violations.
- **Avoid** using `Global` variables for state.
