"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";
import { TeamMember, TeamMemberSchema } from "@/lib/models/team-members";

interface EditTeamMemberPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditTeamMemberPage({
  params,
}: EditTeamMemberPageProps) {
  const router = useRouter();
  const { id } = React.use(params);

  const [teamMember, setTeamMember] = React.useState<TeamMember | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    async function fetchTeamMember() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/team-members/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load team member.");
        }

        const data = (await res.json()) as TeamMember;

        if (isMounted) {
          setTeamMember(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading this team member."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchTeamMember();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const onSubmit = async (values: z.infer<typeof TeamMemberSchema>) => {
    try {
      setSaving(true);
      setError(null);

      const res = await fetch(`/api/team-members/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Failed to update team member.");
      }

      router.push("/admin/team-members");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving this team member."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Edit Team Member" />

      {loading && (
        <div className="rounded-lg border bg-white p-6 text-sm text-muted-foreground shadow-sm">
          Loading team member...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && teamMember && (
        <TeamMemberForm onSubmit={onSubmit} defaultValues={teamMember} />
      )}

      {!loading && !teamMember && !error && (
        <div className="rounded-lg border bg-white p-6 text-sm text-muted-foreground shadow-sm">
          Team member not found.
        </div>
      )}

      {saving && (
        <p className="text-sm text-muted-foreground">
          Saving team member...
        </p>
      )}
    </div>
  );
}