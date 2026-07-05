
import { getSitePageBySlug } from "@/lib/firebase/firestore/getSitePageBySlug";
import { SitePageRenderer } from "@/components/site/SitePageRenderer";
import { NextPage } from 'next';
import { Rocket, Book, Handshake } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const YouthStudentImpactPage: NextPage = async () => {
  const page = await getSitePageBySlug("what-we-do-youth-student-impact");

  if (page && page.status === "published") {
    return <SitePageRenderer page={page} />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Youth & Student Impact Programs
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
          DIBF believes that young people are essential partners in shaping healthier and more resilient communities. We help cultivate a generation committed to social responsibility and community impact.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 text-center">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <Rocket className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Leadership Development</h2>
          <p className="text-slate-700">
            Our programs provide young people with opportunities to develop leadership skills, take initiative, and drive positive change in their communities.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md">
          <Handshake className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Service & Engagement</h2>
          <p className="text-slate-700">
            We connect students with meaningful service opportunities, allowing them to apply their skills and passions to real-world challenges.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md">
          <Book className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Experiential Learning</h2>
          <p className="text-slate-700">
            Through programs like the DIBF African Field School, we offer immersive experiences that foster a deeper understanding of health, development, and social impact.
          </p>
        </div>
      </div>

      <div className="mt-16 text-center bg-slate-50 p-10 rounded-xl">
          <h2 className="text-3xl font-bold mb-4">Join Our Youth Initiatives</h2>
          <p className="text-slate-700 max-w-3xl mx-auto mb-6">
              Are you a student or young professional passionate about making a difference? Explore our programs and find out how you can get involved.
          </p>
          <div className="flex justify-center gap-4">
              <Button asChild>
                  <Link href="/initiatives/dib-african-field-school">DIBF African Field School</Link>
              </Button>
              <Button variant="outline" asChild>
                  <Link href="/get-involved/volunteer">Volunteer With Us</Link>
              </Button>
          </div>
      </div>
    </div>
  );
};

export default YouthStudentImpactPage;
