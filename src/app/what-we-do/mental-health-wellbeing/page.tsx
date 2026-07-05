
import { getSitePageBySlug } from "@/lib/firebase/firestore/getSitePageBySlug";
import { SitePageRenderer } from "@/components/site/SitePageRenderer";
import { NextPage } from 'next';
import { Heart, Users, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const MentalHealthPage: NextPage = async () => {
  const page = await getSitePageBySlug("what-we-do-mental-health-wellbeing");

  if (page && page.status === "published") {
    return <SitePageRenderer page={page} />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Mental Health & Wellbeing
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
          DIBF is committed to promoting mental health and wellbeing in communities through awareness, advocacy, and support for accessible, culturally sensitive mental healthcare. We believe that mental health is a fundamental component of overall health and human dignity.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 text-center">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <Heart className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Promoting Awareness</h2>
          <p className="text-slate-700">
            We work to reduce stigma and increase understanding of mental health through community campaigns, educational workshops, and open conversations.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md">
          <Users className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Community-Centered Support</h2>
          <p className="text-slate-700">
            Our approach is rooted in community. We support initiatives that provide culturally relevant mental health resources and create safe spaces for dialogue and healing.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md">
          <MessageSquare className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Advocacy for Accessible Care</h2>
          <p className="text-slate-700">
            We advocate for policies and programs that improve access to quality mental healthcare for all, particularly in underserved communities.
          </p>
        </div>
      </div>

      <div className="mt-16 text-center bg-slate-50 p-10 rounded-xl">
        <h2 className="text-3xl font-bold mb-4">Join the Conversation</h2>
        <p className="text-slate-700 max-w-3xl mx-auto mb-6">
          Your voice matters in the movement for mental health. Get involved to help us create a world where everyone has the support they need to thrive.
        </p>
        <Button asChild size="lg">
          <Link href="/get-involved">Support Our Work</Link>
        </Button>
      </div>
    </div>
  );
};

export default MentalHealthPage;
