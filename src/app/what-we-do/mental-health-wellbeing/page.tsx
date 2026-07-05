import type { ComponentProps } from 'react';
import Link from 'next/link';
import { Heart, MessageSquare, Users } from 'lucide-react';

import { getSitePageBySlug } from '@/lib/firebase/firestore/getSitePageBySlug';
import { SitePageRenderer } from '@/components/site/SitePageRenderer';
import { Button } from '@/components/ui/button';

type RenderableSitePage = ComponentProps<typeof SitePageRenderer>['page'];

export default async function MentalHealthPage() {
  const page = await getSitePageBySlug('what-we-do-mental-health-wellbeing');

  if (page && page.status === 'published') {
    return <SitePageRenderer page={page as RenderableSitePage} />;
  }

  return (
    <main className="overflow-hidden bg-white">
      <section className="relative isolate overflow-hidden bg-secondary text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.45),transparent_34%),linear-gradient(135deg,#061a33_0%,#082f5f_55%,#031326_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/50" />

        <div className="container relative z-10 mx-auto max-w-7xl px-4 py-28 md:py-32 lg:py-36">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-black uppercase tracking-[0.22em] text-blue-200">
              What We Do
            </p>

            <h1 className="text-5xl font-black leading-tight tracking-tight md:text-6xl">
              Mental Health &amp; Wellbeing
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-9 text-white/75">
              DIBF is committed to promoting mental health and wellbeing in
              communities through awareness, advocacy, and support for accessible,
              culturally sensitive mental healthcare.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-primary">
              Community wellbeing
            </p>

            <h2 className="text-3xl font-black tracking-tight text-secondary md:text-4xl lg:text-5xl">
              Supporting healthier minds and stronger communities.
            </h2>

            <p className="mt-5 text-base leading-8 text-muted-foreground md:text-lg">
              We believe that mental health is a fundamental part of overall
              health, dignity, resilience, and community transformation.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <article className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                <Heart className="h-7 w-7" />
              </div>

              <h3 className="text-2xl font-extrabold text-secondary">
                Promoting Awareness
              </h3>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                We work to reduce stigma and increase understanding of mental
                health through community campaigns, educational workshops, and
                open conversations.
              </p>
            </article>

            <article className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                <Users className="h-7 w-7" />
              </div>

              <h3 className="text-2xl font-extrabold text-secondary">
                Community-Centered Support
              </h3>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Our approach is rooted in community. We support initiatives that
                provide culturally relevant mental health resources and create
                safe spaces for dialogue and healing.
              </p>
            </article>

            <article className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                <MessageSquare className="h-7 w-7" />
              </div>

              <h3 className="text-2xl font-extrabold text-secondary">
                Advocacy for Accessible Care
              </h3>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                We advocate for policies and programs that improve access to
                quality mental healthcare for all, particularly in underserved
                communities.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 md:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="rounded-[2rem] bg-secondary p-8 text-center text-white shadow-2xl md:p-12 lg:p-16">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-blue-200">
              Join the conversation
            </p>

            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              Help create communities where people can thrive emotionally,
              socially, and mentally.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/70">
              Your voice matters in the movement for mental health. Get involved
              to help us create a world where everyone has the support they need
              to thrive.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-14 rounded-full px-8 font-bold">
                <Link href="/get-involved">Support Our Work</Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 rounded-full border-white/25 bg-white/10 px-8 font-bold text-white hover:bg-white hover:text-secondary"
              >
                <Link href="/contact">Contact DIBF</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}