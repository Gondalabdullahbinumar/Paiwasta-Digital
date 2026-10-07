# Launch checklist

Everything on the website that is **hidden**, **kept out of Google**, or **waiting for you**.
Nearly every item is switched on by filling in one line of `src/data/site.ts` and redeploying (see README.md).
A value of `null` means "not supplied yet", and the website hides that item automatically.

## Must do before going live

| # | What | Why | How to switch it on |
|---|---|---|---|
| 1 | **Web3Forms key for the contact form** | Without it, consultation requests are not delivered. The live build refuses to publish without it. | Go to web3forms.com, enter the email address that should receive enquiries, and copy the access key from the email you receive. Paste it into `forms.web3formsKey` in `src/data/site.ts`. |
| 2 | **WhatsApp number** | Until it is set, every WhatsApp button is hidden: the floating button, the menu, the call-to-action bands and Contact. | Set `contact.whatsapp` (digits only, international format, e.g. `923001234567`) and `contact.whatsappLabel` (how it is shown, e.g. `+92 300 1234567`). |
| 3 | **Careers form email (FormSubmit)** | Until it is set, the application form is hidden and Careers shows "No open roles right now" only. | Set `forms.careersFormsubmit` to the email that should receive applications. The first application triggers a confirmation email from FormSubmit: click its link once. Then send a test application with a small PDF to confirm the CV arrives. |
| 4 | **Vercel project name** | Done: the address is `https://paiwasta-digital.vercel.app`. If you add your own domain later, change `SITE_URL` in `astro.config.mjs`. | — |
| 5 | **Approve the interim Privacy Policy and Terms of Service** | I drafted short plain-language versions from the facts in your profile. They are not legal advice. | Read `/privacy` and `/terms`. Both pages are **kept out of Google** until a lawyer reviews them. To include them afterwards, remove `noindex` in `src/pages/privacy.astro` and `src/pages/terms.astro`, and add `'/privacy', '/terms'` to the list in `src/pages/sitemap.xml.ts`. |
| 6 | **Approve page titles and descriptions** | These are what Google shows in search results. | See the table in my report, or edit `src/data/seo.ts`. |

## Hidden until you supply the detail (option b)

| Item | Where it appears | How to switch it on |
|---|---|---|
| Phone number | Footer, Contact, About facts, Privacy | `contact.phone` |
| Email address (on your own domain) | Footer, Contact, About facts, Privacy | `contact.email` |
| Office street address | Footer, Contact, About facts, Google structured data | `contact.address`. Until it is set, these places show "Islamabad, Pakistan". |
| Office hours | Footer, Contact | `contact.hours` |
| Map | Contact | In Google Maps: Share → Embed a map → copy only the `src="..."` link into `contact.mapEmbedUrl` |
| Social links (LinkedIn, Facebook, Instagram, YouTube) | Footer, Google structured data | Fill the `url` for each profile you have in `social` |
| Founder name, title, bio and photo | About page (whole founder section hidden) | Fill `founder`. Put the photo in `src/assets/` (create the folder) and write its file name in `founder.photo` |
| Registered legal name, "(Pvt.) Ltd." | Footer, About, legal pages | `business.legalName` after SECP registration |
| Home "Registered and accountable" strip | Home, under the 3D story | Add lines to `business.registrations`, e.g. `'SECP registration no. 0123456'` |
| Year founded | About facts | `business.foundedYear` |
| "Which payment methods do you accept?" FAQ | FAQ, Payments group (now 3 questions) | Add the question back to `faqs.payments.items` in `site.ts` |
| Working arrangements (office, hybrid, remote) | Careers, "How we work" | `forms.workingArrangements` |
| Application retention period | Careers consent box | `forms.applicationRetention`, e.g. `'12 months'` |
| Open job roles | Careers | Add to `jobs`, e.g. `{ title: 'Front-end developer', meta: 'Islamabad · Full-time' }` |
| Focus industries | Not shown anywhere | Tell me when you choose them |

## Clients and case studies

| Item | Decision | How to switch it on |
|---|---|---|
| Home "Selected work" section | Hidden (no approved projects) | Appears automatically once one approved case study exists |
| Work page | Shows an honest note: "Our first case studies are being prepared" | Add case studies (below). Service and industry filters appear once there are 4 or more. |
| Case Study page (page 11 of 21) | Not published: the sample client, results, quote and images were all placeholders | Copy `src/content/case-studies/_TEMPLATE.md`, fill it with real, client-approved details, and set `clientApproved: true`. It is published at `/work/<file-name>` and added to the sitemap automatically. |

## Turned off by your decision

| Item | Decision | How to switch it back on |
|---|---|---|
| Insights and the sample article | Hidden from the menu, footer, 404 and Thank You pages; built but **kept out of Google** | Add the author and date to `src/content/articles/why-one-connected-digital-team.md`, then set `features.insights = true` |
| Newsletter signup | Hidden | Choose a newsletter tool, then set `features.newsletter = true` (sign-ups are emailed to you through Web3Forms until then) |
| AI assistant chat bubble | Hidden | Needs a real assistant to be connected first; this is developer work. `features.chat` is reserved for it. |
| Services FAQ "Do you work with businesses outside Pakistan?" | Removed (Pakistan only) | Add it back to `faqs.services.items`, and change `business.markets` |

## Always kept out of Google

- `/thank-you` and the Page Not Found page (`noindex`).
- Every Vercel preview address: preview builds add `noindex` to every page and block all crawling in robots.txt. Only the production address can appear in Google.

## Wording changes I made (please check)

- The Privacy and Terms sections on liability and governing law were left out of the interim text, because they need a lawyer.
- Careers consent: "stored for [retention period]" became "stored as described in the Privacy Policy" until you give a period.
- Pricing FAQ "Do you quote in other currencies? ... overseas clients" was replaced with "Which currency are your prices in? Every price on this website is a starting price in Pakistani rupees (PKR)."
- The About facts row "Legal name" now reads "Name: Paiwasta Technologies" until you are registered.
- The Work page empty-state text is new (see above).
