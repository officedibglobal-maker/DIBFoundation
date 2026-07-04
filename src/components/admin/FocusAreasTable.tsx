
"use client";

import { FocusArea } from "@/lib/models/focus-areas";
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
import { iconMap } from "@/components/IconMap";
import { Trash2, Edit } from "lucide-react";

interface FocusAreasTableProps {
  focusAreas: FocusArea[];
}

export function FocusAreasTable({ focusAreas }: FocusAreasTableProps) {
  const deleteFocusArea = async (id: string) => {
    await fetch(`/api/focus-areas/${id}`, {
      method: "DELETE",
    });
    window.location.reload();
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Icon</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {focusAreas.map((focusArea) => (
          <TableRow key={focusArea.id}>
            <TableCell>{focusArea.name}</TableCell>
            <TableCell>
              {iconMap[focusArea.icon as keyof typeof iconMap]({ className: "h-6 w-6" })}
            </TableCell>
            <TableCell>
              <Button variant="ghost" asChild>
                <Link href={`/admin/focus-areas/${focusArea.id}/edit`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                onClick={() => deleteFocusArea(focusArea.id!)}
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
