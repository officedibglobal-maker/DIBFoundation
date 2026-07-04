import { getCampaign } from "../_actions/get-campaign";
import CampaignForm from "../_components/campaign-form";

export default async function EditCampaignPage({ params }) {
  const campaign = await getCampaign(params.id);

  return <CampaignForm campaign={campaign} />;
}
