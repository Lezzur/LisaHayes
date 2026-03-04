# RESTORE.md - Lisa Hayes Recovery Runbook

> Target: Back online in under 10 minutes after catastrophic server loss.

## What You Need (Secrets — store in password manager)

- **Anthropic API key** — for Claude models
- **Discord bot token** — `channels.discord.token` in config
- **Gateway auth token** — `gateway.auth.token` in config
- **GitHub access** — to clone this repo

---

## Step 1 — Fresh Server

Spin up a new server (Ubuntu 22.04+ recommended). SSH in.

---

## Step 2 — Install OpenClaw

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

Or follow: https://docs.openclaw.ai/install

---

## Step 3 — Clone This Repo

```bash
git clone https://github.com/Lezzur/LisaHayes.git /home/node/.openclaw/workspace
```

---

## Step 4 — Restore Config

```bash
cp /home/node/.openclaw/workspace/openclaw.template.json ~/.openclaw/openclaw.json
```

Now edit it and fill in real secrets:

```bash
nano ~/.openclaw/openclaw.json
```

Replace:
- `YOUR_DISCORD_BOT_TOKEN` → your Discord bot token
- `YOUR_GATEWAY_AUTH_TOKEN` → your gateway auth token
- Add your Anthropic API key via: `openclaw config` → Model section

---

## Step 5 — Start OpenClaw

```bash
openclaw gateway start
openclaw start
```

---

## Step 6 — Verify

- Check: `openclaw status`
- Models: `openclaw models list`
- Send Lisa a message on Discord — she should remember who she is

---

## Lisa's Core Files (auto-restored from repo)

- `SOUL.md` — personality
- `IDENTITY.md` — name, vibe, emoji
- `USER.md` — Rick's info
- `MODELS.md` — task → model mapping
- `AGENTS.md` — workspace rules
- `HEARTBEAT.md` — periodic tasks
- `memory/` — daily logs (recent context)

---

## Auto-Backup

Lisa auto-commits and pushes workspace changes to this repo periodically.
Last backup timestamp visible in git log:

```bash
git -C /home/node/.openclaw/workspace log --oneline -5
```

---

_If Lisa seems confused after restore, just say hi — she'll read her files and remember everything._
