"use server";

import { newsletterCampaignsCollection } from "@/lib/firestore/collections";
import { NewsletterCampaign } from "@/types/newsletter-campaign";
import { Timestamp } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

/**
 * Update a newsletter campaign in Firestore.
 *
 * @param id The ID of the campaign to update.
 * @param data The partial data to update.
 * @returns A promise that resolves when the update is complete.
 */
export async function updateCampaign(
  id: string,
  data: Partial<NewsletterCampaign>,
): Promise<void> {
  const campaignRef = newsletterCampaignsCollection.doc(id);

  await campaignRef.update({
    ...data,
    updatedAt: Timestamp.now(),
  });

  revalidatePath(`/admin/newsletter/campaigns/${id}`);
  revalidatePath("/admin/newsletter/campaigns");
}
