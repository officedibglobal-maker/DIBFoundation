import Link from "next/link";
import { notFound } from "next/navigation";

import { getCampaign } from "@/app/admin/newsletter/campaigns/_actions/get-campaign";
import { CampaignForm } from "@/app/admin/newsletter/campaigns/_components/campaign-form";
import { Button } from "@/components/ui/button";

interface CampaignEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function CampaignEditPage({
  params,
}: CampaignEditPageProps) {
  const { id } = await params;
  const campaign = await getCampaign(id);

  if (!campaign) {
    notFound();
  }

  return (
    <div className="container mx-auto space-y-8 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Campaign</h1>
          <p className="mt-2 text-muted-foreground">
            Update this newsletter campaign draft.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href={`/admin/newsletter/campaigns/${id}`}>Back to Campaign</Link>
        </Button>
      </div>

      <CampaignForm campaign={campaign} />
    </div>
  );
}