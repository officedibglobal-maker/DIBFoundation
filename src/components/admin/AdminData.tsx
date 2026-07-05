
"use client";

import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export interface AdminDataHandler<T> {
  get: { url: string };
  create?: { url: string };
  update?: { url: string };
  delete?: { url: string };
}

interface AdminDataProps<T> {
  columns: any[];
  handler: AdminDataHandler<T>;
}

export const AdminData = <T extends {}>({ columns, handler }: AdminDataProps<T>) => {
  const router = useRouter();
  const [data, setData] = useState<T[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(handler.get.url);
      const data = await res.json();
      setData(data);
    };
    fetchData();
  }, [handler.get.url]);

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(filter.toLowerCase())
    )
  );

  const handleCreate = () => {
    router.push(`${window.location.pathname}/new`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Filter..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        {handler.create && (
          <Button onClick={handleCreate}>
            <PlusCircle className="mr-2 h-4 w-4" /> New
          </Button>
        )}
      </div>
      <DataTable columns={columns} data={filteredData} />
    </div>
  );
};
