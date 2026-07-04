
"use client";

import { useEffect, useState } from "react";
import { TeamMember } from "@/lib/models/team-members";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { TeamMembersTable } from "@/components/admin/TeamMembersTable";

export default function TeamMembersPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      const res = await fetch("/api/team-members");
      const data = await res.json();
      setTeamMembers(data);
    };
    fetchTeamMembers();
  }, []);

  return (
    <div>
      <AdminPageHeader title="Team Members">
        <Button asChild>
          <Link href="/admin/team-members/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New
          </Link>
        </Button>
      </AdminPageHeader>
      <TeamMembersTable teamMembers={teamMembers} />
    </div>
  );
}
