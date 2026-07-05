import Link from 'next/link';
import { ArrowRight, Building2, GraduationCap, Handshake, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSitePageBySlug } from '@/lib/firebase/firestore/getSitePageBySlug';

export const dynamic = 'force-dynamic';

const fallbackPage = {
  title: 'Partner With DIBF',
  subtitle: 'Meaningful change is shared work.',
  description:
    'DIBF welcomes collaboration with universities, healthcare institutions, corporations, foundations, development organizations, community groups, researchers, philanthropists, and individuals who share a commitment to improving lives and advancing sustainable development.',
};

const partnerTypes = [
  {
    title: 'Corporate Partnerships',
    description:
      'Collaborate with DIBF through CSR initiatives, campaign sponsorships, workplace giving, and shared impact programs.',
    icon: Building2,
  },
  {
    title: 'University Collaborations',
    description:
      'Partner with DIBF on learning, research, student engagement, field experiences, and community-centered development.',
    icon: GraduationCap,
  },
  {
    title: 'Healthcare Institutions',
    description:
      'Support outreach, public health education, medical missions, training, and access to community health services.',
    icon: HeartHandshake,
  },
  {
    title: 'Development & Research Partners',
    description:
      'Work with DIBF to document outcomes, share knowledge, strengthen systems, and create sustainable community value.',
    icon: Handshake,
  },
];

export default async function PartnerPage() {
  const page = await getSitePageBySlug('partner-with-us');

  const title =
    typeof page?.title === 'string' && page.title.trim()
      ? page.title
      : fallbackPage.title;

  const subtitle =
    typeof page?.subtitle === 'string' && page.subtitle.trim()
      ? page.subtitle
      : fallbackPage.subtitle;

  const description =
    typeof page?.description === 'string' && page.description.trim()
      ? page.description
      : fallbackPage.description;

  const imageUrl =
    typeof page?.imageUrl === 'string' && page.imageUrl.trim()
      ? page.imageUrl
      : '';

  return (
    <main className="overflow-hidden bg-white">
      <section className="relative isolate overflow-hidden bg-secondary text-white">
        {imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${imageUrl}")` }}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.45),transparent_34%),linear-gradient(135deg,#061a33_0%,#082f5f_55%,#031326_100%)]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/45" />

        <div className="container relative z-10 mx-auto max-w-7xl px-4 py-28 md:py-32 lg:py-36">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-black uppercase tracking-[0.22em] text-blue-200">
              Partnerships for Impact
            </p>

            <h1 className="text-5xl font-black leading-tight tracking-tight md:text-6xl">
              {title}
            </h1>

            <p className="mt-6 text-2xl font-bold text-white/90">
              {subtitle}
            </p>

            <p className="mt-6 max-w-2xl text-lg leading-9 text-white/75">
              {description}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-14 rounded-full px-8 font-bold">
                <Link href="/contact">
                  Start a Partnership
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 rounded-full border-white/25 bg-white/10 px-8 font-bold text-white hover:bg-white hover:text-secondary"
              >
                <Link href="/give">Support Our Mission</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 md:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-primary">
              Ways to partner
            </p>

            <h2 className="text-3xl font-black tracking-tight text-secondary md:text-4xl lg:text-5xl">
              Build lasting community impact with DIBF.
            </h2>

            <p className="mt-5 text-base leading-8 text-muted-foreground md:text-lg">
              Our partnerships are built on shared purpose, mutual respect, and a commitment
              to impact that extends beyond immediate interventions.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {partnerTypes.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="text-xl font-extrabold text-secondary">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="rounded-[2rem] bg-secondary p-8 text-center text-white shadow-2xl md:p-12 lg:p-16">
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              Ready to create impact together?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/70">
              Whether you represent an institution, company, university, foundation, or
              community group, there is a place for your contribution within the DIBF
              impact ecosystem.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-14 rounded-full px-8 font-bold">
                <Link href="/contact">
                  Contact DIBF
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 rounded-full border-white/25 bg-white/10 px-8 font-bold text-white hover:bg-white hover:text-secondary"
              >
                <Link href="/get-involved">Explore Get Involved</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}