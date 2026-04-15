import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

const screenshotDir = './temporary screenshots';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

// Find next available screenshot number
let n = 1;
while (fs.existsSync(path.join(screenshotDir, label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`))) {
  n++;
}
const filename = label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`;
const filepath = path.join(screenshotDir, filename);

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
await page.goto(url, { waitUntil: 'load', timeout: 20000 });
await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: filepath, fullPage: true });
await browser.close();

console.log(`Screenshot saved: ${filepath}`);
