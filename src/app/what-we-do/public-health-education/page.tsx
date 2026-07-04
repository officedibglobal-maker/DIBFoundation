'use client';

import { NextPage } from 'next';
import { BookText, Lightbulb, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const PublicHealthEducationPage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        Public Health Education & Awareness
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        Access to information remains one of the most powerful tools for improving health outcomes. DIBF champions public health education and awareness initiatives that encourage informed decision making and healthier communities.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8 text-center">
      <div className="bg-white p-8 rounded-xl shadow-md">
        <Lightbulb className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Informed Decision Making</h2>
        <p className="text-slate-700">
          We empower individuals and families with accurate, accessible health information, enabling them to make confident choices about their wellbeing.
        </p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <Users className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Healthier Communities</h2>
        <p className="text-slate-700">
          Our programs foster a culture of health awareness, addressing public health challenges through education and community engagement.
        </p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <BookText className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Greater Understanding</h2>
        <p className="text-slate-700">
          We work to increase the understanding of complex health issues, from chronic diseases to mental health, reducing stigma and promoting support.
        </p>
      </div>
    </div>

    <div className="mt-16 text-center bg-slate-50 p-10 rounded-xl">
        <h2 className="text-3xl font-bold mb-4">Explore Our Resources</h2>
        <p className="text-slate-700 max-w-3xl mx-auto mb-6">
            Discover articles, research, and publications from DIBF to learn more about our work and key health topics.
        </p>
        <div className="flex justify-center gap-4">
            <Button asChild>
                <Link href="/publications">View Publications</Link>
            </Button>
            <Button variant="outline" asChild>
                <Link href="/news/articles">Read Articles</Link>
            </Button>
        </div>
    </div>
  </div>
);

export default PublicHealthEducationPage;
