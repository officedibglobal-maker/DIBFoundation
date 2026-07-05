'use client';

import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/shared/SectionHeader';
import type { HomepageSectionSettings } from '@/lib/firestore/homepage-settings';

type StoreProduct = Record<string, unknown> & {
  id?: string;
  slug?: string;
  title?: string;
  name?: string;
  summary?: string;
  description?: string;
  price?: number | string;
  salePrice?: number | string;
};

interface ImpactStorePreviewProps {
  products?: StoreProduct[];
  settings?: HomepageSectionSettings;
}

const fallbackProducts: StoreProduct[] = [
  {
    id: 'awareness',
    title: 'Awareness Merchandise',
    summary: 'Purpose-driven items that help turn everyday visibility into advocacy.',
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle & Wellness Items',
    summary: 'Products connected to wellness, community wellbeing, and meaningful giving.',
  },
  {
    id: 'limited',
    title: 'Limited Impact Collections',
    summary: 'Special collections that support campaigns, outreach, and community programs.',
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
  if (typeof value === 'number') return String(value);
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

function getProductImage(product: StoreProduct) {
  return getFirstString(product, [
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

function getProductHref(product: StoreProduct) {
  const slug = getFirstString(product, ['slug']);
  const id = getFirstString(product, ['id']);

  if (slug) return `/impact-store/products/${slug}`;
  if (id) return `/impact-store/products/${id}`;

  return '/impact-store';
}

export function ImpactStorePreview({
  products = [],
  settings,
}: ImpactStorePreviewProps) {
  const sectionLabel = settings?.sectionLabel || 'Impact Store';

  const sectionTitle =
    settings?.sectionTitle || 'Shop With Purpose. Support Meaningful Impact.';

  const sectionBody =
    settings?.sectionBody ||
    'The DIBF Impact Store transforms everyday purchases into opportunities for impact through purpose-driven products, awareness merchandise, lifestyle items, and socially conscious collections.';

  const sectionImageUrl = settings?.imageUrl || '';

  const ctaLabel = settings?.ctaLabel || 'Visit Impact Store';

  const ctaLink = settings?.ctaLink || '/impact-store';

  const displayProducts =
    products.length > 0 ? products.slice(0, 3) : fallbackProducts;

  return (
    <section className="bg-slate-50 py-20 md:py-24 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <SectionHeader
            align="left"
            eyebrow={sectionLabel}
            title={sectionTitle}
            subtitle={sectionBody}
          />

          <Button
            asChild
            size="lg"
            className="hidden h-13 rounded-full px-8 font-bold lg:inline-flex"
          >
            <Link href={ctaLink}>
              {ctaLabel}
              <ShoppingBag className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        {sectionImageUrl ? (
          <div className="mt-12 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
            <img
              src={sectionImageUrl}
              alt={sectionTitle}
              className="h-[360px] w-full object-cover"
            />
          </div>
        ) : null}

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {displayProducts.map((product, index) => {
            const title =
              getFirstString(product, ['title', 'name']) ||
              'DIBF Impact Product';

            const summary =
              getFirstString(product, ['summary', 'description']) ||
              'Every purchase contributes toward initiatives and programs supported by DIBF.';

            const imageUrl = getProductImage(product);

            const price = getFirstString(product, ['salePrice', 'price']);

            return (
              <motion.article
                key={
                  getFirstString(product, ['id', 'slug']) ||
                  `${title}-${index}`
                }
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                custom={index}
                viewport={{ once: true, amount: 0.35 }}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <Link href={getProductHref(product)} className="block">
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-secondary via-blue-900 to-primary">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-8 text-center text-white">
                        <div>
                          <ShoppingBag className="mx-auto h-12 w-12 text-white/80" />
                          <p className="mt-4 text-lg font-black">{title}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-7">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-extrabold text-secondary">
                        {title}
                      </h3>

                      {price ? (
                        <p className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-sm font-black text-primary">
                          {price}
                        </p>
                      ) : null}
                    </div>

                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
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

        <div className="mt-12 text-center lg:hidden">
          <Button asChild size="lg" className="h-13 rounded-full px-8 font-bold">
            <Link href={ctaLink}>
              {ctaLabel}
              <ShoppingBag className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}