# General-Purpose Bot — Smart Model Routing Strategy
**Version:** v1.0 | **Date:** March 7, 2026 | **Priority:** Balanced Cost vs Quality

---

## Glossary

| Term | Meaning |
|---|---|
| The Bot | Whatever general-purpose AI assistant you are building or running |
| The Agent | The automated system executing routing decisions |
| Provider | The AI API company (Anthropic, Google, OpenAI) |
| Tier | A generic quality/cost label that maps to a specific model |
| Registry | The Active Model Registry section below — single source of truth |
| Batch | Async processing APIs with 50% discount for non-urgent tasks |

---

## Master Self-Adaptation Rule

> **Before routing ANY task, the Agent must:**
> 1. Verify all models in the Active Model Registry are still available and not deprecated
> 2. If any model has changed, update the ENTIRE document — all tables, tiers, cost estimates
> 3. Append an entry to Version History with the date and what changed
>
> This rule governs ALL sections. No exceptions.

---

## Active Model Registry

### Anthropic — Claude

| Tier Label | Model | API String | Input $/1M | Output $/1M | Context | Status |
|---|---|---|---|---|---|---|
| BUDGET | Haiku 4.5 | `claude-haiku-4-5-20251001` | $1.00 | $5.00 | 200K | Stable |
| MID | Sonnet 4.6 | `claude-sonnet-4-6` | $3.00 | $15.00 | 200K | Stable |
| PREMIUM | Opus 4.6 | `claude-opus-4-6` | $5.00 | $25.00 | 200K | Stable |

### Google — Gemini

| Tier Label | Model | API String | Input $/1M | Output $/1M | Context | Status |
|---|---|---|---|---|---|---|
| BUDGET | Gemini 2.5 Flash-Lite | `gemini-2.5-flash-lite` | $0.10 | $0.40 | 1M | Stable |
| MID | Gemini 2.5 Flash | `gemini-2.5-flash` | $0.30 | $2.50 | 1M | Stable |
| PREMIUM | Gemini 2.5 Pro | `gemini-2.5-pro` | $1.25 | $10.00 | 2M | Stable |
| PREMIUM-PREVIEW | Gemini 3.1 Pro Preview | `gemini-3.1-pro-preview` | $2.00 | $12.00 | 2M | Preview — migrate in 2 weeks if GA releases |

### OpenAI — GPT

| Tier Label | Model | API String | Input $/1M | Output $/1M | Context | Status |
|---|---|---|---|---|---|---|
| BUDGET | GPT-5 Nano | `gpt-5-nano` | $0.05 | $0.40 | 128K | Stable |
| MID-LOW | GPT-5 Mini | `gpt-5-mini` | $0.25 | $2.00 | 128K | Stable |
| MID | GPT-5.2 | `gpt-5.2` | $1.75 | $14.00 | 128K | Stable |
| PREMIUM | GPT-5.2 Pro | `gpt-5.2-pro` | $21.00 | $168.00 | 128K | Stable — use sparingly |

---

## Tier Equivalence Map

When a model is deprecated, replace it with the closest equivalent from the same tier row below.

| Role | Claude | Gemini | OpenAI |
|---|---|---|---|
| Ultra-budget / automation | — | Gemini BUDGET | GPT BUDGET |
| Budget / simple tasks | Claude BUDGET | Gemini MID | GPT MID-LOW |
| Balanced / default | Claude MID | Gemini MID | GPT MID |
| High quality / complex | Claude MID | Gemini PREMIUM | GPT MID |
| Flagship / premium | Claude PREMIUM | Gemini PREMIUM-PREVIEW | GPT PREMIUM |

---

## Provider Strategy

**Claude (Anthropic)** — Primary provider for conversation, creative writing, and nuanced reasoning. Best personality and instruction-following for user-facing chat.

**OpenAI (GPT)** — Primary provider for code generation, technical tasks, and agentic tool use. Best-in-class for structured outputs and function calling.

**Gemini (Google)** — Secondary provider for large-context tasks (documents, long threads), bulk batch processing, and research/web search where Gemini's native grounding is available.

**Rules:**
- Never mix providers mid-conversation. Pick one and stay with it for the session.
- Reserve PREMIUM tiers for tasks that genuinely require them — verify before escalating.
- Use Batch APIs for any non-urgent task over 20 requests: 50% cost reduction.
- Never use free tiers for production workloads (rate limits break user experience).

