// @ts-check
import { defineConfig } from 'astro/config';

// THE SITE ADDRESS. This is the one setting used for canonical links, the sitemap,
// social sharing tags and structured data. If you buy your own domain later,
// change only this line (for example to 'https://paiwasta.com') and redeploy.
export const SITE_URL = 'https://paiwasta-digital.vercel.app';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  compressHTML: true,
  devToolbar: { enabled: false },
});
