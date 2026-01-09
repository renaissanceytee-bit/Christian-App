# Christian-App (MVP)

This repository contains an offline-first, freemium Christian study app with daily quiz limits, enhanced onboarding, notifications, backups, and monetization ready.

## Features

### Core Learning
- **Vite + React + TypeScript** SPA (fast, modern stack)
- **6-unit structure** (expandable) with full content in `src/data/units.json`
- Lesson viewer with study paragraphs and Bible verses
- 5-question quizzes per unit with instant feedback
- Progress tracking (localStorage or server backup)
- Export / Import progress as JSON
- **All 6 units free** with daily quiz limits for engagement

### Engagement & Habits
- **Enhanced Onboarding**: Multi-step questionnaire (background, goals, study time, reminders)
- **Daily Quiz Limits**: Free users get 3 incorrect answers/day (resets at midnight)
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
- **Freemium model**: All units free with daily quiz limits (3 incorrect answers/day)
- **Premium tiers**:
  - $3.99/month (monthly subscription)
  - $35.99/year (annual subscription, 34% savings = $2.99/month)
- **Premium features**: 
  - Unlimited quiz attempts (no daily limits)
  - All 6 units, unlimited access
  - Offline access, email support, priority requests
- **Discount popups**: Show 50% off promotion when daily limit reached
- **Built-in ads**: Promotional banners showing limited-time offers
- **Stripe integration** (test mode ready)
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
  - `POST /api/stripe/create-session` — create a subscription session (monthly or annual)
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
5. Visit `/units/1` to test daily quiz limits (3 incorrect answers per day)

For production:
- Replace test keys with live keys
- Update price IDs in `server/stripe.js` for $3.99/month and $35.99/year
- Add database subscription tracking
- Configure email notifications
- Update STRIPE_WEBHOOK_SECRET for production webhooks

## Architecture

```
Christian-App/
├── public/
│   ├── manifest.json     (PWA manifest)
│   ├── sw.js             (Service worker for push + cache)
│   └── icons/            (PWA icons)
├── src/
│   ├── components/       (React components)
│   │   ├── PricingPage.tsx          (Stripe checkout UI, new pricing)
│   │   ├── DiscountPopup.tsx        (Daily limit reached popup)
│   │   ├── PromotionalAd.tsx        (50% off promotional ad)
│   │   ├── PushSetup.tsx            (Push permission request)
│   │   ├── ExportImport.tsx         (Data backup/restore)
│   │   ├── Quiz.tsx                 (Quiz with daily limit tracking)
│   │   └── ...
│   ├── pages/            (Page components)
│   │   ├── Home.tsx
│   │   ├── Unit.tsx              (Quiz interface with promotional ad)
│   │   ├── Onboarding.tsx        (Enhanced multi-question onboarding)
│   │   └── ...
│   ├── utils/
│   │   └── dailyLimitUtils.ts    (Daily limit management utilities)
│   ├── data/
│   │   └── units.json    (Content database)
│   ├── styles.css        (CSS variables, responsive)
│   ├── App.tsx           (Router)
│   └── main.tsx          (Entry point, PWA registration)
├── server/               (Backend, optional)
│   ├── index.js          (Express server)
│   ├── db.js             (SQLite schema & init)
│   ├── stripe.js         (Stripe routes for $3.99/month and $35.99/year)
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
- **Daily Limits**: Test by answering 3 questions incorrectly on `/units/1`

## Next Steps

- [ ] Add more units (7–30) to expand content
- [ ] Integrate Stripe webhooks for real subscription tracking
- [ ] Productionize server (persist keys, DB backups, rate-limiting)
- [ ] Add E2E tests (Playwright)
- [ ] Launch beta to gather feedback
- [ ] Implement analytics (privacy-first event tracking)
- [ ] Add accessibility improvements (a11y audit)
- [ ] Mobile app (React Native or PWA wrapper)
- [ ] Family plans for group subscriptions

## License

Licensed under MIT. See [LICENSE](./LICENSE) (if present).

## Contact

Questions or feedback? Email: hello@christianstudy.app

---

**Status**: MVP ready for beta testing. Enhanced onboarding, daily quiz limits, and new pricing ($3.99/month, $35.99/year) implemented. All core features functional, monetization fully scaffolded.

