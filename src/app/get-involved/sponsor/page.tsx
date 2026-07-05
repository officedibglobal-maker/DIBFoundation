
import { getSitePageBySlug } from "@/lib/firebase/firestore/getSitePageBySlug";
import { SitePageRenderer } from "@/components/site/SitePageRenderer";
import { NextPage } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const SponsorPage: NextPage = async () => {
  const page = await getSitePageBySlug("get-involved-sponsor");

  if (page && page.status === "published") {
    return <SitePageRenderer page={page} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Sponsor an Initiative
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Become a sponsor and directly support our impactful initiatives. Your contribution can make a world of difference.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-8 shadow-lg transition-transform hover:scale-105">
          <h2 className="text-2xl font-bold">Sponsor Medical Outreach</h2>
          <p className="mt-2 text-slate-600">Help us bring healthcare to underserved communities.</p>
          <Button asChild className="mt-4">
            <Link href="/contact/partnership-inquiries">Inquire Now</Link>
          </Button>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-lg transition-transform hover:scale-105">
          <h2 className="text-2xl font-bold">Sponsor a Student</h2>
          <p className="mt-2 text-slate-600">Support the next generation of healthcare leaders through our field school.</p>
          <Button asChild className="mt-4">
            <Link href="/initiatives/dib-african-field-school">Learn More</Link>
          </Button>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-lg transition-transform hover:scale-105">
          <h2 className="text-2xl font-bold">Corporate Sponsorship</h2>
          <p className="mt-2 text-slate-600">Align your brand with a cause that matters. Explore our corporate partnership opportunities.</p>
          <Button asChild className="mt-4">
            <Link href="/partnerships/corporate">Explore Partnerships</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SponsorPage;
