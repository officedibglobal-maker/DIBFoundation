'use client';

import { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Gift } from 'lucide-react';

const TinewonsaProjectPage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <Gift className="mx-auto h-16 w-16 text-primary mb-4" />
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        The Tinewonsa Project
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        The Tinewonsa Project reflects DIBF’s commitment to fostering a culture of sustainable giving and collective responsibility. Through this initiative, individuals, institutions, and communities are provided meaningful opportunities to contribute toward causes that improve lives, strengthen communities, and contribute to lasting social impact.
      </p>
    </div>

    <div className="bg-slate-50 p-10 rounded-xl text-center">
        <h2 className="text-3xl font-bold mb-4">A Culture of Collective Responsibility</h2>
        <p className="text-slate-700 max-w-3xl mx-auto mb-6">
            'Tinewonsa' means 'we are all in this together,' and this spirit of unity is the foundation of the project. It is a call to action for everyone to play a part in creating a better future. By providing a platform for giving, we empower every person to become an agent of change.
        </p>
        <Button asChild size="lg">
            <Link href="/give">Contribute to a Cause</Link>
        </Button>
    </div>
  </div>
);

export default TinewonsaProjectPage;
