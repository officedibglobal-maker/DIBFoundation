'use client';

import { NextPage } from 'next';
import Image from 'next/image';

const partners = [
    { name: "University of Toronto", logoUrl: "/logos/uoft.png"},
    { name: "The MasterCard Foundation", logoUrl: "/logos/mastercard.png" },
    { name: "Grand Challenges Canada", logoUrl: "/logos/gcc.png" },
    { name: "Ghana Health Service", logoUrl: "/logos/ghs.png" },
    { name: "SickKids Centre for Global Child Health", logoUrl: "/logos/sickkids.png"},
    { name: "MaRS Discovery District", logoUrl: "/logos/mars.png" }
]

const OurPartnersPage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
     <div className="text-center mb-12">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-4">
        Our Partners
      </h1>
       <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        We are grateful for the collaboration and support of our partners, who make our work possible. Together, we are stronger.
      </p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center">
        {partners.map(partner => (
            <div key={partner.name} className="flex justify-center">
                 <Image 
                    src={partner.logoUrl}
                    alt={partner.name}
                    width={200}
                    height={100}
                    className="object-contain"
                />
            </div>
        ))}
    </div>

  </div>
);

export default OurPartnersPage;
