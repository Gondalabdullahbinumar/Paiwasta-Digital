// Renders the share image and app icons from the brand files. Run: node scripts/brand/make-images.mjs
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
const here = (p) => new URL(p, import.meta.url).href;
const out = (p) => fileURLToPath(new URL(`../../public/${p}`, import.meta.url));
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome' });
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.goto(here('og.html')); await p.waitForTimeout(500);
await p.screenshot({ path: out('og-image.png') });
for (const [size, name] of [[32, "favicon-32.png"], [180, "apple-touch-icon.png"], [192, "icon-192.png"], [512, "icon-512.png"]]) {
  const q = await b.newPage({ viewport: { width: size, height: size } });
  await q.goto(here('../../public/favicon.svg'));
  await q.waitForTimeout(200);
  await q.screenshot({ path: out(name), omitBackground: true });
}
await b.close();
console.log('Images written to public/');
