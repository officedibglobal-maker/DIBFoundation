
"use client";

import { useEffect, useState } from "react";
import { useFirestore } from "@/firebase/firestore/use-firestore";
import { getDocuments } from "@/lib/firestore/crud";
import { Page } from "@/types/firestore";
import { COLLECTIONS } from "@/lib/firestore/collections";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const columns: ColumnDef<Page>[] = [
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
        accessorKey: "slug",
        header: "Slug",
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

export default function AdminPagesPage() {
  const { db } = useFirestore();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    const fetchPages = async () => {
      try {
        const pagesData = await getDocuments<Page>(db, COLLECTIONS.pages);
        setPages(pagesData);
      } catch (error) {
        console.error("Error fetching pages: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [db]);

  return (
    <div>
      <AdminPageHeader title="Pages" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Pages", href: "/admin/content/pages" }]}>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Page
        </Button>
      </AdminPageHeader>
      {loading ? <p>Loading...</p> : <AdminDataTable columns={columns} data={pages} />}
    </div>
  );
}
