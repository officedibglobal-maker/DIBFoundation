"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { adminDb } from "@/firebase/admin";
import { COLLECTIONS } from "@/lib/firestore/collection-names";

const createCampaignSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  previewText: z.string().optional(),
  bodyHtml: z.string().min(1, "Campaign content is required"),
  bodyText: z.string().optional(),
});

export async function createCampaign(
  values: z.infer<typeof createCampaignSchema>
) {
  const parsed = createCampaignSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid campaign data.",
    };
  }

  const now = new Date();

  const docRef = await adminDb
    .collection(COLLECTIONS.newsletterCampaigns)
    .add({
      title: parsed.data.title,
      subject: parsed.data.subject,
      previewText: parsed.data.previewText || "",
      bodyHtml: parsed.data.bodyHtml,
      bodyText: parsed.data.bodyText || "",
      status: "draft",
      recipientCount: 0,
      sentCount: 0,
      failedCount: 0,
      lastError: null,
      sentAt: null,
      createdAt: now,
      updatedAt: now,
    });

  revalidatePath("/admin/newsletter/campaigns");

  return {
    success: true,
    id: docRef.id,
  };
}