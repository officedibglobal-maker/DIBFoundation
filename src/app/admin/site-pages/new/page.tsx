
"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SitePageForm } from "@/components/admin/SitePageForm";
import { SitePageSchema } from "@/lib/models/site-pages";
import { useRouter } from "next/navigation";
import { z } from "zod";

const NewSitePage = () => {
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof SitePageSchema>) => {
    const res = await fetch("/api/site-pages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      router.push("/admin/site-pages");
    }
  };

  return (
    <div>
      <AdminPageHeader title="New Site Page" />
      <SitePageForm onSubmit={onSubmit} />
    </div>
  );
};

export default NewSitePage;
