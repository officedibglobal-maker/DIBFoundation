import { getCampaign } from "../_actions/get-campaign";
import CampaignView from "../_components/campaign-view";

export default async function CampaignPage({ params }) {
  const campaign = await getCampaign(params.id);

  return <CampaignView campaign={campaign} />;
}
