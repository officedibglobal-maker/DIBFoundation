import { z } from 'zod';

export const siteSettingsSchema = z.object({
  organizationName: z.string().min(1, 'Organization name is required'),
  shortName: z.string().optional(),
  tagline: z.string().optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
  logoDarkUrl: z.string().url().optional(),
  faviconUrl: z.string().url().optional(),
  primaryEmail: z.string().email().optional(),
  secondaryEmail: z.string().email().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postalAddress: z.string().optional(),
  mapUrl: z.string().url().optional(),
  timezone: z.string().optional(),
  defaultCurrency: z.string().optional(),
  copyrightText: z.string().optional(),
  maintenanceMode: z.boolean().optional(),
});

export const socialSettingsSchema = z.object({
  facebook: z.string().url().optional(),
  instagram: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  youtube: z.string().url().optional(),
  x: z.string().url().optional(),
  tiktok: z.string().url().optional(),
});

export const seoSettingsSchema = z.object({
  defaultTitle: z.string().optional(),
  titleTemplate: z.string().optional(),
  defaultDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  ogImageUrl: z.string().url().optional(),
  twitterCard: z.string().optional(),
  googleSiteVerification: z.string().optional(),
});

export const donationSettingsSchema = z.object({
  donationsEnabled: z.boolean().optional(),
  currency: z.string().optional(),
  suggestedAmounts: z.array(z.number()).optional(),
  bankName: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  branch: z.string().optional(),
  swiftCode: z.string().optional(),
  mobileMoneyProvider: z.string().optional(),
  mobileMoneyNumber: z.string().optional(),
  mobileMoneyAccountName: z.string().optional(),
  donationInstructions: z.string().optional(),
});
