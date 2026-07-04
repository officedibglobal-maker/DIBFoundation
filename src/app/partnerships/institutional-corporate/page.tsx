'use client';

import { NextPage } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building, Handshake, Scaling } from 'lucide-react';

const InstitutionalCorporatePage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <Building className="mx-auto h-12 w-12 text-primary" />
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-4">
        Institutional & Corporate Partnerships
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        We collaborate with a wide range of institutions and corporations to leverage collective strengths, drive innovation, and scale impact. 
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8 text-center">
      <div className="bg-white p-8 rounded-xl shadow-md">
        <Handshake className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Shared Value Creation</h2>
        <p className="text-slate-700">
          Our partnerships are built on the principle of shared value, where social and business objectives align to create mutual benefits and drive sustainable growth.
        </p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <Scaling className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Scaling Impact</h2>
        <p className="text-slate-700">
          By working with established organizations, we can scale our initiatives to reach more communities and create broader, more lasting change.
        </p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <Building className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Corporate Social Responsibility</h2>
        <p className="text-slate-700">
          We help companies achieve their corporate social responsibility goals through meaningful engagement and impactful programs.
        </p>
      </div>
    </div>

    <div className="mt-16 text-center bg-slate-50 p-10 rounded-xl">
      <h2 className="text-3xl font-bold mb-4">Partner with Us</h2>
      <p className="text-slate-700 max-w-3xl mx-auto mb-6">
        If your organization is interested in exploring a partnership with DIBF, please contact us to learn more about collaboration opportunities.
      </p>
      <Button asChild size="lg">
        <Link href="/contact">Get in Touch</Link>
      </Button>
    </div>
  </div>
);

export default InstitutionalCorporatePage;
