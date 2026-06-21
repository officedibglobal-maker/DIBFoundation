import { z } from 'zod';

export const impactStorySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  body: z.string().optional(),
  beneficiaryName: z.string().min(1, 'Beneficiary name is required'),
  location: z.string().min(1, 'Location is required'),
  initiativeId: z.string().optional(),
  quote: z.string().optional(),
  imageUrl: z.string().url().optional(),
  imageAlt: z.string().optional(),
  videoUrl: z.string().url().optional(),
  featured: z.boolean().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  order: z.number().int().optional(),
  publishedAt: z.date().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});
