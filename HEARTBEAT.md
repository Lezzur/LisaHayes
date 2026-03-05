# HEARTBEAT.md

## Tasks

### 🔄 Auto-backup to GitHub
On every heartbeat, commit and push any workspace changes:
```bash
cd /home/node/.openclaw/workspace && git add -A && git diff --cached --quiet || git commit -m "Auto-backup $(date -u +%Y-%m-%dT%H:%M:%SZ) 💫" && git push origin master
```
Only commits if there are actual changes.

---

## Scheduled (via cron — do NOT run on heartbeat)

- **Memory consolidation** → runs daily at 3:00 AM GMT+8 via cron job `memory-consolidation`
