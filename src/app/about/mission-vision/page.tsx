
import { getSitePageBySlug } from "@/lib/firebase/firestore/getSitePageBySlug";
import { SitePageRenderer } from "@/components/site/SitePageRenderer";
import { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

const MissionVisionPage: NextPage = async () => {
  const page = await getSitePageBySlug("about-mission-vision");

  if (page && page.status === "published") {
    return <SitePageRenderer page={page} />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Our Mission & Vision
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
          Guiding our commitment to service, partnership, and sustainable impact.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 text-center">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-3xl font-bold mb-4 text-primary">Our Mission</h2>
          <p className="text-slate-700 text-lg">
            To create sustainable pathways for people, institutions, and communities to improve lives, improve healthcare, and advance human dignity through service, partnership, innovation, and purposeful giving.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-3xl font-bold mb-4 text-primary">Our Vision</h2>
          <p className="text-slate-700 text-lg">
            A world where every person, institution, and community has a meaningful pathway to create lasting impact, and where Africa's challenges inspire global collaboration, innovation, and shared responsibility.
          </p>
        </div>
      </div>

      <div className="mt-16 text-center bg-slate-50 p-10 rounded-xl">
          <h2 className="text-3xl font-bold mb-4">Be Part of the Journey</h2>
          <p className="text-slate-700 max-w-3xl mx-auto mb-6">
              Creating lasting change calls for all of us. At Doctors in Business Foundation, every act of service, every partnership, and every contribution helps build stronger and more sustainable communities. We invite you to stand with us on this journey across Africa and underserved communities globally.
          </p>
          <Button asChild size="lg">
              <Link href="/get-involved">Get Involved Today</Link>
          </Button>
      </div>
    </div>
  );
};

export default MissionVisionPage;
