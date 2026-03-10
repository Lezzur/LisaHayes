const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async() => {
  const outDir = '/home/node/.openclaw/workspace/projects/lisa-hayes-main-folder/product-qa-audit-2026-03-09';
  const shotDir = path.join(outDir, 'screenshots');
  fs.mkdirSync(shotDir, { recursive: true });
  const results = { checks: [], console: [], requests: [], screenshots: [] };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  page.on('console', msg => results.console.push({ type: msg.type(), text: msg.text() }));
  page.on('response', async res => {
    const s = res.status();
    if (s >= 400) {
      let body = '';
      try { body = (await res.text()).slice(0, 500); } catch {}
      results.requests.push({ url: res.url(), status: s, method: res.request().method(), body });
    }
  });

  async function snap(name) {
    const p = path.join(shotDir, `${name}.png`);
    await page.screenshot({ path: p, fullPage: true });
    results.screenshots.push(p);
  }
  async function toastText() {
    const body = await page.locator('body').innerText();
    return body;
  }

  // invalid login
  await page.goto('https://vaital.vercel.app/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="email"]').fill('qa+badlogin@example.com');
  await page.locator('input[type="password"]').fill('WrongPassword123!');
  await page.getByRole('button', { name: /^sign in$/i }).click();
  await page.waitForTimeout(2500);
  results.checks.push({ name: 'invalid-login', url: page.url(), body: (await toastText()).slice(0, 1200) });
  await snap('invalid-login');

  // signup invalid short password maybe or create account
  await page.goto('https://vaital.vercel.app/login', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /sign up/i }).click();
  await page.waitForTimeout(700);

  const email = `lisa.hayes+qa-${Date.now()}@gmail.com`;
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill('TestPass123!');
  await page.getByRole('button', { name: /^sign up$/i }).click();
  await page.waitForTimeout(4000);
  results.checks.push({ name: 'signup-attempt', email, url: page.url(), body: (await toastText()).slice(0, 2000) });
  await snap('signup-attempt');

  // If landed on app/dashboard, try logout / identify app state
  const buttons = await page.getByRole('button').allTextContents();
  const links = await page.locator('a[href]').evaluateAll(els => els.map(e => ({text:(e.textContent||'').trim(), href:e.getAttribute('href')})));
  results.checks.push({ name: 'post-signup-controls', buttons, links });

  await browser.close();
  fs.writeFileSync(path.join(outDir, 'deeper-auth.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
})();
