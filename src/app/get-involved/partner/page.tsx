
import { getSitePageBySlug } from "@/lib/firebase/firestore/getSitePageBySlug";
import { SitePageRenderer } from "@/components/site/SitePageRenderer";
import { NextPage } from 'next';
import { Handshake, Heart, TrendingUp } from 'lucide-react';
import { PartnershipProposalTool } from '@/components/ai/PartnershipProposalTool';

const PartnerPage: NextPage = async () => {
  const page = await getSitePageBySlug("get-involved-partner");

  if (page && page.status === "published") {
    return <SitePageRenderer page={page} />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Partner With Us
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
          Together, we can create lasting impact. DIBF is committed to building meaningful partnerships with organizations that share our vision for a healthier, more equitable world.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 text-center mb-16">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <Handshake className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Shared Vision</h2>
          <p className="text-slate-700">
            We align with partners who are committed to social responsibility, sustainable development, and community-centered impact.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md">
          <TrendingUp className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Measurable Impact</h2>
          <p className="text-slate-700">
            Our partnerships are designed to deliver tangible results, with clear metrics and transparent reporting to track our collective progress.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md">
          <Heart className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Lasting Change</h2>
          <p className="text-slate-700">
            We believe in creating sustainable change that extends beyond short-term interventions, fostering long-term resilience and wellbeing.
          </p>
        </div>
      </div>

      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Let&apos;s Start the Conversation</h2>
          <p className="mt-2 text-lg text-slate-600 max-w-2xl mx-auto">
            Use our AI-powered tool to generate a partnership proposal and begin the process of collaborating with DIBF.
          </p>
        </div>
        <PartnershipProposalTool />
      </div>
    </div>
  );
};

export default PartnerPage;
