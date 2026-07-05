
import { getSitePageBySlug } from "@/lib/firebase/firestore/getSitePageBySlug";
import { SitePageRenderer } from "@/components/site/SitePageRenderer";
import { NextPage } from 'next';

const MediaRequestsPage: NextPage = async () => {
  const page = await getSitePageBySlug("contact-media-requests");

  if (page && page.status === "published") {
    return <SitePageRenderer page={page} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Media Requests</h1>
      <p>Information for media requests will be here.</p>
    </div>
  );
};

export default MediaRequestsPage;
