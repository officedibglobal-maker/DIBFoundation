import { z } from 'zod';

export const focusAreaSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  summary: z.string().min(1, 'Summary is required'),
  description: z.string().optional(),
  iconName: z.string().optional(),
  imageUrl: z.string().url().optional(),
  imageAlt: z.string().optional(),
  accentStyle: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  order: z.number().int().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});
