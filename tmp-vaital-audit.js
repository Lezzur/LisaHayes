const { chromium } = require('/home/node/.openclaw/workspace/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const EMAIL = process.env.EMAIL;
const PASS = process.env.PASS;
const outDir = process.env.OUTDIR;
const ssDir = path.join(outDir, 'screenshots');
fs.mkdirSync(ssDir, { recursive: true });
const findings = [];
const logs = [];
function note(type, msg){ logs.push(`[${type}] ${msg}`); console.log(`[${type}] ${msg}`); }
(async()=>{
 const browser = await chromium.launch({headless:true});
 const context = await browser.newContext({viewport:{width:1440,height:900}});
 const page = await context.newPage();
 page.on('console', msg => note('console', `${msg.type()}: ${msg.text()}`));
 page.on('pageerror', err => note('pageerror', err.message));
 page.on('response', res => { if (res.status() >= 400) note('resp', `${res.status()} ${res.url()}`); });
 async function shot(name){ const p = path.join(ssDir, name); await page.screenshot({path:p, fullPage:true}); return p; }
 async function text(){ return await page.locator('body').innerText(); }
 
 // 1 invalid login
 await page.goto('https://vaital.vercel.app/login', {waitUntil:'networkidle', timeout:60000});
 await page.fill('input[type=email]', EMAIL);
 await page.fill('input[type=password]', PASS + 'x');
 await page.click('button:has-text("Sign In")');
 await page.waitForTimeout(2500);
 const invalidText = await text();
 findings.push({name:'invalid_login_feedback', url: page.url(), text: invalidText.slice(0,500)});
 if (invalidText.includes('Invalid login credentials')) {
   note('check', 'Invalid login shows feedback');
 } else {
   note('issue', 'Invalid login did not show visible error feedback');
   await shot('invalid-login-no-feedback.png');
 }
 
 // 2 sign up CTA behavior from login
 await page.goto('https://vaital.vercel.app/login', {waitUntil:'networkidle'});
 await page.click('button:has-text("Sign Up")');
 await page.waitForTimeout(2000);
 const signupUrl = page.url();
 const signupText = await text();
 findings.push({name:'signup_cta', url: signupUrl, text: signupText.slice(0,500)});
 if (/404|Page Not Found/i.test(signupText)) {
   note('issue', 'Sign Up CTA routes to 404 page');
   await shot('signup-404.png');
 }
 
 // 3 forgot password submit
 await page.goto('https://vaital.vercel.app/forgot-password', {waitUntil:'networkidle'});
 await page.fill('input[type=email]', EMAIL);
 await page.click('button:has-text("Send Reset Link")');
 await page.waitForTimeout(4000);
 findings.push({name:'forgot_password', url: page.url(), text: (await text()).slice(0,500)});
 await shot('forgot-password-after-submit.png');
 
 // 4 valid login
 await page.goto('https://vaital.vercel.app/login', {waitUntil:'networkidle'});
 await page.fill('input[type=email]', EMAIL);
 await page.fill('input[type=password]', PASS);
 await page.click('button:has-text("Sign In")');
 await page.waitForTimeout(3000);
 const postLoginUrl = page.url();
 findings.push({name:'post_login', url: postLoginUrl, text: (await text()).slice(0,500)});
 if (postLoginUrl.includes('/login')) {
   note('issue', 'Successful login leaves user on /login despite valid session');
   await shot('post-login-stuck-on-login.png');
 }
 
 // 5 auth persistence / dashboard
 await page.goto('https://vaital.vercel.app/', {waitUntil:'networkidle'});
 findings.push({name:'dashboard', url: page.url(), text: (await text()).slice(0,800)});
 
 // 6 upload with no input
 await page.goto('https://vaital.vercel.app/upload', {waitUntil:'networkidle'});
 await page.click('button:has-text("Analyze Results")');
 await page.waitForTimeout(2500);
 findings.push({name:'upload_empty', url: page.url(), text: (await text()).slice(0,600)});
 await shot('upload-empty-submit.png');
 
 // 7 upload plain text sample
 const sample = 'CBC Results\nHemoglobin: 13.5 g/dL\nWBC: 7.2 x10^9/L\nPlatelets: 250 x10^9/L';
 await page.fill('textarea', sample);
 await page.click('button:has-text("Analyze Results")');
 await page.waitForTimeout(8000);
 findings.push({name:'upload_sample_after', url: page.url(), text: (await text()).slice(0,1500)});
 await shot('upload-sample-after-analysis.png');
 
 // 8 meds page empty actions
 await page.goto('https://vaital.vercel.app/my-meds', {waitUntil:'networkidle'});
 await page.click('button:has-text("Add Medication")');
 await page.waitForTimeout(1500);
 findings.push({name:'add_med_modal', url: page.url(), text: (await text()).slice(0,1500)});
 await shot('add-medication-modal.png');
 // close if possible
 const closeBtn = page.locator('button').filter({hasText:/cancel|close/i}).first();
 if (await closeBtn.count()) await closeBtn.click().catch(()=>{});
 await page.waitForTimeout(500);
 await page.click('button:has-text("Analyze Prescription")');
 await page.waitForTimeout(2500);
 findings.push({name:'analyze_prescription_empty', url: page.url(), text: (await text()).slice(0,1200)});
 await shot('analyze-prescription-empty.png');
 
 // 9 sign out
 await page.click('button:has-text("Sign Out")');
 await page.waitForTimeout(3000);
 findings.push({name:'after_signout', url: page.url(), text: (await text()).slice(0,700)});
 await shot('after-signout.png');
 
 fs.writeFileSync(path.join(outDir,'raw-findings.json'), JSON.stringify({findings, logs}, null, 2));
 await browser.close();
})();
