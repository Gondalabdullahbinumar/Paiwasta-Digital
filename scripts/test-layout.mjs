// Opens every page in Chrome at many screen widths and checks for:
// sideways scrolling, tap targets smaller than 44x44, and accessibility problems (axe-core).
// Saves full-page screenshots at 360, 768, 1024 and 1440 into screenshots/.
// Usage: npm run build && npx astro preview   (in one terminal), then: npm run test:layout
import { chromium } from 'playwright-core';
import { readFileSync, mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:4321';
const PAGES = ['/', '/about', '/services', '/web-development', '/software-development', '/graphic-design', '/video-marketing', '/ai-integrations',
  '/pricing', '/work', '/process', '/insights', '/insights/why-one-connected-digital-team', '/faq', '/careers', '/contact', '/thank-you', '/privacy', '/terms', '/404'];
const SIZES = [[320, 640], [360, 780], [390, 844], [414, 896], [768, 1024], [820, 1180], [1024, 768], [1280, 800], [1440, 900], [1920, 1080], [2560, 1440],
  [844, 390, 'phone-landscape'], [1180, 820, 'tablet-landscape']];
const SHOTS = new Set([360, 768, 1024, 1440]);
const axeSrc = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const problems = [];
for (const [w, h, label] of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: w < 1024, isMobile: w < 768 });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  for (const path of PAGES) {
    await page.goto(BASE + (path === '/404' ? '/this-page-does-not-exist' : path), { waitUntil: 'load' });
    await page.waitForTimeout(path === '/' ? 600 : 150);
    const r = await page.evaluate(() => {
      const W = document.documentElement.clientWidth;
      const out = { overflow: document.documentElement.scrollWidth > W + 1 ? document.documentElement.scrollWidth - W : 0, wide: [], small: [] };
      const scroller = (el) => { for (let p = el.parentElement; p; p = p.parentElement) { const s = getComputedStyle(p); if (/(auto|scroll|hidden|clip)/.test(s.overflowX) && p !== document.body && p !== document.documentElement) return true; } return false; };
      for (const el of document.querySelectorAll('body *')) {
        const s = getComputedStyle(el); if (s.position === 'fixed' || el.closest('.sr-only,[hidden],.hp,[data-stage]')) continue;
        const b = el.getBoundingClientRect(); if (!b.width) continue;
        if (b.right > W + 1 && !scroller(el)) out.wide.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} right=${Math.round(b.right)}`);
      }
      for (const el of document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, summary, label.check')) {
        if (el.closest('.sr-only,[hidden],.hp') || el.classList.contains('file-input')) continue;
        const s = getComputedStyle(el); if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0) continue;
        const b = el.getBoundingClientRect(); if (!b.width || !b.height) continue;
        // Links inside running text are exempt (WCAG 2.5.8 inline exception).
        if (el.tagName === 'A' && el.closest('p, li, dd, td, figcaption, label') && !el.matches('.text-link, .btn')) {
          const host = el.closest('p, li, dd, td, figcaption, label'); if (host.textContent.trim() !== el.textContent.trim()) continue;
        }
        if (el.type === 'checkbox' || el.type === 'radio') continue; // the label around it is the tap target
        if (b.width < 44 || b.height < 44) out.small.push(`${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)}" ${Math.round(b.width)}x${Math.round(b.height)}`);
      }
      out.wide = [...new Set(out.wide)].slice(0, 5); out.small = [...new Set(out.small)].slice(0, 8);
      return out;
    });
    const tag = `${label || w + 'px'} ${path}`;
    if (r.overflow) problems.push(`${tag}: page scrolls sideways by ${r.overflow}px → ${r.wide.join('; ')}`);
    else if (r.wide.length) problems.push(`${tag}: elements wider than screen → ${r.wide.join('; ')}`);
    if (r.small.length) problems.push(`${tag}: small tap targets → ${r.small.join('; ')}`);
    if (SHOTS.has(w) && !label) {
      await page.evaluate(() => document.querySelectorAll('.rv-wait').forEach((e) => e.classList.add('in')));
      await page.waitForTimeout(800);
      const name = (path === '/' ? 'home' : path.slice(1).replace(/\//g, '_')) + `-${w}.png`;
      await page.screenshot({ path: `screenshots/${name}`, fullPage: path !== '/' }).catch(() => {});
    }
    if ((w === 360 || w === 1440) && !label) {
      await page.addScriptTag({ content: axeSrc });
      const v = await page.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] })).violations.map((x) => `${x.id} (${x.impact}): ${x.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`));
      v.forEach((x) => problems.push(`${tag}: axe ${x}`));
    }
  }
  if (errs.length) problems.push(`${label || w + 'px'}: script errors → ${[...new Set(errs)].join('; ')}`);
  await ctx.close();
}
await browser.close();
console.log(`Tested ${PAGES.length} pages at ${SIZES.length} sizes (${SIZES.map((s) => s[2] || s[0]).join(', ')}).`);
if (problems.length) { console.log(`\n${problems.length} problem(s):`); problems.forEach((p) => console.log(' - ' + p)); process.exit(1); }
console.log('✓ No sideways scrolling, no small tap targets, no accessibility violations found.');
