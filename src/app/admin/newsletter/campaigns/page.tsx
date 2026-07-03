import { Plus } from "lucide-react";
import Link from "next/link";

import { getCampaigns } from "@/app/admin/newsletter/campaigns/_actions/get-campaigns";
import { CampaignsClient } from "@/app/admin/newsletter/campaigns/_components/campaigns-client";
import { Button } from "@/components/ui/button";

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <div className="container mx-auto space-y-8 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Newsletter Campaigns
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage newsletter campaign drafts, previews, and sending.
          </p>
        </div>

        <Button asChild>
          <Link href="/admin/newsletter/campaigns/new">
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Link>
        </Button>
      </div>

      <CampaignsClient data={campaigns} />
    </div>
  );
}