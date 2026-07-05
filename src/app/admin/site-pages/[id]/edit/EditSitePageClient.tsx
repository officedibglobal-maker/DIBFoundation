
"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SitePageForm } from "@/components/admin/SitePageForm";
import { SitePage, SitePageSchema } from "@/lib/models/site-pages";
import { useRouter } from "next/navigation";
import { z } from "zod";

interface EditSitePageClientProps {
  sitePage: SitePage;
}

export const EditSitePageClient = ({ sitePage }: EditSitePageClientProps) => {
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof SitePageSchema>) => {
    const res = await fetch(`/api/site-pages/${sitePage.id}`, {
      method: "PUT",
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
      <AdminPageHeader title="Edit Site Page" />
      <SitePageForm onSubmit={onSubmit} defaultValues={sitePage} />
    </div>
  );
};
