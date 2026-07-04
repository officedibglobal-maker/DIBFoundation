
"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { FocusAreaForm } from "@/components/admin/FocusAreaForm";
import { FocusArea, FocusAreaSchema } from "@/lib/models/focus-areas";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

interface EditFocusAreaPageProps {
  params: { id: string };
}

const EditFocusAreaPage: NextPage<EditFocusAreaPageProps> = ({ params }) => {
  const router = useRouter();
  const [focusArea, setFocusArea] = useState<FocusArea | null>(null);

  useEffect(() => {
    const fetchFocusArea = async () => {
      const res = await fetch(`/api/focus-areas/${params.id}`);
      const data = await res.json();
      setFocusArea(data);
    };
    fetchFocusArea();
  }, [params.id]);

  const onSubmit = async (values: z.infer<typeof FocusAreaSchema>) => {
    const res = await fetch(`/api/focus-areas/${params.id}`, {
      method: "PUT",
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
      <AdminPageHeader title="Edit Focus Area" />
      {focusArea && <FocusAreaForm onSubmit={onSubmit} defaultValues={focusArea} />}
    </div>
  );
};

export default EditFocusAreaPage;
