const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    console.log('Navigating to VaiTAL login...');
    await page.goto('https://vaital.vercel.app/login', { waitUntil: 'networkidle' });
    
    // Check if we can just log in now
    console.log('Trying login first...');
    await page.fill('input[type="email"]', 'my.lisa.hayes.ai@gmail.com');
    await page.fill('input[type="password"]', 'TemporaryPass123!'); 
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    if (page.url().includes('login')) {
        const bodyText = await page.innerText('body');
        if (bodyText.includes('Invalid login credentials')) {
            console.log('Login failed. Attempting Sign Up...');
            const signupLink = page.locator('button:has-text("Sign Up")');
            await signupLink.click();
            await page.waitForSelector('input[type="email"]');
            await page.fill('input[type="email"]', 'my.lisa.hayes.ai@gmail.com');
            await page.fill('input[type="password"]', 'TemporaryPass123!'); 
            
            // Try to click the specific Sign Up button in the form
            await page.click('form button[type="submit"]');
            await page.waitForTimeout(5000);
        }
    }
    
    console.log('Current URL:', page.url());
    console.log('Body snippet:', (await page.innerText('body')).substring(0, 500));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
