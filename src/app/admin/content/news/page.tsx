
"use client";

import { useEffect, useState } from "react";
import { useFirestore } from "@/firebase/firestore/use-firestore";
import { getDocuments } from "@/lib/firestore/crud";
import { News } from "@/types/firestore";
import { COLLECTIONS } from "@/lib/firestore/collections";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const columns: ColumnDef<News>[] = [
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
        accessorKey: "category",
        header: "Category",
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

export default function AdminNewsPage() {
  const { db } = useFirestore();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    const fetchNews = async () => {
      try {
        const newsData = await getDocuments<News>(db, COLLECTIONS.news);
        setNews(newsData);
      } catch (error) {
        console.error("Error fetching news: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [db]);

  return (
    <div>
      <AdminPageHeader title="News" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "News", href: "/admin/content/news" }]}>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add News Article
        </Button>
      </AdminPageHeader>
      {loading ? <p>Loading...</p> : <AdminDataTable columns={columns} data={news} />}
    </div>
  );
}
