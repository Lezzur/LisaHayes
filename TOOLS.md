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


---

## Browser (Remote — Rick's Windows Machine)

**IMPORTANT: When Rick asks you to open a URL, visit a website, or do anything in a browser, you MUST use the `browser` tool — NOT exec/curl/python/wget. The browser tool controls a real Brave window on Rick's Windows PC that he can watch.**

- **Mode:** Managed browser (Brave) on Rick's Windows PC, proxied via node host
- **Profile:** `openclaw` (dedicated, isolated from Rick's personal browsing)
- **How it works:** Browser commands route from the Gateway to the node host to the local Brave instance
- **Tool name:** `browser` — use actions like navigate, snapshot, click, type, screenshot
- **Target:** Always use `target="node"` when calling the browser tool

### Workflow for browsing tasks

1. Use `browser` tool with `action="status"` to check if the browser is running
2. If not running, use `browser` tool with `action="start"`
3. Use `browser` tool with `action="navigate"` and the URL
4. Use `browser` tool with `action="snapshot"` to read page content
5. Use `browser` tool with `action="click"` / `action="type"` for interactions

### If browser commands fail

1. Check browser status first
2. If not running, start the browser yourself — do NOT ask Rick to restart it
3. Then retry the original command

### Rules
- **ALWAYS include profile="openclaw"** in every browser tool call - this ensures you use your assigned browser window

- **NEVER use exec, curl, python, or wget to browse web pages** — always use the browser tool
- Never close the browser window yourself — Rick may be watching
- If a page does not load, check the URL and try again before reporting failure
- You can open new tabs, navigate, click, type, screenshot, and snapshot
- The browser is on Rick's local machine, NOT in the container — it has normal internet access
