"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { NewsletterSettings } from "@/types/newsletter-settings";

const optionalEmailSchema = z.union([
  z.literal(""),
  z.string().trim().email("Invalid email address."),
]);

const formSchema = z.object({
  senderName: z
    .string()
    .trim()
    .min(1, "Sender name is required."),

  senderEmail: z
    .string()
    .trim()
    .email("Invalid sender email address."),

  replyToEmail: optionalEmailSchema,

  organizationName: z
    .string()
    .trim()
    .min(1, "Organization name is required."),

  organizationAddress: z.string().optional(),

  defaultPreviewText: z.string().optional(),

  defaultFooterHtml: z.string().optional(),

  unsubscribeText: z.string().optional(),

  brevoListId: z
    .string()
    .trim()
    .refine(
      (value) => {
        if (!value) {
          return true;
        }

        return (
          /^\d+$/.test(value) &&
          Number.parseInt(value, 10) > 0
        );
      },
      {
        message:
          "Brevo List ID must be a positive whole number.",
      },
    ),

  testRecipientEmails: z
    .string()
    .refine(
      (value) => {
        if (!value.trim()) {
          return true;
        }

        const emails = value
          .split(/[,\n]/)
          .map((email) => email.trim())
          .filter(Boolean);

        return emails.every((email) =>
          z.string().email().safeParse(email).success,
        );
      },
      {
        message:
          "One or more test-recipient emails are invalid.",
      },
    ),

  welcomeEmailEnabled: z.boolean(),

  campaignApprovalRequired: z.boolean(),
});

export type NewsletterSettingsFormValues =
  z.infer<typeof formSchema>;

interface NewsletterSettingsFormProps {
  initialData?: NewsletterSettings;
  onSave: (
    data: NewsletterSettingsFormValues,
  ) => Promise<boolean>;
  isSaving: boolean;
}

export function NewsletterSettingsForm({
  initialData,
  onSave,
  isSaving,
}: NewsletterSettingsFormProps) {
  const form = useForm<NewsletterSettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      senderName:
        initialData?.senderName ?? "DIB Foundation",

      senderEmail:
        initialData?.senderEmail ?? "",

      replyToEmail:
        initialData?.replyToEmail ?? "",

      organizationName:
        initialData?.organizationName ??
        "DIB Foundation",

      organizationAddress:
        initialData?.organizationAddress ?? "",

      defaultPreviewText:
        initialData?.defaultPreviewText ?? "",

      defaultFooterHtml:
        initialData?.defaultFooterHtml ?? "",

      unsubscribeText:
        initialData?.unsubscribeText ??
        "You are receiving this email because you subscribed to DIB Foundation updates.",

      brevoListId:
        initialData?.brevoListId !== undefined
          ? String(initialData.brevoListId)
          : "",

      testRecipientEmails:
        initialData?.testRecipientEmails?.join("\n") ??
        "",

      welcomeEmailEnabled:
        initialData?.welcomeEmailEnabled ?? true,

      campaignApprovalRequired:
        initialData?.campaignApprovalRequired ??
        true,
    },
  });

  async function onSubmit(
    data: NewsletterSettingsFormValues,
  ) {
    const saved = await onSave(data);

    if (saved) {
      form.reset(data);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="grid gap-8 md:grid-cols-2">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">
              Sender Identity
            </h2>

            <FormField
              control={form.control}
              name="senderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sender Name</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="DIB Foundation"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="senderEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sender Email</FormLabel>

                  <FormControl>
                    <Input
                      type="email"
                      placeholder="newsletter@dibfoundation.org"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="replyToEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Reply-To Email
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="email"
                      placeholder="contact@dibfoundation.org"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">
              Organization
            </h2>

            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Organization Name
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="DIB Foundation"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organizationAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Organization Address
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      placeholder="Enter the registered organization address"
                      rows={5}
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    This may be required in newsletter
                    footers for legal compliance.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
        </div>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">
            Campaign Defaults
          </h2>

          <FormField
            control={form.control}
            name="defaultPreviewText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Default Preview Text
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder="Preview text displayed by email clients"
                    {...field}
                  />
                </FormControl>

                <FormDescription>
                  This usually appears beside or beneath
                  the subject line.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="defaultFooterHtml"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Default Footer HTML
                </FormLabel>

                <FormControl>
                  <Textarea
                    className="font-mono"
                    rows={7}
                    placeholder="<p>DIB Foundation</p>"
                    {...field}
                  />
                </FormControl>

                <FormDescription>
                  This is stored as configuration text and
                  is not rendered on this page.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unsubscribeText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Unsubscribe Text
                </FormLabel>

                <FormControl>
                  <Textarea
                    rows={3}
                    {...field}
                  />
                </FormControl>

                <FormDescription>
                  Plain text displayed before the
                  unsubscribe link.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">
            Delivery Settings
          </h2>

          <FormField
            control={form.control}
            name="brevoListId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Brevo List ID
                </FormLabel>

                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="123"
                    {...field}
                  />
                </FormControl>

                <FormDescription>
                  Leave empty until the correct Brevo
                  contact-list ID is confirmed.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="testRecipientEmails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Test-Recipient Emails
                </FormLabel>

                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder={
                      "team@example.com\nadmin@example.com"
                    }
                    {...field}
                  />
                </FormControl>

                <FormDescription>
                  Enter one address per line or separate
                  addresses with commas.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="welcomeEmailEnabled"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <FormLabel className="text-base">
                    Enable Welcome Email
                  </FormLabel>

                  <FormDescription>
                    Send a welcome email when a new
                    subscriber successfully registers.
                  </FormDescription>
                </div>

                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="campaignApprovalRequired"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <FormLabel className="text-base">
                    Require Campaign Approval
                  </FormLabel>

                  <FormDescription>
                    Campaigns must be approved before
                    scheduling or sending.
                  </FormDescription>
                </div>

                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </section>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={
              isSaving ||
              !form.formState.isDirty
            }
          >
            {isSaving
              ? "Saving..."
              : "Save Settings"}
          </Button>
        </div>
      </form>
    </Form>
  );
}