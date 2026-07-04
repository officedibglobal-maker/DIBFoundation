'use client';

import { NextPage } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Users, Briefcase, Megaphone, ArrowRight } from 'lucide-react';

const GetInvolvedPage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <Heart className="mx-auto h-12 w-12 text-primary" />
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-4">
        Get Involved
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        There are many ways to join our mission and make a difference. Whether you give your time, your voice, or your resources, your contribution is vital to creating healthier communities.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
        <Heart className="h-8 w-8 text-primary mb-3"/>
        <h2 className="text-xl font-bold mb-2">Give</h2>
        <p className="text-slate-700 mb-4 flex-grow">Support our work with a one-time or recurring donation.</p>
        <Button variant="link" asChild className="self-start px-0">
            <Link href="/give">Donate Now <ArrowRight className="ml-2 h-4 w-4"/></Link>
        </Button>
      </div>
       <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
        <Users className="h-8 w-8 text-primary mb-3"/>
        <h2 className="text-xl font-bold mb-2">Volunteer</h2>
        <p className="text-slate-700 mb-4 flex-grow">Lend your skills and passion to our programs and events.</p>
         <Button variant="link" asChild className="self-start px-0">
            <Link href="/get-involved/volunteer">Find Opportunities <ArrowRight className="ml-2 h-4 w-4"/></Link>
        </Button>
      </div>
       <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
        <Briefcase className="h-8 w-8 text-primary mb-3"/>
        <h2 className="text-xl font-bold mb-2">Careers</h2>
        <p className="text-slate-700 mb-4 flex-grow">Join our team and build a career in global health and social impact.</p>
         <Button variant="link" asChild className="self-start px-0">
            <Link href="/get-involved/careers">View Openings <ArrowRight className="ml-2 h-4 w-4"/></Link>
        </Button>
      </div>
       <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
        <Megaphone className="h-8 w-8 text-primary mb-3"/>
        <h2 className="text-xl font-bold mb-2">Support a Campaign</h2>
        <p className="text-slate-700 mb-4 flex-grow">Contribute to one of our specific fundraising campaigns.</p>
         <Button variant="link" asChild className="self-start px-0">
            <Link href="/get-involved/support-a-campaign">Explore Campaigns <ArrowRight className="ml-2 h-4 w-4"/></Link>
        </Button>
      </div>
    </div>

  </div>
);

export default GetInvolvedPage;
