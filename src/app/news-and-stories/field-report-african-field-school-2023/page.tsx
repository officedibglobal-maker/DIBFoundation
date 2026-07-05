
import { getSitePageBySlug } from "@/lib/firebase/firestore/getSitePageBySlug";
import { SitePageRenderer } from "@/components/site/SitePageRenderer";
import { NextPage } from 'next';

const FieldReportAfricanFieldSchool2023Page: NextPage = async () => {
  const page = await getSitePageBySlug("news-and-stories-field-report-african-field-school-2023");

  if (page && page.status === "published") {
    return <SitePageRenderer page={page} />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-4">
        Field Report: Reflections from the 2023 African Field School
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        Students from the 2023 African Field School share their experiences and insights from their time in Ghana, where they worked alongside local partners on community health projects.
      </p>
    </div>
  );

};

export default FieldReportAfricanFieldSchool2023Page;
