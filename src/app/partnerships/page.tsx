'use client';

import { NextPage } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Handshake, Building, GraduationCap, Globe } from 'lucide-react';

const partnerships = [
  {
    name: 'Institutional & Corporate',
    description: 'Collaborating with organizations to drive large-scale impact.',
    link: '/partnerships/institutional-corporate',
    icon: Building,
  },
  {
    name: 'University Collaborations',
    description: 'Partnering with academic institutions to foster research, learning, and innovation.',
    link: '/partnerships/university-collaborations',
    icon: GraduationCap,
  },
  {
    name: 'Global & Community Partners',
    description: 'Working with grassroots organizations and global partners to create change.',
    link: '/partnerships/global-community',
    icon: Globe,
  },
];

const PartnershipsPage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <Handshake className="mx-auto h-12 w-12 text-primary" />
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-4">
        Partnerships
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        Partnership is at the heart of our work. DIBF believes in the power of collaboration to achieve shared goals and create a greater, more sustainable impact than any single organization could achieve alone.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8 text-center">
      {partnerships.map((p) => (
        <div key={p.name} className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center">
          <p.icon className="h-12 w-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">{p.name}</h2>
          <p className="text-slate-700 mb-4 flex-grow">{p.description}</p>
          <Button variant="link" asChild>
            <Link href={p.link}>Learn More</Link>
          </Button>
        </div>
      ))}
    </div>
    
    <div className="mt-16 text-center bg-slate-50 p-10 rounded-xl">
        <h2 className="text-3xl font-bold mb-4">Become a Partner</h2>
        <p className="text-slate-700 max-w-3xl mx-auto mb-6">
            We are always seeking new partners who share our commitment to creating a healthier, more equitable world. If your organization is interested in collaborating with us, we would love to hear from you.
        </p>
        <Button asChild size="lg">
            <Link href="/contact">Partner With Us</Link>
        </Button>
    </div>

  </div>
);

export default PartnershipsPage;
