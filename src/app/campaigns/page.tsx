'use client';

import { NextPage } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Megaphone, ArrowRight } from 'lucide-react';

const CampaignsPage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <Megaphone className="mx-auto h-12 w-12 text-primary"/>
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-4">
        Our Campaigns
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        Join our efforts to create a healthier future for all. Your support for our campaigns makes a tangible difference.
      </p>
    </div>

    <div className="mt-12 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg transition-transform hover:scale-105">
            <h3 className="text-sm font-semibold text-primary tracking-wider uppercase mb-2">Featured Campaign</h3>
            <h2 className="text-3xl font-bold">Dollar-A-Day Campaign</h2>
            <p className="mt-2 text-slate-600 text-lg">
                For just $1 a day, you can provide essential healthcare to those in need. This campaign supports long-term priorities including cancer care, treatment access, and life-saving medical services for underserved communities.
            </p>
            <Button asChild className="mt-6">
                <Link href="/campaigns/dollar-a-day">Learn More & Donate <ArrowRight className="ml-2 h-4 w-4"/></Link>
            </Button>
        </div>
    </div>
    
     <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Support Our Mission</h2>
        <p className="text-slate-700 max-w-3xl mx-auto mb-6">
            There are many ways to contribute to our work. Find the best way for you to get involved.
        </p>
        <div className="flex justify-center gap-4">
            <Button variant="outline" asChild>
                <Link href="/campaigns">See All Campaigns</Link>
            </Button>
            <Button variant="outline" asChild>
                <Link href="/get-involved">More Ways to Give</Link>
            </Button>
        </div>
    </div>

  </div>
);

export default CampaignsPage;
