"use server";

import { newsletterCampaignsCollection, newsletterSubscribersCollection } from "@/lib/firestore/collections";
import { NewsletterCampaignStatus } from "@/types/newsletter-campaign";
import { NewsletterSubscriber } from "@/types/newsletter-subscriber";
import { Timestamp } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME;

async function sendEmail(campaign, subscriber) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: BREVO_SENDER_NAME,
        email: BREVO_SENDER_EMAIL,
      },
      to: [{ email: subscriber.email }],
      subject: campaign.subject,
      htmlContent: campaign.bodyHtml,
      textContent: campaign.bodyText || campaign.previewText || "",
    }),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
}

export async function sendCampaign(id: string): Promise<void> {
  const campaignRef = newsletterCampaignsCollection.doc(id);
  const campaignDoc = await campaignRef.get();

  if (!campaignDoc.exists) {
    throw new Error("Campaign not found");
  }

  const campaign = campaignDoc.data()!;

  if (campaign.status === "sent") {
    return;
  }

  if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL || !BREVO_SENDER_NAME) {
    await campaignRef.update({
      status: NewsletterCampaignStatus.Failed,
      lastError: "Brevo API key, sender email, or sender name is not configured.",
      updatedAt: Timestamp.now(),
    });
    return;
  }

  await campaignRef.update({
    status: NewsletterCampaignStatus.Sending,
    updatedAt: Timestamp.now(),
  });

  const subscribersSnapshot = await newsletterSubscribersCollection
    .where("status", "in", ["active", null])
    .get();

  const subscribers = subscribersSnapshot.docs.map(
    (doc) => doc.data() as NewsletterSubscriber,
  );

  let sentCount = 0;
  let failedCount = 0;
  let lastError = null;

  for (const subscriber of subscribers) {
    try {
      await sendEmail(campaign, subscriber);
      sentCount++;
    } catch (error) {
      failedCount++;
      lastError = error.message;
    }
  }

  await campaignRef.update({
    status: failedCount > 0 ? NewsletterCampaignStatus.Failed : NewsletterCampaignStatus.Sent,
    recipientCount: subscribers.length,
    sentCount,
    failedCount,
    sentAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    lastError,
  });

  revalidatePath(`/admin/newsletter/campaigns/${id}`);
  revalidatePath("/admin/newsletter/campaigns");
}
