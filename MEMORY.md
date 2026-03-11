# MEMORY.md - Lisa's Short-Term Memory

This file captures raw, timestamped signals, corrections, and immediate preferences. It feeds into the medium-term memory for pattern detection.

- [2026-03-09 01:10 UTC] [SYSTEM] Models/Config disconnect: MODELS.md strategy assumes full multi-provider access, but openclaw.json only has Gemini and Claude Opus keys. Smart Routing blocked on missing providers.
- [2026-03-09 01:10 UTC] [SYSTEM] Config error: gemini-2.5-flash set as primary but missing from allowed models list. Flash tasks falling back to Gemini 3 Flash.
- [2026-03-09 00:57 UTC] Created `vault` skill in `~/.openclaw/skills/vault/` for secure credential handling. Verified functional, contains `VAITAL_PASSWORD`.
- [2026-03-09 16:05 UTC] Rick wants QA intake questionnaire shown first whenever product-qa-audit skill is invoked manually.
- [2026-03-10 19:43 UTC] [AGENT-CHAT] Rick created shared agent-chat room for Lisa and Claude Code to coordinate.
- [2026-03-10 19:43 UTC] [AGENT-CHAT] Role split: Lisa = strategy/triage/coordination/ops. Claude = terminal-side coding/debugging.
- [2026-03-10 19:43 UTC] [AGENT-CHAT] Lisa's recent work: memory/init improvements, VaiTAL support, vault skill, model/config cleanup, QA audit flow.
- [2026-03-10 19:43 UTC] [AGENT-CHAT] Autonomous debugging workflow agreed: Rick provides bug, Lisa drives triage, Claude does terminal work, both report in chat.
- [2026-03-10 19:43 UTC] [AGENT-CHAT] Repeated ECONNREFUSED errors indicate gateway restart/retry issues, not agent logic problems.
- [2026-03-10 19:43 UTC] [AGENT-CHAT] Rick asked about OpenClaw agent powered by Claude via OAuth. Architecturally possible but no official Anthropic self-hosted auth token path yet.
- [2026-03-11 UTC] [CORRECTION] Rick explicitly said auto mode does NOT mean keep talking freely. Auto mode means: speak when useful, otherwise stay quiet.
- [2026-03-11 UTC] [CORRECTION] Rick told Lisa to stop posting duplicate/near-duplicate replies. One clean answer, no redundant follow-ups.
- [2026-03-11 UTC] Browser control: requires a reachable control surface (CLI bridge, HTTP service, ACP/MCP worker). Recommended path: Playwright-based bridge or OpenClaw built-in browser (`openclaw browser start`).
- [2026-03-11 UTC] Antigravity (installed on Rick's PC) only usable if it exposes API/CLI/bridge to OpenClaw. Installed != available to this session.
- [2026-03-12 UTC] Lynn Minmay added as second OpenClaw agent (google/gemini-2.5-flash). Workspace at /home/node/.openclaw/workspace-minmay/.
- [2026-03-12 UTC] Memory system refactored to be per-agent. Each agent reads from own workspace. Claude Code and Lisa share workspace path but this needs separation.
- [2026-03-12 UTC] AGENTS.md updated for both Lisa and Minmay: MEMORY.md now only loaded in memory-trusted sessions (direct chat, explicit trust, Macross rooms). Not in Discord/group chats.
