'use client';

import { NextPage } from 'next';
import Image from 'next/image';

const OurStoryPage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
     <div className="text-center mb-12">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-4">
        Our Story
      </h1>
       <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        From a shared vision to a global movement.
      </p>
    </div>

    <div className="max-w-4xl mx-auto">
         <Image 
            src="/images/founder.jpg" 
            alt="DIBF Founder"
            width={1000}
            height={500}
            className="rounded-xl mb-8"
        />
        <div className="prose lg:prose-xl max-w-full">
            <p>
            The Doctors in Business Foundation was born from a simple yet powerful idea: that the principles of business and innovation could be harnessed to solve some of the world’s most pressing health challenges. Our founder, Dr. Maxwell Ananeh-Firempong, a physician with a passion for social entrepreneurship, witnessed firsthand the gaps in healthcare delivery in his home country of Ghana. He saw a need for a new approach, one that combined medical expertise with a commitment to sustainable, community-driven solutions.
            </p>
            <p>
            In 2018, Dr. Ananeh-Firempong brought together a small group of like-minded physicians and business leaders to turn this vision into a reality. They started with a single medical outreach program in a remote village, providing essential health services and laying the groundwork for what would become the DIBF’s signature model of integrated health and development.
            </p>
            <p>
            Today, the DIBF has grown into a global organization with a diverse portfolio of programs and partnerships. But our core mission remains the same: to create a world where everyone has the opportunity to live a healthy and fulfilling life. We are a community of doctors, entrepreneurs, researchers, and volunteers, united by a shared belief in the power of partnership, innovation, and compassion to create lasting change.
            </p>
        </div>
    </div>

  </div>
);

export default OurStoryPage;
