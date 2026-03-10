const { chromium } = require('/home/node/.openclaw/workspace/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const EMAIL = process.env.EMAIL;
const PASS = process.env.PASS;
const outDir = process.env.OUTDIR;
const ssDir = path.join(outDir, 'screenshots');
fs.mkdirSync(ssDir, { recursive: true });
const result = { findings: [], logs: [] };
function log(msg){ result.logs.push(msg); console.log(msg); fs.writeFileSync(path.join(outDir,'raw-findings.json'), JSON.stringify(result,null,2)); }
(async()=>{
 const browser = await chromium.launch({headless:true});
 const context = await browser.newContext({viewport:{width:1440,height:900}});
 const page = await context.newPage();
 page.on('console', msg => log(`[console] ${msg.type()}: ${msg.text()}`));
 page.on('pageerror', err => log(`[pageerror] ${err.message}`));
 page.on('response', res => { if (res.status() >= 400) log(`[resp] ${res.status()} ${res.url()}`); });
 async function capture(name, fn){
   try {
     const data = await fn();
     result.findings.push({name, ...data});
     fs.writeFileSync(path.join(outDir,'raw-findings.json'), JSON.stringify(result,null,2));
   } catch (e) {
     log(`[error:${name}] ${e.message}`);
     result.findings.push({name, error: e.message, url: page.url()});
     fs.writeFileSync(path.join(outDir,'raw-findings.json'), JSON.stringify(result,null,2));
   }
 }
 async function shot(name){ const p = path.join(ssDir, name); await page.screenshot({path:p, fullPage:true}); return p; }
 async function body(){ return await page.locator('body').innerText(); }
 
 await capture('invalid_login', async()=>{
   await page.goto('https://vaital.vercel.app/login', {waitUntil:'networkidle', timeout:60000});
   await page.fill('input[type=email]', EMAIL);
   await page.fill('input[type=password]', PASS + 'x');
   await page.click('button:has-text("Sign In")');
   await page.waitForTimeout(2500);
   return { url: page.url(), text: (await body()).slice(0,800), screenshot: await shot('invalid-login.png') };
 });
 
 await capture('signup_from_login', async()=>{
   await page.goto('https://vaital.vercel.app/login', {waitUntil:'networkidle'});
   await page.click('button:has-text("Sign Up")');
   await page.waitForTimeout(2500);
   return { url: page.url(), text: (await body()).slice(0,1000), screenshot: await shot('signup-from-login.png') };
 });
 
 await capture('forgot_password', async()=>{
   await page.goto('https://vaital.vercel.app/forgot-password', {waitUntil:'networkidle'});
   await page.fill('input[type=email]', EMAIL);
   await page.click('button:has-text("Send Reset Link")');
   await page.waitForTimeout(4000);
   return { url: page.url(), text: (await body()).slice(0,1000), screenshot: await shot('forgot-password-after-submit.png') };
 });
 
 await capture('valid_login', async()=>{
   await page.goto('https://vaital.vercel.app/login', {waitUntil:'networkidle'});
   await page.fill('input[type=email]', EMAIL);
   await page.fill('input[type=password]', PASS);
   await page.click('button:has-text("Sign In")');
   await page.waitForTimeout(3000);
   return { url: page.url(), text: (await body()).slice(0,1000), screenshot: await shot('post-login.png'), cookies: (await context.cookies()).map(c=>c.name) };
 });
 
 await capture('dashboard', async()=>{
   await page.goto('https://vaital.vercel.app/', {waitUntil:'networkidle'});
   return { url: page.url(), text: (await body()).slice(0,1000), screenshot: await shot('dashboard.png') };
 });
 
 await capture('upload_page', async()=>{
   await page.goto('https://vaital.vercel.app/upload', {waitUntil:'networkidle'});
   const disabled = await page.locator('button:has-text("Analyze Results")').isDisabled();
   return { url: page.url(), text: (await body()).slice(0,1200), analyzeDisabledInitially: disabled, screenshot: await shot('upload-page-initial.png') };
 });
 
 await capture('upload_text_analysis', async()=>{
   await page.goto('https://vaital.vercel.app/upload', {waitUntil:'networkidle'});
   await page.fill('textarea', 'CBC Results\nHemoglobin: 13.5 g/dL\nWBC: 7.2 x10^9/L\nPlatelets: 250 x10^9/L');
   await page.waitForTimeout(500);
   const disabledBefore = await page.locator('button:has-text("Analyze Results")').isDisabled();
   let clicked = false;
   if (!disabledBefore) { await page.click('button:has-text("Analyze Results")'); clicked = true; await page.waitForTimeout(8000); }
   return { url: page.url(), clicked, disabledBefore, text: (await body()).slice(0,2000), screenshot: await shot('upload-after-text-analysis.png') };
 });
 
 await capture('my_meds_page', async()=>{
   await page.goto('https://vaital.vercel.app/my-meds', {waitUntil:'networkidle'});
   return { url: page.url(), text: (await body()).slice(0,1500), screenshot: await shot('my-meds.png') };
 });
 
 await capture('add_medication_modal', async()=>{
   await page.goto('https://vaital.vercel.app/my-meds', {waitUntil:'networkidle'});
   await page.click('button:has-text("Add Medication")');
   await page.waitForTimeout(1500);
   return { url: page.url(), text: (await body()).slice(0,2000), screenshot: await shot('add-medication-modal.png') };
 });
 
 await capture('prescription_area', async()=>{
   await page.goto('https://vaital.vercel.app/my-meds', {waitUntil:'networkidle'});
   const disabled = await page.locator('button:has-text("Analyze Prescription")').isDisabled();
   return { url: page.url(), analyzeDisabledInitially: disabled, text: (await body()).slice(0,2000), screenshot: await shot('prescription-area.png') };
 });
 
 await capture('signout', async()=>{
   await page.goto('https://vaital.vercel.app/', {waitUntil:'networkidle'});
   await page.click('button:has-text("Sign Out")');
   await page.waitForTimeout(3000);
   return { url: page.url(), text: (await body()).slice(0,1200), screenshot: await shot('after-signout.png') };
 });
 
 await browser.close();
})();
