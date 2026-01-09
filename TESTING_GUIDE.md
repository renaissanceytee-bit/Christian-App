# Testing Guide: Daily Quiz Limits & Enhanced Monetization

## Quick Test Scenarios

### Scenario 1: Enhanced Onboarding
**Steps:**
1. Clear localStorage: `localStorage.clear()`
2. Refresh page and navigate to home
3. Should be redirected to `/onboarding` automatically
4. Complete all 6 questions:
   - Name: "John Doe"
   - Background: Select "Growing up in it"
   - Goal: Select "Build a daily practice"
   - Study Time: Select "1-3 hours"
   - Reminders: Select "Yes"
   - Reminder Time: Set to "10:00"
5. Click "Start Learning"
6. Should redirect to `/` home page
7. Verify in console: `localStorage.getItem('user_background')` returns "Growing up in it"

**Expected Result:** ✅ Onboarding saves all data and redirects properly

---

### Scenario 2: Daily Quiz Limit Enforcement
**Steps:**
1. Navigate to `/units/1` (first unit)
2. Scroll to "Quick Quiz" section
3. Look for blue info box: "📊 Remaining attempts today: 3 of 3"
4. Answer first question incorrectly (select wrong option)
5. Click "Check Answers"
6. Should see red "Not quite" feedback
7. Box should now show: "Remaining attempts: 2 of 3"
8. Repeat steps 4-7 two more times
9. On the 4th submission:
   - Should see warning: "Daily limit reached!"
   - Quiz interface becomes disabled (greyed out)
   - DiscountPopup modal appears

**Expected Result:** ✅ Counter decrements correctly, popup shows at limit

---

### Scenario 3: Discount Popup Flow
**Steps:**
1. After hitting daily limit (see Scenario 2)
2. Modal shows "50% OFF TODAY" badge at top
3. Two plan options visible:
   - Monthly: $3.99/month
   - Annual: $35.99/year with "Save 34%" badge
4. Annual is selected by default
5. Click "Maybe Later" button
6. Modal closes but quiz stays disabled
7. Click quiz again (submit button)
8. Modal re-appears
9. Select "Monthly" option
10. Click "Upgrade Now"
11. Should redirect to Stripe test checkout

**Expected Result:** ✅ Popup shows correct pricing, navigation works

---

### Scenario 4: Promotional Ad Display
**Steps:**
1. Clear premium flag: `localStorage.removeItem('hasPremium')`
2. Navigate to `/units/1`
3. Above the lesson content, should see green banner:
   - "🎉 50% OFF Premium Today"
   - "Unlimited quiz attempts and study at your own pace"
   - "Upgrade Now" button
4. Click "X" in top-right to dismiss
5. Banner disappears
6. Refresh page
7. Banner should still be dismissed (state maintained)
8. Set premium: `localStorage.setItem('hasPremium', '1')`
9. Refresh page
10. Banner should NOT appear (hidden for premium users)

**Expected Result:** ✅ Ad shows for free users, hidden for premium, dismissal works

---

### Scenario 5: Premium User Experience
**Steps:**
1. Set premium flag: `localStorage.setItem('hasPremium', '1')`
2. Navigate to `/units/1`
3. PromotionalAd should NOT appear
4. In quiz, info box should say: "Remaining attempts: ∞"
5. Answer 5 questions incorrectly
6. No popup appears, no limit enforcement
7. Quiz stays enabled
8. Can answer as many times as desired

**Expected Result:** ✅ Premium users have unlimited attempts, no ads

---

### Scenario 6: Daily Limit Reset
**Steps:**
1. Clear premium: `localStorage.removeItem('hasPremium')`
2. Hit daily limit (Scenario 2)
3. In console, check: `localStorage.getItem('daily_limit_date')`
4. Should return today's date (e.g., "2024-01-15")
5. Manually set yesterday's date:
   ```javascript
   localStorage.setItem('daily_limit_date', '2024-01-14')
   ```
6. Refresh page
7. Info box should show: "Remaining attempts: 3 of 3"
8. Quiz should be enabled again
9. Count should reset to 0 internally

**Expected Result:** ✅ Limit resets when date changes

---

