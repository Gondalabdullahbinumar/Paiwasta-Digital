// robots.txt: points search engines to the sitemap. Preview builds on Vercel block all crawling.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const isProduction = !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production';
  const body = isProduction
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', site).href}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
