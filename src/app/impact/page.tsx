'use client';

import { NextPage } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Target, CheckCircle, Heart, Users, BookOpen, FlaskConical, Globe, MessageSquare, Briefcase, Handshake } from 'lucide-react';

const coreFocusAreas = [
  { name: 'Health and Wellbeing', icon: Heart },
  { name: 'Community Development', icon: Users },
  { name: 'Youth Leadership and Empowerment', icon: Briefcase },
  { name: 'Mental Health Awareness', icon: MessageSquare },
  { name: 'Women and Family Support', icon: Handshake },
  { name: 'Education and Learning', icon: BookOpen },
  { name: 'Humanitarian Initiatives', icon: Globe },
  { name: 'Sustainable Giving', icon: CheckCircle },
  { name: 'Research and Knowledge Exchange', icon: FlaskConical },
  { name: 'Global Collaboration and Partnerships', icon: Globe },
];

const ImpactPage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <Target className="mx-auto h-12 w-12 text-primary"/>
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-4">
        Our Impact
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        DIBF is committed to creating measurable, sustainable impact across our core focus areas. Our work is driven by a deep understanding of the challenges communities face and a commitment to creating lasting change.
      </p>
    </div>

    <div>
      <h2 className="text-3xl font-bold text-center mb-8">Our Core Focus Areas</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
        {coreFocusAreas.map((area) => (
          <div key={area.name} className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
            <area.icon className="h-10 w-10 text-primary mb-3" />
            <h3 className="font-semibold text-slate-800 text-md">{area.name}</h3>
          </div>
        ))}
      </div>
    </div>
    
    <div className="mt-16 text-center bg-slate-50 p-10 rounded-xl">
      <h2 className="text-3xl font-bold mb-4">See Our Work in Action</h2>
      <p className="text-slate-700 max-w-3xl mx-auto mb-6">
        Explore our stories, reports, and publications to learn more about the impact we are making together with our partners and supporters.
      </p>
      <div className="flex justify-center gap-4">
        <Button asChild>
          <Link href="/impact/stories">Impact Stories</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/impact/outreach-reports">Outreach Reports</Link>
        </Button>
      </div>
    </div>

  </div>
);

export default ImpactPage;
