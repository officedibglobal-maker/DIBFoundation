'use client';

import { NextPage } from 'next';
import { Gift, Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const SustainableGivingPage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        Sustainable Giving Initiatives
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        DIBF fosters a culture of sustainable giving and collective responsibility through meaningful opportunities to contribute toward causes that improve lives and create lasting impact.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8 text-center">
      <div className="bg-white p-8 rounded-xl shadow-md">
        <Gift className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">The Tinewonsa Project</h2>
        <p className="text-slate-700">
          Our flagship initiative providing meaningful opportunities for individuals and institutions to contribute to lasting social impact.
        </p>
        <Button variant="link" asChild><Link href="/initiatives/tinewonsa-project">Learn More</Link></Button>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <Heart className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Dollar-A-Day Campaign</h2>
        <p className="text-slate-700">
          Harnessing the power of collective generosity to support long-term healthcare priorities through everyday giving.
        </p>
        <Button variant="link" asChild><Link href="/campaigns/dollar-a-day">Learn More</Link></Button>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <ShoppingCart className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">DIBF Impact Store</h2>
        <p className="text-slate-700">
          Transforming everyday purchases into opportunities for impact through purpose-driven products and awareness initiatives.
        </p>
        <Button variant="link" asChild><Link href="/impact-store">Shop Now</Link></Button>
      </div>
    </div>

    <div className="mt-16 text-center bg-slate-50 p-10 rounded-xl">
        <h2 className="text-3xl font-bold mb-4">Your Contribution Matters</h2>
        <p className="text-slate-700 max-w-3xl mx-auto mb-6">
            Every donation, no matter the size, contributes to a healthier, more equitable future for communities across Africa and beyond. 
        </p>
        <Button asChild size="lg">
            <Link href="/give">Give Today</Link>
        </Button>
    </div>
  </div>
);

export default SustainableGivingPage;
