---
name: product-qa-audit
description: Perform comprehensive browser-based product QA audits and smoke tests for websites or web applications, including feature exploration, functional bug hunting, UX evaluation, and structured reporting. Use when asked to audit, test, check, review, QA, or smoke test a site/app/URL; review onboarding, login, signup, settings, dashboard, or core product flows; generate a System Health & Optimization Report; or set up recurring cron-based audits. Trigger on plain-English requests like 'audit this app', 'check this site', 'review this product', 'smoke test this URL', 'QA this flow', or 'set up a scheduled audit'. Supports manual runs and scheduled audits; manual invocations should ask for scope/depth if not specified, while cron runs should default to a full audit.
---

# Product QA Audit

Run a senior-level QA automation and UX review for a website or web app, then deliver a structured report that separates must-fix defects from improvement opportunities.

## Default operating mode

Assume this persona during the audit: **Senior QA Automation Engineer and UX Consultant**.

Use these defaults unless the user overrides them:
- **Manual invocation:** ask whether to run a quick smoke test, full audit, or feature-specific audit if the scope is unclear.
- **Cron invocation:** default to **full audit**.
- **Auth wall present:** if sign-up is available, register using Lisa's email; if the account already exists, log in.
- **Screenshots:** optional. Capture them only when they materially improve bug diagnosis, show a broken/ambiguous UI state, or preserve evidence that may be hard to reproduce.
- **Output location for saved artifacts:** `/home/node/.openclaw/workspace/projects/lisa-hayes-main-folder/`

## Workflow

### 1. Clarify scope only when needed

If the request is manual and scope is vague, do **not** guess the audit shape. Ask the user to fill out a compact intake prompt.

Use this exact template when the user invokes the skill in plain English without enough detail:

```text
Got it. Fill this out and I’ll run the audit:

Target:
- app name:
- URL:

Audit mode:
- quick smoke test / full audit / focused audit

Focus areas:
- 
- 
- 

Credentials / access notes:
- 

Areas to avoid or known constraints:
- 

Extra instructions:
- 
```

Keep the request lightweight, but make sure you collect at least:
- target app or URL
- audit mode
- focus areas
- any access constraints or credentials context

If the user already gave enough detail, do not ask them to repeat it. Proceed using what they provided.

Do not block on questions if the user clearly requested a broad audit of a public or self-sign-up product.

### 2. Build an exploration plan

Identify major surfaces before clicking randomly:
- landing / marketing pages
- sign-up, login, password reset, logout
- onboarding
- dashboard/home
- settings/account/profile/billing
- primary product workflows
- empty states, validation states, error states, confirmation states
- responsive or modal/drawer flows if visible in-browser

If the app is large, prioritize:
1. authentication and account lifecycle
2. core value-delivery workflow
3. settings/profile/preferences
4. secondary features

### 3. Execute the audit

Explore every accessible page, button, control, and core user flow within the agreed scope.

While testing, actively look for:
- broken links or dead navigation
- console errors and network failures when visible through the available tooling
- failed submissions, missing validation, duplicate submissions, silent failures
- layout glitches, clipping, overlap, z-index issues, unusable mobile-ish states, inaccessible contrast cues when obvious
- misleading labels, unclear calls to action, confusing success/error states
- slow-feeling interactions, excessive friction, too many clicks, awkward sequencing

Use realistic QA behavior:
- try happy path first
- then try edge cases and light adversarial input
- verify that success states are actually persisted after refresh/navigation when possible
- note whether an issue is deterministic, intermittent, or suspected

### 4. Decide when screenshots are necessary

Take screenshots only when they add value. Prefer screenshots for:
- visual breakage or layout corruption
- confusing or contradictory UI states
- bugs that may be disputed later without evidence
- multi-step states that are easier to understand visually than textually

Skip screenshots for routine findings that are obvious from text alone.

When saving screenshots or reports, create a dated subfolder under the Syncthing folder.

### 5. Write the report

Always produce a **System Health & Optimization Report**.

Use the exact top-level sections and keep them in this order:
1. **Executive Summary**
2. **Audit Scope**
3. **The Bug List (Must Fix)**
4. **The Enhancement List (Should Improve)**
5. **Strategic Recommendations**
6. **Appendix: Evidence & Notes**

Read `references/report-format.md` before writing the final report.

## Severity and evidence rules

For each bug, include:
- severity: Critical / High / Medium / Low
- area: auth, onboarding, navigation, settings, dashboard, billing, etc.
- title: one-line defect summary
- reproduction steps
- expected result
- actual result
- impact on user or business
- evidence: screenshot path if captured, otherwise `No screenshot captured`
- confidence: Confirmed / Likely / Suspected

For each enhancement, include:
- area
- issue/opportunity
- why it feels slow, clunky, unclear, or high-friction
- recommended improvement
- expected UX or performance benefit

## Cron-friendly behavior

When the user wants to create a cron job for this audit, do **not** silently invent the scheduled job from a vague request. First collect the cron setup inputs with a fill-in template unless the user already supplied them.

Use this exact template when cron setup details are missing:

```text
Before I set up the cron job, fill this out:

Target:
- app name:
- URL:

Schedule:
- cadence: (daily / weekdays / weekly / custom cron)
- time:
- timezone:

Audit mode:
- full audit (recommended for cron)

Focus areas:
- 
- 
- 

Delivery:
- announce results in chat / save files silently

Credentials / access notes:
- 

Blockers or known constraints:
- 

Extra instructions:
- 
```

For cron or other unattended runs after setup is confirmed:
- default to **full audit**
- avoid unnecessary back-and-forth questions
- save the report to the Syncthing folder as a timestamped markdown file
- include a short executive summary at the top for skim-reading
- mention any blockers clearly, especially auth, email verification, rate limits, captchas, or unavailable test data
- if the app is too large to cover fully in one run, state the completed coverage and the skipped areas instead of pretending full coverage

## Output and file naming

Save created artifacts under:
`/home/node/.openclaw/workspace/projects/lisa-hayes-main-folder/`

Recommended per-run structure:
- `product-qa-audit-YYYY-MM-DD/`
  - `report-<app-slug>-<timestamp>.md`
  - `screenshots/` (only if needed)
  - optional raw notes

Use kebab-case slugs and ISO-like timestamps safe for filenames.

## Quality bar

Be specific, not theatrical.

Good:
- explain what broke
- explain who it hurts
- explain how often it happened
- explain what to change

Avoid:
- vague praise
- generic UX filler
- padding the report with obvious statements
- calling something a bug without enough evidence

If a feature works but feels slow, unclear, fragile, or overcomplicated, include it in **The Enhancement List (Should Improve)**.

## References

- Report structure and wording standard: `references/report-format.md`
- Audit heuristics and coverage checklist: `references/audit-heuristics.md`
