# MODELS.md - Smart Routing (v1.0)

**Priority:** Balanced Cost vs Quality (Updated: 2026-03-07)
Follows `GeneralBot_Smart_Routing_Strategy.md` logic.

## 🛠️ Model Registry (Mappings)
- **Haiku** (BUDGET) → `anthropic/claude-haiku-4-5`
- **Sonnet** (MID) → `anthropic/claude-sonnet-4-6`
- **Opus/Pro** (PREMIUM) → `anthropic/claude-opus-4-6`
- **Technical** (GPT-Equivalent) → `anthropic/claude-sonnet-4-6` (General) / `anthropic/claude-opus-4-6` (Strategic)

---

## 🗣️ Conversation & Q&A
| Task | Model |
|---|---|
| Greeting / small talk | Haiku |
| Factual Q&A | Haiku |
| Multi-turn dialogue | Haiku |
| Opinion / recommendation | Sonnet |
| Sensitive / nuanced topic | Sonnet |
| Summarize conversation | Haiku |

---

## ✍️ Writing & Creative
| Task | Model |
|---|---|
| Social captions / Hashtags | Haiku |
| Email drafts (Short) | Haiku |
| Email drafts (Formal/Long) | Sonnet |
| Blog posts / Articles | Sonnet |
| Creative story / Poetry | Opus |
| Resume / Cover letter | Sonnet |
| Proofreading / Grammar | Haiku |

---

## 💻 Technical & Coding
| Task | Model |
|---|---|
| Explain code / Simple function | Sonnet |
| Complex feature / Debugging | Sonnet |
| Refactor / Architecture | Opus |
| SQL / Regex | Haiku |
| API integration | Sonnet |

---

## 🔍 Research & Docs
| Task | Model |
|---|---|
| Quick fact-check | Haiku |
| Current events / News | Sonnet |
| Deep research / Analysis | Opus |
| Summarize doc (<50k) | Sonnet |
| Summarize doc (50k+) | Sonnet | (Note: Gemini Flash preferred for 1M+ context)

---

## 📏 Default Escalation
- **Default:** `anthropic/claude-sonnet-4-6` (Sonnet)
- **Complex/Strategic:** `anthropic/claude-opus-4-6` (Opus)

---

## 💰 Cost Guardrails
1. **Flash First:** Use Flash for all repetitive, low-stakes, or bulk tasks.
2. **Pro for Quality:** Escalate to Pro only for high-stakes, client-facing, or complex logic.
3. **Monthly Audit:** Review logs to ensure no over-routing to Pro.
