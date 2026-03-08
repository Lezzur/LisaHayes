# 🧠 MEMORY.md - Lisa's Short-Term Memory

This file captures raw, timestamped signals, corrections, and immediate preferences. It feeds into the medium-term memory for pattern detection.

- [2026-03-08 13:48 UTC] Confirmed Playwright is installed and functional (Version 1.58.2). Updated TOOLS.md to reflect this.
- [2026-03-08 06:08 UTC] New session started. Read SOUL.md, USER.md, daily files, MEMORY.md — but FAILED to read long-term.md and medium-term.md. Initialization sequence was incomplete.
- [2026-03-08 06:09 UTC] Rick switched model to Claude Opus 4.6 (anthropic/claude-opus-4-6) manually. Kept it intentionally despite routing strategy suggesting BUDGET for conversation.
- [2026-03-08 06:10 UTC] Signed up for VaiTAL (https://vaital.vercel.app) using my.lisa.hayes.ai@gmail.com. Email confirmed via Supabase. Logged in successfully. Health dashboard app — empty account.
- [2026-03-08 06:10 UTC] VaiTAL password generated and stored: credentials shared with Rick in main session chat.
- [2026-03-08 06:29 UTC] Rick instructed: review smart routing rules and always implement them. Updated MODELS.md v1.0 → v1.1: restored full multi-provider strategy (Claude for conversation/writing, OpenAI for code, Gemini for research/large-context). Previous v1.0 was Gemini-only due to Anthropic outage.
- [2026-03-08 06:33 UTC] Rick instructed: review memory architecture and ensure it's always followed, even at initialization. Found 4 issues: (1) startup sequence missing long-term/medium-term reads, (2) file naming mismatch (confirmed-long-term.md vs long-term.md), (3) stale consolidation state, (4) missed signal capture. All fixed.
- [2026-03-08 06:33 UTC] [CORRECTION] Updated AGENTS.md initialization sequence: now explicitly includes long-term.md (step 3) and medium-term.md (step 4) before daily files and MEMORY.md. Fixed file name references from confirmed-long-term.md → long-term.md.
- [2026-03-08 06:40 UTC] [PREFERENCE] Rick wants dynamic model switching mid-session. Chat on cheap models, escalate to bigger models when tasks demand it (coding, complex writing, etc.), then drop back. Updated MODELS.md v1.1 routing behavior. Removed "never mix providers mid-conversation" rule. Rick's manual model override always takes priority.
- [2026-03-08 06:43 UTC] [FIX] Memory consolidation cron was broken — referenced nonexistent memory/short-term.md and had hardcoded date (2026-03-06.md). Updated payload to follow AGENTS.md architecture properly.
- [2026-03-08 06:43 UTC] [FIX] Discord daily channel cron had hardcoded date in payload. Updated to use dynamic date.
- [2026-03-08 06:43 UTC] [CLEANUP] Removed 16 temp files from workspace root (screenshots, throwaway JS from VaiTAL signup and earlier sessions).
- [2026-03-08 06:43 UTC] [FIX] Updated .gitignore to exclude node_modules/, package-lock.json, *.png, *.jpg, *.tmp.
- [2026-03-08 06:43 UTC] [FIX] Updated model references in PLAN.md, ROADMAP.md, TACTICAL_REVIEW.md: Gemini 1.5 Flash → 2.5 Flash, removed GPT-4o references.
