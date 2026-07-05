"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { FocusAreaForm } from "@/components/admin/FocusAreaForm";
import { FocusArea, FocusAreaSchema } from "@/lib/models/focus-areas";

interface EditFocusAreaPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditFocusAreaPage({ params }: EditFocusAreaPageProps) {
  const router = useRouter();
  const { id } = React.use(params);

  const [focusArea, setFocusArea] = React.useState<FocusArea | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    async function fetchFocusArea() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/focus-areas/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load focus area.");
        }

        const data = (await res.json()) as FocusArea;

        if (isMounted) {
          setFocusArea(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading this focus area."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchFocusArea();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const onSubmit = async (values: z.infer<typeof FocusAreaSchema>) => {
    try {
      setSaving(true);
      setError(null);

      const res = await fetch(`/api/focus-areas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Failed to update focus area.");
      }

      router.push("/admin/focus-areas");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving this focus area."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Edit Focus Area" />

      {loading && (
        <div className="rounded-lg border bg-white p-6 text-sm text-muted-foreground shadow-sm">
          Loading focus area...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && focusArea && (
        <FocusAreaForm onSubmit={onSubmit} defaultValues={focusArea} />
      )}

      {!loading && !focusArea && !error && (
        <div className="rounded-lg border bg-white p-6 text-sm text-muted-foreground shadow-sm">
          Focus area not found.
        </div>
      )}

      {saving && (
        <p className="text-sm text-muted-foreground">
          Saving focus area...
        </p>
      )}
    </div>
  );
}