'use client';

import { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase, BookOpen, Globe, Users } from 'lucide-react';

const DibAfricanFieldSchoolPage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        Doctors in Business African Field School
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        The Doctors in Business African Field School is a platform for experiential learning, service, cultural exchange, and meaningful engagement across Africa. It brings together students, researchers, institutions, and global partners to foster a deeper understanding of health, sustainable development, leadership, and social impact.
      </p>
    </div>

    <div className="grid md:grid-cols-4 gap-8 text-center">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <BookOpen className="mx-auto h-10 w-10 text-primary mb-4" />
        <h2 className="text-xl font-bold mb-2">Experiential Learning</h2>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <Briefcase className="mx-auto h-10 w-10 text-primary mb-4" />
        <h2 className="text-xl font-bold mb-2">Community-Centered Service</h2>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <Globe className="mx-auto h-10 w-10 text-primary mb-4" />
        <h2 className="text-xl font-bold mb-2">Cultural Exchange</h2>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <Users className="mx-auto h-10 w-10 text-primary mb-4" />
        <h2 className="text-xl font-bold mb-2">Global Partnership</h2>
      </div>
    </div>

    <div className="mt-16 text-center bg-slate-50 p-10 rounded-xl">
        <h2 className="text-3xl font-bold mb-4">An Immersive Experience</h2>
        <p className="text-slate-700 max-w-3xl mx-auto mb-6">
            The Field School offers a unique opportunity to learn directly from communities, engage with local experts, and collaborate on projects that address real-world challenges. It is a transformative experience for anyone interested in global health, sustainable development, and social impact.
        </p>
        <Button asChild size="lg">
            <Link href="/partnerships/university-collaborations">Learn About University Collaborations</Link>
        </Button>
    </div>
  </div>
);

export default DibAfricanFieldSchoolPage;
