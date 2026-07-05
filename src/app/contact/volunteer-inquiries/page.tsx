
import { getSitePageBySlug } from "@/lib/firebase/firestore/getSitePageBySlug";
import { SitePageRenderer } from "@/components/site/SitePageRenderer";
import { NextPage } from 'next';

const VolunteerInquiriesPage: NextPage = async () => {
  const page = await getSitePageBySlug("contact-volunteer-inquiries");

  if (page && page.status === "published") {
    return <SitePageRenderer page={page} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Volunteer Inquiries</h1>
      <p>Information for volunteer inquiries will be here.</p>
    </div>
  );
};

export default VolunteerInquiriesPage;
