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
- **Access:** IMAP via imapflow + SMTP via nodemailer
- **Tools location:** /home/node/tools/gmail
- **Credentials:** stored in workspace .env (GMAIL_APP_PASSWORD)
- **IMAP:** imap.gmail.com:993 (SSL)
- **SMTP:** smtp.gmail.com:587 (TLS)

---

## Playwright

- **Location:** /home/node/tools/playwright
- **Status:** Installed but system libs missing in container — use for non-Gmail tasks when libs are fixed
- **Note:** Gmail handled via IMAP/SMTP, not Playwright

---

Add whatever helps you do your job. This is your cheat sheet.
