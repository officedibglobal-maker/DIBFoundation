
import { getSitePageBySlug } from "@/lib/firebase/firestore/getSitePageBySlug";
import { SitePageRenderer } from "@/components/site/SitePageRenderer";
import { NextPage } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Megaphone, Heart } from 'lucide-react';

const SupportCampaignPage: NextPage = async () => {
  const page = await getSitePageBySlug("get-involved-support-a-campaign");

  if (page && page.status === "published") {
    return <SitePageRenderer page={page} />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Megaphone className="mx-auto h-12 w-12 text-primary" />
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-4">
          Support a Campaign
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
          Your contribution to a specific campaign can make a targeted impact on the issues you care about most. Explore our active campaigns and join us in making a difference.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-md">
            <Heart className="h-10 w-10 text-primary mb-4"/>
            <h2 className="text-2xl font-bold mb-2">Mental Health & Youth Wellbeing Fund</h2>
            <p className="text-slate-700 mb-4">Support programs that promote mental health education, resilience, and access to care for young people.</p>
             <Button asChild>
                <Link href="/give?campaign=mental-health">Donate Now</Link>
            </Button>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md">
            <Heart className="h-10 w-10 text-primary mb-4"/>
            <h2 className="text-2xl font-bold mb-2">African Field School Scholarship Fund</h2>
            <p className="text-slate-700 mb-4">Help provide students with the opportunity to participate in our immersive learning program in Africa.</p>
            <Button asChild>
                <Link href="/give?campaign=field-school">Donate Now</Link>
            </Button>
        </div>
      </div>

    </div>
  );
};

export default SupportCampaignPage;
