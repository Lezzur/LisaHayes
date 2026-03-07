const { chromium } = require('playwright');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf8');
const env = envFile.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) acc[key.trim()] = value.trim();
    return acc;
}, {});

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    const email = 'my.lisa.hayes.ai@gmail.com';
    const password = env.GMAIL_APP_PASSWORD;

    console.log('Navigating to VaiTAL login...');
    await page.goto('https://vaital.vercel.app/login', { waitUntil: 'networkidle' });
    
    console.log('Switching to Sign Up mode...');
    const signupToggle = page.locator('button:has-text("Sign Up")');
    await signupToggle.click();
    await page.waitForTimeout(2000);
    
    // Fill credentials after toggle
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);

    console.log('Clicking "Sign Up" and monitoring response content...');
    
    page.on('response', async response => {
        if (response.url().includes('signup')) {
            try {
              const data = await response.json();
              console.log('SIGNUP RESPONSE:', JSON.stringify(data, null, 2));
            } catch (e) {}
        }
    });

    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(5000);
    console.log('Final URL:', page.url());
    const body = await page.innerText('body');
    console.log('Page content snippet:', body.substring(0, 500));

  } catch (error) {
    console.error('Error during audit:', error);
  } finally {
    await browser.close();
  }
})();
