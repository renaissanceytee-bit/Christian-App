# Monetization Model

## Christian Study: Freemium Strategy with Daily Quiz Limits

### Free Tier (Forever Free)
- **Access**: All 6 units available to everyone
- **Quiz Limits**: 3 incorrect answers per day (resets at midnight)
- **Features**:
  - Read and study all core content (Who is God, Who is Jesus, God's Character, etc.)
  - Quiz lessons with daily limit tracking
  - Basic progress tracking (localStorage)
  - In-app reminders and calendar export
  - Offline access (PWA)
  - Daily promotional offers (50% off upgrade)
- **Goal**: Remove friction for discovery; let users experience comprehensive learning risk-free. Daily limits encourage engagement and conversion without blocking access.

### Premium Tier ($3.99/month or $35.99/year)
- **Access**: All units (6) with unlimited access
- **Features**:
  - ✓ Unlimited quiz attempts (no daily limits)
  - ✓ All 6 units available anytime
  - ✓ Advanced progress analytics (charts, time spent, weak areas)
  - ✓ Cross-device sync (backup & restore account)
  - ✓ Offline mode (download all lessons)
  - ✓ Ad-free experience
  - ✓ Email support (within 24 hours)
  - ✓ Priority feature requests
- **Pricing Strategy**:
  - Monthly: $3.99/month (ideal for trying)
  - Annual: $35.99/year = $2.99/month (34% savings, ~$12 saved per year)
- **Positioning**: "Unlimited learning. Study at your own pace."

### Daily Limit Mechanics
- **Free Users**: Limited to 3 incorrect quiz answers per day
- **When Limit Reached**:
  1. User sees warning before final attempt
  2. After 3 incorrect, quiz interface is disabled
  3. Discount popup appears: "50% OFF TODAY" with upgrade options
  4. Promotes monthly ($3.99) and annual ($35.99/year) plans
- **Premium Users**: No daily limits, unlimited attempts
- **Reset**: Automatic reset at midnight UTC

### Future Monetization Paths
1. **Premium Plus** ($9.99/month): Group lessons, pastoral commentary, audio versions
2. **Church Licenses**: Bulk subscriptions for small groups or churches (custom pricing)
3. **Sponsorship & Partnerships**: Faith-based organizations may sponsor free tier features
4. **Affiliate Commissions**: Link to related resources (books, courses, Bible apps) — rev-share model
5. **Family Plans**: Multiple user accounts under one subscription

---

## Why This Model Works

1. **Low Barrier**: All content free; no payment gatekeeping faith learning
2. **Strategic Friction**: Daily limits create gentle nudge toward premium without blocking core experience
3. **High Perceived Value**: Premium unlocks serious study and removes time-based friction
4. **Predictable Revenue**: Monthly subscription enables sustainable development
5. **Growth Friendly**: Free tier with daily limits drives word-of-mouth; easy viral loop
6. **Conversion Friendly**: Users experience all content before upgrading decision
7. **Mission Aligned**: Keep core content free; premium funds server costs & team

---

## Implementation Status

### Complete
- ✅ Enhanced multi-question onboarding (background, goals, study time, reminders)
- ✅ Free access to all 6 units
- ✅ Daily quiz limit tracking (3 incorrect answers/day for free users)
- ✅ Daily limit utilities (`src/utils/dailyLimitUtils.ts`)
- ✅ Discount popup when limit reached (showing 50% off promotion)
- ✅ Promotional ad component (built-in ads showing 50% off)
- ✅ Updated PricingPage ($3.99/month or $35.99/year with annual discount badge)
- ✅ Quiz UI shows remaining attempts
- ✅ Stripe test integration (checkout session creation)
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
