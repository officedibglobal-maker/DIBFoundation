'use client';

import { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Users, Book, Handshake, Target } from 'lucide-react';

const AboutUsPage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <Users className="mx-auto h-12 w-12 text-primary" />
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-4">
        About the Doctors in Business Foundation
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        The Doctors in Business Foundation is a global non-profit organization dedicated to improving health and well-being in underserved communities through medical outreach, research, and sustainable development.
      </p>
    </div>

    <div className="relative mb-12">
         <Image 
            src="/images/team-photo.jpg" 
            alt="DIBF Team"
            width={1200}
            height={600}
            className="rounded-xl"
        />
    </div>

    <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission & Vision</h2>
            <div className="space-y-4">
                <div className="flex">
                    <Target className="h-8 w-8 text-primary mr-4 mt-1"/>
                    <div>
                        <h3 className="font-bold text-lg">Our Mission</h3>
                        <p className="text-slate-700">To create sustainable health and development solutions in partnership with communities, guided by research and a commitment to equity.</p>
                    </div>
                </div>
                <div className="flex">
                     <Target className="h-8 w-8 text-primary mr-4 mt-1"/>
                     <div>
                        <h3 className="font-bold text-lg">Our Vision</h3>
                        <p className="text-slate-700">A world where everyone, regardless of their circumstances, has the opportunity to live a healthy and fulfilling life.</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
            <Link href="/about-us/our-story" className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                <Book className="mx-auto h-10 w-10 text-primary mb-3"/>
                <h3 className="font-bold text-lg">Our Story</h3>
            </Link>
            <Link href="/about-us/our-team" className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                <Users className="mx-auto h-10 w-10 text-primary mb-3"/>
                <h3 className="font-bold text-lg">Our Team</h3>
            </Link>
             <Link href="/about-us/our-partners" className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                <Handshake className="mx-auto h-10 w-10 text-primary mb-3"/>
                <h3 className="font-bold text-lg">Our Partners</h3>
            </Link>
             <Link href="/impact/outreach-reports" className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                <Target className="mx-auto h-10 w-10 text-primary mb-3"/>
                <h3 className="font-bold text-lg">Our Impact</h3>
            </Link>
        </div>
    </div>

  </div>
);

export default AboutUsPage;
