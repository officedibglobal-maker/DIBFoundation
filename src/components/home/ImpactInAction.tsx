'use client';

import Link from 'next/link';
import { ArrowRight, FileText, Images, Newspaper, Users } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { SectionHeader } from '@/components/shared/SectionHeader';

type Story = Record<string, unknown> & {
  id?: string;
  title?: string;
  summary?: string;
  slug?: string;
};

interface ImpactInActionProps {
  stories?: Story[];
}

const fallbackLinks = [
  {
    title: 'Stories of Impact',
    description: 'Read community stories that show how service, giving, and partnership create real change.',
    href: '/impact/stories',
    icon: Users,
  },
  {
    title: 'Outreach Reports',
    description: 'Explore reports from medical outreach, public health, youth, and community-centered initiatives.',
    href: '/impact/outreach-reports',
    icon: FileText,
  },
  {
    title: 'Community Highlights',
    description: 'Follow meaningful moments, field updates, and milestones from DIBF programs.',
    href: '/impact/stories',
    icon: Newspaper,
  },
  {
    title: 'Photo & Video Gallery',
    description: 'See DIBF’s work in action through visual stories from communities and partners.',
    href: '/gallery',
    icon: Images,
  },
];

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
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

function getImage(record: Record<string, unknown>) {
  return getFirstString(record, [
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
    'images',
    'photos',
  ]);
}

export function ImpactInAction({ stories = [] }: ImpactInActionProps) {
  const hasStories = stories.length > 0;

  const cards = hasStories
    ? stories.slice(0, 4).map((story) => ({
        title: getFirstString(story, ['title', 'name']) || 'Impact Story',
        description:
          getFirstString(story, ['summary', 'description', 'excerpt']) ||
          'A story of service, partnership, and community-centered impact.',
        href: getFirstString(story, ['slug'])
          ? `/impact/stories/${getFirstString(story, ['slug'])}`
          : '/impact/stories',
        imageUrl: getImage(story),
        icon: Users,
      }))
    : fallbackLinks.map((link) => ({ ...link, imageUrl: '' }));

  return (
    <section className="bg-white py-20 md:py-24 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Impact proof"
          title="Impact in Action"
          subtitle="Explore DIBF stories, reports, community highlights, and field moments that show the work behind the mission."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={`${card.title}-${index}`}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                custom={index}
                viewport={{ once: true, amount: 0.35 }}
              >
                <Link
                  href={card.href}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
                >
                  <div className="relative h-40 bg-blue-50">
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 text-primary">
                        <Icon className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="text-lg font-extrabold text-secondary">
                      {card.title}
                    </h3>

                    <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">
                      {card.description}
                    </p>

                    <div className="mt-7 inline-flex items-center text-sm font-bold text-primary">
                      Explore
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}