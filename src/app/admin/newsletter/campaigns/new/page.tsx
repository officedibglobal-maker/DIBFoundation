import { CampaignForm } from "@/app/admin/newsletter/campaigns/_components/campaign-form";

export default function NewCampaignPage() {
  return (
    <div className="container mx-auto space-y-8 py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Campaign</h1>
        <p className="mt-2 text-muted-foreground">
          Create a new newsletter campaign draft.
        </p>
      </div>

      <CampaignForm />
    </div>
  );
}