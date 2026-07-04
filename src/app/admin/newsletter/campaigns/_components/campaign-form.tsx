"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createCampaign } from "@/app/admin/newsletter/campaigns/_actions/create-campaign";
import { generateCampaignContent } from "@/app/admin/newsletter/campaigns/_actions/generate-campaign-content";
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

  showSponsorBlock: z.boolean().optional(),
  sponsorName: z.string().optional(),
  sponsorLabel: z.string().optional(),
  sponsorHeadline: z.string().optional(),
  sponsorBody: z.string().optional(),
  sponsorCtaLabel: z.string().optional(),
  sponsorCtaUrl: z.string().optional(),
  sponsorImageUrl: z.string().optional(),
});

type CampaignFormValues = z.infer<typeof formSchema>;

interface CampaignFormProps {
  campaign?: SerializedNewsletterCampaign;
}

export function CampaignForm({ campaign }: CampaignFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isGenerating, startGenerating] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const [aiGoal, setAiGoal] = useState("");
  const [aiAudience, setAiAudience] = useState("DIB Foundation supporters");
  const [aiTone, setAiTone] = useState("Warm, donor-friendly, hopeful");
  const [aiKeyPoints, setAiKeyPoints] = useState("");
  const [aiCallToAction, setAiCallToAction] = useState(
    "Continue supporting DIB Foundation"
  );

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

      showSponsorBlock: campaign?.showSponsorBlock ?? false,
      sponsorName: campaign?.sponsorName ?? "",
      sponsorLabel: campaign?.sponsorLabel ?? "Sponsored Message",
      sponsorHeadline: campaign?.sponsorHeadline ?? "",
      sponsorBody: campaign?.sponsorBody ?? "",
      sponsorCtaLabel: campaign?.sponsorCtaLabel ?? "",
      sponsorCtaUrl: campaign?.sponsorCtaUrl ?? "",
      sponsorImageUrl: campaign?.sponsorImageUrl ?? "",
    },
  });

  function handleGenerate() {
    setAiError(null);

    startGenerating(async () => {
      const result = await generateCampaignContent({
        goal: aiGoal,
        audience: aiAudience,
        tone: aiTone,
        keyPoints: aiKeyPoints,
        callToAction: aiCallToAction,
      });

      if (!result.success || !result.content) {
        setAiError(result.message || "Failed to generate campaign content.");
        return;
      }

      form.setValue("title", result.content.title, { shouldDirty: true });
      form.setValue("subject", result.content.subject, { shouldDirty: true });
      form.setValue("previewText", result.content.previewText, {
        shouldDirty: true,
      });
      form.setValue("bodyHtml", result.content.bodyHtml, {
        shouldDirty: true,
      });
      form.setValue("bodyText", result.content.bodyText, {
        shouldDirty: true,
      });
    });
  }

  function onSubmit(values: CampaignFormValues) {
    setError(null);

    startTransition(async () => {
      const result =
        campaign && campaign.id
          ? await updateCampaign(campaign.id, values)
          : await createCampaign(values);

      if (!result.success) {
        const message =
          "message" in result && typeof result.message === "string"
            ? result.message
            : "error" in result && typeof result.error === "string"
              ? result.error
              : "Failed to save campaign.";

        setError(message);
        return;
      }

      router.push("/admin/newsletter/campaigns");
      router.refresh();
    });
  }

  const bodyHtml = form.watch("bodyHtml");
  const showSponsorBlock = form.watch("showSponsorBlock");
  const sponsorLabel = form.watch("sponsorLabel");
  const sponsorName = form.watch("sponsorName");
  const sponsorHeadline = form.watch("sponsorHeadline");
  const sponsorBody = form.watch("sponsorBody");
  const sponsorCtaLabel = form.watch("sponsorCtaLabel");
  const sponsorCtaUrl = form.watch("sponsorCtaUrl");
  const sponsorImageUrl = form.watch("sponsorImageUrl");

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

        <section className="rounded-lg border bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <div>
              <h2 className="text-lg font-semibold">AI Campaign Assistant</h2>
              <p className="text-sm text-muted-foreground">
                Generate a draft, then review and edit before saving.
              </p>
            </div>
          </div>

          {aiError ? (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {aiError}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Campaign goal</label>
              <textarea
                value={aiGoal}
                onChange={(event) => setAiGoal(event.target.value)}
                className="mt-2 min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Example: Thank donors for supporting education outreach and invite them to continue giving."
              />
            </div>

            <div>
              <label className="text-sm font-medium">Audience</label>
              <Input
                value={aiAudience}
                onChange={(event) => setAiAudience(event.target.value)}
                placeholder="DIB Foundation supporters"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tone</label>
              <Input
                value={aiTone}
                onChange={(event) => setAiTone(event.target.value)}
                placeholder="Warm and hopeful"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium">Key points</label>
              <textarea
                value={aiKeyPoints}
                onChange={(event) => setAiKeyPoints(event.target.value)}
                className="mt-2 min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Mention recent impact, community support, children, families, and appreciation."
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium">Call to action</label>
              <Input
                value={aiCallToAction}
                onChange={(event) => setAiCallToAction(event.target.value)}
                placeholder="Continue supporting DIB Foundation"
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="mt-4"
          >
            {isGenerating ? "Generating..." : "Generate Campaign Draft"}
          </Button>
        </section>

        <section className="rounded-lg border bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold">Campaign Content</h2>

          <div className="space-y-8">
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
          </div>
        </section>

        <section className="rounded-lg border bg-white p-5">
          <h2 className="mb-2 text-lg font-semibold">
            Sponsored / Partner Message
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Add an optional clearly labeled sponsor block inside this newsletter.
          </p>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="showSponsorBlock"
              render={({ field }) => (
                <FormItem>
                  <label className="flex items-center gap-3 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={field.value === true}
                      onChange={(event) => field.onChange(event.target.checked)}
                      className="h-4 w-4"
                    />
                    Show sponsor block in this campaign
                  </label>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showSponsorBlock ? (
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="sponsorLabel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input placeholder="Sponsored Message" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sponsorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sponsor name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Partner or advertiser name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sponsorHeadline"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Sponsor headline</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="A short sponsor headline"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sponsorBody"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Sponsor body</FormLabel>
                      <FormControl>
                        <textarea
                          className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          placeholder="Short sponsored message..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sponsorCtaLabel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA label</FormLabel>
                      <FormControl>
                        <Input placeholder="Learn More" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sponsorCtaUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sponsorImageUrl"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional. Use a public image URL.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-lg border bg-white p-5">
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

          {showSponsorBlock &&
          (sponsorName || sponsorHeadline || sponsorBody) ? (
            <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-blue-700">
                {sponsorLabel || "Sponsored Message"}
              </p>

              {sponsorImageUrl ? (
                <img
                  src={sponsorImageUrl}
                  alt={sponsorName || sponsorHeadline || "Sponsor image"}
                  className="mb-4 max-h-56 rounded-lg object-cover"
                />
              ) : null}

              {sponsorName ? (
                <p className="text-sm text-muted-foreground">{sponsorName}</p>
              ) : null}

              {sponsorHeadline ? (
                <h3 className="mt-1 text-xl font-semibold">
                  {sponsorHeadline}
                </h3>
              ) : null}

              {sponsorBody ? (
                <p className="mt-2 text-sm leading-6">{sponsorBody}</p>
              ) : null}

              {sponsorCtaLabel && sponsorCtaUrl ? (
                <p className="mt-4">
                  <span className="inline-flex rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
                    {sponsorCtaLabel}
                  </span>
                </p>
              ) : null}
            </div>
          ) : null}
        </section>

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