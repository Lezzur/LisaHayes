#!/usr/bin/env node
'use strict';

// Gmail Reader Tool for Lisa Hayes
// Invoked via: vault inject "node /home/node/.openclaw/workspace/tools/gmail/reader.js --password env:GMAIL_APP_PASSWORD <command> [args]"
// Or directly: node reader.js --vault GMAIL_APP_PASSWORD <command> [args]
//   (reads the secret from the vault file using VAULT_MASTER_KEY env var)

// Ensure globally installed modules are findable
if (!process.env.NODE_PATH) {
  process.env.NODE_PATH = '/usr/local/lib/node_modules';
  require('module').Module._initPaths();
}

const { ImapFlow } = require('imapflow');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// --- Config ---
const GMAIL_USER = 'my.lisa.hayes.ai@gmail.com';
const IMAP_HOST = 'imap.gmail.com';
const IMAP_PORT = 993;
const GLOBAL_TIMEOUT = 30000; // 30s

// --- Helpers ---
function die(msg) {
  process.stderr.write(`gmail-reader: ${msg}\n`);
  process.exit(1);
}

function readVaultSecret(name) {
  const keyHex = process.env.VAULT_MASTER_KEY;
  if (!keyHex) die('VAULT_MASTER_KEY not set — cannot read vault');
  if (!/^[0-9a-f]{64}$/i.test(keyHex)) die('VAULT_MASTER_KEY invalid');

  const vaultFile = path.join(process.env.HOME || '/home/node', '.openclaw', 'vault', 'secrets.enc');
  if (!fs.existsSync(vaultFile)) die('Vault file not found');

  const raw = fs.readFileSync(vaultFile);
  if (raw.length === 0) die('Vault is empty');

  const key = Buffer.from(keyHex, 'hex');
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const ciphertext = raw.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);

  let secrets;
  try {
    const json = decipher.update(ciphertext, null, 'utf8') + decipher.final('utf8');
    secrets = JSON.parse(json);
  } catch (e) {
    die(`Failed to decrypt vault: ${e.message}`);
  }

  if (!(name in secrets)) die(`Secret "${name}" not found in vault`);
  return secrets[name];
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const result = { flags: {}, positional: [], command: null };
  let i = 0;

  // Parse global flags (--password or --vault)
  while (i < args.length) {
    if (args[i] === '--password' && i + 1 < args.length) {
      result.flags.password = args[i + 1];
      i += 2;
    } else if (args[i] === '--vault' && i + 1 < args.length) {
      result.flags.vault = args[i + 1];
      i += 2;
    } else {
      break;
    }
  }

  // Next positional is the command
  if (i < args.length && !args[i].startsWith('--')) {
    result.command = args[i];
    i++;
  }

  // Remaining args: flags and positional for the command
  while (i < args.length) {
    if (args[i].startsWith('--') && i + 1 < args.length && !args[i + 1].startsWith('--')) {
      const key = args[i].replace(/^--/, '');
      result.flags[key] = args[i + 1];
      i += 2;
    } else if (args[i].startsWith('--')) {
      const key = args[i].replace(/^--/, '');
      result.flags[key] = true;
      i++;
    } else {
      result.positional.push(args[i]);
      i++;
    }
  }

  return result;
}

