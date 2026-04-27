# Courtlane

[![CI](https://github.com/ibalosh/courtlane/actions/workflows/ci.yml/badge.svg)](https://github.com/ibalosh/courtlane/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white)](https://zod.dev/)

Courtlane is a court booking app for clubs and sports centers. It combines customer management, account-based access, and weekly court scheduling in a single TypeScript monorepo.

Shared Zod contracts keep the frontend and backend aligned, while Prisma handles the PostgreSQL data layer.

![Courtlane preview](./screenshot.png)

## Tech Stack

- frontend: React 19, Vite, TanStack Query
- backend: NestJS
- contracts and validation: Zod
- database: Prisma + PostgreSQL
- workspace: Nx + Yarn workspaces

## Repository Structure

- `apps/web`: frontend for authentication, customer management, and reservation scheduling
- `apps/api`: API for auth, users, customers, and reservations
- `libs/contracts`: shared Zod schemas and typed API contracts
- `libs/db`: Prisma schema, migrations, and database utilities

## Getting Started

Install dependencies, copy the environment file, prepare the database, and start the app:

```bash
yarn install
cp .env.example .env
yarn db:prepare
yarn start
```

The default local environment is:

```env
DATABASE_URL=postgresql://courtlane:courtlane@localhost:5432/courtlane
API_PORT=3000
API_BASE_URL=http://localhost:3000/api
WEB_APP_URL=http://localhost:4200
```
