'use client';

import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const StoryPage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
    <article className="max-w-3xl mx-auto">
        <div className="mb-8">
            <Button variant="outline" asChild>
                <Link href="/news"> 
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Back to News
                </Link>
            </Button>
        </div>

      <h1 className="text-4xl font-extrabold tracking-tight mb-4">
        Empowering Youth: The Story of the DIBF Leadership Workshop
      </h1>
      <p className="text-slate-500 mb-6">October 20, 2023</p>

       <Image 
        src="/images/youth-workshop.jpg" 
        alt="Youth leadership workshop" 
        width={800}
        height={450}
        className="rounded-xl mb-8"
      />

      <div className="prose lg:prose-xl max-w-full">
        <p>
          The future of our communities lies in the hands of our youth. That's the belief that drives the Doctors in Business Foundation's new Youth Leadership Program, which recently held its inaugural workshop in Accra. The program brought together 50 young people from diverse backgrounds for a weekend of intensive training in leadership, communication, and community organizing.
        </p>
        <p>
          Facilitated by a team of experienced mentors and community leaders, the workshop provided a platform for participants to explore their potential, develop their skills, and connect with like-minded peers. Through a series of interactive sessions, group activities, and personal reflections, the young leaders of tomorrow began to find their voice.
        </p>
         <blockquote>
          <p>"I used to think leadership was about being in charge. Now I see it's about service, about listening, and about empowering others." - Akosua, a workshop participant.</p>
        </blockquote>
        <p>
          The workshop is just the beginning. The participants will now go on to lead their own community service projects, with ongoing mentorship and support from DIBF. We are excited to see the incredible things these young leaders will achieve.
        </p>
      </div>

    </article>
  </div>
);

export default StoryPage;
