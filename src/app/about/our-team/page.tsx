
"use client";

import { NextPage } from "next";
import { useEffect, useState } from "react";
import { TeamMember } from "@/lib/models/team-members";
import Image from "next/image";
import { Users } from "lucide-react";

const OurTeamPage: NextPage = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      const res = await fetch("/api/team-members");
      const data = await res.json();
      setTeamMembers(data);
    };
    fetchTeamMembers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Users className="mx-auto h-12 w-12 text-primary" />
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-4">
          Our Team
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
          Meet the dedicated individuals who are committed to making a difference.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
            <Image
              src={member.image}
              alt={member.name}
              width={150}
              height={150}
              className="rounded-full mb-4"
            />
            <h3 className="text-xl font-bold text-slate-800">{member.name}</h3>
            <p className="text-slate-600">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurTeamPage;