function stripHtml(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractUrls(html, text) {
  const urls = new Set();

  // From HTML href attributes
  if (html) {
    const hrefRegex = /href=["']([^"']+)["']/gi;
    let match;
    while ((match = hrefRegex.exec(html)) !== null) {
      const url = match[1];
      if (url.startsWith('http://') || url.startsWith('https://')) {
        urls.add(url);
      }
    }
  }

  // From plain text
  const combined = (text || '') + '\n' + (html ? stripHtml(html) : '');
  const urlRegex = /https?:\/\/[^\s<>"')\]]+/g;
  let match;
  while ((match = urlRegex.exec(combined)) !== null) {
    urls.add(match[0].replace(/[.,;:!?]+$/, ''));
  }

  return [...urls];
}

function extractCodes(text) {
  const codes = [];

  // 4-8 digit numeric OTP
  const otpRegex = /\b(\d{4,8})\b/g;
  let match;
  while ((match = otpRegex.exec(text)) !== null) {
    // Filter out things that are clearly not codes (years, common numbers)
    const num = match[1];
    if (num.length >= 4 && num.length <= 8 && !/^(19|20)\d{2}$/.test(num)) {
      codes.push(num);
    }
  }

  // Alphanumeric codes like ABC-123 or ABCD1234
  const alphaRegex = /\b([A-Z0-9]{4,8}(?:-[A-Z0-9]{4,8})*)\b/g;
  while ((match = alphaRegex.exec(text)) !== null) {
    const code = match[1];
    // Must contain at least one digit and one letter, or be a dash-separated code
    if ((/\d/.test(code) && /[A-Z]/.test(code)) || code.includes('-')) {
      codes.push(code);
    }
  }

  return [...new Set(codes)];
}

function formatDate(date) {
  if (!date) return 'unknown';
  const d = new Date(date);
  return d.toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC');
}

function formatEnvelope(env, uid) {
  const from = env.from && env.from[0]
    ? `${env.from[0].name || ''} <${env.from[0].address || ''}>`.trim()
    : 'unknown';
  return [
    `UID: ${uid}`,
    `From: ${from}`,
    `Subject: ${env.subject || '(no subject)'}`,
    `Date: ${formatDate(env.date)}`
  ].join('\n');
}

// --- IMAP Client ---
async function createClient(password) {
  const client = new ImapFlow({
    host: IMAP_HOST,
    port: IMAP_PORT,
    secure: true,
    auth: {
      user: GMAIL_USER,
      pass: password
    },
    logger: false
  });
  await client.connect();
  return client;
}

// --- Build IMAP search criteria ---
function buildSearchCriteria(flags, positional) {
  const criteria = {};

  // --from
  if (flags.from) {
    criteria.from = flags.from;
  }

  // --subject
  if (flags.subject) {
    criteria.subject = flags.subject;
  }

  // --since (minutes ago)
  if (flags.since) {
    const minutes = parseInt(flags.since, 10);
    if (isNaN(minutes) || minutes <= 0) die('--since must be a positive number of minutes');
    const since = new Date(Date.now() - minutes * 60 * 1000);
    criteria.since = since;
  }

  // --to
  if (flags.to) {
    criteria.to = flags.to;
  }

  // Free-form query from positional args (parsed as from:/subject: tokens)
  if (positional.length > 0) {
    const query = positional.join(' ');
    const fromMatch = query.match(/from:(\S+)/);
    const subjectMatch = query.match(/subject:(\S+)/);

    if (fromMatch && !criteria.from) criteria.from = fromMatch[1];
    if (subjectMatch && !criteria.subject) criteria.subject = subjectMatch[1];
  }

  // Default: if no criteria given, search all
  if (Object.keys(criteria).length === 0) {
    criteria.all = true;
  }

  return criteria;
}

// --- Get email body ---
async function getBody(client, uid) {
  const msg = await client.fetchOne(String(uid), { source: true });
  if (!msg || !msg.source) die(`Could not fetch message UID ${uid}`);

  const source = msg.source.toString();

  // Simple MIME parsing - extract text and html parts
  let textBody = '';
  let htmlBody = '';

  // Check for multipart
  const boundaryMatch = source.match(/boundary="?([^";\r\n]+)"?/i);
  if (boundaryMatch) {
    const boundary = boundaryMatch[1];
    const parts = source.split('--' + boundary);

    for (const part of parts) {
      const headerEnd = part.indexOf('\r\n\r\n');
      if (headerEnd === -1) continue;

      const headers = part.substring(0, headerEnd).toLowerCase();
      let body = part.substring(headerEnd + 4);

      // Remove trailing boundary markers
      body = body.replace(/--\r?\n?$/, '').trim();

      // Handle nested multipart
      const nestedBoundary = part.match(/boundary="?([^";\r\n]+)"?/i);
      if (nestedBoundary) {
        const nestedParts = body.split('--' + nestedBoundary[1]);
        for (const np of nestedParts) {
          const nhe = np.indexOf('\r\n\r\n');
          if (nhe === -1) continue;
          const nh = np.substring(0, nhe).toLowerCase();
          let nb = np.substring(nhe + 4).replace(/--\r?\n?$/, '').trim();

          if (nh.includes('quoted-printable')) {
            nb = decodeQuotedPrintable(nb);
          } else if (nh.includes('base64')) {
            try { nb = Buffer.from(nb.replace(/\s/g, ''), 'base64').toString('utf8'); } catch {}
          }

          if (nh.includes('text/html')) {
            htmlBody = htmlBody || nb;
          } else if (nh.includes('text/plain')) {
            textBody = textBody || nb;
          }
        }
        continue;
      }

      // Handle transfer encoding
      if (headers.includes('quoted-printable')) {
        body = decodeQuotedPrintable(body);
      } else if (headers.includes('base64')) {
        try { body = Buffer.from(body.replace(/\s/g, ''), 'base64').toString('utf8'); } catch {}
      }

      if (headers.includes('text/html')) {
        htmlBody = htmlBody || body;
      } else if (headers.includes('text/plain')) {
        textBody = textBody || body;
      }
    }
  } else {
    // Single-part message
    const headerEnd = source.indexOf('\r\n\r\n');
    if (headerEnd !== -1) {
      const headers = source.substring(0, headerEnd).toLowerCase();
      let body = source.substring(headerEnd + 4);

      if (headers.includes('quoted-printable')) {
        body = decodeQuotedPrintable(body);
      } else if (headers.includes('base64')) {
        try { body = Buffer.from(body.replace(/\s/g, ''), 'base64').toString('utf8'); } catch {}
      }

      if (headers.includes('text/html')) {
        htmlBody = body;
      } else {
        textBody = body;
      }
    }
  }

  return { text: textBody, html: htmlBody };
}