---

## Routing Decision Logic

Evaluate rules **in order**. Use the first rule that matches.

| # | Condition | Provider | Tier | Notes |
|---|---|---|---|---|
| 1 | Simple greeting, chitchat, single-sentence Q&A | Claude | BUDGET | Fast, cheap, personality intact |
| 2 | Factual lookup, definition, quick calculation | OpenAI | BUDGET | GPT Nano handles structured recall well |
| 3 | General conversation, multi-turn dialogue | Claude | BUDGET | Haiku holds context well for most chat |
| 4 | Writing task — short (social post, email, headline) | Claude | BUDGET | Haiku sufficient for short-form |
| 5 | Writing task — long or nuanced (article, story, essay) | Claude | MID | Sonnet for voice/quality |
| 6 | Code task — simple (snippet, fix, explain) | OpenAI | MID-LOW | GPT-5 Mini handles most code tasks |
| 7 | Code task — complex (architecture, debug, refactor) | OpenAI | MID | GPT-5.2 for complex code |
| 8 | Research with web search needed | Gemini | MID | Gemini grounding preferred; fallback Claude MID with search tool |
| 9 | Long document analysis (50K+ tokens) | Gemini | MID | Use 1M context window; fallback Gemini PREMIUM if >500K |
| 10 | Bulk / async batch (20+ requests, not time-sensitive) | Gemini | BUDGET + Batch API | 50% off; use for summaries, classification, tagging |
| 11 | Complex reasoning, multi-step logic | Claude | MID | Sonnet before escalating |
| 12 | Highest-stakes output (flagship quality required) | Claude | PREMIUM | Opus only when MID genuinely falls short |
| 13 | Unknown task type | Claude | BUDGET | Execute → evaluate → escalate if poor (see Unknown Task Handler) |

---

## Task Routing Tables

### Conversation & Q&A

| Task | Primary Tier | Primary Model | Fallback Tier | Fallback Model |
|---|---|---|---|---|
| Greeting / small talk | Claude BUDGET | Haiku 4.5 | Claude BUDGET | Haiku 4.5 |
| Single factual question | OpenAI BUDGET | GPT-5 Nano | Claude BUDGET | Haiku 4.5 |
| Multi-turn dialogue | Claude BUDGET | Haiku 4.5 | Claude MID | Sonnet 4.6 |
| Opinion / recommendation | Claude MID | Sonnet 4.6 | Claude BUDGET | Haiku 4.5 |
| Sensitive / nuanced topic | Claude MID | Sonnet 4.6 | Claude PREMIUM | Opus 4.6 |
| Role-play / persona | Claude MID | Sonnet 4.6 | Claude MID | Sonnet 4.6 |
| Summarize conversation | Claude BUDGET | Haiku 4.5 | OpenAI BUDGET | GPT-5 Nano |
| Language translation | OpenAI MID-LOW | GPT-5 Mini | Claude BUDGET | Haiku 4.5 |
| Explain a concept (simple) | Claude BUDGET | Haiku 4.5 | OpenAI BUDGET | GPT-5 Nano |
| Explain a concept (deep) | Claude MID | Sonnet 4.6 | OpenAI MID | GPT-5.2 |

---

### Writing & Creative Tasks

| Task | Primary Tier | Primary Model | Fallback Tier | Fallback Model |
|---|---|---|---|---|
| Social media caption | Claude BUDGET | Haiku 4.5 | OpenAI BUDGET | GPT-5 Nano |
| Email draft (short) | Claude BUDGET | Haiku 4.5 | OpenAI MID-LOW | GPT-5 Mini |
| Email draft (formal/long) | Claude MID | Sonnet 4.6 | OpenAI MID | GPT-5.2 |
| Blog post / article | Claude MID | Sonnet 4.6 | Claude MID | Sonnet 4.6 |
| Creative story / fiction | Claude MID | Sonnet 4.6 | Claude PREMIUM | Opus 4.6 |
| Poetry / lyrical writing | Claude PREMIUM | Opus 4.6 | Claude MID | Sonnet 4.6 |
| Resume / cover letter | Claude MID | Sonnet 4.6 | OpenAI MID | GPT-5.2 |
| Proofreading / grammar fix | OpenAI MID-LOW | GPT-5 Mini | Claude BUDGET | Haiku 4.5 |
| Rewrite / tone adjustment | Claude MID | Sonnet 4.6 | Claude BUDGET | Haiku 4.5 |
| Product description (bulk) | Gemini BUDGET + Batch | Gemini 2.5 Flash-Lite | OpenAI BUDGET + Batch | GPT-5 Nano |
| Brainstorm / ideation | Claude MID | Sonnet 4.6 | Claude BUDGET | Haiku 4.5 |
| Persuasive writing | Claude MID | Sonnet 4.6 | Claude PREMIUM | Opus 4.6 |
| Long-form report (2K+ words) | Claude MID | Sonnet 4.6 | OpenAI MID | GPT-5.2 |

