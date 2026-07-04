
"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { FocusAreaForm } from "@/components/admin/FocusAreaForm";
import { FocusAreaSchema } from "@/lib/models/focus-areas";
import { useRouter } from "next/navigation";
import { z } from "zod";

export default function NewFocusAreaPage() {
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof FocusAreaSchema>) => {
    const res = await fetch("/api/focus-areas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      router.push("/admin/focus-areas");
    }
  };

  return (
    <div>
      <AdminPageHeader title="Add New Focus Area" />
      <FocusAreaForm onSubmit={onSubmit} />
    </div>
  );
}
