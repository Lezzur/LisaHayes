# VaiTAL QA Audit

- **App:** VaiTAL
- **URL tested:** https://vaital.vercel.app/login
- **Audit mode:** Full audit
- **Date:** 2026-03-10
- **Tester:** Lisa Hayes
- **Environment:** Production (Vercel), desktop Chromium via Playwright
- **Account used:** existing Lisa Gmail account

## Scope Covered

- Authentication: sign in, invalid sign in, forgot password, sign out, sign-up entry point
- Dashboard: post-login landing, empty states
- Upload Results: page load, empty state, text analysis trigger
- My Meds: empty states, add-medication modal, prescription analysis area
- Global UI: assistant widget presence, navigation consistency

## Executive Summary

VaiTAL is functional enough to allow sign-in, dashboard access, meds access, and sign-out, but there are several issues that make the product feel unreliable in real use. The biggest problem found in this run is a **server-side failure on results upload analysis**. There are also product/UX issues around password recovery rate limiting and assistant copy that overpromises access to results even when none are present.

## Severity Legend

- **High** — core flow broken or server error
- **Medium** — important flow degraded, confusing, or misleading
- **Low** — polish, copy, or UX friction

## Findings

### 1) Upload analysis hits a server error
- **Severity:** High
- **Area:** Upload Results
- **Steps to reproduce:**
  1. Log in.
  2. Go to `/upload`.
  3. Paste sample lab text into the textarea.
  4. Click **Analyze Results**.
- **Expected:** analysis completes, validation message appears, or the user gets a clear processing/result state.
- **Actual:** network response returns **500** from `https://vaital.vercel.app/upload`; the page remains in a vague **Processing...** state and the browser logs a server-components render error.
- **Evidence:** `screenshots/upload-after-text-analysis.png`, `raw-findings.json`
- **Notes:** This is the most serious issue in the run because it breaks a core value path.

### 2) Forgot password flow is vulnerable to immediate rate-limit failure
- **Severity:** Medium
- **Area:** Authentication
- **Steps to reproduce:**
  1. Open `/forgot-password`.
  2. Enter a valid email.
  3. Click **Send Reset Link**.
- **Expected:** success confirmation, or at least resilient UX with retry timing guidance.
- **Actual:** UI shows `email rate limit exceeded`; network response returned **429** from Supabase recover endpoint.
- **Evidence:** `screenshots/forgot-password-after-submit.png`, `raw-findings.json`
- **Notes:** Some of this is backend/provider behavior, but the UX still needs handling: cooldown text, retry timer, and clearer user guidance.

### 3) Assistant copy is misleading in empty-state and unauthenticated contexts
- **Severity:** Medium
- **Area:** Assistant widget / product trust
- **Steps to reproduce:**
  1. Visit dashboard or auth-adjacent pages with no uploaded data.
  2. Read assistant panel copy.
- **Expected:** copy should reflect the user’s actual state.
- **Actual:** widget says `I have access to your uploaded results.` even when the dashboard clearly says there is no data yet.
- **Evidence:** dashboard, upload, my-meds, and forgot-password page captures
- **Notes:** This undercuts trust fast, especially in a health product.

### 4) Assistant widget appears on auth recovery page and adds noise
- **Severity:** Low
- **Area:** Forgot Password UX
- **Steps to reproduce:** open `/forgot-password`.
- **Expected:** focused password-recovery experience.
- **Actual:** full medical assistant panel is present on the page.
- **Evidence:** `screenshots/forgot-password-after-submit.png`
- **Notes:** It is distracting and not obviously useful there.

### 5) Upload page lacks clear post-submit feedback when processing fails
- **Severity:** Medium
- **Area:** Upload Results
- **Steps to reproduce:** same as finding #1.
- **Expected:** visible error state, retry option, or actionable messaging.
- **Actual:** button state changes to `Processing...`, but no user-friendly failure messaging was observed during the failed request.
- **Evidence:** `screenshots/upload-after-text-analysis.png`, `raw-findings.json`
- **Notes:** Even if backend errors happen, the UI should recover cleanly.

### 6) Custom medication days advertise a feature that is not available yet
- **Severity:** Low
- **Area:** My Meds
- **Steps to reproduce:**
  1. Open `/my-meds`.
  2. Click **Add Medication**.
- **Expected:** either working custom-day scheduling or no mention of it.
- **Actual:** modal shows `Custom days coming soon`.
- **Evidence:** `screenshots/add-medication-modal.png`
- **Notes:** Not a bug by itself, but it signals unfinished functionality in an important medication-management workflow.

## Passed Checks

- Invalid login shows clear feedback: `Invalid login credentials`
- Sign-up entry point from the login screen opens an in-page create-account state rather than failing
- Valid login succeeds and lands on the dashboard
- Session persists after login and the signed-in email is shown on authenticated pages
- Sign out returns the user cleanly to `/login`
- Upload and prescription analysis actions are correctly disabled when no input is present
- Add Medication modal opens successfully

## UX Observations

- Empty states are generally clear and readable.
- Navigation is simple and easy to understand.
- The app feels lightweight, but several screens expose unfinished or overly generic states.
- For a medical product, trust language matters more than usual; misleading assistant copy is more damaging here than it would be in a casual SaaS app.

## Recommended Fix Order

1. Fix the **500 error on upload analysis**.
2. Improve **upload failure handling** so the UI shows a clear error and recovery path.
3. Add proper **forgot-password rate-limit UX** with cooldown messaging.
4. Make assistant copy state-aware: no results means no claim of result access.
5. Remove or reduce assistant panel presence on auth/recovery screens.
6. Decide whether `Custom days coming soon` should ship visibly or stay hidden until complete.

## Artifacts

- Raw findings: `projects/lisa-hayes-main-folder/product-qa-audit-2026-03-10/raw-findings.json`
- Screenshots directory: `projects/lisa-hayes-main-folder/product-qa-audit-2026-03-10/screenshots/`

## Screenshots Captured

- `invalid-login.png`
- `signup-from-login.png`
- `forgot-password-after-submit.png`
- `post-login.png`
- `dashboard.png`
- `upload-page-initial.png`
- `upload-after-text-analysis.png`
- `my-meds.png`
- `add-medication-modal.png`
- `prescription-area.png`
- `after-signout.png`
