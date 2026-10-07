# Paiwasta Technologies website

The website for Paiwasta Technologies, built with Astro as plain HTML pages and hosted on Vercel.

- **What still needs your details:** see `LAUNCH-CHECKLIST.md`.
- **Company details, contact details and prices:** all in one file, `src/data/site.ts`.
- **Page titles and descriptions for Google:** `src/data/seo.ts`.
- **Site address** (change it if you buy your own domain): `SITE_URL` in `astro.config.mjs`.

## Preview the site on your computer

You need Node.js 22 or newer (this computer already has Node 24).

```bash
cd ~/paiwasta-website
npm install          # first time only: downloads the building tools
npm run dev          # live preview at http://localhost:4321, refreshes as you edit
```

Press `Ctrl + C` in the terminal to stop it.

To see exactly what will go live:

```bash
npm run build        # builds the site into dist/ and runs the site check
npm run preview      # shows the built site at http://localhost:4321
```

`npm run build` also checks the whole site. It stops with a list of problems if it finds any page with bracketed placeholder text, a broken internal link, a missing title or description, or more than one main heading.

## Change a phone number, the city, a price, or any company detail

1. Open `src/data/site.ts` in a text editor (for example VS Code).
2. Find the line, change the text between the quotes, and save. For example:
   ```ts
   phone: '+92 51 1234567',
   ```
   A value of `null` means "not supplied yet", and that item stays hidden on the site.
3. Publish the change (see "Publishing changes" below).

Prices appear in several places (Pricing, the service pages, the Home packages and the FAQ), but every one of them comes from this file. Change a price once and it updates everywhere.

## Add an article

1. Make a copy of `src/content/articles/why-one-connected-digital-team.md`.
2. Rename the copy. Use lowercase words joined by hyphens, for example `website-speed-checklist.md`. That name becomes the address: `/insights/website-speed-checklist`.
3. Edit the top section (between the `---` lines):
   ```yaml
   title: What a business website should do in its first ten seconds
   description: One sentence for Google, up to about 155 characters.
   excerpt: One or two sentences shown on the article card.
   category: Web          # Web, Software, Design, Video, AI or Business
   date: 2026-11-01
   author: Your name
   minutes: 5             # reading time
   ```
4. Write the article below the second `---`. Start a line with `##` for a heading, `-` for a bullet point, and `>` for a quote.
5. Publish. The article appears on Insights, in Related articles and in the sitemap automatically. The category filters and page numbers appear on their own once there are 6 or more articles.

Insights is currently switched off. Set `features.insights = true` in `src/data/site.ts` to show it.

## Add a case study

Copy `src/content/case-studies/_TEMPLATE.md` and follow the instructions inside it. Only publish real projects that the client has approved.

## Publishing changes

The site is connected to GitHub, so Vercel rebuilds and publishes it automatically whenever a change is saved there:

```bash
git add -A
git commit -m "Update phone number"
git push
```

After about a minute the live site shows the change. If the build fails (for example, a placeholder slipped in), Vercel keeps the previous version live and shows the error in its dashboard.

## Useful commands

| Command | What it does |
|---|---|
| `npm run dev` | Live preview while editing |
| `npm run build` | Builds the site and runs the site check |
| `npm run preview` | Shows the built site |
| `npm run test:layout` | Opens every page in Chrome at 13 screen sizes and checks for sideways scrolling, small tap targets and accessibility problems. Run `npm run preview` in another terminal first. Screenshots are saved to `screenshots/`. |
| `npm run fonts` | Rebuilds the cut-down Urdu font (only needed if the Urdu word changes) |
| `node scripts/brand/make-images.mjs` | Rebuilds the share image and icons |

## How the site is built (for a developer)

- Astro 7, static output, no front-end framework. The small scripts are plain TypeScript in each page.
- `src/layouts/Base.astro`: head tags (canonical, Open Graph, Twitter, JSON-LD), header and footer.
- `src/components/`: Header (with mobile menu), Footer (with call-to-action band and WhatsApp button), PageHero (with breadcrumb JSON-LD), Rings, Faq (`<details>`), LegalPage, Logo.
- `src/pages/[service].astro`: one template for all five service pages.
- `src/scripts/home3d.js`: the three.js scene, loaded only on the home page after the page has loaded and the browser is idle. Lite mode on phones and low-power devices; static rings when WebGL is missing, the visitor prefers reduced motion, or the device renders WebGL in software. Add `?3d` to the address to force 3D for testing.
- Fonts are stored in `public/fonts/`. The Nastaliq font is cut down to the letters of پیوستہ (12 KB).
- `vercel.json`: clean addresses (`/about.html` redirects to `/about`), long caching for fingerprinted files, security headers.
- Preview deployments are `noindex`, decided by the `VERCEL_ENV` variable.