### Scenario 7: Pricing Page
**Steps:**
1. Navigate to `/pricing`
2. Should see two tiers:
   - **Free**: $0/month, 3 incorrect answers/day limit
   - **Premium**: "50% OFF TODAY" badge, toggle for Monthly/Annual
3. Click "Monthly" toggle
4. Premium shows: $3.99/month
5. Click "Annual" toggle
6. Premium shows: $35.99/year with "Just $2.99/month billed annually"
7. Info box at bottom: "Free users get 3 incorrect answers per day"

**Expected Result:** ✅ Pricing displays correctly, toggle works

---

### Scenario 8: Multiple Units
**Steps:**
1. Clear localStorage: `localStorage.clear()`
2. Go through onboarding
3. Navigate to `/units/1`
4. Answer questions, hit daily limit
5. Click "Next Unit" button at bottom
6. Navigate to `/units/2`
7. Try to answer quiz
8. Should also be limited (shared daily counter, not per-unit)
9. Verify: `localStorage.getItem('daily_incorrect_count')` shows count is shared

**Expected Result:** ✅ Daily limit is app-wide, not per-unit

---

### Scenario 9: Reminders Toggle in Onboarding
**Steps:**
1. Clear localStorage: `localStorage.clear()`
2. Start onboarding
3. At "Reminders" question, select "No"
4. "Reminder Time" question should be skipped (next button directly advances)
5. Complete onboarding
6. Verify in console:
   ```javascript
   localStorage.getItem('reminder_time') // Should be null
   localStorage.getItem('profile_name')  // Should exist
   ```

**Expected Result:** ✅ Reminder time not saved when disabled

---

### Scenario 10: Onboarding Progress Bar
**Steps:**
1. Clear localStorage and start onboarding
2. On first question (Name), progress bar should be ~17% filled
3. Each step, bar increases by ~17%
4. On final step (Reminder Time), bar should be at ~83%
5. After clicking "Start Learning", not visible (redirects)

**Expected Result:** ✅ Progress bar shows completion percentage

---

## Browser DevTools Testing

### Check Daily Limit State
```javascript
// In DevTools Console:
localStorage.getItem('daily_limit_date')       // Today's date
localStorage.getItem('daily_incorrect_count')  // Number 0-3
localStorage.getItem('hasPremium')             // "0" or "1"
```

### Simulate Premium User
```javascript
localStorage.setItem('hasPremium', '1')
location.reload()
```

### Reset Daily Limit
```javascript
localStorage.removeItem('daily_limit_date')
localStorage.removeItem('daily_incorrect_count')
location.reload()
```

### Check Onboarding Data
```javascript
localStorage.getItem('profile_name')
localStorage.getItem('user_background')
localStorage.getItem('profile_goal')
localStorage.getItem('user_study_time')
localStorage.getItem('reminder_time')
localStorage.getItem('onboarded')
```

---

## Edge Cases to Test

1. **User switches devices**: Premium status not synced (local-only in MVP)
2. **Browser localStorage full**: Graceful degradation (try/catch blocks)
3. **Midnight boundary**: Correct reset when crossing date line
4. **Network disconnected**: Stripe checkout fails gracefully (error message shown)
5. **Multiple tabs open**: Limit state may be inconsistent (each tab tracks independently)
6. **Very fast form submission**: Debouncing may be needed (watch for rapid clicks)

---

## Mobile Testing

### iPhone/Android
1. Navigate to `/units/1` on mobile
2. Quiz should be readable (single column)
3. Buttons should be touch-friendly (large targets)
4. Promotional ad should be full-width
5. DiscountPopup should fit screen without scrolling
6. Pricing page should be readable (cards stack vertically)

---

## Performance Notes

- Daily limit check: O(1) localStorage read
- No API calls on quiz submit (local only)
- Stripe integration lazy-loads on `/pricing` page
- PromotionalAd dismissal is instant (no API)

---

## Success Criteria

✅ All 10 scenarios pass  
✅ No console errors  
✅ TypeScript compilation successful  
✅ Mobile layout responsive  
✅ Pricing displays correctly  
✅ Daily limit enforces correctly  
✅ Onboarding saves data  
✅ Ads dismiss and persist state  

**When all pass: Ready for beta testing!**
