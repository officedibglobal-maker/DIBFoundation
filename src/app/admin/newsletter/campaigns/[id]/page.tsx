
"use client";

import { CampaignForm } from "../CampaignForm";
import { useFirestore } from "@/firebase/firestore/use-firestore";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function EditCampaignPage({ params }: { params: { id: string } }) {
  const { db, status, error } = useFirestore();
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    if (status !== 'ready' || !db) return;
    const fetchCampaign = async () => {
      const campaignRef = doc(db, "newsletterCampaigns", params.id);
      const campaignSnap = await getDoc(campaignRef);
      if (campaignSnap.exists()) {
        setCampaign(campaignSnap.data() as any);
      } else {
        // Handle not found
      }
    };

    fetchCampaign();
  }, [db, params.id, status]);

  if (status === 'loading' || !campaign) {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>Error: {error?.message}</div>;
  }

  return <CampaignForm campaign={campaign} campaignId={params.id} />;
}
