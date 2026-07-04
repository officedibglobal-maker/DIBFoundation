import Link from "next/link";
import { notFound } from "next/navigation";

import { getCampaign } from "@/app/admin/newsletter/campaigns/_actions/get-campaign";
import { CampaignView } from "@/app/admin/newsletter/campaigns/_components/campaign-view";
import { Button } from "@/components/ui/button";

interface CampaignPageProps {
  params: Promise<{ id: string }>;
}

export default async function CampaignPage({ params }: CampaignPageProps) {
  const { id } = await params;
  const campaign = await getCampaign(id);

  if (!campaign) {
    notFound();
  }

  return (
    <div className="container mx-auto space-y-8 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Newsletter Campaign
          </h1>
          <p className="mt-2 text-muted-foreground">
            Preview, edit, and send this campaign.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/newsletter/campaigns">Back to Campaigns</Link>
        </Button>
      </div>

      <CampaignView campaign={campaign} />
    </div>
  );
}