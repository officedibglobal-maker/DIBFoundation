'use client';

import { NextPage } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Globe, Users, Handshake } from 'lucide-react';

const GlobalCommunityPage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <Globe className="mx-auto h-12 w-12 text-primary" />
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-4">
        Global & Community Partnerships
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        Our work is grounded in the communities we serve. We partner with grassroots organizations, local leaders, and global allies who share our vision for a healthier, more equitable world.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8 text-center">
      <div className="bg-white p-8 rounded-xl shadow-md">
        <Users className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Community-Led Initiatives</h2>
        <p className="text-slate-700">
          We support and amplify the work of community-based organizations, ensuring that our interventions are locally relevant and sustainable.
        </p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <Handshake className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Building Local Capacity</h2>
        <p className="text-slate-700">
          We invest in the capacity of our local partners, empowering them to lead change in their own communities.
        </p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <Globe className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Global Solidarity</h2>
        <p className="text-slate-700">
          We build bridges between local communities and global partners, fostering a network of solidarity and shared purpose.
        </p>
      </div>
    </div>

    <div className="mt-16 text-center bg-slate-50 p-10 rounded-xl">
      <h2 className="text-3xl font-bold mb-4">Our Partners in the Field</h2>
      <p className="text-slate-700 max-w-3xl mx-auto mb-6">
        Learn more about the incredible organizations we work with on the ground.
      </p>
      <Button asChild size="lg">
        <Link href="/about-us/our-partners">Meet Our Partners</Link>
      </Button>
    </div>
  </div>
);

export default GlobalCommunityPage;
