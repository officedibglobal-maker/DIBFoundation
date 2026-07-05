
import { z } from "zod";

export const HomepageSettingsSchema = z.object({
  partnershipLabel: z.string().optional(),
  partnershipTitle: z.string().optional(),
  partnershipBody: z.string().optional(),
  partnershipImageUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
  partnershipCtaLabel: z.string().optional(),
  partnershipCtaLink: z.string().optional(),

  impactStoreLabel: z.string().optional(),
  impactStoreTitle: z.string().optional(),
  impactStoreBody: z.string().optional(),
  impactStoreImageUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
  impactStoreCtaLabel: z.string().optional(),
  impactStoreCtaLink: z.string().optional(),

  finalCtaTitle: z.string().optional(),
  finalCtaBody: z.string().optional(),
  finalCtaBackgroundImageUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
  finalCtaPrimaryLabel: z.string().optional(),
  finalCtaPrimaryLink: z.string().optional(),
  finalCtaSecondaryLabel: z.string().optional(),
  finalCtaSecondaryLink: z.string().optional(),
});
