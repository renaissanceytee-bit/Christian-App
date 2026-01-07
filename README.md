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

New features added: a fresh, friendly UI, streak tracking, PWA manifest and service worker skeleton, daily reminder tools (in-app reminders and downloadable calendar reminder), and export/import for local backups.

Next steps (optional): add a small push-server (open-source `web-push`) to enable web push notifications, or add persistent backend with SQLite if you want server-side backups or accounts.
