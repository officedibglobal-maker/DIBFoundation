
import { getSitePageBySlug } from "@/lib/firebase/firestore/getSitePageBySlug";
import { SitePageRenderer } from "@/components/site/SitePageRenderer";
import { NextPage } from 'next';

const TeamOrInstitutionPage: NextPage = async () => {
  const page = await getSitePageBySlug("get-involved-team-or-institution");

  if (page && page.status === "published") {
    return <SitePageRenderer page={page} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Bring a Team or Institution</h1>
    </div>
  );
};

export default TeamOrInstitutionPage;
