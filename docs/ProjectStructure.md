# Project Structure

## Key Architecture Decisions

### Why `app/` stays at root
Expo Router v6 requires the `app/` directory to be at the project root.
It is hardwired by `"main": "expo-router/entry"` in package.json.
Moving it breaks the router. All screen files live here.

### Feature modules in `src/components/`
Each feature has its own subfolder:
- `dashboard/` — Dashboard widgets
- `assignments/` — Assignment CRUD
- `iamarks/` — IA marks management
- `aichecker/` — AI similarity checker
- `common/` — Shared (Navbar, Sidebar, PageHeader, TopNavbar)

### Backend
Follows MVC pattern:
- `routes/` — Express route definitions
- `controllers/` — Business logic per resource
- `config/` — Database connection
- `scripts/` — Migration and seed scripts

### Database
- Schema defined in `database/schema.sql`
- Migrations in `database/migrations/`
- Seed data in `database/seed/seed.js`
