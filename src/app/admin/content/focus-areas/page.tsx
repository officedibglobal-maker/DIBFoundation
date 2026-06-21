
"use client";

import { useEffect, useState } from "react";
import { useFirestore } from "@/firebase/firestore/use-firestore";
import { getDocuments } from "@/lib/firestore/crud";
import { FocusArea } from "@/types/firestore";
import { COLLECTIONS } from "@/lib/firestore/collections";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const columns: ColumnDef<FocusArea>[] = [
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
        accessorKey: "order",
        header: "Order",
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

export default function AdminFocusAreasPage() {
  const { db } = useFirestore();
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    const fetchFocusAreas = async () => {
      try {
        const areas = await getDocuments<FocusArea>(db, COLLECTIONS.focusAreas);
        setFocusAreas(areas);
      } catch (error) {
        console.error("Error fetching focus areas: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFocusAreas();
  }, [db]);

  return (
    <div>
      <AdminPageHeader title="Focus Areas" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Focus Areas", href: "/admin/content/focus-areas" }]}>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Focus Area
        </Button>
      </AdminPageHeader>
      {loading ? <p>Loading...</p> : <AdminDataTable columns={columns} data={focusAreas} />}
    </div>
  );
}
