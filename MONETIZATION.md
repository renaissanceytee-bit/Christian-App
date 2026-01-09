# Monetization Model

## Christian Study: Freemium Strategy

### Free Tier (Forever Free)
- **Access**: Units 1–2 only
- **Features**:
  - Read and study core content (Who is God, Who is Jesus)
  - 1 quiz attempt per unit (write-once)
  - Basic progress tracking (localStorage)
  - In-app reminders and calendar export
  - Offline access (PWA)
- **Goal**: Remove friction for discovery; let users experience the app risk-free

### Premium Tier ($4.99/month or $49/year)
- **Access**: All units (3+) unlimited
- **Features**:
  - Unlimited quiz attempts (revise and retest)
  - Advanced progress analytics (charts, time spent, weak areas)
  - Cross-device sync (backup & restore account)
  - Offline mode (download all lessons)
  - Ad-free experience
  - Email support (within 24 hours)
  - Priority feature requests
- **Positioning**: "Go deeper with confidence"

### Future Monetization Paths
1. **Premium Plus** ($9.99/month): Group lessons, pastoral commentary, audio versions
2. **Church Licenses**: Bulk subscriptions for small groups or churches (custom pricing)
3. **Sponsorship & Partnerships**: Faith-based organizations may sponsor free tier features
4. **Affiliate Commissions**: Link to related resources (books, courses, Bible apps) — rev-share model

---

## Why This Model Works

1. **Low Barrier**: Free tier teaches the core message; no payment gatekeeping faith
2. **High Perceived Value**: Premium unlocks serious study (unlimited attempts, sync, offline)
3. **Predictable Revenue**: Monthly subscription enables sustainable development
4. **Growth Friendly**: Free tier drives word-of-mouth; easy viral loop
5. **Mission Aligned**: We keep core content free; premium funds server costs & team

---

## Implementation Status

### Complete
- ✅ Free/Premium local gating hooks (localStorage `hasPremium` flag)
- ✅ Stripe test integration (checkout session creation, webhook scaffolding)
- ✅ Pricing page UI
- ✅ Payment backend skeleton (Node + Stripe)

### In Progress / Planned
- 🔄 Subscription verification (sync Stripe with user DB)
- 🔄 Email payment notifications
- 🔄 Subscription management dashboard (cancel, upgrade, invoice history)
- 🔄 Premium feature gating (Unit 3+, unlimited attempts, sync)
- 🔄 Payment error handling & retry logic
- 🔄 Regional tax compliance (VAT, sales tax)

---

## Stripe Test Keys (Development Only)

Use these for testing:
```
Stripe Publishable Key: pk_test_[your-test-key]
Stripe Secret Key: sk_test_[your-test-key]
Test Card: 4242 4242 4242 4242 (any future date, any CVC)
```

Replace with production keys before deployment.

---

## Customer Support

Premium members get:
- Email support within 24 hours
- Bug fix priority
- Feature request consideration
- Early access to new units

Support email: support@christianstudy.app

---

**Last Updated**: January 2026
