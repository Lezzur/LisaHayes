const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async() => {
  const outDir = '/home/node/.openclaw/workspace/projects/lisa-hayes-main-folder/product-qa-audit-2026-03-09';
  const shotDir = path.join(outDir, 'screenshots');
  fs.mkdirSync(shotDir, { recursive: true });
  const email = `my.lisa.hayes.ai+vaitalqa${Date.now()}@gmail.com`;
  const password = 'TestPass123!';
  const results = { email, password, console: [], requests: [] };
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('console', msg => results.console.push({ type: msg.type(), text: msg.text() }));
  page.on('response', async res => {
    if (res.status() >= 400) {
      let body=''; try{body=(await res.text()).slice(0,500)}catch{}
      results.requests.push({ url: res.url(), status: res.status(), method: res.request().method(), body });
    }
  });
  await page.goto('https://vaital.vercel.app/login', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /sign up/i }).click();
  await page.waitForTimeout(700);
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole('button', { name: /^sign up$/i }).click();
  await page.waitForTimeout(5000);
  const body = await page.locator('body').innerText();
  const shot = path.join(shotDir, 'full-run-signup.png');
  await page.screenshot({ path: shot, fullPage: true });
  await browser.close();
  results.body = body.slice(0, 3000);
  results.screenshot = shot;
  fs.writeFileSync(path.join(outDir, 'full-run-signup.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
})();
