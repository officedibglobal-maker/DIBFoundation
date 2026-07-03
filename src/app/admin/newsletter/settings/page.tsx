"use client";

import {
  useMemo,
  useState,
} from "react";
import {
  deleteField,
  doc,
  serverTimestamp,
  setDoc,
  type PartialWithFieldValue,
} from "firebase/firestore";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  NewsletterSettingsForm,
  type NewsletterSettingsFormValues,
} from "@/components/admin/newsletter/NewsletterSettingsForm";
import { useDoc } from "@/firebase/firestore/use-doc";
import { useFirestore } from "@/firebase/firestore/use-firestore";
import { toast } from "@/hooks/use-toast";
import { COLLECTIONS } from "@/lib/firestore/collections";
import { newsletterSettingsConverter } from "@/lib/firestore/converters";
import type { NewsletterSettings } from "@/types/newsletter-settings";

const SETTINGS_DOCUMENT_ID = "default";

function normalizeTestRecipientEmails(
  value: string,
): string[] {
  return Array.from(
    new Set(
      value
        .split(/[,\n]/)
        .map((email) =>
          email.trim().toLowerCase(),
        )
        .filter(Boolean),
    ),
  );
}

export default function NewsletterSettingsPage() {
  const {
    db,
    status: firestoreStatus,
    error: firestoreError,
  } = useFirestore();

  const [isSaving, setIsSaving] =
    useState(false);

  const settingsReference = useMemo(() => {
    if (!db) {
      return null;
    }

    return doc(
      db,
      COLLECTIONS.newsletterSettings,
      SETTINGS_DOCUMENT_ID,
    ).withConverter(newsletterSettingsConverter);
  }, [db]);

  const {
    data: settings,
    loading: settingsLoading,
    error: settingsError,
  } = useDoc(settingsReference);

  async function handleSave(
    values: NewsletterSettingsFormValues,
  ): Promise<boolean> {
    if (!settingsReference) {
      toast({
        title: "Database unavailable",
        description:
          "Firestore is not ready. Please refresh the page and try again.",
        variant: "destructive",
      });

      return false;
    }

    if (isSaving) {
      return false;
    }

    setIsSaving(true);

    try {
      const testRecipientEmails =
        normalizeTestRecipientEmails(
          values.testRecipientEmails,
        );

      const brevoListId =
        values.brevoListId.trim().length > 0
          ? Number.parseInt(
              values.brevoListId,
              10,
            )
          : null;

      const settingsData: PartialWithFieldValue<NewsletterSettings> =
        {
          senderName: values.senderName.trim(),
          senderEmail: values.senderEmail
            .trim()
            .toLowerCase(),

          replyToEmail:
            values.replyToEmail
              .trim()
              .toLowerCase(),

          organizationName:
            values.organizationName.trim(),

          organizationAddress:
            values.organizationAddress?.trim() ??
            "",

          defaultPreviewText:
            values.defaultPreviewText?.trim() ??
            "",

          defaultFooterHtml:
            values.defaultFooterHtml ?? "",

          unsubscribeText:
            values.unsubscribeText?.trim() ?? "",

          brevoListId:
            brevoListId ??
            deleteField(),

          testRecipientEmails,

          welcomeEmailEnabled:
            values.welcomeEmailEnabled,

          campaignApprovalRequired:
            values.campaignApprovalRequired,

          createdAt:
            settings?.createdAt ??
            serverTimestamp(),

          updatedAt: serverTimestamp(),
        };

      await setDoc(
        settingsReference,
        settingsData,
        {
          merge: true,
        },
      );

      toast({
        title: "Settings saved",
        description:
          "Newsletter settings were updated successfully.",
      });

      return true;
    } catch (saveError) {
      console.error(
        "Failed to save newsletter settings:",
        saveError,
      );

      toast({
        title: "Error saving settings",
        description:
          saveError instanceof Error
            ? saveError.message
            : "An unexpected error occurred while saving newsletter settings.",
        variant: "destructive",
      });

      return false;
    } finally {
      setIsSaving(false);
    }
  }

  const firebaseInitializing =
    firestoreStatus !== "ready" &&
    firestoreStatus !== "error";

  const isLoading =
    firebaseInitializing ||
    settingsLoading;

  const displayedError =
    firestoreError ?? settingsError;

  return (
    <div className="container mx-auto space-y-6 py-8">
      <div className="space-y-2">
        <AdminPageHeader
          title="Newsletter Settings"
        />

        <p className="text-sm text-muted-foreground">
          Configure sender information, campaign
          defaults, test recipients, and newsletter
          delivery preferences.
        </p>
      </div>

      {isLoading && (
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Loading newsletter settings...
          </p>
        </div>
      )}

      {!isLoading && displayedError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
          <p className="text-sm text-destructive">
            Error loading settings:{" "}
            {displayedError.message}
          </p>
        </div>
      )}

      {!isLoading && !displayedError && (
        <NewsletterSettingsForm
          initialData={settings}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}