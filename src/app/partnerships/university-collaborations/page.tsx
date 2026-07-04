'use client';

import { NextPage } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, Book, FlaskConical } from 'lucide-react';

const UniversityCollaborationsPage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <GraduationCap className="mx-auto h-12 w-12 text-primary" />
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-4">
        University & Academic Collaborations
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        DIBF partners with universities and academic institutions to foster research, innovation, and learning. These collaborations are essential for developing evidence-based solutions and cultivating the next generation of global health leaders.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8 text-center">
      <div className="bg-white p-8 rounded-xl shadow-md">
        <FlaskConical className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Joint Research Initiatives</h2>
        <p className="text-slate-700">
          We collaborate on research projects that advance knowledge and inform policy and practice in global health and development.
        </p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <Book className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Experiential Learning</h2>
        <p className="text-slate-700">
           Through programs like the DIBF African Field School, we provide students with hands-on learning opportunities in a global context.
        </p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <GraduationCap className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Knowledge Exchange</h2>
        <p className="text-slate-700">
           We facilitate the exchange of knowledge and expertise between academic partners, communities, and practitioners.
        </p>
      </div>
    </div>

    <div className="mt-16 text-center bg-slate-50 p-10 rounded-xl">
      <h2 className="text-3xl font-bold mb-4">Explore the DIBF African Field School</h2>
      <p className="text-slate-700 max-w-3xl mx-auto mb-6">
        Our flagship program for university collaboration offers an immersive experience in global health and sustainable development. Learn more about how your institution can get involved.
      </p>
      <Button asChild size="lg">
        <Link href="/initiatives/dib-african-field-school">Learn More</Link>
      </Button>
    </div>
  </div>
);

export default UniversityCollaborationsPage;
