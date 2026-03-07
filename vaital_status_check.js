const { chromium } = require('playwright');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf8');
const env = envFile.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) acc[key.trim()] = value.trim();
    return acc;
}, {});

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    console.log('Navigating to VaiTAL login...');
    await page.goto('https://vaital.vercel.app/login');
    
    const email = 'my.lisa.hayes.ai@gmail.com';
    const password = env.GMAIL_APP_PASSWORD;

    console.log(`Attempting login with: ${email}`);
    
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    
    console.log('Login button clicked. Waiting 5s for dashboard...');
    await new Promise(r => setTimeout(r, 5000));
    
    const url = page.url();
    console.log('Current URL:', url);
    
    const bodyText = await page.innerText('body');
    if (bodyText.includes('Dashboard') || bodyText.includes('Welcome') || bodyText.includes('Logout')) {
      console.log('Status: Logged In');
      
      // Let's see if we're on a profile or home page
      const h1 = await page.$eval('h1', el => el.innerText).catch(() => 'No H1');
      console.log('Main Header:', h1);
      
      // If there's an upload or scan button, we can mention it
      const hasUpload = await page.isVisible('button:has-text("Upload")').catch(() => false);
      if (hasUpload) console.log('Found Upload Button - READY FOR PHASE 2!');
      
    } else {
      console.log('Status: Login Failed or Session Not Started');
      console.log('Body snippet:', bodyText.substring(0, 300));
    }

    await browser.close();
  } catch (err) {
    console.error('Playwright Error:', err);
    process.exit(1);
  }
})();
