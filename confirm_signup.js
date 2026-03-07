const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const url = 'https://neknhlrttunrsqtctrag.supabase.co/auth/v1/verify?token=pkce_54a8bc954728df730ccd3ac3239bc51070c9280370a32a89e191d0c7&type=signup&redirect_to=http://localhost:3000';
  
  console.log('Navigating to confirmation URL...');
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    console.log('Navigation complete. Final URL:', page.url());
    // Since it redirects to localhost:3000, we expect a connection error or a redirect.
  } catch (err) {
    console.log('Result (expected redirect to localhost):', err.message);
  } finally {
    await browser.close();
  }
})();
