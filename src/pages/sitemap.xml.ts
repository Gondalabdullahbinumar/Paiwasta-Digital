// sitemap.xml: only the pages that should be found on Google.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { services, features } from '../data/site';

export const GET: APIRoute = async ({ site }) => {
  const paths = [
    '/', '/about', '/services', ...services.map((s) => `/${s.slug}`), '/pricing', '/work', '/process', '/faq', '/careers', '/contact',
    ...(await getCollection('caseStudies', (c) => c.data.clientApproved)).map((c) => `/work/${c.id}`),
  ];
  if (features.insights) {
    paths.push('/insights', ...(await getCollection('articles', (a) => !a.data.draft)).map((a) => `/insights/${a.id}`));
  }
  const today = new Date().toISOString().slice(0, 10);
  const urls = paths.map((p) => `  <url><loc>${new URL(p, site).href.replace(/\/$/, '') || site!.href}</loc><lastmod>${today}</lastmod></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
