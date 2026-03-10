# Audit Heuristics

Use this checklist to avoid shallow audits.

## Coverage checklist

### Public surface
- landing page loads cleanly
- primary calls to action work
- footer/header links resolve correctly
- pricing, about, docs, contact, legal pages if present

### Authentication
- sign up
- login
- logout
- password reset or forgot-password entry point if present
- email verification or magic-link handling if present
- duplicate account behavior
- incorrect password / invalid email handling

### Onboarding
- first-run prompts
- welcome flows
- profile completion
- skipped vs completed onboarding states

### Core workflow
- the main thing the product is supposed to do
- create, edit, save, submit, delete, archive, export, or equivalent actions
- empty states and post-success states
- refresh persistence where relevant

### Settings and account
- profile updates
- password or auth settings
- notification preferences
- billing/subscription surfaces if accessible
- destructive actions and confirmation dialogs

### Reliability and quality
- obvious console errors
- failed requests or silent spinners
- duplicate toasts or missing success feedback
- loading states that feel stalled or ambiguous
- navigation loops or back-button weirdness

## UX heuristics

Flag enhancements when you see any of the following:
- too many clicks before reaching value
- labels that do not match user intent
- success states that are easy to miss
- unclear next step after completion
- forms asking for more than they need
- visual hierarchy that hides the primary action
- slow-feeling interactions without reassurance
- modal or drawer flows that trap the user
- tables or dashboards that lack useful empty-state guidance
- terminology mismatch between marketing and in-product UI

## Evidence standards

- Mark issues as **Confirmed** only when personally reproduced or directly observed.
- Mark as **Likely** when evidence is strong but the full cause is not proven.
- Mark as **Suspected** when behavior suggests a defect but reproduction is incomplete.
- Avoid severity inflation. A cosmetic issue is not Critical just because it is annoying.

## Screenshot guidance

Capture screenshots when one of these is true:
- the issue is visual
- the state will likely disappear or be hard to reproduce
- the report would be materially clearer with proof

Do not capture screenshots for every little thing just because you can. That is how people end up with a folder full of nonsense.

## Cron run notes

For unattended audits:
- optimize for broad coverage and useful reporting, not perfection theater
- call out blockers immediately
- prefer finishing a credible partial audit over stalling on one flow forever
- state exactly what was and was not tested
