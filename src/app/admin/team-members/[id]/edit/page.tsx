
"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";
import { TeamMember, TeamMemberSchema } from "@/lib/models/team-members";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

export default function EditTeamMemberPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    const fetchTeamMember = async () => {
      const res = await fetch(`/api/team-members/${params.id}`);
      const data = await res.json();
      setTeamMember(data);
    };
    fetchTeamMember();
  }, [params.id]);

  const onSubmit = async (values: z.infer<typeof TeamMemberSchema>) => {
    const res = await fetch(`/api/team-members/${params.id}`, {
      method: "PUT",
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
      <AdminPageHeader title="Edit Team Member" />
      {teamMember && <TeamMemberForm onSubmit={onSubmit} defaultValues={teamMember} />}
    </div>
  );
}
