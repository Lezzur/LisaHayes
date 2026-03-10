# Product QA Audit — Cron Companion

This is a reusable pattern for scheduling unattended recurring QA audits with the `product-qa-audit` skill.

## What this companion does

It gives you a **ready-made cron job shape** for recurring audits so you do not have to reinvent the prompt each time.

Use it when you want OpenClaw to:
- revisit a site/app on a schedule
- run a full audit automatically
- save timestamped reports into the Syncthing folder
- surface blockers like login issues, verification walls, captchas, and partial coverage
- keep reporting format consistent across runs

In plain English: **the skill tells the agent how to audit; the cron companion tells the scheduler when and how to run that audit repeatedly.**

## Recommended behavior for cron runs

- audit depth: **full audit**
- auth walls: register with Lisa's email if needed, otherwise log in
- screenshots: capture only when genuinely helpful
- output: save report and any screenshots under `/home/node/.openclaw/workspace/projects/lisa-hayes-main-folder/`
- delivery: announce summary back to chat unless you prefer silent jobs

## Prompt template for cron jobs

Use this as the `payload.message` for an isolated cron job. Replace bracketed placeholders.

```text
Run the `product-qa-audit` skill against [APP_NAME] at [TARGET_URL].

Audit mode: cron full audit.

Instructions:
- Perform a comprehensive browser-based QA and UX audit.
- Explore all accessible pages and major user flows, especially sign-up, login, onboarding, dashboard, settings, and the core value-delivery workflow.
- If authentication is required, register using Lisa's email if no account exists; otherwise log in.
- Capture screenshots only when they materially improve bug evidence or clarify a confusing visual state.
- Save all created artifacts into `/home/node/.openclaw/workspace/projects/lisa-hayes-main-folder/` using a dated subfolder and timestamped filenames.
- Generate a complete System Health & Optimization Report with these sections in order:
  1. Executive Summary
  2. Audit Scope
  3. The Bug List (Must Fix)
  4. The Enhancement List (Should Improve)
  5. Strategic Recommendations
  6. Appendix: Evidence & Notes
- If the product is too large to cover fully in one run, state what was covered and what was skipped.
- If blocked by captcha, email verification, missing seed data, or environment issues, report that clearly instead of guessing.
```

## Example cron schedules

- Every day at 9:00 AM Manila time: `0 9 * * *`
- Every Monday at 8:00 AM Manila time: `0 8 * * 1`
- Every 6 hours: use interval mode instead of cron if preferred

## Suggested delivery modes

### Announce
Use when you want a summary posted back into chat after each run.

### None
Use when you only want files saved silently and will review them later.

## Notes

- Use **isolated cron jobs**, not main-session reminders, for unattended audits.
- Cron should schedule the run; the skill provides the audit standards and report structure.
- If you later want narrower recurring audits, duplicate this template and specialize it per module, such as onboarding-only or settings-only.
