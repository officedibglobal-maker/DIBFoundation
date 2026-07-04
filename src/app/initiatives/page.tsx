'use client';

import { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const InitiativesPage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        Our Initiatives
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        DIBF's initiatives are designed to create sustainable impact in the communities we serve. Explore our key programs and discover how you can get involved.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-xl shadow-md group hover:bg-slate-50 transition-colors">
        <h2 className="text-2xl font-bold mb-2">The Tinewonsa Project</h2>
        <p className="text-slate-700 mb-4">Fostering a culture of sustainable giving and collective responsibility for lasting social impact.</p>
        <Button variant="outline" asChild>
          <Link href="/initiatives/tinewonsa-project">Learn More <ArrowRight className="ml-2 h-4 w-4"/></Link>
        </Button>
      </div>
       <div className="bg-white p-8 rounded-xl shadow-md group hover:bg-slate-50 transition-colors">
        <h2 className="text-2xl font-bold mb-2">Dollar-A-Day Campaign</h2>
        <p className="text-slate-700 mb-4">Supporting long-term healthcare priorities through the power of collective, everyday giving.</p>
        <Button variant="outline" asChild>
          <Link href="/campaigns/dollar-a-day">Learn More <ArrowRight className="ml-2 h-4 w-4"/></Link>
        </Button>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md group hover:bg-slate-50 transition-colors">
        <h2 className="text-2xl font-bold mb-2">DIBF African Field School</h2>
        <p className="text-slate-700 mb-4">An immersive platform for experiential learning, service, and cultural exchange across Africa.</p>
        <Button variant="outline" asChild>
          <Link href="/initiatives/dib-african-field-school">Learn More <ArrowRight className="ml-2 h-4 w-4"/></Link>
        </Button>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md group hover:bg-slate-50 transition-colors">
        <h2 className="text-2xl font-bold mb-2">DIBF Impact Store</h2>
        <p className="text-slate-700 mb-4">Transforming everyday purchases into opportunities for impact with purpose-driven products.</p>
        <Button variant="outline" asChild>
          <Link href="/impact-store">Shop Now <ArrowRight className="ml-2 h-4 w-4"/></Link>
        </Button>
      </div>
    </div>
  </div>
);

export default InitiativesPage;
