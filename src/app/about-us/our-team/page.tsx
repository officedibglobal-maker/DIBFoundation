'use client';

import { NextPage } from 'next';
import Image from 'next/image';

const teamMembers = [
    {
        name: "Dr. Maxwell Ananeh-Firempong",
        role: "Founder & Executive Director",
        imageUrl: "/images/team/maxwell.jpg"
    },
    {
        name: "Dr. Ama Koranteng",
        role: "Director of Programs",
        imageUrl: "/images/team/ama.jpg"
    },
    {
        name: "Mr. Kofi A. Boateng",
        role: "Director of Finance & Operations",
        imageUrl: "/images/team/kofi.jpg"
    },
    {
        name: "Ms. Yaa Asantewaa",
        role: "Communications Lead",
        imageUrl: "/images/team/yaa.jpg"
    },
     {
        name: "Dr. Chinwe Eze",
        role: "Research & Evaluation Lead",
        imageUrl: "/images/team/chinwe.jpg"
    },
     {
        name: "Mr. Omar Hassan",
        role: "Partnerships Coordinator",
        imageUrl: "/images/team/omar.jpg"
    }
]

const OurTeamPage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
     <div className="text-center mb-12">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-4">
        Meet Our Team
      </h1>
       <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        We are a diverse team of dedicated professionals from various backgrounds, united by a common goal to make a positive impact.
      </p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {teamMembers.map(member => (
            <div key={member.name} className="text-center">
                <Image 
                    src={member.imageUrl}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-primary">{member.role}</p>
            </div>
        ))}
    </div>

  </div>
);

export default OurTeamPage;
