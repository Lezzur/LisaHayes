# MODELS.md - Smart Routing (v1.1)

**Priority:** Balanced Cost vs Quality | **Updated:** 2026-03-08
**Source of truth:** `projects/lisa-hayes-main-folder/GeneralBot_Smart_Routing_Strategy.md`

---

## ⚙️ OpenClaw Practical Notes

- **Dynamic model switching is ON** — switch models mid-session based on task type
- **How:** Use `session_status(model=...)` to swap before a task, swap back after
- **Sub-agents & cron** — spawn with the appropriate model per task (preferred for heavy/isolated work)
- **Aliases available:** `flash` (Gemini 3 Flash), `pro` (Gemini 3 Pro), `opus` (Claude Opus 4.6)
- **Default model:** `google/gemini-2.5-flash` (maps to Gemini MID — good all-rounder)

### Dynamic Routing Behavior

1. **Conversation / chat** → stay on current model or drop to BUDGET tier (cheap, fast)
2. **Task switch detected** (Rick says "go do X", "code this", "write this") → evaluate task against routing tables → switch to the appropriate model BEFORE executing
3. **After task completes** → switch back to conversation-appropriate model
4. **Heavy/isolated tasks** → prefer spawning a sub-agent with the right model (keeps main session light)
5. **Rick's manual model override** → always respected, don't auto-switch away from it unless task demands escalation

---

## 🏗️ Active Model Registry

### Anthropic — Claude (Primary: Conversation, Writing, Reasoning)
| Tier | Model | Alias | Cost (In/Out per 1M) |
|---|---|---|---|
| BUDGET | Haiku 4.5 | — | $1 / $5 |
| MID | Sonnet 4.6 | — | $3 / $15 |
| PREMIUM | Opus 4.6 | `opus` | $5 / $25 |

### Google — Gemini (Primary: Large-context, Research, Batch)
| Tier | Model | Alias | Cost (In/Out per 1M) |
|---|---|---|---|
| BUDGET | Gemini 2.5 Flash-Lite | — | $0.10 / $0.40 |
| MID | Gemini 2.5 Flash | `flash` | $0.30 / $2.50 |
| PREMIUM | Gemini 2.5 Pro | `pro` | $1.25 / $10 |
| PREMIUM-PREVIEW | Gemini 3.1 Pro Preview | — | $2 / $12 |

### OpenAI — GPT (Primary: Code, Technical, Structured Output)
| Tier | Model | Alias | Cost (In/Out per 1M) |
|---|---|---|---|
| BUDGET | GPT-5 Nano | — | $0.05 / $0.40 |
| MID-LOW | GPT-5 Mini | — | $0.25 / $2 |
| MID | GPT-5.2 | — | $1.75 / $14 |
| PREMIUM | GPT-5.2 Pro | — | $21 / $168 ⚠️ use sparingly |

---

## 🧭 Provider Strategy

| Domain | Primary Provider | Why |
|---|---|---|
| Conversation & chat | **Claude** | Best personality, instruction-following |
| Writing & creative | **Claude** | Best voice, nuance |
| Code & technical | **OpenAI** | Best structured output, function calling |
| Research & web search | **Gemini** | Native grounding, large context |
| Large documents (50K+) | **Gemini** | 1M–2M context windows |
| Bulk / batch (20+ items) | **Gemini** | Cheapest + batch API discount |

---

## 🗣️ Conversation & Q&A
| Task | Primary | Fallback |
|---|---|---|
| Greeting / small talk | Claude BUDGET (Haiku) | — |
| Factual Q&A | OpenAI BUDGET (Nano) | Claude BUDGET |
| Multi-turn dialogue | Claude BUDGET (Haiku) | Claude MID (Sonnet) |
| Opinion / recommendation | Claude MID (Sonnet) | Claude BUDGET |
| Sensitive / nuanced topic | Claude MID (Sonnet) | Claude PREMIUM (Opus) |
| Role-play / persona | Claude MID (Sonnet) | — |
| Summarize conversation | Claude BUDGET (Haiku) | OpenAI BUDGET |
| Translation | OpenAI MID-LOW (Mini) | Claude BUDGET |
| Explain concept (simple) | Claude BUDGET (Haiku) | OpenAI BUDGET |
| Explain concept (deep) | Claude MID (Sonnet) | OpenAI MID |

---

