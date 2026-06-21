
import { Hero } from '@/components/home/Hero';
import { FeaturedStory } from '@/components/home/FeaturedStory';
import { WhatWeDoGrid } from '@/components/home/WhatWeDoGrid';
import { ImpactStats } from '@/components/home/ImpactStats';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, Handshake, Heart, ShieldCheck } from 'lucide-react';
import { getDocuments } from '@/lib/firestore/server';
import { COLLECTIONS } from '@/lib/firestore/collections';
import { Initiative, Stat } from '@/types/firestore';
import { orderBy } from 'firebase/firestore';

export default async function HomePage() {
  const initiatives = await getDocuments<Initiative>(COLLECTIONS.initiatives, [orderBy("order", "asc")]);
  const stats = await getDocuments<Stat>(COLLECTIONS.impactStats, [orderBy("order", "asc")]);

  return (
    <div className="space-y-0">
      <Hero />
      <FeaturedStory />
      <WhatWeDoGrid />

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Our Initiatives" 
            subtitle="Strategic programs designed to create lasting transformation in healthcare and community development."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {initiatives.map((item, idx) => (
              <Link href="/initiatives" key={item.id || idx} className="group h-full">
                <div className="h-full border-none shadow-lg group-hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col relative min-h-[400px] rounded-lg">
                  <Image 
                    src={item.imageUrl || `https://picsum.photos/seed/init-${idx}/600/800`} 
                    alt={item.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 space-y-2 text-white w-full">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-sm text-white/70 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {item.summary}
                    </p>
                    <div className="pt-2">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-accent transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild variant="outline" className="rounded-full px-10 h-12 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all">
              <Link href="/initiatives">View All Initiatives</Link>
            </Button>
          </div>
        </div>
      </section>

      <ImpactStats stats={stats} />

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold text-secondary font-headline leading-tight">
                  Stronger Together. Greater Impact.
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                  We believe meaningful change happens through collaboration. Partner with us to build healthier, more resilient communities across the globe.
                </p>
              </div>
              <Button asChild size="lg" className="h-14 px-10 font-bold bg-primary rounded-full gap-2">
                <Link href="/partnerships">
                  Partner With Us <Handshake className="w-5 h-5" />
                </Link>
              </Button>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl order-1 lg:order-2">
              <Image 
                src="https://picsum.photos/seed/partnership-home/800/600" 
                alt="Partnership" 
                fill 
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="relative h-[400px] lg:h-full">
              <Image 
                src="https://picsum.photos/seed/store-teaser/800/800" 
                alt="Impact Store" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="p-12 lg:p-20 space-y-8">
              <div className="space-y-4">
                <span className="text-accent font-bold uppercase tracking-widest text-xs">DIBF Impact Store</span>
                <h2 className="text-3xl md:text-5xl font-bold text-secondary font-headline">
                  Shop With Purpose.
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Every purchase supports initiatives that advance health, promote wellbeing, and create opportunities for lasting impact.
                </p>
              </div>
              <Button asChild size="lg" className="h-14 px-10 font-bold bg-secondary rounded-full gap-2">
                <Link href="/impact-store">
                  Shop the Collection <ShoppingBag className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-secondary text-white">
        <div className="container mx-auto px-4 text-center space-y-16">
          <div className="space-y-4 max-w-3xl mx-auto">
            <span className="text-accent font-bold uppercase tracking-widest text-sm">Make An Impact Today</span>
            <h2 className="text-3xl md:text-5xl font-bold font-headline">Join Us in Building a Better World</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { 
                icon: Heart, 
                title: "Donate", 
                text: "Your support helps us continue life-changing work.", 
                link: "/give", 
                cta: "Donate Now" 
              },
              { 
                icon: ShieldCheck, 
                title: "Volunteer", 
                text: "Give your time and skills to uplift communities.", 
                link: "/get-involved", 
                cta: "Get Involved" 
              },
              { 
                icon: Handshake, 
                title: "Partner", 
                text: "Collaborate with us to drive sustainable change.", 
                link: "/partnerships", 
                cta: "Partner With Us" 
              }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-3xl hover:bg-white/10 transition-all group">
                <div className="w-16 h-16 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/60 mb-8 leading-relaxed">{item.text}</p>
                <Link href={item.link} className="inline-flex items-center gap-2 text-accent font-bold hover:gap-3 transition-all">
                  {item.cta} <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
