"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { adminDb } from "@/firebase/admin";
import { COLLECTIONS } from "@/lib/firestore/collection-names";

const updateCampaignSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  previewText: z.string().optional(),
  bodyHtml: z.string().min(1, "HTML body is required"),
  bodyText: z.string().optional(),
});

export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;

export async function updateCampaign(
  id: string,
  values: UpdateCampaignInput
): Promise<{ success: boolean; message?: string }> {
  const parsed = updateCampaignSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid campaign data.",
    };
  }

  const campaignRef = adminDb.collection(COLLECTIONS.newsletterCampaigns).doc(id);
  const campaignSnap = await campaignRef.get();

  if (!campaignSnap.exists) {
    return {
      success: false,
      message: "Campaign not found.",
    };
  }

  const campaign = campaignSnap.data() || {};

  if (campaign.status === "sent" || campaign.status === "sending") {
    return {
      success: false,
      message: "Cannot update a campaign that has been sent or is sending.",
    };
  }

  await campaignRef.update({
    title: parsed.data.title,
    subject: parsed.data.subject,
    previewText: parsed.data.previewText || "",
    bodyHtml: parsed.data.bodyHtml,
    bodyText: parsed.data.bodyText || "",
    updatedAt: new Date(),
  });

  revalidatePath("/admin/newsletter/campaigns");
  revalidatePath(`/admin/newsletter/campaigns/${id}`);
  revalidatePath(`/admin/newsletter/campaigns/${id}/edit`);

  return {
    success: true,
    message: "Campaign updated.",
  };
}