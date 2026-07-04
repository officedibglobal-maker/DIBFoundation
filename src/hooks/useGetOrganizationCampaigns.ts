
import { collection, where, query } from "firebase/firestore";
import { useCollection } from "@/firebase/firestore/use-collection";
import { newsletterCampaignConverter } from "@/lib/firestore/converters";
import { db } from "@/firebase";
import { NewsletterCampaign } from "@/types/newsletter-campaign";

export function useGetOrganizationCampaigns(organizationId: string | null) {
  const campaignsRef = collection(db, "newsletter-campaigns").withConverter(
    newsletterCampaignConverter
  );

  const q = organizationId
    ? query(campaignsRef, where("organization", "==", organizationId))
    : null;

  const { data, loading, error } = useCollection<NewsletterCampaign>(q);

  return { campaigns: data, loading, error };
}
