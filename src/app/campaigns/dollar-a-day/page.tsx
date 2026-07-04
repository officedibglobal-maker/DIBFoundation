'use client';

import { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import { Heart, Target, FlaskConical } from 'lucide-react';
import Link from 'next/link';

const DollarADayPage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        Dollar-A-Day Campaign
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        The Dollar-A-Day Campaign reflects the power of collective generosity. Through everyday giving, the initiative supports long-term healthcare priorities that strengthen health systems and improve lives across underserved communities.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8 text-center">
      <div className="bg-white p-8 rounded-xl shadow-md">
        <Heart className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Cancer Care & Research</h2>
        <p className="text-slate-700">
          Your contribution helps fund vital cancer research and provides care for patients in underserved areas.
        </p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <Target className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Life-Saving Treatment Access</h2>
        <p className="text-slate-700">
          We work to ensure that everyone has access to the treatments they need to survive and thrive.
        </p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <FlaskConical className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Healthcare Innovations</h2>
        <p className="text-slate-700">
          Support the development and implementation of innovative solutions that strengthen healthcare systems.
        </p>
      </div>
    </div>

    <div className="mt-16 text-center bg-primary text-white p-10 rounded-xl">
        <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
        <p className="max-w-3xl mx-auto mb-6">
            For just $1 a day, you can be a part of a community that is making a lasting difference in the lives of people across Africa and beyond. Your recurring gift provides a steady stream of support for our most critical healthcare initiatives.
        </p>
        <Button asChild size="lg" variant="secondary">
            <Link href="/give">Give $1 a Day</Link>
        </Button>
    </div>
  </div>
);

export default DollarADayPage;
