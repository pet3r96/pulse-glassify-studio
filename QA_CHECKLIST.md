# PulseGen Studio - Live Billing QA Checklist

## ✅ Endpoints Verified
- `/api/stripe/create-checkout-session` ✓
- `/api/stripe/webhook` ✓
- `/api/stripe/create-portal-session` ✓
- `/api/admin/billing/stats` ✓
- `/api/admin/billing/events` ✓

---

## 🧪 Test Flow: Sign In → Subscribe → Checkout

### Step 1: Authentication
- [ ] Navigate to `/auth`
- [ ] Sign in with test account (or create new account)
- [ ] Verify redirect based on subscription status:
  - [ ] Super admin → `/admin`
  - [ ] Active subscription → `/dashboard`
  - [ ] No subscription → `/subscribe`

### Step 2: Subscribe Page
- [ ] Navigate to `/subscribe`
- [ ] Verify all 3 plans display (Starter OS, Agency Pro OS, Accelerator OS)
- [ ] Verify Monthly/Annual toggle works with animation
- [ ] Verify pricing updates correctly (monthly vs annual)
- [ ] Click "Get [Plan Name]" button on any plan
- [ ] Verify loading state on button
- [ ] Verify redirect to Stripe Checkout page

### Step 3: Stripe Checkout
- [ ] On Stripe Checkout page:
  - [ ] Verify plan name and price match selected plan
  - [ ] Enter test card: `4242 4242 4242 4242`
  - [ ] Enter any future expiry (e.g., 12/25)
  - [ ] Enter any CVC (e.g., 123)
  - [ ] Enter any ZIP (e.g., 12345)
- [ ] Click "Subscribe"
- [ ] Verify successful payment
- [ ] Verify redirect to `/theme-studio?new=true`

---

## 🔒 Test Flow: Lock States Verification

### Step 4: Verify Unlocked State (After Payment)
- [ ] Navigate to `/theme-studio`
  - [ ] Verify NO lock overlay visible
  - [ ] Verify NO banner message
  - [ ] Verify "Save Theme" button is ENABLED
  - [ ] Verify all inputs are ENABLED
  - [ ] Verify preview controls work
- [ ] Navigate to `/marketplace`
  - [ ] Verify NO banner message
  - [ ] Verify "Buy" and "Apply" buttons are ENABLED
  - [ ] Verify themes can be browsed
  - [ ] Verify tooltips do NOT show "Upgrade to unlock"

### Step 5: Change Subscription to Locked State
**In Stripe Dashboard:**
- [ ] Go to Stripe Dashboard → Customers
- [ ] Find the test customer
- [ ] Open their subscription
- [ ] Change subscription status to one of:
  - `past_due`
  - `unpaid`
  - `canceled`

**OR use the webhook simulation endpoint:**
```bash
curl -X POST http://localhost:3000/api/qa/billing/simulate \
  -H "Content-Type: application/json" \
  -d '{"event": "subscription.past_due", "userId": "YOUR_USER_ID"}'
```

### Step 6: Verify Locked State
- [ ] Refresh `/theme-studio` page
  - [ ] Verify lock overlay appears (backdrop-blur, dark overlay)
  - [ ] Verify banner message shows (e.g., "Billing Required...")
  - [ ] Verify "Save Theme" button shows "Upgrade to Unlock"
  - [ ] Verify button is DISABLED
  - [ ] Verify inputs are DISABLED
  - [ ] Verify "Manage Billing" button works (opens Stripe portal)
- [ ] Navigate to `/marketplace`
  - [ ] Verify banner message appears
  - [ ] Verify "Buy" and "Apply" buttons show "Upgrade to Unlock"
  - [ ] Verify buttons are DISABLED
  - [ ] Verify tooltip on hover: "Upgrade to restore Marketplace access"
  - [ ] Verify themes can still be browsed (view-only mode)

### Step 7: Restore Active Status
**In Stripe Dashboard:**
- [ ] Change subscription status back to `active`

**OR use webhook simulation:**
```bash
curl -X POST http://localhost:3000/api/qa/billing/simulate \
  -H "Content-Type: application/json" \
  -d '{"event": "subscription.activated", "userId": "YOUR_USER_ID"}'
```

