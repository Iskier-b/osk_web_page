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

const dashboardItem = z.object({
  title: z.string(),
  body: z.string(),
  href: z.string().optional(),
  linkLabel: z.string().optional(),
});

const priceRow = z.object({
  label: z.string(),
  price: z.string().optional(),
  note: z.string().optional(),
});

const newsTeaser = z.object({
  title: z.string(),
  summary: z.string().optional(),
});

const reviewQuote = z.object({
  author: z.string(),
  quote: z.string(),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    heroTitle: z.string().optional(),
    heroSubtitle: z.string().optional(),
    heroImage: imageRef.optional(),
    heroPitches: z.array(z.string()).optional(),
    cta: ctaRef.optional(),
    secondaryCta: ctaRef.optional(),
    blurbOnly: z.boolean().optional(),
    dashboardItems: z.array(dashboardItem).optional(),
    priceRows: z.array(priceRow).optional(),
    teaserImages: z.array(imageRef).optional(),
    newsTeasers: z.array(newsTeaser).optional(),
    reviewQuotes: z.array(reviewQuote).optional(),
  }),
});

export const collections = { pages };
