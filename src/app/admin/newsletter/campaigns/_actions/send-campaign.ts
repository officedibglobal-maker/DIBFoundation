"use server";

import { revalidatePath } from "next/cache";

import { adminDb } from "@/firebase/admin";
import { COLLECTIONS } from "@/lib/firestore/collection-names";

type ActiveSubscriber = {
  email: string;
};

async function getActiveSubscribers(): Promise<ActiveSubscriber[]> {
  const collectionNames = Array.from(
    new Set(["newsletterSubscriptions", COLLECTIONS.newsletterSubscribers])
  );

  const subscribersByEmail = new Map<string, ActiveSubscriber>();

  for (const collectionName of collectionNames) {
    const snapshot = await adminDb.collection(collectionName).get();

    snapshot.docs.forEach((subscriberDoc) => {
      const subscriber = subscriberDoc.data();
      const email = subscriber.email;
      const status = subscriber.status;

      if (
        typeof email === "string" &&
        email.includes("@") &&
        (status === undefined || status === "active")
      ) {
        subscribersByEmail.set(email.toLowerCase(), { email });
      }
    });
  }

  return Array.from(subscribersByEmail.values());
}

function stripHtml(value: string): string {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getSafeUrl(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return "";

  try {
    const url = new URL(value.trim());

    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }

    return "";
  } catch {
    return "";
  }
}

