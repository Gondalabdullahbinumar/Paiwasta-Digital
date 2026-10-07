// Articles and case studies are plain text files (Markdown) in src/content/.
// See README.md for how to add one.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const serviceKey = z.enum(['web', 'software', 'design', 'video', 'ai']);

const articles = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(170),
    excerpt: z.string(),
    category: z.enum(['Web', 'Software', 'Design', 'Video', 'AI', 'Business']),
    date: z.coerce.date().optional(),
    author: z.string().optional(),
    authorBio: z.string().optional(),
    minutes: z.number(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/case-studies' }),
  schema: z.object({
    client: z.string(),
    title: z.string(),
    summary: z.string(),
    industry: z.string(),
    services: z.array(serviceKey).min(1),
    timeline: z.string().optional(),
    results: z.array(z.object({ figure: z.string(), label: z.string() })).default([]),
    quote: z.object({ text: z.string(), name: z.string(), role: z.string() }).optional(),
    order: z.number().default(100),
    // Only true once the client has approved publication.
    clientApproved: z.boolean(),
  }),
});

export const collections = { articles, caseStudies };
