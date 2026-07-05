
"use client";

import { AdminData, AdminDataHandler } from "@/components/admin/AdminData";
import { SitePage } from "@/lib/models/site-pages";

const columns = [
  { key: "title", label: "Title" },
  { key: "slug", label: "Slug" },
  { key: "status", label: "Status" },
];

export const SitePagesClient = () => {
  const handler: AdminDataHandler<SitePage> = {
    get: { url: "/api/site-pages" },
    create: { url: "/api/site-pages" },
    update: { url: "/api/site-pages/:id" },
    delete: { url: "/api/site-pages/:id" },
  };

  return <AdminData columns={columns} handler={handler} />;
};
