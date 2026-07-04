
"use client";

import { useEffect, useState } from "react";
import { FocusArea } from "@/lib/models/focus-areas";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { FocusAreasTable } from "@/components/admin/FocusAreasTable";

export default function FocusAreasPage() {
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);

  useEffect(() => {
    const fetchFocusAreas = async () => {
      const res = await fetch("/api/focus-areas");
      const data = await res.json();
      setFocusAreas(data);
    };
    fetchFocusAreas();
  }, []);

  return (
    <div>
      <AdminPageHeader title="Focus Areas">
        <Button asChild>
          <Link href="/admin/focus-areas/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New
          </Link>
        </Button>
      </AdminPageHeader>
      <FocusAreasTable focusAreas={focusAreas} />
    </div>
  );
}
