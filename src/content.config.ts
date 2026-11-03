import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { AREA_IDS } from './data/areas';

const date = z.string().regex(/^\d{4}(-\d{2})?$/);
const section = z.enum(['work', 'research']);

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    section,
    alsoIn: section.optional(),
    form: z.enum(['page', 'card']),
    areas: z.array(z.enum(AREA_IDS)).default([]),
    org: z.string().optional(),
    role: z.string().optional(),
    start: date.optional(),
    end: date.or(z.literal('present')).optional(),
    summary: z.string().max(300),
    links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
    order: z.number(),
  }),
});

export const collections = { projects };
