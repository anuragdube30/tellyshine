# Telly Shine

Premium full-stack TV serial & entertainment news website built with Next.js, Prisma, SQLite and NextAuth.

## Important: No Docker / No PostgreSQL

This ready-to-run version uses a local SQLite database. You do **not** need Docker Desktop or PostgreSQL.

## Windows - easiest setup

### 1. Install Node.js

Install Node.js 18+ (Node 20+ recommended).

### 2. Open this folder in VS Code

Open a terminal in the `telly-shine` folder.

### 3. Install dependencies

```powershell
npm install
```

### 4. Automatically set up the database + admin

```powershell
npm run setup
```

This automatically:
- creates the local SQLite database
- creates `.env` and an `AUTH_SECRET` if needed
- generates Prisma Client
- creates all database tables
- loads demo content
- creates/resets the admin account

You can also double-click `setup-local-db.cmd`.

### 5. Start the website

```powershell
npm run dev
```

Open:

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin/login

## Admin login

**Email:** `admin@tellyshine.com`

**Password:** `TellyShine@123`

If the password ever stops working, run:

```powershell
npm run db:reset-admin
```

## Database

The SQLite file is created automatically at `prisma/dev.db`. No database server is required.

## Cloudinary

Cloudinary is optional. The site works without it. Add Cloudinary credentials to `.env` only if you want to use the admin image-upload feature.

## Useful commands

| Command | Purpose |
|---|---|
| `npm run setup` | First-time local setup |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run db:push` | Apply Prisma schema changes |
| `npm run db:seed` | Seed demo content |
| `npm run db:reset-admin` | Reset admin credentials |
| `npm run db:studio` | Open Prisma Studio |

## Main features

- Public entertainment/news website
- TV serials, news, videos and celebrities
- Trending and search pages
- Dark/light theme
- Admin dashboard
- News/serial/video/celebrity CRUD
- Categories and breaking-news management
- Messages inbox
- Site settings
- Credentials-based admin authentication
- Seeded demo content
