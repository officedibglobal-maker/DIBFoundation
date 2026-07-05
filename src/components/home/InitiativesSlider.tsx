'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/shared/SectionHeader';

type Initiative = Record<string, unknown> & {
  id?: string;
  title?: string;
  name?: string;
  summary?: string;
  description?: string;
  slug?: string;
  category?: string;
};

interface InitiativesSliderProps {
  initiatives?: Initiative[];
}

const fallbackInitiatives: Initiative[] = [
  {
    id: 'tinewonsa',
    title: 'The Tinewonsa Project',
    summary: 'Fostering sustainable giving and collective responsibility for community-centered impact.',
    slug: 'tinewonsa-project',
    category: 'Sustainable Giving',
  },
  {
    id: 'dollar-a-day',
    title: 'Dollar-A-Day Campaign',
    summary: 'Mobilizing everyday generosity to support healthcare priorities and life-saving access.',
    slug: 'dollar-a-day',
    category: 'Giving Campaign',
  },
  {
    id: 'field-school',
    title: 'DIB African Field School',
    summary: 'Experiential learning, service, cultural exchange, and meaningful engagement across Africa.',
    slug: 'dib-african-field-school',
    category: 'Education & Learning',
  },
  {
    id: 'impact-store',
    title: 'DIBF Impact Store',
    summary: 'Purpose-driven products that transform everyday purchases into meaningful impact.',
    slug: 'impact-store',
    category: 'Impact Store',
  },
];

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.08,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function getStringValue(value: unknown): string {
  if (!value) return '';

  if (typeof value === 'string') return value.trim();

  if (Array.isArray(value)) return getStringValue(value[0]);

  if (typeof value === 'object') {
    const objectValue = value as Record<string, unknown>;

    return (
      getStringValue(objectValue.url) ||
      getStringValue(objectValue.src) ||
      getStringValue(objectValue.downloadURL) ||
      getStringValue(objectValue.imageUrl)
    );
  }

  return '';
}

function getFirstString(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = getStringValue(record[key]);
    if (value) return value;
  }

  return '';
}

function getImage(item: Initiative) {
  return getFirstString(item, [
    'imageUrl',
    'imageURL',
    'image',
    'coverImage',
    'coverImageUrl',
    'featuredImage',
    'featuredImageUrl',
    'thumbnailUrl',
    'photoUrl',
    'mediaUrl',
    'bannerImage',
    'bannerImageUrl',
    'images',
    'photos',
  ]);
}

function getInitiativeLink(initiative: Initiative) {
  const title = getFirstString(initiative, ['title', 'name']);
  const slug = getFirstString(initiative, ['slug']);

  if (title.includes('Tinewonsa') || slug.includes('tinewonsa')) {
    return '/initiatives/tinewonsa-project';
  }

  if (title.includes('Dollar-A-Day') || slug.includes('dollar-a-day')) {
    return '/campaigns/dollar-a-day';
  }

  if (title.includes('African Field School') || slug.includes('field-school')) {
    return '/initiatives/dib-african-field-school';
  }

  if (title.includes('Impact Store') || slug.includes('impact-store')) {
    return '/impact-store';
  }

  if (slug) return `/initiatives/${slug}`;

  return '/initiatives';
}

export function InitiativesSlider({ initiatives = [] }: InitiativesSliderProps) {
  const displayInitiatives =
    initiatives.length > 0 ? initiatives.slice(0, 4) : fallbackInitiatives;

  return (
    <section className="bg-slate-50 py-20 md:py-24 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Flagship initiatives"
          title="Programs Designed for Long-Term Transformation"
          subtitle="DIBF’s flagship initiatives create pathways for healthcare, education, sustainable giving, experiential learning, and community-centered development."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {displayInitiatives.map((item, index) => {
            const title = getFirstString(item, ['title', 'name']) || 'DIBF Initiative';
            const summary =
              getFirstString(item, ['summary', 'description']) ||
              'Supporting communities through healthcare, empowerment, and sustainable transformation.';
            const category = getFirstString(item, ['category', 'type']) || 'Initiative';
            const imageUrl = getImage(item);

            return (
              <motion.article
                key={item.id || `${title}-${index}`}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                custom={index}
                viewport={{ once: true, amount: 0.35 }}
                className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <Link href={getInitiativeLink(item)} className="block">
                  <div className="relative h-72 overflow-hidden bg-gradient-to-br from-secondary via-blue-900 to-primary">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_35%),linear-gradient(135deg,#061a33,#0b5db8)]" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/35 to-transparent" />

                    <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-black uppercase tracking-wide text-secondary">
                      {category}
                    </div>
                  </div>

                  <div className="p-7">
                    <h3 className="text-xl font-extrabold leading-tight text-secondary">
                      {title}
                    </h3>

                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-muted-foreground">
                      {summary}
                    </p>

                    <div className="mt-6 inline-flex items-center text-sm font-bold text-primary">
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button
            asChild
            variant="outline"
            className="h-13 rounded-full border-primary px-10 font-bold text-primary hover:bg-primary hover:text-white"
          >
            <Link href="/initiatives">View All Initiatives</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}