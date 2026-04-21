# Courtlane

[![CI](https://github.com/ibalosh/courtlane/actions/workflows/ci.yml/badge.svg)](https://github.com/ibalosh/courtlane/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white)](https://zod.dev/)

Courtlane is a small full-stack booking app for clubs and sports centers that need a simple way to manage customers and reserve courts on a weekly schedule.

It combines a React frontend, a NestJS API, shared Zod contracts, and a Prisma/PostgreSQL data layer in one TypeScript monorepo.

## What It Includes

- user authentication and account-based access
- customer management for recurring players and contacts
- court and weekly reservation scheduling
- shared request and response contracts between frontend and backend

## Tech Stack

- frontend: React 19, Vite, TanStack Query
- backend: NestJS
- validation/contracts: Zod
- database: Prisma + PostgreSQL
- workspace tooling: Nx + Yarn workspaces

## Repository Structure

- `apps/web`: React + Vite frontend for login, customer management, and reservation scheduling
- `apps/api`: NestJS backend API for auth, users, customers, and reservations
- `libs/contracts`: shared Zod schemas and typed contracts between the frontend and backend
- `libs/db`: Prisma database layer and seed/migration tooling

## Getting Started

Install dependencies, configure the environment, prepare the database, and start the workspace:

```bash
yarn install
cp .env.example .env
yarn db:prepare
yarn start
```

The API currently expects at least:

```env
API_PORT=4400
WEB_APP_URL=http://localhost:4200
DATABASE_URL=postgresql://courtlane:courtlane@localhost:5432/courtlane
```

## Preview

Landing page preview of the Courtlane booking experience.

![Courtlane preview](./screenshot.png)
