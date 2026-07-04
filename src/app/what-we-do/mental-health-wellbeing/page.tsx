'use client';

import { NextPage } from 'next';
import { Heart, Users, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const MentalHealthPage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        Mental Health & Youth Wellbeing
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        DIBF supports conversations and initiatives that promote mental wellbeing, resilience, and inclusion. Stronger communities are built when individuals are empowered to thrive emotionally, socially, and mentally.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8 text-center">
      <div className="bg-white p-8 rounded-xl shadow-md">
        <MessageSquare className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Promoting Conversations</h2>
        <p className="text-slate-700">
          We work to break the stigma surrounding mental health by creating safe spaces for open dialogue and sharing personal stories.
        </p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <Heart className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Fostering Resilience</h2>
        <p className="text-slate-700">
          Our initiatives provide young people with tools and resources to build emotional resilience and navigate life's challenges.
        </p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <Users className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Building Inclusive Communities</h2>
        <p className="text-slate-700">
          We advocate for inclusive environments where every young person feels seen, heard, and supported.
        </p>
      </div>
    </div>

    <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Get Involved</h2>
        <p className="text-slate-700 max-w-3xl mx-auto mb-6">
            Support our mission to promote mental health and wellbeing for youth in our communities.
        </p>
        <Button asChild>
            <Link href="/give">Donate Now</Link>
        </Button>
    </div>
  </div>
);

export default MentalHealthPage;
