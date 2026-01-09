# Christian-App (MVP)

This repository contains an offline-first demo of a short-lesson Christian study app.

Features:
- Vite + React + TypeScript SPA
- 30-unit structure (sample units 1–6 included as JSON)
- Lesson viewer with short study paragraphs and 1–2 verses
- Quick 5-question quizzes for each unit
- Progress saved in localStorage
- Export / Import progress (JSON)
- Local waitlist capture and CSV export

Local setup:

1. Install Node 18+ and npm
2. npm install
3. npm run dev

This is a minimal, zero-cost stack: no paid APIs are used.

New features added: a fresh, friendly UI, streak tracking, PWA manifest and service worker skeleton, daily reminder tools (in-app reminders and downloadable calendar reminder), autosave for quiz answers (toggleable), premium gating hooks for a freemium model, and export/import for local backups.

Next steps (optional): add a small push-server (open-source `web-push`) to enable web push notifications, add a simple Node+SQLite backend for server-side backups and user accounts, and integrate a payment provider if you choose a paid tier.

Push server (dev): A simple demo push server has been added in `server/` using `web-push` and `express`. It generates VAPID keys on startup and exposes:
- `GET /vapidPublicKey` — returns the VAPID public key
- `POST /subscribe` — accepts a subscription object and stores it in memory
- `POST /unsubscribe` — removes a subscription by `endpoint`
- `POST /sendNotification` — sends a payload to all stored subscriptions

To run (dev):

1. cd server && npm install
2. npm start

Note: For production, persist VAPID keys and subscriptions and secure this endpoint behind authentication.

Backup & accounts (dev demo): A minimal account/backup demo has been added to the same `server/` app to show how server-side backups can work (SQLite).
- `POST /signup` — create a test user with `{email,password}` (returns JWT)
- `POST /login` — login and receive a JWT
- `POST /backup` — (Bearer token) store a JSON backup payload for the authenticated user
- `GET /backup` — (Bearer token) retrieve the latest backup for the authenticated user

To try (dev):

1. cd server && npm install
2. npm start
3. POST /signup and /login to get a token, then call /backup with `Authorization: Bearer <token>`

Note: This demo is not production-ready. Persist keys and backups, add proper rate-limiting, and secure endpoints before any real data use.

CI/CD: A GitHub Actions workflow has been added to build and deploy the site (deploy step uses GitHub Pages).
