# Database

`libs/db` owns the Prisma schema, generated client wiring, and DB-level utilities used by the API.

## Purpose

- Define the PostgreSQL schema
- Configure the Prisma client
- Provide seed and migration support
- Keep persistence details out of the frontend and shared contracts

## Main Entities

- `Account`
- `User`
- `Session`
- `Court`
- `Customer`
- `Reservation`

## Relationship Diagram

```mermaid
erDiagram
    Account ||--o{ User : has
    Account ||--o{ Court : has
    Account ||--o{ Customer : has
    Account ||--o{ Reservation : has

    User ||--o{ Session : has

    Court ||--o{ Reservation : booked_for
    Customer ||--o{ Reservation : owns

    Account {
      int id
      string name
    }

    User {
      int id
      int accountId
      string email
      string name
      string passwordHash
    }

    Session {
      int id
      int userId
      string tokenHash
      datetime expiresAt
    }

    Court {
      int id
      int accountId
      string name
      int sortOrder
      boolean isActive
    }

    Customer {
      int id
      int accountId
      string name
      string email
      string phone
      string notes
    }

    Reservation {
      int id
      int accountId
      int courtId
      int customerId
      datetime startsAt
      datetime endsAt
    }
```

## Important Rules

- Reservations are account-scoped.
- Courts are account-scoped.
- Customers are account-scoped.
- Reservations reference customers with `onDelete: Restrict`.

That last rule is why a customer cannot be deleted while reservations still point to it.

## Useful Commands

```bash
yarn db:prepare
yarn db:reset
yarn db:seed
```

