
"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SitePagesClient } from "@/components/admin/SitePagesClient";

const SitePagesPage = () => {
  return (
    <div>
      <AdminPageHeader title="Site Pages" />
      <SitePagesClient />
    </div>
  );
};

export default SitePagesPage;
