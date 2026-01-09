# Christian-App (MVP)

This repository contains an offline-first, freemium Christian study app with notifications, backups, and monetization ready.

## Features

### Core Learning
- **Vite + React + TypeScript** SPA (fast, modern stack)
- **6-unit structure** (expandable) with full content in `src/data/units.json`
- Lesson viewer with study paragraphs and Bible verses
- 5-question quizzes per unit with instant feedback
- Progress tracking (localStorage or server backup)
- Export / Import progress as JSON

### Engagement & Habits
- **Streak tracking** (consecutive study days)
- **Daily reminders** (in-app time picker + calendar export)
- **Web Push notifications** (opt-in, via service worker)
- **PWA support** (installable, offline access)
- Autosave quiz answers (toggleable in settings)

### Cross-Device & Accounts
- **Server-side backups** (Node + SQLite, optional)
- Account signup / login (JWT auth)
- Backup/restore progress across devices
- Email-based account recovery

### Monetization
- **Freemium model**: Units 1–2 free, Units 3+ premium
- **Stripe integration** (test mode ready)
- Pricing page with subscription options ($4.99/month)
- Premium features: unlimited quiz attempts, offline access, email support
- See [MONETIZATION.md](./MONETIZATION.md) for full details

### Privacy
- All data on-device by default (localStorage)
- Backups are encrypted in transit, stored securely
- No tracking, no ads (unless premium opt-in)
- See [PRIVACY.md](./PRIVACY.md) for full policy

## Quick Start

### Frontend (Dev)
```bash
npm install
npm run dev
```
Open http://localhost:5173 in your browser.

### Backend (Optional, Dev)
```bash
cd server
npm install
npm start
```
This starts the push server, backup server, and Stripe endpoints at http://localhost:4000.

#### Backend Routes
- **Push API**
  - `GET /vapidPublicKey` — VAPID public key for client subscription
  - `POST /subscribe` — register a push subscription
  - `POST /unsubscribe` — unregister a subscription
  - `POST /sendNotification` — send a notification to all subscribers

- **Backups & Auth**
  - `POST /signup` — create account with `{email, password}` (returns JWT)
  - `POST /login` — login and receive JWT
  - `POST /backup` — (Bearer auth) save encrypted progress
  - `GET /backup` — (Bearer auth) retrieve latest backup

- **Stripe (Test Mode)**
  - `GET /api/stripe/public-key` — return Stripe test public key
  - `POST /api/stripe/create-checkout-session` — create a subscription session
  - `POST /api/stripe/webhook` — handle Stripe events (optional)

### Build & Deploy
```bash
npm run build      # Creates dist/
npm run preview    # Preview production build
```

Deploy `dist/` to GitHub Pages (CI/CD configured) or any static host.

## Content Structure

Units are in `src/data/units.json`:
```json
[
  {
    "id": 1,
    "title": "Unit Title",
    "purpose": "What users will learn",
    "study": ["Paragraph 1", "Paragraph 2", ...],
    "verses": [{"ref": "John 3:16 NLT", "text": "..."}],
    "quiz": [{"type": "mc", "q": "...", "options": [...], "correct": 0, ...}]
  },
  ...
]
```

## Readability

Run the readability heuristic to check content grade level:
```bash
node scripts/readability_heuristic.cjs
cat readability-heuristic-report.md
```
Goal: Keep all units at grade 3–5 for broad accessibility.

## Monetization Setup

1. Get Stripe test keys from https://dashboard.stripe.com/test/apikeys
2. Set environment variables (or use defaults in dev):
   ```bash
   export STRIPE_PUBLIC_KEY="pk_test_..."
   export STRIPE_SECRET_KEY="sk_test_..."
   export STRIPE_WEBHOOK_SECRET="whsec_test_..."
   ```
3. Visit `/pricing` page to see the pricing UI
4. Test checkout with card `4242 4242 4242 4242`

For production:
- Replace test keys with live keys
- Update pricing IDs in `server/stripe.js` and `src/components/PricingPage.tsx`
- Add database subscription tracking
- Configure email notifications

## Architecture

```
Christian-App/
├── public/
│   ├── manifest.json     (PWA manifest)
│   ├── sw.js             (Service worker for push + cache)
│   └── icons/            (PWA icons)
├── src/
│   ├── components/       (React components)
│   │   ├── PricingPage.tsx      (Stripe checkout UI)
│   │   ├── PushSetup.tsx        (Push permission request)
│   │   ├── ExportImport.tsx     (Data backup/restore)
│   │   └── ...
│   ├── pages/            (Page components)
│   │   ├── Home.tsx
│   │   ├── Unit.tsx      (Quiz interface)
│   │   ├── Onboarding.tsx
│   │   └── ...
│   ├── data/
│   │   └── units.json    (Content database)
│   ├── styles.css        (CSS variables, responsive)
│   ├── App.tsx           (Router)
│   └── main.tsx          (Entry point, PWA registration)
├── server/               (Backend, optional)
│   ├── index.js          (Express server)
│   ├── db.js             (SQLite schema & init)
│   ├── stripe.js         (Stripe routes)
│   └── package.json
├── scripts/              (Tooling)
│   ├── readability_heuristic.cjs  (Content grade level)
│   └── ...
├── dist/                 (Built app, commit for Pages deploy)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── PRIVACY.md            (Privacy policy)
└── MONETIZATION.md       (Monetization model docs)
```

## Environment Variables

### Frontend (.env or vite.config.ts)
```
VITE_PUSH_SERVER_URL=http://localhost:4000  (for local push server)
```

### Backend (server/)
```
PORT=4000
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
PUSH_SERVER_JWT=dev-secret  (change in production)
```

## Testing

- **TypeScript**: `npx tsc --noEmit`
- **Build**: `npm run build`
- **Dev**: `npm run dev`
- **Push**: `npm run start:push-server`

## Next Steps

- [ ] Add more units (7–30) to expand content
- [ ] Integrate Stripe webhooks for real subscription tracking
- [ ] Productionize server (persist keys, DB backups, rate-limiting)
- [ ] Add E2E tests (Playwright)
- [ ] Launch beta to gather feedback
- [ ] Implement analytics (privacy-first event tracking)
- [ ] Add accessibility improvements (a11y audit)
- [ ] Mobile app (React Native or PWA wrapper)

## License

Licensed under MIT. See [LICENSE](./LICENSE) (if present).

## Contact

Questions or feedback? Email: hello@christianstudy.app

---

**Status**: MVP ready for beta testing. All core features functional, monetization scaffolded.

