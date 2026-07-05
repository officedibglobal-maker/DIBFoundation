
import { getSitePageBySlug } from "@/lib/firebase/firestore/getSitePageBySlug";
import { SitePageRenderer } from "@/components/site/SitePageRenderer";
import { NextPage } from 'next';
import { BookOpen, Monitor, HeartPulse, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const PublicHealthEducationPage: NextPage = async () => {
  const page = await getSitePageBySlug("what-we-do-public-health-education");

  if (page && page.status === "published") {
    return <SitePageRenderer page={page} />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Public Health Education
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
          At DIBF, we believe that knowledge is key to building healthier communities. Our Public Health Education initiatives are designed to empower individuals and communities with the information and skills they need to make informed health decisions, prevent disease, and promote wellbeing for all.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <BookOpen className="mx-auto h-10 w-10 text-primary mb-4" />
          <h2 className="text-xl font-bold mb-2">Health Literacy</h2>
          <p className="text-slate-700">
            We create and distribute easy-to-understand health materials to improve health literacy and empower individuals to take control of their health.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Monitor className="mx-auto h-10 w-10 text-primary mb-4" />
          <h2 className="text-xl font-bold mb-2">Digital Health Education</h2>
          <p className="text-slate-700">
            Leveraging technology, we provide accessible online resources, webinars, and social media campaigns to reach a wider audience with vital health information.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <HeartPulse className="mx-auto h-10 w-10 text-primary mb-4" />
          <h2 className="text-xl font-bold mb-2">Disease Prevention</h2>
          <p className="text-slate-700">
            Our programs focus on preventing both communicable and non-communicable diseases through awareness campaigns and promoting healthy lifestyles.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Users className="mx-auto h-10 w-10 text-primary mb-4" />
          <h2 className="text-xl font-bold mb-2">Community Workshops</h2>
          <p className="text-slate-700">
            We conduct interactive workshops on topics such as nutrition, hygiene, and mental health, tailored to the specific needs of each community.
          </p>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Get Involved</h2>
        <p className="text-slate-700 max-w-2xl mx-auto mb-6">
          Whether you are a health professional, a student, or a passionate individual, you can contribute to our mission. Your support can help us expand our reach and empower more communities through health education.
        </p>
        <Button asChild size="lg">
          <Link href="/get-involved">Support Our Mission</Link>
        </Button>
      </div>
    </div>
  );
};

export default PublicHealthEducationPage;
