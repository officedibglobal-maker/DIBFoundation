"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { sendCampaign } from "@/app/admin/newsletter/campaigns/_actions/send-campaign";
import { Button } from "@/components/ui/button";
import { type NewsletterCampaignStatus } from "@/types/newsletter-campaign";

interface CampaignSendButtonProps {
  id: string;
  status: NewsletterCampaignStatus;
}

export function CampaignSendButton({ id, status }: CampaignSendButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const isSent = status === "sent";
  const isSending = status === "sending";
  const canSend = status === "draft" || status === "failed";

  function handleSend() {
    const confirmed = window.confirm(
      "Send this campaign to all active subscribers? This cannot be undone."
    );

    if (!confirmed) return;

    setMessage(null);

    startTransition(async () => {
      const result = await sendCampaign(id);
      setMessage(result.message || null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleSend} disabled={!canSend || isPending}>
        {isPending
          ? "Sending..."
          : isSent
            ? "Already Sent"
            : isSending
              ? "Sending..."
              : "Send Campaign"}
      </Button>

      {message ? (
        <p className="text-sm text-muted-foreground">{message}</p>
      ) : null}
    </div>
  );
}