function buildSponsorHtml(campaign: Record<string, unknown>): string {
  if (campaign.showSponsorBlock !== true) return "";

  const sponsorName =
    typeof campaign.sponsorName === "string" ? campaign.sponsorName.trim() : "";
  const sponsorLabel =
    typeof campaign.sponsorLabel === "string" && campaign.sponsorLabel.trim()
      ? campaign.sponsorLabel.trim()
      : "Sponsored Message";
  const sponsorHeadline =
    typeof campaign.sponsorHeadline === "string"
      ? campaign.sponsorHeadline.trim()
      : "";
  const sponsorBody =
    typeof campaign.sponsorBody === "string" ? campaign.sponsorBody.trim() : "";
  const sponsorCtaLabel =
    typeof campaign.sponsorCtaLabel === "string"
      ? campaign.sponsorCtaLabel.trim()
      : "";
  const sponsorCtaUrl = getSafeUrl(campaign.sponsorCtaUrl);
  const sponsorImageUrl = getSafeUrl(campaign.sponsorImageUrl);

  if (!sponsorName && !sponsorHeadline && !sponsorBody) return "";

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 28px 0; border: 1px solid #dbeafe; border-radius: 12px; background: #f8fbff;">
      <tr>
        <td style="padding: 20px;">
          <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #2563eb; font-weight: 700;">
            ${escapeHtml(sponsorLabel)}
          </p>
          ${
            sponsorImageUrl
              ? `<img src="${sponsorImageUrl}" alt="${escapeHtml(
                  sponsorName || sponsorHeadline || "Sponsor image"
                )}" style="max-width: 100%; border-radius: 10px; margin-bottom: 14px;" />`
              : ""
          }
          ${
            sponsorName
              ? `<p style="margin: 0 0 6px; font-size: 14px; color: #475569;">${escapeHtml(
                  sponsorName
                )}</p>`
              : ""
          }
          ${
            sponsorHeadline
              ? `<h2 style="margin: 0 0 10px; font-size: 22px; line-height: 1.25; color: #0f172a;">${escapeHtml(
                  sponsorHeadline
                )}</h2>`
              : ""
          }
          ${
            sponsorBody
              ? `<p style="margin: 0 0 14px; font-size: 15px; line-height: 1.6; color: #334155;">${escapeHtml(
                  sponsorBody
                )}</p>`
              : ""
          }
          ${
            sponsorCtaLabel && sponsorCtaUrl
              ? `<p style="margin: 0;"><a href="${sponsorCtaUrl}" style="display: inline-block; padding: 10px 14px; background: #0b63ce; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700;">${escapeHtml(
                  sponsorCtaLabel
                )}</a></p>`
              : ""
          }
        </td>
      </tr>
    </table>
  `;
}

function buildSponsorText(campaign: Record<string, unknown>): string {
  if (campaign.showSponsorBlock !== true) return "";

  const sponsorName =
    typeof campaign.sponsorName === "string" ? campaign.sponsorName.trim() : "";
  const sponsorLabel =
    typeof campaign.sponsorLabel === "string" && campaign.sponsorLabel.trim()
      ? campaign.sponsorLabel.trim()
      : "Sponsored Message";
  const sponsorHeadline =
    typeof campaign.sponsorHeadline === "string"
      ? campaign.sponsorHeadline.trim()
      : "";
  const sponsorBody =
    typeof campaign.sponsorBody === "string" ? campaign.sponsorBody.trim() : "";
  const sponsorCtaLabel =
    typeof campaign.sponsorCtaLabel === "string"
      ? campaign.sponsorCtaLabel.trim()
      : "";
  const sponsorCtaUrl = getSafeUrl(campaign.sponsorCtaUrl);

  if (!sponsorName && !sponsorHeadline && !sponsorBody) return "";

  return [
    "",
    sponsorLabel,
    sponsorName,
    sponsorHeadline,
    sponsorBody,
    sponsorCtaLabel && sponsorCtaUrl ? `${sponsorCtaLabel}: ${sponsorCtaUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildTextContent(campaign: Record<string, unknown>): string {
  const bodyText =
    typeof campaign.bodyText === "string" ? campaign.bodyText.trim() : "";

  const previewText =
    typeof campaign.previewText === "string" ? campaign.previewText.trim() : "";

  const bodyHtml =
    typeof campaign.bodyHtml === "string" ? campaign.bodyHtml.trim() : "";

  const strippedHtml = bodyHtml ? stripHtml(bodyHtml) : "";

  const mainText =
    bodyText || strippedHtml || previewText || "DIB Foundation newsletter update.";

  const sponsorText = buildSponsorText(campaign);

  return `${mainText}${sponsorText ? `\n${sponsorText}` : ""}`.trim();
}

function buildHtmlContent(campaign: Record<string, unknown>): string {
  const bodyHtml =
    typeof campaign.bodyHtml === "string" ? campaign.bodyHtml.trim() : "";

  const mainHtml = bodyHtml || "<p>DIB Foundation newsletter update.</p>";
  const sponsorHtml = buildSponsorHtml(campaign);

  return `${mainHtml}${sponsorHtml}`;
}

export async function sendCampaign(
  id: string
): Promise<{ success: boolean; message?: string }> {
  const campaignRef = adminDb.collection(COLLECTIONS.newsletterCampaigns).doc(id);
  const campaignSnap = await campaignRef.get();

  if (!campaignSnap.exists) {
    return {
      success: false,
      message: "Campaign not found.",
    };
  }

  const campaign = campaignSnap.data() || {};

  if (campaign.status === "sent") {
    return {
      success: false,
      message: "This campaign has already been sent.",
    };
  }

  if (campaign.status === "sending") {
    return {
      success: false,
      message: "This campaign is already sending.",
    };
  }

  const brevoApiKey = process.env.BREVO_API_KEY;
  const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL;
  const brevoSenderName = process.env.BREVO_SENDER_NAME;

  async function markFailed(message: string, failedCount = 0) {
    await campaignRef.update({
      status: "failed",
      failedCount,
      lastError: message,
      updatedAt: new Date(),
    });

    revalidatePath("/admin/newsletter/campaigns");
    revalidatePath(`/admin/newsletter/campaigns/${id}`);

    return {
      success: false,
      message,
    };
  }

  if (!brevoApiKey || !brevoSenderEmail || !brevoSenderName) {
    return markFailed("Brevo API configuration is missing in .env.local.");
  }

  const activeSubscribers = await getActiveSubscribers();

  if (activeSubscribers.length === 0) {
    return markFailed("There are no active subscribers to send this campaign to.");
  }

  const subject =
    typeof campaign.subject === "string" && campaign.subject.trim()
      ? campaign.subject.trim()
      : "DIB Foundation Newsletter";

  const htmlContent = buildHtmlContent(campaign);
  const textContent = buildTextContent(campaign);

  await campaignRef.update({
    status: "sending",
    recipientCount: activeSubscribers.length,
    sentCount: 0,
    failedCount: 0,
    lastError: null,
    updatedAt: new Date(),
  });

  let sentCount = 0;
  let failedCount = 0;
  const errors: string[] = [];

  for (const subscriber of activeSubscribers) {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          sender: {
            name: brevoSenderName,
            email: brevoSenderEmail,
          },
          to: [{ email: subscriber.email }],
          subject,
          htmlContent,
          textContent,
        }),
      });

      if (response.ok) {
        sentCount++;
      } else {
        failedCount++;
        const errorText = await response.text();
        errors.push(errorText);
      }
    } catch (error) {
      failedCount++;
      errors.push(error instanceof Error ? error.message : "Unknown send error.");
    }
  }

  const allFailed = failedCount === activeSubscribers.length;

  await campaignRef.update({
    status: allFailed ? "failed" : "sent",
    recipientCount: activeSubscribers.length,
    sentCount,
    failedCount,
    sentAt: sentCount > 0 ? new Date() : null,
    updatedAt: new Date(),
    lastError:
      failedCount > 0
        ? `${failedCount} email(s) failed. ${errors[0] || ""}`.trim()
        : null,
  });

  revalidatePath("/admin/newsletter/campaigns");
  revalidatePath(`/admin/newsletter/campaigns/${id}`);

  if (sentCount === 0) {
    return {
      success: false,
      message: "Campaign failed to send to all subscribers.",
    };
  }

  return {
    success: true,
    message: `Campaign sent to ${sentCount} subscriber(s).`,
  };
}