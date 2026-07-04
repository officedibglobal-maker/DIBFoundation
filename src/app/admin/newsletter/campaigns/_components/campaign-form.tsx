"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createCampaign } from "@/app/admin/newsletter/campaigns/_actions/create-campaign";
import { updateCampaign } from "@/app/admin/newsletter/campaigns/_actions/update-campaign";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type SerializedNewsletterCampaign } from "@/types/newsletter-campaign";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  previewText: z.string().optional(),
  bodyHtml: z.string().min(1, "Campaign content is required"),
  bodyText: z.string().optional(),
});

type CampaignFormValues = z.infer<typeof formSchema>;

interface CampaignFormProps {
  campaign?: SerializedNewsletterCampaign;
}

export function CampaignForm({ campaign }: CampaignFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isReadOnly =
    campaign?.status === "sent" || campaign?.status === "sending";

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: campaign?.title ?? "",
      subject: campaign?.subject ?? "",
      previewText: campaign?.previewText ?? "",
      bodyHtml: campaign?.bodyHtml ?? "",
      bodyText: campaign?.bodyText ?? "",
    },
  });

  function onSubmit(values: CampaignFormValues) {
    setError(null);

    startTransition(async () => {
      const result =
        campaign && campaign.id
          ? await updateCampaign(campaign.id, values)
          : await createCampaign(values);

      if (!result.success) {
        const message =
          "message" in result
            ? result.message
            : "error" in result
              ? result.error
              : "Failed to save campaign.";

        setError(message || "Failed to save campaign.");
        return;
      }

      router.push("/admin/newsletter/campaigns");
      router.refresh();
    });
  }

  const bodyHtml = form.watch("bodyHtml");

  if (isReadOnly) {
    return (
      <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
        <h2 className="font-semibold">Campaign is locked</h2>
        <p className="mt-1">
          This campaign has status "{campaign.status}" and can no longer be
          edited.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign title</FormLabel>
              <FormControl>
                <Input placeholder="July donor update" {...field} />
              </FormControl>
              <FormDescription>
                Internal title used inside the admin hub.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email subject</FormLabel>
              <FormControl>
                <Input
                  placeholder="See what your support made possible"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the subject subscribers will see.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="previewText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preview text</FormLabel>
              <FormControl>
                <Input
                  placeholder="A short summary shown in some inboxes"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional inbox preview text.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bodyHtml"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email HTML content</FormLabel>
              <FormControl>
                <textarea
                  className="min-h-72 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="<h1>DIB Foundation Newsletter</h1><p>Write your campaign here...</p>"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                HTML content for the newsletter email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bodyText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plain text fallback</FormLabel>
              <FormControl>
                <textarea
                  className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Plain text version of the campaign..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional fallback for email clients that do not render HTML.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">Preview</h2>
          {bodyHtml ? (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Your campaign preview will appear here.
            </p>
          )}
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending
            ? campaign
              ? "Updating..."
              : "Saving..."
            : campaign
              ? "Update Campaign"
              : "Save Draft"}
        </Button>
      </form>
    </Form>
  );
}