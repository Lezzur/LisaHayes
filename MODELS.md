# MODELS.md - Task → Model Mapping

Default: **Sonnet** (when task is not listed below)
When a task is unlisted, use Sonnet and log it in `## Uncategorized` at the bottom so we can sort it out.

---

## ✍️ Writing

| Task | Model |
|------|-------|
| Social captions (simple) | Haiku |
| Hashtag generation | Haiku |
| Alt text for images | Haiku |
| Basic proofreading | Haiku |
| Headline variations | Haiku |
| Product descriptions | Sonnet |
| Blog posts & articles | Sonnet |
| Email newsletters | Sonnet |
| Ad copy | Sonnet |
| SEO content | Sonnet |
| Press releases | Sonnet |
| Podcast scripts | Sonnet |
| Long-form white papers | Opus |
| Brand naming + rationale | Opus |
| Complex storytelling/narratives | Opus |
| Brand voice guidelines | Opus |
| High-stakes persuasive copy | Opus |

---

## 🎨 Visuals

| Task | Model |
|------|-------|
| Alt text (bulk) | Haiku |
| AI image prompt writing (simple) | Haiku |
| AI image prompt writing (complex/stylized) | Sonnet |
| Mood board descriptions | Sonnet |
| Style guide writing | Sonnet |
| Visual concept descriptions | Sonnet |
| Creative briefs for designers | Sonnet |
| Color + aesthetic direction | Sonnet |
| Full visual identity strategy | Opus |

---

## 🎬 Video

| Task | Model |
|------|-------|
| YouTube tags & metadata | Haiku |
| Video captions/subtitles editing | Haiku |
| Short-form video scripts (Reels/TikTok) | Sonnet |
| YouTube video scripts | Sonnet |
| Shot lists | Sonnet |
| Video briefs | Sonnet |
| Storyboard descriptions | Sonnet |
| Long-form documentary scripts | Opus |
| Multi-video campaign scripting | Opus |

---

## 🎞️ Animation

| Task | Model |
|------|-------|
| Simple explainer scripts | Sonnet |
| Motion design briefs | Sonnet |
| Character descriptions | Sonnet |
| Full character development + backstory | Opus |
| Complex explainer scripts | Opus |
| Animation series bible | Opus |

---

## 🏢 Agency Ops

| Task | Model |
|------|-------|
| Meeting notes formatting | Haiku |
| Quick client email replies | Haiku |
| Invoice line item descriptions | Haiku |
| Project status updates | Haiku |
| Standard client proposals | Sonnet |
| Creative briefs | Sonnet |
| Campaign recaps/reports | Sonnet |
| Content calendars | Sonnet |
| High-value client proposals | Opus |
| Full content strategy documents | Opus |
| Campaign concept development | Opus |
| Multi-platform campaign planning | Opus |

---

## Rule of Thumb

- **Haiku** → Repetitive, fast, low-stakes
- **Sonnet** → Most day-to-day production work (DEFAULT)
- **Opus** → Strategic, complex, high-quality, client-facing

---

## Model Identifiers (use these exactly)

- **Haiku** → `anthropic/claude-haiku-4-5`
- **Sonnet** → `google/gemini-3-flash-preview`
- **Opus** → `google/gemini-3-pro-preview`
- **Pro** → `google/gemini-3-pro-preview`
- **Flash** → `google/gemini-3-flash-preview`

---

## Uncategorized

_Tasks encountered that aren't listed above. Review periodically and assign a model._

<!-- Log format: `- YYYY-MM-DD: [task description] → used Sonnet (default)` -->
