"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type SerializedNewsletterCampaign } from "@/types/newsletter-campaign";

interface CampaignsClientProps {
  data: SerializedNewsletterCampaign[];
}

function formatDate(value: unknown): string {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

export function CampaignsClient({ data }: CampaignsClientProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <h2 className="text-lg font-semibold">No campaigns yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your first newsletter campaign draft.
        </p>
        <Button asChild className="mt-4">
          <Link href="/admin/newsletter/campaigns/new">New Campaign</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Title</th>
            <th className="px-4 py-3 text-left font-medium">Subject</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Created</th>
            <th className="px-4 py-3 text-left font-medium">Updated</th>
            <th className="px-4 py-3 text-left font-medium">Sent</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((campaign) => (
            <tr key={campaign.id} className="border-t">
              <td className="px-4 py-3 font-medium">{campaign.title}</td>
              <td className="px-4 py-3">{campaign.subject}</td>
              <td className="px-4 py-3">
                <Badge>{campaign.status}</Badge>
              </td>
              <td className="px-4 py-3">{formatDate(campaign.createdAt)}</td>
              <td className="px-4 py-3">{formatDate(campaign.updatedAt)}</td>
              <td className="px-4 py-3">{formatDate(campaign.sentAt)}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/newsletter/campaigns/${campaign.id}`}>
                      View
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={`/admin/newsletter/campaigns/${campaign.id}/edit`}
                    >
                      Edit
                    </Link>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}