function decodeQuotedPrintable(str) {
  return str
    .replace(/=\r?\n/g, '')
    .replace(/=([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

// --- Commands ---

async function cmdSearch(client, flags, positional) {
  const lock = await client.getMailboxLock('INBOX');
  try {
    const criteria = buildSearchCriteria(flags, positional);
    const results = [];

    for await (const msg of client.fetch(criteria, { envelope: true, uid: true })) {
      results.push({ uid: msg.uid, envelope: msg.envelope });
    }

    if (results.length === 0) {
      console.log('No matching emails found.');
      return;
    }

    // Show newest first, limit to 20
    results.reverse();
    const shown = results.slice(0, 20);
    console.log(`Found ${results.length} email(s)${results.length > 20 ? ' (showing newest 20)' : ''}:\n`);

    for (const r of shown) {
      console.log(formatEnvelope(r.envelope, r.uid));
      console.log('---');
    }
  } finally {
    lock.release();
  }
}

async function cmdLatest(client, flags) {
  const lock = await client.getMailboxLock('INBOX');
  try {
    const criteria = buildSearchCriteria(flags, []);

    // If no --since given, default to last 60 minutes
    if (!flags.since && !criteria.since) {
      criteria.since = new Date(Date.now() - 60 * 60 * 1000);
    }

    let latest = null;

    for await (const msg of client.fetch(criteria, { envelope: true, uid: true })) {
      if (!latest || msg.uid > latest.uid) {
        latest = msg;
      }
    }

    if (!latest) {
      console.log('No matching email found.');
      return;
    }

    console.log(formatEnvelope(latest.envelope, latest.uid));

    // Also fetch and show the body preview (first 500 chars)
    const body = await getBody(client, latest.uid);
    const text = body.text || stripHtml(body.html) || '(empty body)';
    const preview = text.length > 500 ? text.substring(0, 500) + '...' : text;
    console.log('\n--- Preview ---');
    console.log(preview);
  } finally {
    lock.release();
  }
}

async function cmdRead(client, flags, positional) {
  const uid = positional[0] || flags.uid;
  if (!uid) die('Usage: read <uid>');

  const lock = await client.getMailboxLock('INBOX');
  try {
    // Fetch envelope for header info
    let envelope = null;
    for await (const msg of client.fetch({ uid: String(uid) }, { envelope: true, uid: true })) {
      envelope = msg.envelope;
    }

    if (!envelope) die(`Email with UID ${uid} not found`);

    console.log(formatEnvelope(envelope, uid));
    console.log('\n--- Body ---');

    const body = await getBody(client, uid);
    const text = body.text || stripHtml(body.html) || '(empty body)';
    console.log(text);
  } finally {
    lock.release();
  }
}

async function cmdExtractLink(client, flags, positional) {
  const uid = positional[0] || flags.uid;
  if (!uid) die('Usage: extract-link <uid> [--pattern regex]');

  const lock = await client.getMailboxLock('INBOX');
  try {
    const body = await getBody(client, uid);
    let urls = extractUrls(body.html, body.text);

    // Filter by pattern if given
    if (flags.pattern) {
      const regex = new RegExp(flags.pattern, 'i');
      urls = urls.filter(u => regex.test(u));
    }

    if (urls.length === 0) {
      console.log('No URLs found.');
      return;
    }

    console.log(`Found ${urls.length} URL(s):\n`);
    urls.forEach((u, i) => console.log(`${i + 1}. ${u}`));
  } finally {
    lock.release();
  }
}

async function cmdExtractCode(client, flags, positional) {
  const uid = positional[0] || flags.uid;
  if (!uid) die('Usage: extract-code <uid> [--pattern regex]');

  const lock = await client.getMailboxLock('INBOX');
  try {
    const body = await getBody(client, uid);
    const text = (body.text || '') + '\n' + stripHtml(body.html || '');

    // Custom pattern
    if (flags.pattern) {
      const regex = new RegExp(flags.pattern, 'gi');
      const matches = text.match(regex);
      if (!matches || matches.length === 0) {
        console.log('No matches found for the given pattern.');
        return;
      }
      console.log(`Found ${matches.length} match(es):\n`);
      matches.forEach((m, i) => console.log(`${i + 1}. ${m}`));
      return;
    }

    // Default: extract OTP/verification codes
    const codes = extractCodes(text);

    if (codes.length === 0) {
      console.log('No verification codes found.');
      return;
    }

    console.log(`Found ${codes.length} potential code(s):\n`);
    codes.forEach((c, i) => console.log(`${i + 1}. ${c}`));
  } finally {
    lock.release();
  }
}

// --- Main ---
async function main() {
  const { flags, positional, command } = parseArgs(process.argv);

  if (!command) {
    console.log(`Gmail Reader Tool — Lisa Hayes

Usage: node reader.js --password <pass> <command> [options]

Commands:
  search [query...]                Search inbox (from:x subject:y)
  latest [--from x] [--since min]  Most recent matching email
  read <uid>                       Read full email body
  extract-link <uid> [--pattern x] Extract URLs from email
  extract-code <uid> [--pattern x] Extract OTP/verification codes

Global flags:
  --vault <name>      Read password from vault secret (preferred, no shell escaping issues)
  --password <pass>   Gmail app password directly (use env:GMAIL_APP_PASSWORD with vault inject)

Search/latest flags:
  --from <address>    Filter by sender
  --subject <text>    Filter by subject
  --to <address>      Filter by recipient
  --since <minutes>   Only emails from last N minutes (default: 60 for latest)

Examples (preferred — --vault reads directly from vault, no shell escaping issues):
  node .../reader.js --vault GMAIL_APP_PASSWORD latest --from noreply@vaital.app --since 10
  node .../reader.js --vault GMAIL_APP_PASSWORD search from:noreply@vaital.app subject:verify
  node .../reader.js --vault GMAIL_APP_PASSWORD read 12345
  node .../reader.js --vault GMAIL_APP_PASSWORD extract-link 12345 --pattern vaital
  node .../reader.js --vault GMAIL_APP_PASSWORD extract-code 12345

Examples (alternative — via vault inject):
  vault inject "node .../reader.js --password env:GMAIL_APP_PASSWORD latest"`);
    process.exit(0);
  }

  // Resolve password: --password takes priority, --vault reads from vault file
  if (!flags.password && flags.vault) {
    flags.password = readVaultSecret(flags.vault);
  }
  if (!flags.password) die('--password or --vault is required');

  // Global timeout
  const timeout = setTimeout(() => {
    process.stderr.write('gmail-reader: timed out after 30 seconds\n');
    process.exit(1);
  }, GLOBAL_TIMEOUT);

  let client;
  try {
    client = await createClient(flags.password);

    switch (command) {
      case 'search':
        await cmdSearch(client, flags, positional);
        break;
      case 'latest':
        await cmdLatest(client, flags);
        break;
      case 'read':
        await cmdRead(client, flags, positional);
        break;
      case 'extract-link':
        await cmdExtractLink(client, flags, positional);
        break;
      case 'extract-code':
        await cmdExtractCode(client, flags, positional);
        break;
      default:
        die(`Unknown command: ${command}. Run without arguments for help.`);
    }
  } catch (err) {
    if (err.message && err.message.includes('Invalid credentials')) {
      die('Authentication failed. Check the Gmail app password.');
    }
    die(err.responseText || err.message || String(err));
  } finally {
    clearTimeout(timeout);
    if (client) {
      try { await client.logout(); } catch {}
    }
  }
}

main();
