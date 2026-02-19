# Taskflow Frontend

A modern, responsive, and rules-aware frontend for the Task Rules Engine.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (replicated)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite

## Project Structure

```text
frontend/
├── src/
│   ├── api/          # Backend communication (fetch wrapper)
│   ├── components/   # Reusable UI parts & forms
│   │   ├── layout/   # Navbar and common layout
│   │   ├── users/    # User-specific components
│   │   ├── tasks/    # Task-specific components
│   │   └── ui/       # Fundamental UI building blocks
│   ├── hooks/        # Custom React hooks (toast, etc.)
│   ├── pages/        # High-level screens
│   ├── types/        # TypeScript interfaces
│   ├── App.tsx       # Main entry & routing
│   └── main.tsx      # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- Backend running at `http://localhost:5000`

### Installation

```bash
cd frontend
npm install
```

### Running the App

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Integration

The frontend communicates with the Flask backend using a standard `fetch` wrapper in `src/api/client.ts`. 

- **Error Handling**: Every API response is checked for success. If a rule violation (400 Bad Request) occurs, the error message is extracted and displayed to the user via a global notification system (Toast).
- **Type Safety**: All API requests and responses are strictly typed using interfaces in `src/types/index.ts`.

## Features

- **Landing Page**: Overview of system capabilities.
- **User Management**: List users and create new ones.
- **Task Management**:
  - Create tasks with date ranges.
  - Assign tasks to active users.
  - Update task status with transition enforcement.
- **Rule Visibility**: All systemic constraints (e.g., "User is inactive", "Tasks overlap") are surfaced as clear user-facing messages.
