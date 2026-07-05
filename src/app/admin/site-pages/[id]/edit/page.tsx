import { notFound } from "next/navigation";

import { getSitePageById } from "@/lib/firebase/firestore";
import { EditSitePageClient } from "./EditSitePageClient";

interface EditSitePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditSitePage({ params }: EditSitePageProps) {
  const { id } = await params;

  const sitePage = await getSitePageById(id);

  if (!sitePage) {
    notFound();
  }

  return <EditSitePageClient sitePage={sitePage} />;
}