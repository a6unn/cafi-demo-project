# CAFI Notes API

> Demo project for the **CAFI Inaugural Meetup** — *"From Prompt to Production: A LIVE Claude Code Build Session"*
>
> April 3, 2026 | Ideas2IT, Guindy, Chennai

A notes and collections REST API built with Node.js, Express, Prisma, and SQLite. This project is designed to demonstrate how to use **Claude Code** effectively — with clear patterns that AI can follow.

## What This Project Is For

This project was built for the [CAFI meetup session](https://www.meetup.com/chennai-ai-fluency-initiative-cafi/events/313941376/) where we demonstrate:

1. **Round 1 (The Wrong Way):** Using Claude Code without context — no CLAUDE.md, no Plan Mode, vague prompts
2. **Round 2 (The Right Way):** Using Claude Code with proper workflow — CLAUDE.md, Plan Mode, specific prompts, code review

The task for both rounds: **Add a bookmarks feature** (CRUD + pagination + validation + tests).

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm installed
- (Optional) Claude Code installed — `npm install -g @anthropic-ai/claude-code`

### Setup

```bash
# Clone the repo
git clone https://github.com/a6unn/cafi-demo-project.git
cd cafi-demo-project

# Install dependencies
npm install

# Set up the database
cp .env.example .env
npx prisma migrate dev --name init

# Seed demo data
npx prisma db seed

# Start the server
npm run dev
```

The API runs on `http://localhost:3000`.

### Run Tests

```bash
npm test
```

## API Endpoints

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | List notes (cursor-based pagination) |
| GET | `/api/notes/:id` | Get a single note |
| POST | `/api/notes` | Create a note |
| PATCH | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |

Query params for listing: `limit`, `cursor`, `collectionId`, `pinned`, `search`

### Collections
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/collections` | List collections |
| GET | `/api/collections/:id` | Get collection with notes |
| POST | `/api/collections` | Create a collection |
| PATCH | `/api/collections/:id` | Update a collection |
| DELETE | `/api/collections/:id` | Delete a collection |

### Tags
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tags` | List all tags |
| POST | `/api/tags` | Create a tag |
| DELETE | `/api/tags/:id` | Delete a tag |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |

## Project Structure

```
cafi-demo-project/
├── CLAUDE.md                  # AI context file (read by Claude Code)
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.js                # Demo data seeder
├── src/
│   ├── app.js                 # Express app setup
│   ├── index.js               # Server entry point
│   ├── routes/
│   │   ├── notes.js           # Notes CRUD + pagination
│   │   ├── collections.js     # Collections CRUD + pagination
│   │   └── tags.js            # Tags CRUD
│   ├── schemas/
│   │   ├── notes.js           # Zod validation for notes
│   │   ├── collections.js     # Zod validation for collections
│   │   └── tags.js            # Zod validation for tags
│   ├── middleware/
│   │   ├── errorHandler.js    # Centralized error handling
│   │   └── validate.js        # Zod validation middleware
│   └── utils/
│       ├── prisma.js          # Prisma client singleton
│       └── pagination.js      # Cursor-based pagination helpers
├── __tests__/
│   ├── notes.test.js          # Notes endpoint tests
│   └── collections.test.js    # Collections endpoint tests
└── package.json
```

## Key Patterns (What Claude Code Should Follow)

These are the conventions established in this project. When you ask Claude Code to add a new feature, it should follow these patterns:

- **Cursor-based pagination** using `buildPagination()` and `buildPaginationResponse()` from `src/utils/pagination.js`
- **Zod validation** with schemas in `src/schemas/` and the `validate()` middleware
- **Centralized error handling** — all routes use `try/catch` with `next(err)`
- **Consistent response formats** — POST returns 201, DELETE returns 204
- **Tests** in `__tests__/` using Jest + Supertest

## Try It Yourself

### Exercise: Add a Bookmarks Feature

**The task:** Add a bookmarks feature where users can save URLs with a title and optional description. Include CRUD operations, cursor-based pagination, Zod validation, and tests.

**Round 1 — The Wrong Way (try this first):**
```bash
claude
# Then type: "Build me a bookmarks API with CRUD and pagination"
```

**Round 2 — The Right Way (try this second):**
```bash
# Clear context first
/clear

# Enter Plan Mode
# Press Shift+Tab twice

# Then type:
# "Read the existing routes in src/routes/ in depth. Understand the patterns —
#  how endpoints are structured, how validation is done, how pagination works,
#  how errors are handled. Write your findings in research.md"

# After research, type:
# "I want to add a bookmarks feature. Each bookmark has a title (required),
#  url (required, must be valid URL), and description (optional).
#  Follow the exact patterns from notes.js. Include Prisma model, route,
#  Zod schema, cursor-based pagination, and tests. Write a plan.md first.
#  Don't implement yet."

# Review the plan, then:
# Exit Plan Mode (Shift+Tab back to Normal)
# "Implement the plan. Mark tasks done in plan.md. Don't stop until complete.
#  Run npm test after each major change."
```

Compare the two outputs. Notice the difference in quality.

## About CAFI

The **Chennai AI Fluency Initiative (CAFI)** is a community of developers, builders, and learners building AI literacy in Chennai through hands-on sessions.

- [Meetup Group](https://www.meetup.com/chennai-ai-fluency-initiative-cafi/)
- [Follow Arun on LinkedIn](https://www.linkedin.com/in/arungcse/)

*This event is in association with [Ideas2IT Technologies](https://www.ideas2it.com).*

## License

MIT
