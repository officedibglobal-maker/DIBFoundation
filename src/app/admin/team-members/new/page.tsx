
"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";
import { TeamMemberSchema } from "@/lib/models/team-members";
import { useRouter } from "next/navigation";
import { z } from "zod";

export default function NewTeamMemberPage() {
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof TeamMemberSchema>) => {
    const res = await fetch("/api/team-members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      router.push("/admin/team-members");
    }
  };

  return (
    <div>
      <AdminPageHeader title="Add New Team Member" />
      <TeamMemberForm onSubmit={onSubmit} />
    </div>
  );
}
