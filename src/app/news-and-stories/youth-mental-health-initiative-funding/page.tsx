
import { getSitePageBySlug } from "@/lib/firebase/firestore/getSitePageBySlug";
import { SitePageRenderer } from "@/components/site/SitePageRenderer";
import { NextPage } from 'next';

const YouthMentalHealthInitiativeFundingPage: NextPage = async () => {
  const page = await getSitePageBySlug("news-and-stories-youth-mental-health-initiative-funding");

  if (page && page.status === "published") {
    return <SitePageRenderer page={page} />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-4">
        Youth-Led Mental Health Initiatives Receive Support from DIBF
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        In recognition of World Mental Health Day, DIBF is proud to announce funding for five new youth-led projects focused on promoting mental wellbeing and resilience in their communities.
      </p>
    </div>
  );

};

export default YouthMentalHealthInitiativeFundingPage;