---

### Coding & Technical Tasks

| Task | Primary Tier | Primary Model | Fallback Tier | Fallback Model |
|---|---|---|---|---|
| Explain code snippet | OpenAI MID-LOW | GPT-5 Mini | Claude BUDGET | Haiku 4.5 |
| Write short function | OpenAI MID-LOW | GPT-5 Mini | Claude BUDGET | Haiku 4.5 |
| Write complex feature | OpenAI MID | GPT-5.2 | Claude MID | Sonnet 4.6 |
| Debug / fix error | OpenAI MID | GPT-5.2 | Claude MID | Sonnet 4.6 |
| Refactor code | OpenAI MID | GPT-5.2 | Claude MID | Sonnet 4.6 |
| Architecture / system design | OpenAI MID | GPT-5.2 | Claude PREMIUM | Opus 4.6 |
| Write unit tests | OpenAI MID-LOW | GPT-5 Mini | OpenAI MID | GPT-5.2 |
| SQL query generation | OpenAI MID-LOW | GPT-5 Mini | OpenAI BUDGET | GPT-5 Nano |
| Regex / pattern generation | OpenAI BUDGET | GPT-5 Nano | OpenAI MID-LOW | GPT-5 Mini |
| API integration help | OpenAI MID | GPT-5.2 | Claude MID | Sonnet 4.6 |
| DevOps / CLI commands | OpenAI MID-LOW | GPT-5 Mini | Claude BUDGET | Haiku 4.5 |
| Data processing script | OpenAI MID | GPT-5.2 | Claude MID | Sonnet 4.6 |
| Code review (bulk files) | Gemini MID + Batch | Gemini 2.5 Flash | OpenAI MID + Batch | GPT-5.2 |
| Technical documentation | OpenAI MID | GPT-5.2 | Claude MID | Sonnet 4.6 |

---

### Research & Web Search

| Task | Primary Tier | Primary Model | Fallback Tier | Fallback Model |
|---|---|---|---|---|
| Quick fact-check | OpenAI BUDGET | GPT-5 Nano | Claude BUDGET | Haiku 4.5 |
| Current events / news | Gemini MID | Gemini 2.5 Flash | OpenAI MID | GPT-5.2 |
| Deep research (multi-source) | Gemini PREMIUM | Gemini 2.5 Pro | Claude MID + search tool | Sonnet 4.6 |
| Competitive analysis | Gemini PREMIUM | Gemini 2.5 Pro | OpenAI MID | GPT-5.2 |
| Summarize long document | Gemini MID | Gemini 2.5 Flash | Claude MID | Sonnet 4.6 |
| Summarize very long doc (500K+) | Gemini PREMIUM | Gemini 2.5 Pro | Gemini PREMIUM-PREVIEW | Gemini 3.1 Pro Preview |
| Literature / topic overview | Claude MID | Sonnet 4.6 | Gemini MID | Gemini 2.5 Flash |
| Data extraction from doc | OpenAI MID | GPT-5.2 | Gemini MID | Gemini 2.5 Flash |
| Bulk document summarization | Gemini BUDGET + Batch | Gemini 2.5 Flash-Lite | OpenAI BUDGET + Batch | GPT-5 Nano |
| Citation / source finding | Gemini MID | Gemini 2.5 Flash | OpenAI MID | GPT-5.2 |

---

## Unknown Task Handler

When a task does not match any routing table entry:

