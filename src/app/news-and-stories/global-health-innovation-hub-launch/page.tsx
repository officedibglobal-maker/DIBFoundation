
import { getSitePageBySlug } from "@/lib/firebase/firestore/getSitePageBySlug";
import { SitePageRenderer } from "@/components/site/SitePageRenderer";
import { NextPage } from 'next';

const GlobalHealthInnovationHubLaunchPage: NextPage = async () => {
  const page = await getSitePageBySlug("news-and-stories-global-health-innovation-hub-launch");

  if (page && page.status === "published") {
    return <SitePageRenderer page={page} />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-4">
        DIBF and University of Toronto Partner to Launch Global Health Innovation Hub
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        The DIBF Global Health Innovation Hub at the University of Toronto will bring together researchers, entrepreneurs, and community partners to develop and scale solutions to pressing global health challenges.
      </p>
    </div>
  );

};

export default GlobalHealthInnovationHubLaunchPage;
