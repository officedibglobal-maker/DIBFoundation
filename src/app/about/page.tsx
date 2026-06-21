
"use client";

import * as React from 'react';
import { useFirestore } from '@/firebase/firestore/use-firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Users, Heart, Lightbulb, TrendingUp, Handshake } from 'lucide-react';

export default function AboutPage() {
  const { db } = useFirestore();

  // About Page Content
  const aboutRef = React.useMemo(() => db ? doc(db, 'heroSections', 'about') : null, [db]);
  const { data: hero } = useDoc(aboutRef);

  const whoWeAreRef = React.useMemo(() => db ? doc(db, 'siteContent', 'aboutWhoWeAre') : null, [db]);
  const { data: whoWeAre } = useDoc(whoWeAreRef);

  const values = [
    { icon: Heart, title: "Human Dignity", desc: "We value every person and uphold respect, compassion, and inclusion in all we do." },
    { icon: ShieldCheck, title: "Integrity", desc: "We act with transparency, accountability, and the highest ethical standards." },
    { icon: TrendingUp, title: "Sustainability", desc: "We pursue long-term solutions that create lasting value for communities." },
    { icon: Handshake, title: "Collaboration", desc: "We believe in the power of partnership and shared responsibility." },
    { icon: Lightbulb, title: "Innovation", desc: "We embrace creative solutions to address complex health challenges." },
    { icon: Users, title: "Empowerment", desc: "We empower individuals and communities to lead and create change." }
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-secondary text-white py-24 text-center">
        <div className="container mx-auto px-4 max-w-3xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">{hero?.heading || "About DIBF"}</h1>
          <p className="text-xl text-white/70 leading-relaxed">
            {hero?.body || "Doctors in Business Foundation | DIBF is the nonprofit and social impact arm of Doctors in Business Global."}
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <SectionHeader 
                title={whoWeAre?.title || "Who We Are"} 
                subtitle={whoWeAre?.subtitle || "DIBF was established to advance health equity, human dignity, and sustainable development."}
              />
              <p className="text-lg text-muted-foreground leading-relaxed">
                {whoWeAre?.description || "With a strong foundation in healthcare and a broader commitment to human development, DIBF supports initiatives that improve lives."}
              </p>
              <div className="bg-primary/5 p-8 rounded-2xl border-l-4 border-primary italic">
                <p className="text-xl text-secondary font-medium">
                  "Meaningful impact continues long after a single intervention has ended."
                </p>
              </div>
            </div>
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={whoWeAre?.imageUrl || "https://picsum.photos/seed/about-impact/800/1000"} 
                alt="Impact" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader title="Our Core Values" subtitle="The principles that guide every decision and project we undertake." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <Card key={i} className="h-full border-none shadow-lg hover:shadow-xl transition-all p-8 space-y-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <v.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-secondary">{v.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="leadership" className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center max-w-4xl space-y-12">
          <SectionHeader title="Strong Governance. Responsible Stewardship." subtitle="" />
          <p className="text-lg text-muted-foreground">
            DIBF is guided by a committed board and leadership team with diverse expertise in healthcare, development, research, business, and community engagement.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {["Independent Board Oversight", "Transparent Financials", "Ethical Operations", "Strategic Alliances"].map((b, i) => (
              <div key={i} className="p-4 bg-muted rounded-xl text-secondary font-bold text-sm uppercase tracking-wider">
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