- [ ] Refresh `/theme-studio` and `/marketplace`
- [ ] Verify lock overlay disappears
- [ ] Verify all buttons/inputs re-enable

---

## 📊 Test Flow: Admin Billing Dashboard

### Step 8: Access Admin Panel
- [ ] Sign in as super_admin account
- [ ] Navigate to `/admin`
- [ ] Click "Billing" tab
- [ ] Verify billing dashboard loads

### Step 9: Verify Stats Display
- [ ] Verify **MRR** (Monthly Recurring Revenue) displays correctly
- [ ] Verify **ARR** (Annual Recurring Revenue) displays correctly
- [ ] Verify **Total Subscriptions** count displays
- [ ] Verify **Active Seats** count displays
- [ ] Verify stats match actual Stripe data

### Step 10: Verify Billing Events Log
- [ ] Scroll to "Recent Billing Events" section
- [ ] Verify events from your checkout test appear:
  - [ ] `activated` event (from successful checkout)
  - [ ] `upgrade` event (if applicable)
  - [ ] Any `past_due` or `unpaid` events (from lock tests)
- [ ] Verify event timestamps are correct
- [ ] Verify `stripe_subscription_id` is recorded
- [ ] Verify events are sorted by most recent first

### Step 11: Verify Action Buttons
- [ ] Verify "Manage in Stripe" button exists (gradient style)
- [ ] Verify "Override Billing" button exists (gradient style)
- [ ] Verify "Send Reminder" button exists (gradient style)
- [ ] Click "Manage in Stripe" → Verify redirects to Stripe Dashboard

### Step 12: Verify Filters
- [ ] Test plan filter dropdown:
  - [ ] Select "Starter" → Verify only Starter plans shown
  - [ ] Select "Agency Pro" → Verify only Pro plans shown
  - [ ] Select "Accelerator" → Verify only Accelerator plans shown
- [ ] Test status filter dropdown:
  - [ ] Select "Active" → Verify only active subscriptions
  - [ ] Select "Past Due" → Verify only past_due subscriptions
  - [ ] Select "Unpaid" → Verify only unpaid/canceled subscriptions

---

## 🔗 Test Flow: Billing Portal Link

### Step 13: Verify Billing Portal Access
- [ ] Navigate to `/account/billing` (or Settings → Billing)
- [ ] Click "Open Billing Portal" or "Manage Billing" button
- [ ] Verify redirects to Stripe Billing Portal
- [ ] Verify can update payment method
- [ ] Verify can view invoice history
- [ ] Verify can cancel subscription (for testing)
- [ ] Verify return URL redirects back to `/account/billing`

---

## ✅ Expected Behaviors Summary

### Lock States:
- **Active**: Full access, no overlays, all buttons enabled
- **Past Due**: Banner visible, lock overlay on theme-studio, disabled buttons
- **Unpaid/Canceled**: Full lock with overlay, rollback themes, view-only marketplace
- **Incomplete**: Banner visible, limited interactivity

### Webhook Events:
- `customer.subscription.created` → Logs `activated` event
- `customer.subscription.updated` → Logs `upgrade` or status change event
- `customer.subscription.deleted` → Logs `canceled` event, triggers rollback
- `invoice.payment_failed` → Logs `failed` event, triggers lock
- `invoice.payment_succeeded` → Updates subscription to `active`

### Admin Dashboard:
- MRR = Sum of all monthly subscriptions
- ARR = MRR × 12
- Active Seats = Sum of included seats per plan
- Events sorted by `recorded_at` DESC
- Filters work for plan and status

---

## 🐛 Known Issues / Notes

- [ ] Document any bugs found during testing
- [ ] Note any UI/UX improvements needed
- [ ] Verify mobile responsiveness on all pages
- [ ] Test dark/light theme toggle on all pages

---

## 📝 Test Results

**Date:** _________________  
**Tester:** _________________  
**Environment:** Local Dev / Staging / Production  

**Overall Status:** ✅ Pass / ❌ Fail / ⚠️ Partial

**Notes:**

