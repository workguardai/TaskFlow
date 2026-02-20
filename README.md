# TaskFlow (Task Rules Engine)

A production-quality Task Management System built with Python/Flask and React, demonstrating clean architecture, strict domain rule enforcement, and AI-assisted professional development.

## Quick Start

### Backend (Python + Flask)
```bash
cd backend
pip install -r requirements.txt
python -m app.main
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

## Key Technical Decisions

### Layered Architecture (DDD Lite)
The system is divided into strict layers to ensure **Change Resilience**:
- **API Layer**: Handles HTTP concerns.
- **Service Layer**: Orchestrates business operations.
- **Domain Layer**: Pure business logic (Invariants).
- **Persistence Layer**: Data storage (SQLAlchemy).

### Strict Rule Enforcement
Rules are defined as pure functions in `backend/app/domain/rules.py`. This ensures **Correctness** by centralizing the "brain" of the application away from framework-specific code.

### Robust Validation
We use **Pydantic** on the backend and **Zod** (in inferred types) on the frontend. This provides **Interface Safety**, guarding the system against malformed data.

## AI Usage & Guidance

This project was built using "Agentic AI" workflows. To maintain system integrity, we used a specific guidance file:
- **[AI Guidance](file:///c:/Projects/assignment/ai_guidance.md)**: Contains constraints on layer logic, testing requirements, and forbidden practices (e.g., no DB calls in routes).

**Review Process**: All AI-generated code was critically reviewed for adherence to these guidelines, specifically ensuring that domain rules were never bypassed.

## Project Structure & Walkthrough

### Backend (Python + Flask)
The backend is structured to separate business logic from technical infrastructure:
- **`app/main.py`**: The application entry point. It initializes the Flask app, sets up SQLAlchemy, and registers the API routes.
- **`app/db.py`**: Manages the database connection and session lifecycle.
- **`app/api/routes.py`**: Defines the RESTful endpoints. It focuses on request orchestration and delegating to services.
- **`app/services/task_service.py`**: The "Business Orchestrator". It coordinates database operations and ensures domain rules are invoked before any state change.
- **`app/domain/rules.py`**: **The Core Rules Engine**. Contains pure Python functions that enforce the assessment's invariants (Completion, Assignment, and Overlap constraints).
- **`app/models/models.py`**: Defines the SQLAlchemy database schemas for `User` and `Task`.
- **`app/schemas/schemas.py`**: Uses Pydantic to enforce strict data validation for every request and response.
- **`app/seed.py`**: A utility script to populate the database with consistent test data.

### Frontend (React + TS)
A modular and type-safe frontend built with Vite:
- **`src/App.tsx`**: Sets up the global layout, navigation sidebar, and page routing.
- **`src/pages/Tasks.tsx`**: The main interface for managing tasks, displaying rule violation errors clearly to the user.
- **`src/pages/Users.tsx`**: Management interface for users and their active/inactive status.
- **`src/api/client.ts`**: A centralized, type-safe API client that handles communication with the Flask backend.
- **`src/types/index.ts`**: Contains the shared TypeScript interfaces used across the application.
- **`src/lib/utils.ts`**: Helper utilities for dynamic Tailwind CSS styling.

## Verification

### Automated Tests
The system's correctness is proven by a suite of tests that verify both successful flows and every single rule violation:
```bash
cd backend
python -m pytest tests/test_tasks.py
```

## Walkthrough Video
*(Recording coming soon - explaining architecture, AI usage, and extension approach)*

## Extension Approach

- **New Rules**: Add to `domain/rules.py` and invoke in the Service.
- **Observability**: Failures are captured via structured logging and returned with unique error codes for frontend diagnosis.
