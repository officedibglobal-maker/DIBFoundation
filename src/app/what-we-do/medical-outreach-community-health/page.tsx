'use client';

import { NextPage } from 'next';
import { Stethoscope, BookOpen, Users, Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const MedicalOutreachPage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        Medical Outreach & Community Health
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        DIBF supports health initiatives that improve access to care, promote preventive health practices, and contribute to healthier communities. Through collaborative and community-centered approaches, we work to address health challenges while supporting long-term wellbeing.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-xl shadow-md">
        <Stethoscope className="h-10 w-10 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Improving Access to Care</h2>
        <p className="text-slate-700">
          We partner with local healthcare providers and community organizations to bring medical services to underserved populations, ensuring that more people have access to the care they need.
        </p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <BookOpen className="h-10 w-10 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Promoting Preventive Health</h2>
        <p className="text-slate-700">
          We believe in the power of prevention. Our outreach programs include health screenings, workshops, and awareness campaigns to empower individuals with the knowledge to lead healthier lives.
        </p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <Users className="h-10 w-10 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Community-Centered Approach</h2>
        <p className="text-slate-700">
          Our initiatives are designed with the community, for the community. We listen to local needs and collaborate with community leaders to create programs that are relevant and sustainable.
        </p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <Heart className="h-10 w-10 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Supporting Long-Term Wellbeing</h2>
        <p className="text-slate-700">
          Beyond immediate medical care, we are committed to fostering long-term health and wellbeing. Our work aims to improve the quality of life for individuals and families in the communities we serve.
        </p>
      </div>
    </div>

    <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Related Links</h2>
        <div className="flex justify-center gap-4">
            <Button variant="outline" asChild>
                <Link href="/what-we-do/public-health-education">Public Health Education</Link>
            </Button>
            <Button variant="outline" asChild>
                <Link href="/impact/outreach-reports">Outreach Reports</Link>
            </Button>
        </div>
    </div>
  </div>
);

export default MedicalOutreachPage;
