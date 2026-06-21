
"use client";

import { useEffect, useState } from "react";
import { useFirestore } from "@/firebase/firestore/use-firestore";
import { getDocuments } from "@/lib/firestore/crud";
import { ImpactStory } from "@/types/firestore";
import { COLLECTIONS } from "@/lib/firestore/collections";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const columns: ColumnDef<ImpactStory>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "beneficiaryName",
        header: "Beneficiary",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return <Badge variant={status === 'published' ? 'default' : 'secondary'}>{status}</Badge>
        }
    },
];

export default function AdminImpactStoriesPage() {
  const { db } = useFirestore();
  const [stories, setStories] = useState<ImpactStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    const fetchStories = async () => {
      try {
        const storiesData = await getDocuments<ImpactStory>(db, COLLECTIONS.impactStories);
        setStories(storiesData);
      } catch (error) {
        console.error("Error fetching impact stories: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [db]);

  return (
    <div>
      <AdminPageHeader title="Impact Stories" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Impact Stories", href: "/admin/content/impact-stories" }]}>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Impact Story
        </Button>
      </AdminPageHeader>
      {loading ? <p>Loading...</p> : <AdminDataTable columns={columns} data={stories} />}
    </div>
  );
}
