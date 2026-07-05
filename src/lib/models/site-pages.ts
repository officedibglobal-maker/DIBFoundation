import { z } from "zod";
import {
  Timestamp,
  type DocumentData,
  type FirestoreDataConverter,
  type PartialWithFieldValue,
  type QueryDocumentSnapshot,
  type SetOptions,
  type SnapshotOptions,
  type WithFieldValue,
  serverTimestamp,
} from "firebase/firestore";

export const SitePageCtaSchema = z
  .object({
    label: z.string().trim().min(1, "CTA label is required"),
    href: z.string().trim().min(1, "CTA link is required"),
    variant: z.enum(["primary", "secondary", "outline"]).optional(),
  })
  .passthrough();

export const SitePageSectionItemSchema = z
  .object({
    title: z.string().trim().min(1, "Item title is required"),
    description: z.string().optional().default(""),
    href: z.string().optional().default(""),
    imageUrl: z.string().optional().default(""),
    icon: z.string().optional().default(""),
  })
  .passthrough();

export const SitePageSectionSchema = z
  .object({
    id: z.string().trim().min(1, "Section id is required"),
    type: z
      .enum(["richText", "cards", "feature", "cta", "gallery", "stats", "list"])
      .default("richText"),
    heading: z.string().optional().default(""),
    body: z.string().optional().default(""),
    imageUrl: z.string().optional().default(""),
    items: z.array(SitePageSectionItemSchema).optional().default([]),
  })
  .passthrough();

export const SitePageSchema = z
  .object({
    id: z.string().optional(),
    slug: z.string().trim().min(1, "Slug is required").default("untitled-page"),
    title: z.string().trim().min(1, "Title is required").default("Untitled Page"),
    subtitle: z.string().optional().default(""),
    eyebrow: z.string().optional().default(""),
    heroImageUrl: z.string().optional().default(""),
    status: z.enum(["draft", "published"]).default("published"),
    sections: z.array(SitePageSectionSchema).optional().default([]),
    ctas: z.array(SitePageCtaSchema).optional().default([]),
    seoTitle: z.string().optional().default(""),
    seoDescription: z.string().optional().default(""),
    order: z.coerce.number().optional().default(0),
    createdAt: z.any().optional(),
    updatedAt: z.any().optional(),
  })
  .passthrough();

export type SitePageCta = z.infer<typeof SitePageCtaSchema>;
export type SitePageSectionItem = z.infer<typeof SitePageSectionItemSchema>;
export type SitePageSection = z.infer<typeof SitePageSectionSchema>;
export type SitePage = z.infer<typeof SitePageSchema>;

function sitePageToFirestore(sitePage: WithFieldValue<SitePage>): DocumentData;
function sitePageToFirestore(
  sitePage: PartialWithFieldValue<SitePage>,
  options: SetOptions
): DocumentData;
function sitePageToFirestore(
  sitePage: WithFieldValue<SitePage> | PartialWithFieldValue<SitePage>,
  _options?: SetOptions
): DocumentData {
  const page = sitePage as PartialWithFieldValue<SitePage> & {
    id?: unknown;
    createdAt?: unknown;
  };

  const { id, ...rest } = page;

  return {
    ...rest,
    createdAt: page.createdAt ?? Timestamp.now(),
    updatedAt: serverTimestamp(),
  };
}

export const sitePageConverter: FirestoreDataConverter<SitePage> = {
  toFirestore: sitePageToFirestore,

  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions
  ): SitePage {
    const data = snapshot.data(options) as Partial<SitePage>;

    return {
      id: snapshot.id,
      slug:
        typeof data.slug === "string" && data.slug.length > 0
          ? data.slug
          : snapshot.id,
      title:
        typeof data.title === "string" && data.title.length > 0
          ? data.title
          : "Untitled Page",
      subtitle: data.subtitle ?? "",
      eyebrow: data.eyebrow ?? "",
      heroImageUrl: data.heroImageUrl ?? "",
      status: data.status === "draft" ? "draft" : "published",
      sections: Array.isArray(data.sections) ? data.sections : [],
      ctas: Array.isArray(data.ctas) ? data.ctas : [],
      seoTitle: data.seoTitle ?? "",
      seoDescription: data.seoDescription ?? "",
      order: typeof data.order === "number" ? data.order : 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};