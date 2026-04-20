# API

The Courtlane API is a NestJS application that serves authentication, customer management, reservation management, and a simple health check.

## Modules

- `auth`
- `customers`
- `reservations`
- `health`

Most business endpoints are account-scoped through the authenticated user session.

## Auth Model

- Session-based auth using cookies
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

`/auth/me` can return the current authenticated user or `null`.

## Endpoints

### Health

- `GET /`
  - Returns `{ status: "OK" }`

### Auth

- `POST /auth/signup`
  - Creates a user and account session
- `POST /auth/login`
  - Logs in an existing user
- `POST /auth/logout`
  - Clears the active session
- `GET /auth/me`
  - Returns the current user or `null`

### Customers

- `GET /customers`
  - Returns the full customer list for the current account
- `GET /customers/search?query=...`
  - Returns matching customers for the current account
- `POST /customers`
  - Creates a customer
- `PATCH /customers/:id`
  - Updates a customer
- `DELETE /customers/:id`
  - Deletes a customer if it has no reservations

Delete behavior:

- If the customer still has reservations, the API returns a conflict error instead of deleting it.

### Reservations

- `GET /reservations/week?start=YYYY-MM-DD`
  - Returns the weekly schedule, courts, slots, and reservations
- `POST /reservations`
  - Creates a reservation
- `PATCH /reservations/:id`
  - Reassigns the reservation to a different customer
- `DELETE /reservations/:id`
  - Clears the reservation

## Validation

Request and response validation is contract-driven:

- request payloads and params are validated with schemas from `@courtlane/contracts`
- responses are validated by response interceptors against the same shared schemas

That keeps the API behavior aligned with the frontend transport types.

