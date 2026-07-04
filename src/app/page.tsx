import { Hero } from '@/components/home/Hero';
import { FeaturedStory } from '@/components/home/FeaturedStory';
import { WhatWeDoGrid } from '@/components/home/WhatWeDoGrid';
import { ImpactStats } from '@/components/home/ImpactStats';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShoppingBag,
  Handshake,
  Heart,
  ShieldCheck,
} from 'lucide-react';
import { getDocuments } from '@/lib/firestore/server';
import { COLLECTIONS } from '@/lib/firestore/collections';
import { Initiative, Stat, ImpactStatViewModel } from '@/types/firestore';
import { orderBy } from 'firebase/firestore';

export default async function HomePage() {
  const initiatives = await getDocuments<Initiative>(
    COLLECTIONS.initiatives,
    [orderBy('order', 'asc')],
  );

  const stats = await getDocuments<Stat>(
    COLLECTIONS.impactStats,
    [orderBy('order', 'asc')],
  );

  const serializedStats: ImpactStatViewModel[] = stats.map((stat) => ({
    id: stat.id ?? '',
    label: stat.label ?? '',
    value: typeof stat.value === 'number' ? stat.value : Number(stat.value ?? 0),
    prefix: typeof stat.prefix === 'string' ? stat.prefix : undefined,
    suffix: typeof stat.suffix === 'string' ? stat.suffix : undefined,
    description:
      typeof stat.description === 'string' ? stat.description : undefined,
    iconName: typeof stat.iconName === 'string' ? stat.iconName : undefined,
    order: typeof stat.order === 'number' ? stat.order : 0,
  }));

  const getInitiativeLink = (initiative: Initiative): string => {
    if (initiative.title?.includes('Tinewonsa')) {
      return '/initiatives/tinewonsa-project';
    }
    if (initiative.title?.includes('Dollar-A-Day')) {
      return '/campaigns/dollar-a-day';
    }
    if (initiative.title?.includes('African Field School')) {
      return '/initiatives/dib-african-field-school';
    }
    if (initiative.slug) {
      return `/initiatives/${initiative.slug}`;
    }
    return '/initiatives';
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-white">
      <Hero />

      <section className="relative bg-white">
        <ImpactStats stats={serializedStats} />
      </section>

      <FeaturedStory />

      <WhatWeDoGrid />

      <section className="bg-muted/30 py-20 md:py-24">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Our Initiatives"
            subtitle="Strategic programs designed to create lasting transformation in healthcare and community development."
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {initiatives.map((item, idx) => {
              const title = item.title || 'DIBF Initiative';
              const summary =
                item.summary ||
                'Supporting communities through healthcare, empowerment, and sustainable community transformation.';

              return (
                <Link
                  href={getInitiativeLink(item)}
                  key={item.id || `${title}-${idx}`}
                  className="group block h-full"
                >
                  <article className="relative flex h-full min-h-[400px] overflow-hidden rounded-2xl bg-secondary shadow-lg transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl">
                    <Image
                      src={
                        item.imageUrl ||
                        `https://picsum.photos/seed/init-${idx}/700/900`
                      }
                      alt={title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/45 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <h3 className="text-xl font-bold leading-tight">
                        {title}
                      </h3>

                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/75">
                        {summary}
                      </p>

                      <div className="mt-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors group-hover:bg-accent">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-primary px-10 font-bold text-primary transition-all hover:bg-primary hover:text-white"
            >
              <Link href="/initiatives">View All Initiatives</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 space-y-8 lg:order-1">
              <div className="space-y-5">
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                  Partnerships
                </span>

                <h2 className="font-headline text-3xl font-bold leading-tight text-secondary md:text-5xl">
                  Stronger Together. Greater Impact.
                </h2>

                <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                  We believe meaningful change happens through collaboration.
                  Partner with us to build healthier, more resilient communities
                  across the globe.
                </p>
              </div>

              <Button
                asChild
                size="lg"
                className="h-14 rounded-full bg-primary px-10 font-bold"
              >
                <Link href="/get-involved/partner" className="inline-flex items-center gap-2">
                  Partner With Us <Handshake className="h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="relative order-1 h-[360px] overflow-hidden rounded-[2rem] shadow-2xl lg:order-2 lg:h-[500px]">
              <Image
                src="https://picsum.photos/seed/partnership-home/900/650"
                alt="DIBF partnership"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/25 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center overflow-hidden rounded-[2rem] bg-white shadow-xl lg:grid-cols-2 lg:rounded-[2.5rem]">
            <div className="relative h-[340px] lg:h-full lg:min-h-[540px]">
              <Image
                src="https://picsum.photos/seed/store-teaser/900/900"
                alt="DIBF Impact Store"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent" />
            </div>

            <div className="space-y-8 p-8 sm:p-12 lg:p-20">
              <div className="space-y-5">
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                  DIBF Impact Store
                </span>

                <h2 className="font-headline text-3xl font-bold leading-tight text-secondary md:text-5xl">
                  Shop With Purpose.
                </h2>

                <p className="text-lg leading-relaxed text-muted-foreground">
                  Every purchase supports initiatives that advance health,
                  promote wellbeing, and create opportunities for lasting
                  impact.
                </p>
              </div>

              <Button
                asChild
                size="lg"
                className="h-14 rounded-full bg-secondary px-10 font-bold"
              >
                <Link href="/impact-store" className="inline-flex items-center gap-2">
                  Shop the Collection <ShoppingBag className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-20 text-white md:py-24">
        <div className="container mx-auto space-y-14 px-4 text-center md:space-y-16">
          <div className="mx-auto max-w-3xl space-y-5">
            <span className="text-sm font-bold uppercase tracking-[0.22em] text-accent">
              Make An Impact Today
            </span>

            <h2 className="font-headline text-3xl font-bold leading-tight md:text-5xl">
              Join Us in Building a Better World
            </h2>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {[
              {
                icon: Heart,
                title: 'Donate',
                text: 'Your support helps us continue life-changing work.',
                link: '/give',
                cta: 'Donate Now',
              },
              {
                icon: ShieldCheck,
                title: 'Volunteer',
                text: 'Give your time and skills to uplift communities.',
                link: '/get-involved/volunteer',
                cta: 'Get Involved',
              },
              {
                icon: Handshake,
                title: 'Partner',
                text: 'Collaborate with us to drive sustainable change.',
                link: '/get-involved/partner',
                cta: 'Partner With Us',
              },
            ].map((item) => (
              <article
                key={item.title}
                className="group rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition-all hover:-translate-y-1 hover:bg-white/[0.08] sm:p-10"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-accent transition-transform group-hover:scale-110">
                  <item.icon className="h-8 w-8" />
                </div>

                <h3 className="mb-3 text-2xl font-bold">{item.title}</h3>

                <p className="mb-8 leading-relaxed text-white/65">
                  {item.text}
                </p>

                <Link
                  href={item.link}
                  className="inline-flex items-center gap-2 font-bold text-accent transition-all hover:gap-3"
                >
                  {item.cta} <ArrowRight className="h-5 w-5" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
