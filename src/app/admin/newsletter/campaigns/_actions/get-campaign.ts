"use server";

import { newsletterCampaignsCollection } from "@/lib/firestore/collections";
import { serialize } from "@/lib/firestore/serialize";
import { SerializedNewsletterCampaign } from "@/types/newsletter-campaign";
import { notFound } from "next/navigation";

/**
 * Get a single newsletter campaign from Firestore.
 *
 * @param id The ID of the campaign to get.
 * @returns The serialized campaign data.
 * @throws {Error} If the campaign is not found.
 */
export async function getCampaign(
  id: string,
): Promise<SerializedNewsletterCampaign> {
  const campaignDoc = await newsletterCampaignsCollection.doc(id).get();

  if (!campaignDoc.exists) {
    notFound();
  }

  const campaign = campaignDoc.data()!;

  return serialize(campaign);
}
