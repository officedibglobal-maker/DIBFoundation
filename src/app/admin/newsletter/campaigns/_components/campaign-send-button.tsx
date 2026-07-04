"use client";

import { Button } from "@/components/ui/button";
import { NewsletterCampaignStatus } from "@/types/newsletter-campaign";
import { sendCampaign } from "../_actions/send-campaign";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";

export function CampaignSendButton({ campaignId, campaignStatus }: { campaignId: string, campaignStatus: NewsletterCampaignStatus }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSend = () => {
    if (confirm("Are you sure you want to send this campaign?")) {
      startTransition(async () => {
        try {
          await sendCampaign(campaignId);
          toast({ title: "Campaign sent successfully" });
        } catch (error) {
          toast({ title: "Failed to send campaign", description: error.message, variant: "destructive" });
        }
      });
    }
  };

  const canSend = campaignStatus === NewsletterCampaignStatus.Draft || campaignStatus === NewsletterCampaignStatus.Failed;

  if (!canSend) {
    return <Button disabled>Sent</Button>;
  }

  return <Button onClick={handleSend} disabled={isPending}>{isPending ? "Sending..." : "Send Campaign"}</Button>;
}
