"use client";

import Link from "next/link";

import { CampaignSendButton } from "@/app/admin/newsletter/campaigns/_components/campaign-send-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type SerializedNewsletterCampaign } from "@/types/newsletter-campaign";

interface CampaignViewProps {
  campaign: SerializedNewsletterCampaign;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

export function CampaignView({ campaign }: CampaignViewProps) {
  const canEdit = campaign.status === "draft" || campaign.status === "failed";
  const hasSponsorBlock =
    campaign.showSponsorBlock &&
    (campaign.sponsorName || campaign.sponsorHeadline || campaign.sponsorBody);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">{campaign.title}</h2>
            <p className="mt-2 text-muted-foreground">{campaign.subject}</p>
            {campaign.previewText ? (
              <p className="mt-2 text-sm text-muted-foreground">
                {campaign.previewText}
              </p>
            ) : null}
          </div>

          <Badge>{campaign.status}</Badge>
        </div>

        <div className="mt-6 grid gap-4 text-sm md:grid-cols-3">
          <div>
            <p className="font-semibold">Created</p>
            <p>{formatDate(campaign.createdAt)}</p>
          </div>

          <div>
            <p className="font-semibold">Updated</p>
            <p>{formatDate(campaign.updatedAt)}</p>
          </div>

          <div>
            <p className="font-semibold">Sent</p>
            <p>{formatDate(campaign.sentAt)}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 text-sm md:grid-cols-3">
          <div>
            <p className="font-semibold">Recipients</p>
            <p>{campaign.recipientCount ?? 0}</p>
          </div>

          <div>
            <p className="font-semibold">Sent count</p>
            <p>{campaign.sentCount ?? 0}</p>
          </div>

          <div>
            <p className="font-semibold">Failed count</p>
            <p>{campaign.failedCount ?? 0}</p>
          </div>
        </div>

        {campaign.lastError ? (
          <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <p className="font-semibold">Last Error</p>
            <p className="mt-1">{campaign.lastError}</p>
          </div>
        ) : null}
      </div>

      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">HTML Preview</h2>
        {campaign.bodyHtml ? (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: campaign.bodyHtml }}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            No HTML content available.
          </p>
        )}

        {hasSponsorBlock ? (
          <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-blue-700">
              {campaign.sponsorLabel || "Sponsored Message"}
            </p>

            {campaign.sponsorImageUrl ? (
              <img
                src={campaign.sponsorImageUrl}
                alt={
                  campaign.sponsorName ||
                  campaign.sponsorHeadline ||
                  "Sponsor image"
                }
                className="mb-4 max-h-56 rounded-lg object-cover"
              />
            ) : null}

            {campaign.sponsorName ? (
              <p className="text-sm text-muted-foreground">
                {campaign.sponsorName}
              </p>
            ) : null}

            {campaign.sponsorHeadline ? (
              <h3 className="mt-1 text-xl font-semibold">
                {campaign.sponsorHeadline}
              </h3>
            ) : null}

            {campaign.sponsorBody ? (
              <p className="mt-2 text-sm leading-6">{campaign.sponsorBody}</p>
            ) : null}

            {campaign.sponsorCtaLabel && campaign.sponsorCtaUrl ? (
              <p className="mt-4">
                <a
                  href={campaign.sponsorCtaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
                >
                  {campaign.sponsorCtaLabel}
                </a>
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Plain Text Fallback</h2>
        {campaign.bodyText ? (
          <p className="whitespace-pre-wrap text-sm">{campaign.bodyText}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            No plain text fallback available.
          </p>
        )}
      </div>

      {campaign.id ? (
        <div className="flex flex-wrap gap-3">
          {canEdit ? (
            <Button asChild variant="outline">
              <Link href={`/admin/newsletter/campaigns/${campaign.id}/edit`}>
                Edit
              </Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              Edit locked
            </Button>
          )}

          <CampaignSendButton id={campaign.id} status={campaign.status} />
        </div>
      ) : null}
    </div>
  );
}