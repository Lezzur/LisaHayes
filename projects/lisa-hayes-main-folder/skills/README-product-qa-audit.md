# Product QA Audit Skill Bundle

## Included

- `product-qa-audit.skill` — packaged skill file
- `product-qa-audit-cron-template.md` — reusable cron companion guidance
- `product-qa-audit-cron-job.example.json` — example isolated cron job payload

## What to use each file for

### `product-qa-audit.skill`
The skill itself. Keep this as the reusable instruction bundle.

### `product-qa-audit-cron-template.md`
Explains how recurring audits should behave and gives you a reusable cron prompt template.

### `product-qa-audit-cron-job.example.json`
A copy-pasteable starting point for creating an actual cron job later.

## Recommended usage

- Manual audits: invoke the skill and let it ask whether you want quick smoke, full audit, or module-focused scope.
- Scheduled audits: use an isolated cron job based on the example JSON and tailor the URL, schedule, model, and delivery mode.
