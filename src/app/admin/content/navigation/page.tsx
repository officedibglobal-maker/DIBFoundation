
"use client";

import { useEffect, useState } from "react";
import { useFirestore } from "@/firebase/firestore/use-firestore";
import { getDocuments } from "@/lib/firestore/crud";
import { NavigationItem } from "@/types/firestore";
import { COLLECTIONS } from "@/lib/firestore/collections";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const columns: ColumnDef<NavigationItem>[] = [
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
        accessorKey: "label",
        header: "Label",
    },
    {
        accessorKey: "href",
        header: "URL",
    },
    {
        accessorKey: "location",
        header: "Location",
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

export default function AdminNavigationPage() {
  const { db } = useFirestore();
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    const fetchNavItems = async () => {
      try {
        const items = await getDocuments<NavigationItem>(db, COLLECTIONS.navigationItems);
        setNavItems(items);
      } catch (error) {
        console.error("Error fetching navigation items: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNavItems();
  }, [db]);

  return (
    <div>
      <AdminPageHeader title="Navigation" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Navigation", href: "/admin/content/navigation" }]}>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Navigation Item
        </Button>
      </AdminPageHeader>
      {loading ? <p>Loading...</p> : <AdminDataTable columns={columns} data={navItems} />}
    </div>
  );
}
