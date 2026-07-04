
"use client";

import { TeamMember } from "@/lib/models/team-members";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trash2, Edit } from "lucide-react";
import Image from "next/image";

interface TeamMembersTableProps {
  teamMembers: TeamMember[];
}

export function TeamMembersTable({ teamMembers }: TeamMembersTableProps) {
  const deleteTeamMember = async (id: string) => {
    await fetch(`/api/team-members/${id}`, {
      method: "DELETE",
    });
    window.location.reload();
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teamMembers.map((teamMember) => (
          <TableRow key={teamMember.id}>
            <TableCell>
              <Image
                src={teamMember.image}
                alt={teamMember.name}
                width={50}
                height={50}
                className="rounded-full"
              />
            </TableCell>
            <TableCell>{teamMember.name}</TableCell>
            <TableCell>{teamMember.role}</TableCell>
            <TableCell>
              <Button variant="ghost" asChild>
                <Link href={`/admin/team-members/${teamMember.id}/edit`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                onClick={() => deleteTeamMember(teamMember.id!)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
