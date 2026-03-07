# MODELS.md - Smart Routing (v1.0)

**Priority:** Balanced Cost vs Quality (Updated: 2026-03-07)
Follows `GeneralBot_Smart_Routing_Strategy.md` logic.

## 🛠️ Model Registry (Mappings)
- **Haiku** (BUDGET) → `google/gemini-2.5-flash`
- **Sonnet** (MID) → `google/gemini-2.5-pro`
- **Opus/Pro** (PREMIUM) → `google/gemini-3-1-pro`
- **Technical** (GPT-Equivalent) → `google/gemini-2.5-pro` (General) / `google/gemini-3-1-pro` (Strategic)

---

## 🗣️ Conversation & Q&A
| Task | Model |
|---|---|
| Greeting / small talk | google/gemini-2.5-flash |
| Factual Q&A | google/gemini-2.5-flash |
| Multi-turn dialogue | google/gemini-2.5-flash |
| Opinion / recommendation | google/gemini-2.5-pro |
| Sensitive / nuanced topic | google/gemini-2.5-pro |
| Summarize conversation | google/gemini-2.5-flash |

---

## ✍️ Writing & Creative
| Task | Model |
|---|---|
| Social captions / Hashtags | google/gemini-2.5-flash |
| Email drafts (Short) | google/gemini-2.5-flash |
| Email drafts (Formal/Long) | google/gemini-2.5-pro |
| Blog posts / Articles | google/gemini-2.5-pro |
| Creative story / Poetry | google/gemini-3-1-pro |
| Resume / Cover letter | google/gemini-2.5-pro |
| Proofreading / Grammar | google/gemini-2.5-flash |

---

## 💻 Technical & Coding
| Task | Model |
|---|---|
| Explain code / Simple function | google/gemini-2.5-pro |
| Complex feature / Debugging | google/gemini-2.5-pro |
| Refactor / Architecture | google/gemini-3-1-pro |
| SQL / Regex | google/gemini-2.5-flash |
| API integration | google/gemini-2.5-pro |

---

## 🔍 Research & Docs
| Task | Model |
|---|---|
| Quick fact-check | google/gemini-2.5-flash |
| Current events / News | google/gemini-2.5-pro |
| Deep research / Analysis | google/gemini-3-1-pro |
| Summarize doc (<50k) | google/gemini-2.5-pro |
| Summarize doc (50k+) | google/gemini-2.5-pro | (Note: Gemini Flash is still capable for very large contexts if needed)

---

## 📏 Default Escalation
- **Default:** `google/gemini-2.5-pro` (Sonnet Equivalent)
- **Complex/Strategic:** `google/gemini-3-1-pro` (Opus Equivalent)

---

## 💰 Cost Guardrails
1. **Gemini 2.5 Flash First:** Use `google/gemini-2.5-flash` for all repetitive, low-stakes, or bulk tasks.
2. **Gemini 2.5 Pro for Quality:** Escalate to `google/gemini-2.5-pro` only for high-stakes, client-facing, or complex logic.
3. **Gemini 3.1 Pro for Premium:** Use `google/gemini-3-1-pro` for the most complex, strategic, or creative tasks.
4. **Monthly Audit:** Review logs to ensure efficient model routing and cost management.
