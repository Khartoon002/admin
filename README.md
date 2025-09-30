# CLINTON FX — Next.js 14 Admin + Public Registrations + Bots Panel

Production-ready monorepo (single app) implementing:
- Private Admin (cookie session)
- Public bots and registration links
- Theme tokens + dark/light, palette switching
- Prisma (Supabase Postgres), deployable to Vercel
- Bots HTML versioning + public /bots/[slug]
- One-time registration links → Downline creation → WhatsApp redirect + AutoRemote
- CSV exports
- Keep-warm ping endpoint for Vercel Cron

## Prerequisites
- Node.js LTS (>=18)
- Supabase or Postgres connection strings

## Setup
```bash
cp .env.example .env
# fill values
npm i
npx prisma migrate dev --name init
npm run dev
```

## Build / Deploy
- Ensure env vars are set in Vercel
- Add Cron Job: `*/5 * * * *` → `/api/ping`
- Build command runs `prisma generate` automatically

## Cookies & Security
- Admin auth via `adminSession` httpOnly cookie (7 days)
- Bots panel requires `bots_admin` cookie matching `BOTS_ADMIN_TOKEN`
- Public routes: `/registrations/*`, `/bots/*`, `/admin/bots/login`, `/admin/bots/logout`
- All other routes require admin session
