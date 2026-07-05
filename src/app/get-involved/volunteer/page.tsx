
import { getSitePageBySlug } from "@/lib/firebase/firestore/getSitePageBySlug";
import { SitePageRenderer } from "@/components/site/SitePageRenderer";
import { NextPage } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, Heart } from 'lucide-react';

const VolunteerPage: NextPage = async () => {
  const page = await getSitePageBySlug("get-involved-volunteer");

  if (page && page.status === "published") {
    return <SitePageRenderer page={page} />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Users className="mx-auto h-12 w-12 text-primary" />
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-4">
          Volunteer with DIBF
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
          Volunteers are the backbone of our organization. Your time, talent, and passion are invaluable to our work. We offer a variety of volunteer opportunities, both in the field and remotely.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md">
              <Briefcase className="h-10 w-10 text-primary mb-4"/>
              <h2 className="text-2xl font-bold mb-2">Skilled Volunteers</h2>
              <p className="text-slate-700 mb-4">Are you a healthcare professional, a researcher, a project manager, or have other professional skills to offer? We are always looking for skilled volunteers to support our programs.</p>
               <Button asChild variant="outline">
                  <Link href="/contact?subject=Skilled%20Volunteer">Inquire About Opportunities</Link>
              </Button>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
              <Heart className="h-10 w-10 text-primary mb-4"/>
              <h2 className="text-2xl font-bold mb-2">General Volunteers</h2>
              <p className="text-slate-700 mb-4">Interested in supporting our events, fundraising campaigns, or administrative tasks? We have a role for you! General volunteers play a crucial part in our day-to-day operations.</p>
              <Button asChild variant="outline">
                  <Link href="/contact?subject=General%20Volunteer">Become a Volunteer</Link>
              </Button>
          </div>
      </div>

    </div>
  );
};

export default VolunteerPage;
