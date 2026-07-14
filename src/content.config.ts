import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

// Reads the files Keystatic writes (see keystatic.config.ts). Schemas here
// type-check the frontmatter/data at build time.

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdoc}', base: './src/content/projects' }),
  schema: z.object({
    // Optional: the slug (entry.id) is the canonical kebab-case name; this is a
    // fallback in case Keystatic also serializes the slug field into the file.
    name: z.string().optional(),
    order: z.number().default(10),
    description: z.string(),
    chips: z
      .array(
        z.object({
          label: z.string(),
          ai: z.boolean().default(false),
        })
      )
      .default([]),
    // Optional public path to a screenshot (e.g. /images/projects/foo.png).
    // When set, it overrides the ASCII glyph.
    image: z.string().optional(),
    // Which terminal ASCII glyph fills the card (see src/lib/projectGlyphs.ts).
    icon: z.string().default('terminal'),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdoc}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().default(''),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, posts };