## ✍️ Writing & Creative
| Task | Primary | Fallback |
|---|---|---|
| Social captions | Claude BUDGET (Haiku) | OpenAI BUDGET |
| Email (short) | Claude BUDGET (Haiku) | OpenAI MID-LOW |
| Email (formal/long) | Claude MID (Sonnet) | OpenAI MID |
| Blog post / article | Claude MID (Sonnet) | — |
| Creative story / fiction | Claude MID (Sonnet) | Claude PREMIUM (Opus) |
| Poetry / lyrical | Claude PREMIUM (Opus) | Claude MID |
| Resume / cover letter | Claude MID (Sonnet) | OpenAI MID |
| Proofreading / grammar | OpenAI MID-LOW (Mini) | Claude BUDGET |
| Brainstorm / ideation | Claude MID (Sonnet) | Claude BUDGET |
| Persuasive writing | Claude MID (Sonnet) | Claude PREMIUM |
| Long-form report (2K+) | Claude MID (Sonnet) | OpenAI MID |
| Product descriptions (bulk) | Gemini BUDGET + Batch | OpenAI BUDGET + Batch |

---

## 💻 Technical & Coding
| Task | Primary | Fallback |
|---|---|---|
| Explain code / simple function | OpenAI MID-LOW (Mini) | Claude BUDGET |
| Complex feature / debug | OpenAI MID (GPT-5.2) | Claude MID |
| Refactor / architecture | OpenAI MID (GPT-5.2) | Claude PREMIUM |
| SQL / regex | OpenAI BUDGET (Nano) | OpenAI MID-LOW |
| API integration | OpenAI MID (GPT-5.2) | Claude MID |
| Unit tests | OpenAI MID-LOW (Mini) | OpenAI MID |
| DevOps / CLI | OpenAI MID-LOW (Mini) | Claude BUDGET |
| Data processing script | OpenAI MID (GPT-5.2) | Claude MID |
| Code review (bulk) | Gemini MID + Batch | OpenAI MID + Batch |
| Technical docs | OpenAI MID (GPT-5.2) | Claude MID |

---

## 🔍 Research & Documents
| Task | Primary | Fallback |
|---|---|---|
| Quick fact-check | OpenAI BUDGET (Nano) | Claude BUDGET |
| Current events / news | Gemini MID (Flash) | OpenAI MID |
| Deep research | Gemini PREMIUM (Pro) | Claude MID + search |
| Competitive analysis | Gemini PREMIUM (Pro) | OpenAI MID |
| Summarize doc (<50K) | Gemini MID (Flash) | Claude MID |
| Summarize doc (50K+) | Gemini PREMIUM (Pro) | Gemini PREMIUM-PREVIEW |
| Literature overview | Claude MID (Sonnet) | Gemini MID |
| Data extraction | OpenAI MID (GPT-5.2) | Gemini MID |
| Bulk doc summarization | Gemini BUDGET + Batch | OpenAI BUDGET + Batch |

---

## 📏 Escalation & Switching Rules

1. **Start at the recommended tier for the task** — don't pre-escalate
2. **Switch models dynamically** — when a task changes (chat → code → writing), switch to the right model for that task
3. **Escalate only if output quality is genuinely poor** — one tier at a time
4. **PREMIUM is last resort** — always try MID first
5. **GPT-5.2 Pro is OFF by default** — 12× cost of GPT-5.2
6. **Unknown tasks** → Claude BUDGET → evaluate → escalate if needed
7. **After a heavy task, drop back** — return to a conversation-appropriate model when done
8. **Rick's manual override beats auto-routing** — if Rick sets a model, stay on it unless he asks for a task that needs something bigger

---

## 💰 Cost Guardrails

1. Use BUDGET tiers for repetitive, low-stakes, or bulk tasks
2. Batch API mandatory for 20+ non-urgent requests (50% off)
3. No free tiers in production (rate limits break UX)
4. Monthly spend cap: $30–60 for moderate use
5. Weekly audit: check if any tasks are over-routed to premium
6. Enable prompt caching where supported
7. Never run the same task twice — cache responses

---

## 📋 Quick Reference

| Task Type | Model | Provider |
|---|---|---|
| Greeting / chitchat | Haiku 4.5 | Claude |
| General conversation | Haiku 4.5 | Claude |
| Short writing | Haiku 4.5 | Claude |
| Long / nuanced writing | Sonnet 4.6 | Claude |
| Creative / literary | Opus 4.6 | Claude |
| Simple code | GPT-5 Mini | OpenAI |
| Complex code | GPT-5.2 | OpenAI |
| Web search / news | Gemini 2.5 Flash | Google |
| Deep research | Gemini 2.5 Pro | Google |
| Long document (50K+) | Gemini 2.5 Flash/Pro | Google |
| Bulk / batch | Gemini Flash-Lite | Google |
| Unknown | Haiku 4.5 | Claude |

---

## 📝 Version History

| Version | Date | Changes |
|---|---|---|
| v1.0 | 2026-03-07 | Initial. Gemini-only mappings (Anthropic unavailable). |
| v1.1 | 2026-03-08 | Full multi-provider restore. Claude primary for conversation/writing, OpenAI for code, Gemini for research/large-context. Anthropic back online. |