**Step 1 — Classify:**
- A: Does it involve generating or editing text for a human reader? → Writing tier
- B: Does it involve code, scripts, or technical output? → Coding tier
- C: Does it require current/external information? → Research tier
- D: Is it a back-and-forth dialogue with no deliverable? → Conversation tier
- E: Is it a bulk/batch job (20+ similar items)? → Gemini BUDGET + Batch
- F: None of the above → Claude BUDGET, escalate if response quality is poor

**Step 2 — Execute and evaluate:**
- Run with the classified tier
- If output quality is poor: escalate one tier and retry once
- If still poor: escalate to MID on primary provider for that category

**Step 3 — Log:**
Record in `routing_unknowns.log`:
```
date | task_description | classification | tier_used | quality_rating (1-5) | escalated (yes/no)
```

**Promotion rule:** If the same task type appears 3+ times in the log, add it to the appropriate routing table as a permanent entry.

---

## Cost Guardrails

1. **PREMIUM tiers are last resort** — always try MID first and escalate only if output quality is genuinely insufficient
2. **GPT-5.2 Pro is off by default** — requires explicit override; cost is 12× GPT-5.2
3. **Gemini free tier is banned in production** — rate limits will break user experience
4. **Preview models require a 2-week migration plan** — never depend on a preview model as your only option
5. **Batch API is mandatory for 20+ non-urgent requests** — 50% discount, no exceptions
6. **Set a hard monthly spend cap** — recommended $30–60/month for moderate personal/hobby use
7. **Audit weekly** — review routing_unknowns.log and check if any tasks are over-routed to premium tiers
8. **Prompt caching** — enable where supported; OpenAI offers 50–90% off cached input tokens
9. **Never run the same task twice** — cache responses for repeated identical queries
10. **If monthly spend exceeds cap** — immediately audit and shift top-cost tasks one tier down

---

## Estimated Monthly Cost

Based on balanced general-purpose use (moderate volume, mix of all four task types):

| Usage Level | Typical Profile | Estimated Cost/Month |
|---|---|---|
| Light | Personal bot, casual use, <500 requests | $5–15 |
| Moderate | Small team or active personal bot, 500–2K requests | $20–50 |
| Heavy | Production bot or high-volume personal use, 2K–10K requests | $60–150 |

**Biggest cost drivers:** Long creative writing (Claude MID output tokens), complex code tasks (GPT-5.2 output tokens), and deep research (Gemini PREMIUM). Shift these to one tier lower and/or batch whenever possible to cut costs 40–60%.

---

## Quick Reference Cheat Sheet

| Task Type | Primary Tier | Primary Model | Fallback Tier | Fallback Model |
|---|---|---|---|---|
| Greeting / chitchat | Claude BUDGET | Haiku 4.5 | Claude BUDGET | Haiku 4.5 |
| Factual Q&A | OpenAI BUDGET | GPT-5 Nano | Claude BUDGET | Haiku 4.5 |
| General conversation | Claude BUDGET | Haiku 4.5 | Claude MID | Sonnet 4.6 |
| Short writing | Claude BUDGET | Haiku 4.5 | OpenAI MID-LOW | GPT-5 Mini |
| Long / nuanced writing | Claude MID | Sonnet 4.6 | OpenAI MID | GPT-5.2 |
| Creative / literary | Claude PREMIUM | Opus 4.6 | Claude MID | Sonnet 4.6 |
| Simple code | OpenAI MID-LOW | GPT-5 Mini | Claude BUDGET | Haiku 4.5 |
| Complex code | OpenAI MID | GPT-5.2 | Claude MID | Sonnet 4.6 |
| Web search / news | Gemini MID | Gemini 2.5 Flash | OpenAI MID | GPT-5.2 |
| Deep research | Gemini PREMIUM | Gemini 2.5 Pro | Claude MID | Sonnet 4.6 |
| Long document (50K+) | Gemini MID | Gemini 2.5 Flash | Gemini PREMIUM | Gemini 2.5 Pro |
| Bulk / batch jobs | Gemini BUDGET + Batch | Gemini 2.5 Flash-Lite | OpenAI BUDGET + Batch | GPT-5 Nano |
| Unknown task | Claude BUDGET | Haiku 4.5 | Claude MID | Sonnet 4.6 |

---

## Version History

| Version | Date | Changes |
|---|---|---|
| v1.0 | March 7, 2026 | Initial release. Three-provider strategy (Claude + Gemini + OpenAI). Four task domains: conversation, writing, coding, research. Balanced cost/quality priority. |
