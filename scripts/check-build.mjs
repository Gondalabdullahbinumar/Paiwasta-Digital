// Runs after every build. Fails the build if the site has a problem a visitor or Google would see.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const errors = [], warnings = [];
const files = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); } })(DIST);

const toPath = (f) => { let p = '/' + relative(DIST, f).replace(/\.html$/, ''); if (p === '/index') p = '/'; return p; };
const text = (html) => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ');
const attr = (html, re) => (html.match(re) || [])[1];
const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
const inSitemap = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/$/, '') || '/'));
const titles = new Map(), descs = new Map();

for (const f of files) {
  const html = readFileSync(f, 'utf8'), path = toPath(f);
  // 1. No bracketed placeholders like [city] anywhere in visible text, titles or alt text.
  const visible = text(html) + ' ' + [...html.matchAll(/(?:alt|title|aria-label|content)="([^"]*)"/g)].map((m) => m[1]).join(' ');
  const br = visible.match(/\[[A-Za-z0-9][^\]\n]{0,80}\]/g);
  if (br) errors.push(`${path}: placeholder text ${[...new Set(br)].join(', ')}`);
  // 2. Exactly one main heading.
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) errors.push(`${path}: has ${h1} <h1> headings (should be 1)`);
  // 3. Title, description and canonical.
  const title = attr(html, /<title>([^<]*)<\/title>/), desc = attr(html, /<meta name="description" content="([^"]*)"/);
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  const noindex = /<meta name="robots" content="noindex/.test(html);
  if (!title) errors.push(`${path}: missing <title>`); else if (title.length > 65) warnings.push(`${path}: title is ${title.length} characters`);
  if (!desc) errors.push(`${path}: missing description`); else if (desc.length > 160) warnings.push(`${path}: description is ${desc.length} characters`);
  if (!canonical) errors.push(`${path}: missing canonical link`);
  if (!noindex) {
    if (titles.has(title)) errors.push(`${path}: same title as ${titles.get(title)}`); titles.set(title, path);
    if (descs.has(desc)) errors.push(`${path}: same description as ${descs.get(desc)}`); descs.set(desc, path);
  }
  // 4. Sitemap and noindex agree.
  if (path !== '/404') {
    if (!noindex && !inSitemap.has(path) && process.env.VERCEL_ENV !== 'preview') errors.push(`${path}: indexable but missing from sitemap.xml`);
    if (noindex && inSitemap.has(path)) errors.push(`${path}: in sitemap.xml but marked noindex`);
  }
  // 5. Every internal link opens a real page or file.
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const u = m[1];
    if (u === '/' || u.startsWith('/_astro/')) continue;
    const clean = u.replace(/\/$/, '');
    const ok = existsSync(join(DIST, clean + '.html')) || existsSync(join(DIST, clean)) || existsSync(join(DIST, clean, 'index.html'));
    if (!ok) errors.push(`${path}: broken link ${u}`);
  }
  // 6. Structured data must be valid JSON.
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { errors.push(`${path}: invalid structured data`); }
  }
}

// 7. Launch blockers that only matter on the live site.
const site = readFileSync('src/data/site.ts', 'utf8');
if (/web3formsKey: null/.test(site)) {
  const msg = 'Contact form has no Web3Forms key yet (src/data/site.ts → forms.web3formsKey). Enquiries will not be delivered.';
  process.env.VERCEL_ENV === 'production' ? errors.push(msg) : warnings.push(msg);
}

warnings.forEach((w) => console.log('  ⚠ ' + w));
if (errors.length) { errors.forEach((e) => console.error('  ✗ ' + e)); console.error(`\nSite check failed: ${errors.length} problem(s).`); process.exit(1); }
console.log(`\n✓ Site check passed: ${files.length} pages, ${inSitemap.size} in the sitemap, no placeholders, no broken links.`);
