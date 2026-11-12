# Library Management System

A NestJS + Prisma + PostgreSQL API for managing a library's book catalog.

## Setup

```bash
cd api
npm install
cp .env.example .env        # then add your hosted PostgreSQL connection string
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
```

Use `npx prisma studio` to browse the data.

## Schema Decisions

**Why Book references Genre instead of embedding it.**
PostgreSQL is a relational database, so relationships between entities are expressed with foreign keys. Each genre is stored once in the `Genre` table, and every `Book` points to it through `genreId` (declared with `@relation`). This gives us:

- **One source of truth:** renaming a genre means updating a single row, and every book reflects the change. Embedding a copy of the genre in each book would duplicate the data and let the copies drift apart.
- **Integrity:** the foreign key stops a book from pointing to a genre that doesn't exist.
- **Easy querying:** fetching all books in a genre is a simple filter on `genreId`, and Prisma gives typed access to the related data through the `genre` and `books` relation fields.

**Other decisions**

- `Role` is an enum (`PATRON`, `LIBRARIAN`) so the database rejects any other value. New users default to `PATRON`.
- `isbn` (Book), `email` (User), and `name`/`slug` (Genre) are `@unique` so duplicates are rejected at the database level.
- `User` stores `passwordHash`, never a plain password.
- `availableCopies` is tracked separately from `totalCopies` so borrowing can reduce availability without losing the total.
- The seed script uses `upsert`, so it can be run repeatedly without unique-constraint errors.

## Stretch Notes

**Review model:** `Review` links `Book` and `User` with `bookId` and `userId` foreign keys (rating, optional comment).

**Prisma vs. a document database:** In a document database I would have been tempted to nest the genre inside each book document. Prisma pushed me to model genres as their own table and link to them, and the schema file became the single source of truth for the tables, the types, and the relationships.