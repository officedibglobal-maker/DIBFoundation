
"use client";

import { useParams } from 'next/navigation';
import { CampaignForm } from "../CampaignForm";
import { useFirestore } from "@/firebase/firestore/use-firestore";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function EditCampaignPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { db, status, error } = useFirestore();
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== 'ready' || !db) {
        if(status === 'error') setIsLoading(false);
        return;
    }
    const fetchCampaign = async () => {
      const campaignRef = doc(db, "newsletterCampaigns", id);
      const campaignSnap = await getDoc(campaignRef);
      if (campaignSnap.exists()) {
        setCampaign(campaignSnap.data() as any);
      }
      setIsLoading(false);
    };

    fetchCampaign();
  }, [db, id, status]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (status === 'error') {
    return <div>Error: {error?.message}</div>;
  }

  if (!campaign) {
    return <div>Campaign not found</div>
  }

  return <CampaignForm campaign={campaign} campaignId={id} />;
}
