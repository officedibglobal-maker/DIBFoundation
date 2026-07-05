
import { getSitePageBySlug } from "@/lib/firebase/firestore/getSitePageBySlug";
import { SitePageRenderer } from "@/components/site/SitePageRenderer";
import { NextPage } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, ArrowRight } from 'lucide-react';

const jobOpenings = [
    {
        title: "Program Manager, Global Health",
        location: "Accra, Ghana (Hybrid)",
        description: "We are seeking an experienced Program Manager to oversee our global health portfolio. The ideal candidate will have a strong background in public health, project management, and community engagement.",
        link: "/careers/program-manager-global-health"
    },
    {
        title: "Communications Officer",
        location: "Remote",
        description: "Join our communications team to help tell the story of our impact. The Communications Officer will be responsible for creating content, managing social media, and supporting our outreach efforts.",
        link: "/careers/communications-officer"
    },
    {
        title: "Development and Partnerships Lead",
        location: "Toronto, Canada (Hybrid)",
        description: "We are looking for a strategic and relational Development and Partnerships Lead to grow our funding base and cultivate relationships with key partners.",
        link: "/careers/development-partnerships-lead"
    }
]

const CareersPage: NextPage = async () => {
  const page = await getSitePageBySlug("get-involved-careers");

  if (page && page.status === "published") {
    return <SitePageRenderer page={page} />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Briefcase className="mx-auto h-12 w-12 text-primary" />
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-4">
          Careers at DIBF
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
          Join a passionate team dedicated to creating lasting social impact. At DIBF, you will have the opportunity to use your skills and expertise to address some of the world’s most pressing health challenges.
        </p>
      </div>

      <div>
          <h2 className="text-3xl font-bold mb-8 text-center">Current Openings</h2>
          <div className="space-y-6 max-w-4xl mx-auto">
              {jobOpenings.map(job => (
                  <div key={job.title} className="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row">
                      <div className="flex-grow">
                          <h3 className="text-xl font-bold">{job.title}</h3>
                          <div className="flex items-center text-slate-600 mt-1">
                              <MapPin className="h-4 w-4 mr-2"/>
                              <span>{job.location}</span>
                          </div>
                          <p className="text-slate-700 mt-2">{job.description}</p>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-6 flex items-center">
                           <Button asChild>
                              <Link href={job.link}>View Details <ArrowRight className="ml-2 h-4 w-4"/></Link>
                          </Button>
                      </div>
                  </div>
              ))}
          </div>
      </div>
      
      <div className="mt-16 text-center bg-slate-50 p-10 rounded-xl">
          <h2 className="text-3xl font-bold mb-4">Don't See a Fit?</h2>
          <p className="text-slate-700 max-w-3xl mx-auto mb-6">
              We are always looking for talented and passionate individuals to join our team. If you are interested in working with us but don't see a current opening that matches your profile, please send us your resume.
          </p>
          <Button asChild variant="outline">
              <Link href="/contact?subject=General%20Application">Submit Your Resume</Link>
          </Button>
      </div>

    </div>
  );
};

export default CareersPage;
