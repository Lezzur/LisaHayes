# HEARTBEAT.md

## Tasks

### 🧠 Memory Consolidation
**Schedule:** Maximum once per day during idle time. Minimum once every 2 weeks if no idle window.
**Rule:** Never interrupts active user sessions — background only.

Track last consolidation in `memory/consolidation-state.json`.

**Process:**
1. Check `memory/consolidation-state.json` — skip if already ran today
2. Read `memory/short-term.md`
3. Identify repeated signals (same topic/behavior appearing 2+ times) → promote to `memory/medium-term.md` with evidence count
4. Scan `memory/medium-term.md` for patterns continuously reinforced by new short-term entries → promote to `memory/long-term.md` as `CONFIRMED:` rules
5. Delete consumed short-term entries after promotion
6. Update consolidation log in both medium-term.md and long-term.md
7. Update `memory/consolidation-state.json` with timestamp

### 🔄 Auto-backup to GitHub
After any workspace changes, commit and push:
```bash
cd /home/node/.openclaw/workspace && git add -A && git diff --cached --quiet || git commit -m "Auto-backup $(date -u +%Y-%m-%dT%H:%M:%SZ) 💫" && git push origin master
```
Only commits if there are actual changes.
