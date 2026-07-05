
import { z } from "zod";

export const PartnerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  logoUrl: z.string().url("Invalid URL"),
  imageUrl: z.string().url("Invalid URL"),
  websiteUrl: z.string().url("Invalid URL"),
  description: z.string(),
  partnerType: z.string(),
  order: z.number().int(),
  status: z.enum(["draft", "published"]),
  featured: z.boolean(),
});
