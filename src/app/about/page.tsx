'use client';

import { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const AboutPage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        Advancing Health, Human Dignity, and Sustainable Development
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        Doctors in Business Foundation (DIBF) is the nonprofit and social impact arm of Doctors in Business Global, dedicated to advancing health equity, community wellbeing, and sustainable humanitarian interventions across Africa and underserved communities globally.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
        <p className="text-slate-700 mb-4">
          DIBF is a health and community development foundation dedicated to transforming shared responsibility into meaningful action that strengthens communities and creates lasting impact.
        </p>
        <p className="text-slate-700 mb-4">
          With a strong foundation in healthcare and a broader commitment to human development, we support initiatives that improve lives, expand opportunities, and contribute to healthier, more resilient, and more sustainable communities.
        </p>
        <Button asChild>
          <Link href="/about/mission-vision">Our Mission & Vision</Link>
        </Button>
      </div>
      <div>
        <h2 className="text-3xl font-bold mb-4">Why DIBF?</h2>
        <p className="text-slate-700 mb-4">
          DIBF stands as a trusted platform for health, humanitarian service, sustainable giving, education, and community-centered impact. Our work is shaped by healthcare knowledge, social responsibility, and deep respect for the communities we serve.
        </p>
        <p className="text-slate-700 mb-4">
          We believe that impact is strongest when it is shared, sustainable, and rooted in genuine partnership. Every initiative is approached with the intention to create value that lasts and strengthens human dignity.
        </p>
        <Button variant="outline" asChild>
          <Link href="/get-involved/partner">Partner With Us</Link>
        </Button>
      </div>
    </div>
  </div>
);

export default AboutPage;
