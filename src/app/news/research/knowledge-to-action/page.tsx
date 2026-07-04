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
        From Knowledge to Action: A Researcher's Journey with DIBF
      </h1>
      <p className="text-slate-500 mb-6">November 5, 2023</p>

       <Image 
        src="/images/research-journey.jpg" 
        alt="Researcher working in a lab" 
        width={800}
        height={450}
        className="rounded-xl mb-8"
      />

      <div className="prose lg:prose-xl max-w-full">
        <p>
          For Dr. Evelyn Addo, a public health researcher, the partnership with the Doctors in Business Foundation has been transformative. Her research, which focuses on maternal health in underserved communities, has always been driven by a desire to make a real-world impact. But it was through her collaboration with DIBF that she was able to bridge the gap between research and practice.
        </p>
        <p>
          Working closely with DIBF's field team, Dr. Addo was able to gain invaluable insights into the lived realities of the women she was studying. This community-engaged approach not only enriched her research but also ensured that her findings were directly relevant to the needs of the community. 
        </p>
         <blockquote>
          <p>"As a researcher, it's easy to get lost in the data. DIBF helped me to see the faces behind the numbers, to understand the stories behind the statistics. It has profoundly changed the way I approach my work." - Dr. Evelyn Addo</p>
        </blockquote>
        <p>
          Dr. Addo's research has since been published in a leading academic journal and has been instrumental in shaping DIBF's maternal health strategy. Her story is a powerful example of how collaboration between researchers and practitioners can lead to evidence-based solutions that save lives.
        </p>
      </div>

    </article>
  </div>
);

export default StoryPage;
