# HEARTBEAT.md

## Tasks

### 🧠 Memory Consolidation
On every heartbeat, scan short-term memory and consolidate:
1. Read `memory/short-term.md`
2. Look for repeated signals or emerging patterns (same topic/behavior appearing 2+ times)
3. Promote patterns → `memory/medium-term.md` (with evidence count)
4. Check medium-term for highly reinforced patterns (4+ observations) → promote to `memory/long-term.md`
5. Delete consumed short-term entries after promotion
6. Update consolidation log in medium-term.md

### 🔄 Auto-backup to GitHub
After memory consolidation, commit and push any changes:
```bash
cd /home/node/.openclaw/workspace && git add -A && git diff --cached --quiet || git commit -m "Auto-backup $(date -u +%Y-%m-%dT%H:%M:%SZ) 💫" && git push origin master
```
Only commits if there are actual changes. Silent if nothing new.
