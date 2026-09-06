# Robotics Club — MITS Generated Site

This project was scaffolded by the **MITS Web** framework.

## Structure

```
robotics/
├── client/      # Public-facing website
├── admin/       # Org admin panel
├── server/      # API layer (Express + Prisma)
├── database/    # Prisma schema + migrations + seed
├── mits.config.ts
└── package.json
```

## Getting Started

1. Set your `DATABASE_URL` in `database/.env`
2. Run migrations: `npx prisma migrate dev` (from `database/`)
3. Seed the database: `npx prisma db seed` (from `database/`)

## Tech Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL (Neon) via Prisma ORM
- **Auth:** bcrypt + JWT
