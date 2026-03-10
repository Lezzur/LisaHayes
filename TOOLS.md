# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## Gmail

- **Address:** my.lisa.hayes.ai@gmail.com
- **IMAP:** imap.gmail.com:993 (SSL)
- **SMTP:** smtp.gmail.com:587 (TLS)
- **Credentials:** vault secret `GMAIL_APP_PASSWORD` (never raw — use --vault flag)

### Gmail Reader CLI

**Path:** `/home/node/.openclaw/workspace/tools/gmail/reader.js`

**Usage:** `node /home/node/.openclaw/workspace/tools/gmail/reader.js --vault GMAIL_APP_PASSWORD <command> [options]`

| Command | Description | Example |
|---------|-------------|---------|
| `latest [--from x] [--since min]` | Most recent matching email | `latest --from noreply@vaital.app --since 10` |
| `search [from:x subject:y]` | Search inbox | `search from:noreply@vaital.app subject:verify` |
| `read <uid>` | Read full email body | `read 12345` |
| `extract-link <uid> [--pattern x]` | Extract URLs from email | `extract-link 12345 --pattern vaital` |
| `extract-code <uid> [--pattern x]` | Extract OTP/verification codes | `extract-code 12345` |

**Flags:** `--from`, `--subject`, `--to`, `--since <minutes>` (default 60 for latest)

**Workflow for verification emails:**
1. `latest --from <sender> --since 5` — get the UID
2. `extract-code <uid>` or `extract-link <uid> --pattern <domain>` — get the code/link

**Important:** Always use `--vault GMAIL_APP_PASSWORD`, never pass the password directly.

---

## Playwright

- **Location:** /home/node/tools/playwright
- **Status:** Installed and functional. Version: 1.58.2
- **Note:** Gmail handled via IMAP/SMTP, not Playwright

---

Add whatever helps you do your job. This is your cheat sheet.
