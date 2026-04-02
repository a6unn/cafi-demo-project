# Project: CAFI Notes API

## Stack
- Node.js 22 + Express 4
- SQLite via Prisma ORM
- Zod for input validation
- Jest + Supertest for testing

## Architecture
- Routes in `src/routes/` — one file per resource
- Zod schemas in `src/schemas/` — one file per resource
- Middleware in `src/middleware/` — validate.js wraps Zod, errorHandler.js catches all errors
- Prisma client singleton in `src/utils/prisma.js`
- Pagination utility in `src/utils/pagination.js`

## Conventions
- Use cursor-based pagination (NEVER offset). See `src/utils/pagination.js` for helpers.
- All endpoints use try/catch with `next(err)` — errors flow to the centralized errorHandler.
- POST returns 201, DELETE returns 204 with no body.
- PATCH for updates (not PUT) — only send fields that change.
- All request bodies validated with Zod via the `validate()` middleware.
- Include related data using Prisma `include` — keep responses rich.
- Transform join table results (e.g., NoteTag) to flat arrays in route handlers.

## Rules
- NEVER use console.log in route handlers — use the errorHandler for errors.
- NEVER use offset pagination — always cursor-based using buildPagination/buildPaginationResponse.
- Follow existing patterns in `src/routes/notes.js` for any new resource.
- Keep Zod schemas in separate files under `src/schemas/`.
- All new features MUST have tests in `__tests__/`.

## Commands
- `npm test` — run all tests
- `npm run dev` — start dev server with hot reload
- `npx prisma migrate dev` — create/apply migrations
- `npx prisma db seed` — seed demo data
- `npm run lint` — lint the codebase

## Testing Patterns
- Tests live in `__tests__/[resource].test.js`
- Use `supertest` to make HTTP requests against the Express app
- Clean up DB state in `beforeAll` — delete in reverse dependency order
- Disconnect Prisma in `afterAll`
- Test: success cases, validation errors, 404s, and pagination
