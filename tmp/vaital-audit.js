const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async() => {
  const outDir = '/home/node/.openclaw/workspace/projects/lisa-hayes-main-folder/product-qa-audit-2026-03-09';
  const shotDir = path.join(outDir, 'screenshots');
  fs.mkdirSync(shotDir, { recursive: true });
  const results = { pages: [], issues: [], notes: [], console: [], requests: [], screenshots: [] };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);

  page.on('console', msg => results.console.push({ type: msg.type(), text: msg.text() }));
  page.on('response', res => {
    const s = res.status();
    if (s >= 400) results.requests.push({ url: res.url(), status: s, method: res.request().method() });
  });
  page.on('pageerror', err => results.console.push({ type: 'pageerror', text: String(err) }));

  async function snap(name) {
    const p = path.join(shotDir, `${name}.png`);
    await page.screenshot({ path: p, fullPage: true });
    results.screenshots.push(p);
    return p;
  }

  async function record(name) {
    results.pages.push({ name, url: page.url(), title: await page.title() });
  }

  // Login page
  await page.goto('https://vaital.vercel.app/login', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');
  await record('login');
  results.notes.push({ loginHeading: await page.locator('h1').first().textContent() });

  // Empty submit validation
  await page.getByRole('button', { name: /^sign in$/i }).click();
  await page.waitForTimeout(400);
  results.notes.push({
    emptyEmailValidation: await page.locator('input[type="email"]').evaluate(el => el.validationMessage),
    emptyPasswordValidation: await page.locator('input[type="password"]').evaluate(el => el.validationMessage)
  });

  // Invalid email validation
  await page.locator('input[type="email"]').fill('not-an-email');
  await page.locator('input[type="password"]').fill('123');
  await page.getByRole('button', { name: /^sign in$/i }).click();
  await page.waitForTimeout(400);
  results.notes.push({ invalidEmailValidation: await page.locator('input[type="email"]').evaluate(el => el.validationMessage) });

  // Password toggle
  await page.locator('input[type="email"]').fill('qa@example.com');
  await page.locator('input[type="password"]').fill('Secret123!');
  await page.getByRole('button', { name: /show password/i }).click();
  await page.waitForTimeout(200);
  const pwdTypeAfter = await page.locator('input[placeholder="Enter your password"]').evaluate(el => el.getAttribute('type'));
  results.notes.push({ passwordInputTypeAfterToggle: pwdTypeAfter });

  // Forgot password page
  await page.getByRole('link', { name: /forgot password/i }).click();
  await page.waitForLoadState('networkidle');
  await record('forgot-password');
  const forgotBody = await page.locator('body').innerText();
  results.notes.push({ forgotPasswordExcerpt: forgotBody.slice(0, 800) });
  await snap('forgot-password');

  // Return to login and open signup
  await page.goto('https://vaital.vercel.app/login', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /sign up/i }).click();
  await page.waitForTimeout(1000);
  await page.waitForLoadState('networkidle');
  await record('signup');
  const signupBody = await page.locator('body').innerText();
  results.notes.push({ signupExcerpt: signupBody.slice(0, 1200) });
  await snap('signup');

  // attempt empty signup submit if page changed
  const headings = await page.locator('h1,h2').allTextContents();
  results.notes.push({ headings });

  // Root redirect
  await page.goto('https://vaital.vercel.app/', { waitUntil: 'networkidle' });
  await record('root');

  // basic link map on current page or login
  await page.goto('https://vaital.vercel.app/login', { waitUntil: 'networkidle' });
  const links = await page.locator('a[href]').evaluateAll(els => els.map(e => ({ text: (e.textContent || '').trim(), href: e.getAttribute('href') })));
  results.notes.push({ links });

  await browser.close();
  fs.writeFileSync(path.join(outDir, 'raw-notes.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
})();
