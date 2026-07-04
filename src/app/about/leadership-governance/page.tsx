'use client';

import { NextPage } from 'next';
import { Shield, Users, GitCommit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const LeadershipGovernancePage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        Leadership & Governance
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        Committed to responsible leadership, ethical service, and transparent governance in every aspect of our work.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8 text-center">
      <div className="bg-white p-8 rounded-xl shadow-md">
        <Shield className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Ethical Service</h2>
        <p className="text-slate-700">
          Our actions are guided by a deep respect for the dignity and wellbeing of the communities we serve. We are committed to the highest standards of integrity and ethical conduct.
        </p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <Users className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Community-Centered Impact</h2>
        <p className="text-slate-700">
          We believe in a community-led approach. Our governance ensures that our initiatives are culturally sensitive, locally relevant, and create sustainable, long-term value.
        </p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <GitCommit className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Transparent Accountability</h2>
        <p className="text-slate-700">
          We are accountable to our partners, donors, and the communities we serve. Our governance model prioritizes transparency in our operations, finances, and impact reporting.
        </p>
      </div>
    </div>
    <div className="mt-16 text-center bg-slate-50 p-10 rounded-xl">
        <h2 className="text-3xl font-bold mb-4">Partnership Accountability</h2>
        <p className="text-slate-700 max-w-3xl mx-auto mb-6">
            Our partnerships are built on mutual respect and shared purpose. We are committed to upholding our responsibilities and ensuring that our collaborations are effective, equitable, and aligned with our mission.
        </p>
        <Button asChild size="lg">
            <Link href="/partnerships">Learn About Our Partnerships</Link>
        </Button>
    </div>
  </div>
);

export default LeadershipGovernancePage;
