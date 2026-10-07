// Cuts Noto Nastaliq Urdu down to the letters of the one Urdu word on the site,
// keeping the shaping rules so the letters still join. Run with: npm run fonts
import { readFile, writeFile } from 'node:fs/promises';
import subsetFont from 'subset-font';

const WORD = 'پیوستہ';
const src = 'node_modules/@fontsource/noto-nastaliq-urdu/files/noto-nastaliq-urdu-arabic-500-normal.woff2';
const out = 'public/fonts/nastaliq-paiwasta.woff2';

const full = await readFile(src);
const small = await subsetFont(full, WORD, { targetFormat: 'woff2' });
await writeFile(out, small);
console.log(`Urdu font: ${(full.length / 1024).toFixed(0)} KB -> ${(small.length / 1024).toFixed(1)} KB`);
