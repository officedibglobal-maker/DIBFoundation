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
        A New Beginning: Bringing Healthcare to Rural Communities
      </h1>
      <p className="text-slate-500 mb-6">October 15, 2023</p>

      <Image 
        src="/images/outreach.jpg" 
        alt="Medical outreach in a rural community" 
        width={800}
        height={450}
        className="rounded-xl mb-8"
      />

      <div className="prose lg:prose-xl max-w-full">
        <p>
          In the heart of northern Ghana, where access to healthcare is a daily challenge, the Doctors in Business Foundation recently concluded a week-long medical outreach program that brought hope and healing to the community of Gbintiri and its surrounding villages. Over 500 individuals, many of whom had not seen a doctor in years, received free medical consultations, essential medicines, and health education.
        </p>
        <p>
          The outreach, organized in partnership with local community leaders and a team of dedicated volunteer healthcare professionals, addressed a wide range of health issues, from malaria and malnutrition to chronic conditions like hypertension and diabetes. For many, it was a lifeline. 
        </p>
        <blockquote>
          <p>"I have been suffering from this cough for months, but I could not afford to travel to the city to see a doctor. Today, you have brought the hospital to us. God bless you." - Adama, a community elder.</p>
        </blockquote>
        <p>
          The success of this outreach is a testament to the power of community and partnership. It is a powerful reminder that by working together, we can make a tangible difference in the lives of the most vulnerable. As we reflect on this rewarding experience, we are more committed than ever to our mission of ensuring accessible and equitable healthcare for all.
        </p>
      </div>

    </article>
  </div>
);

export default StoryPage;
