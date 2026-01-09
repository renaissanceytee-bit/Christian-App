# Privacy Policy

## Data Collection

Christian Study is committed to your privacy. Here is what we collect and how we use it:

### On-Device Data (No Tracking)
- All your quiz answers, progress, and bookmarks are stored **only on your device** using browser localStorage.
- We do not send this data to any server unless you explicitly use the backup feature.

### Backup & Account Data (Optional)
- If you create a backup account, we store:
  - Email address (for login)
  - Password (hashed with bcrypt, never stored in plain text)
  - Your quiz progress and answers (encrypted in transit, as a JSON blob)
- Backups are stored in our SQLite database for up to **90 days** if inactive, then deleted.

### Payment Information
- Payment processing is handled by **Stripe** (PCI-DSS compliant). We never store your credit card details.
- Only your subscription status is stored on our server (active, inactive, renewal date).

### Optional Analytics
- We do not track your activity or behavior by default.
- If enabled in settings, we may log anonymized learning events (e.g., "unit completed", "quiz answered") to improve content.
- No personal identifying information is attached to analytics.

## Data Retention

- **Active Users**: Data retained as long as your account is active.
- **Inactive Users**: After 90 days of no login, backups are deleted. On-device data persists until you clear it.
- **Deleted Accounts**: All data is removed within 7 days of account deletion.

## Your Rights

- **Access**: You can export all your data anytime via the Export feature.
- **Delete**: You can delete your account and all associated data at any time.
- **Portability**: Your data is yours — export it as JSON and use it elsewhere.

## Third-Party Services

- **Stripe**: Handles payments. See [Stripe Privacy Policy](https://stripe.com/en-us/privacy).
- **Web Push**: We use browser push notifications (opt-in). See your browser's privacy settings.

## Changes to This Policy

We may update this policy. If changes materially affect your privacy, we will notify you.

## Contact

Questions? Email us at: privacy@christianstudy.app

---

**Last Updated**: January 2026
