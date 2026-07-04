import { SerializedNewsletterCampaign } from "@/types/newsletter-campaign";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CampaignSendButton } from "./campaign-send-button";

export default function CampaignView({ campaign }: { campaign: SerializedNewsletterCampaign }) {
  const formattedDate = (date) =>
    date ? new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "UTC" }).format(new Date(date)) : 'N/A';

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">{campaign.title}</h1>
        <div className="flex items-center space-x-2">
          <Link href={`/admin/newsletter/campaigns/${campaign.id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <CampaignSendButton campaignId={campaign.id} campaignStatus={campaign.status} />
        </div>
      </div>
      <div>
        <p><span className="font-semibold">Subject:</span> {campaign.subject}</p>
        <p><span className="font-semibold">Preview:</span> {campaign.previewText}</p>
        <p><span className="font-semibold">Status:</span> <Badge>{campaign.status}</Badge></p>
      </div>
      <div>
        <p><span className="font-semibold">Created:</span> {formattedDate(campaign.createdAt)}</p>
        <p><span className="font-semibold">Updated:</span> {formattedDate(campaign.updatedAt)}</p>
        <p><span className="font-semibold">Sent:</span> {formattedDate(campaign.sentAt)}</p>
      </div>
      <div>
        <p><span className="font-semibold">Recipients:</span> {campaign.recipientCount ?? 'N/A'}</p>
        <p><span className="font-semibold">Sent:</span> {campaign.sentCount ?? 'N/A'}</p>
        <p><span className="font-semibold">Failed:</span> {campaign.failedCount ?? 'N/A'}</p>
        {campaign.lastError && <p><span className="font-semibold">Last Error:</span> {campaign.lastError}</p>}
      </div>
      <div>
        <h2 className="text-xl font-bold">HTML Content</h2>
        <div dangerouslySetInnerHTML={{ __html: campaign.bodyHtml }} className="p-4 border rounded" />
      </div>
      <div>
        <h2 className="text-xl font-bold">Plain Text Content</h2>
        <pre className="p-4 border rounded">{campaign.bodyText}</pre>
      </div>
    </div>
  );
}
