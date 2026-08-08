import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const imageRef = z.object({
  src: z.string(),
  alt: z.string(),
});

const ctaRef = z.object({
  label: z.string(),
  href: z.string(),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    heroTitle: z.string().optional(),
    heroSubtitle: z.string().optional(),
    heroImage: imageRef.optional(),
    cta: ctaRef.optional(),
    blurbOnly: z.boolean().optional(),
  }),
});

export const collections = { pages };
