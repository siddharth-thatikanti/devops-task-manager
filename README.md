# DevOps Task Manager

A small three-tier task management application built with React, Node.js/Express, and PostgreSQL.

## Features
- List tasks
- Create tasks
- Mark tasks completed / reopen them
- Delete tasks
- Backend health and readiness endpoints

## Prerequisites
- Node.js 20+
- PostgreSQL 14+

This repository contains only the application source code. It does not include Docker, Kubernetes, Terraform, CI/CD workflows, or cloud deployment configuration.

## 1. Create the database

Create a PostgreSQL database and run the schema:

```bash
createdb devops_tasks
psql -d devops_tasks -f database/init.sql
```

If your PostgreSQL setup requires a username or host, use your normal `psql` connection options.

## 2. Configure and start the backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Edit `backend/.env` with your PostgreSQL credentials. The backend listens on port 5000 by default.

Endpoints:
- `GET /api/tasks`
- `POST /api/tasks` with JSON `{ "title": "Learn PostgreSQL" }`
- `PATCH /api/tasks/:id` with JSON `{ "completed": true }`
- `DELETE /api/tasks/:id`
- `GET /health`
- `GET /ready`
- `GET /version`

## 3. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

The Vite development server proxies `/api`, `/health`, `/ready`, and `/version` to `http://localhost:5000`.

## Troubleshooting
- `ECONNREFUSED`: confirm PostgreSQL is running and host/port in `backend/.env` are correct.
- `password authentication failed`: update `DB_USER` and `DB_PASSWORD`.
- `database does not exist`: create `devops_tasks` or update `DB_NAME`.
