import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

type SitePageSection = {
  id?: string;
  type?: string;
  heading?: string;
  title?: string;
  body?: string;
  content?: string;
  imageUrl?: string;
  imageAlt?: string;
  items?: string[];
  ctaLabel?: string;
  ctaLink?: string;
};

type RenderableSitePage = {
  id?: string;
  slug?: string;
  order?: number;
  status?: 'draft' | 'published' | string;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  heroImageUrl?: string;
  imageUrl?: string;
  summary?: string;
  body?: string;
  content?: string;
  sections?: unknown;
  ctaLabel?: string;
  ctaLink?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

type SitePageRendererProps = {
  page: unknown;
};

function getText(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function getSections(page: RenderableSitePage): SitePageSection[] {
  if (!Array.isArray(page.sections)) {
    return [];
  }

  return page.sections
    .filter(
      (section): section is Record<string, unknown> =>
        section !== null &&
        typeof section === 'object' &&
        !Array.isArray(section)
    )
    .map((section, index) => ({
      id: getText(section.id, `section-${index}`),
      type: getText(section.type, 'richText'),
      heading: getText(section.heading || section.title),
      title: getText(section.title || section.heading),
      body: getText(section.body || section.content),
      content: getText(section.content || section.body),
      imageUrl: getText(section.imageUrl),
      imageAlt: getText(section.imageAlt),
      items: Array.isArray(section.items)
        ? section.items.filter((item): item is string => typeof item === 'string')
        : [],
      ctaLabel: getText(section.ctaLabel),
      ctaLink: getText(section.ctaLink),
    }));
}

function RichTextBlock({ section }: { section: SitePageSection }) {
  const heading = getText(section.heading || section.title);
  const body = getText(section.body || section.content);

  if (!heading && !body) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto max-w-4xl px-4">
        {heading ? (
          <h2 className="text-3xl font-black tracking-tight text-secondary md:text-4xl">
            {heading}
          </h2>
        ) : null}

        {body ? (
          <div className="mt-6 whitespace-pre-line text-base leading-8 text-muted-foreground md:text-lg">
            {body}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ImageTextBlock({
  section,
  index,
}: {
  section: SitePageSection;
  index: number;
}) {
  const heading = getText(section.heading || section.title);
  const body = getText(section.body || section.content);
  const imageUrl = getText(section.imageUrl);
  const ctaLabel = getText(section.ctaLabel);
  const ctaLink = getText(section.ctaLink);
  const reverse = index % 2 === 1;

  if (!heading && !body && !imageUrl) return null;

  return (
    <section className="py-14">
      <div
        className={`container mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-2 ${
          reverse ? 'lg:[&>*:first-child]:order-2' : ''
        }`}
      >
        <div>
          {heading ? (
            <h2 className="text-3xl font-black tracking-tight text-secondary md:text-4xl">
              {heading}
            </h2>
          ) : null}

          {body ? (
            <p className="mt-6 whitespace-pre-line text-base leading-8 text-muted-foreground md:text-lg">
              {body}
            </p>
          ) : null}

          {ctaLabel && ctaLink ? (
            <Link
              href={ctaLink}
              className="mt-8 inline-flex h-12 items-center rounded-full bg-primary px-7 text-sm font-bold text-white transition hover:bg-primary/90"
            >
              {ctaLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-[2rem] bg-slate-100 shadow-xl">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={section.imageAlt || heading || 'DIBF section image'}
              width={900}
              height={650}
              className="h-[360px] w-full object-cover"
            />
          ) : (
            <div className="h-[360px] bg-gradient-to-br from-secondary to-primary" />
          )}
        </div>
      </div>
    </section>
  );
}

function ListBlock({ section }: { section: SitePageSection }) {
  const heading = getText(section.heading || section.title);
  const body = getText(section.body || section.content);
  const items = Array.isArray(section.items) ? section.items : [];

  if (!heading && !body && items.length === 0) return null;

  return (
    <section className="bg-slate-50 py-16">
      <div className="container mx-auto max-w-5xl px-4">
        {heading ? (
          <h2 className="text-3xl font-black tracking-tight text-secondary md:text-4xl">
            {heading}
          </h2>
        ) : null}

        {body ? (
          <p className="mt-5 text-base leading-8 text-muted-foreground md:text-lg">
            {body}
          </p>
        ) : null}

        {items.length > 0 ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {items.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm leading-7 text-muted-foreground">
                  {item}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function CardsBlock({ section }: { section: SitePageSection }) {
  const heading = getText(section.heading || section.title);
  const body = getText(section.body || section.content);
  const items = Array.isArray(section.items) ? section.items : [];

  if (!heading && !body && items.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          {heading ? (
            <h2 className="text-3xl font-black tracking-tight text-secondary md:text-4xl">
              {heading}
            </h2>
          ) : null}

          {body ? (
            <p className="mt-5 text-base leading-8 text-muted-foreground md:text-lg">
              {body}
            </p>
          ) : null}
        </div>

        {items.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <CheckCircle className="h-7 w-7 text-primary" />
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {item}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function renderSection(section: SitePageSection, index: number) {
  const type = getText(section.type, 'richText');

  if (type === 'imageText' || type === 'feature' || type === 'split') {
    return (
      <ImageTextBlock
        key={section.id || `image-text-${index}`}
        section={section}
        index={index}
      />
    );
  }

  if (type === 'list' || type === 'bullets') {
    return (
      <ListBlock
        key={section.id || `list-${index}`}
        section={section}
      />
    );
  }

  if (type === 'cards' || type === 'cardGrid') {
    return (
      <CardsBlock
        key={section.id || `cards-${index}`}
        section={section}
      />
    );
  }

  return (
    <RichTextBlock
      key={section.id || `rich-text-${index}`}
      section={section}
    />
  );
}

export function SitePageRenderer({ page }: SitePageRendererProps) {
  const normalizedPage =
    page && typeof page === 'object' && !Array.isArray(page)
      ? (page as RenderableSitePage)
      : {};

  const title = getText(normalizedPage.title, 'Doctors in Business Foundation');
  const subtitle = getText(normalizedPage.subtitle || normalizedPage.summary);
  const eyebrow = getText(normalizedPage.eyebrow);
  const heroImageUrl = getText(
    normalizedPage.heroImageUrl || normalizedPage.imageUrl
  );
  const body = getText(normalizedPage.body || normalizedPage.content);
  const sections = getSections(normalizedPage);
  const ctaLabel = getText(normalizedPage.ctaLabel);
  const ctaLink = getText(normalizedPage.ctaLink);

  return (
    <main className="overflow-hidden bg-white">
      <section className="relative isolate overflow-hidden bg-secondary text-white">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : null}

        <div className="absolute inset-0 bg-secondary/80" />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/90 to-primary/60" />

        <div className="container relative z-10 mx-auto max-w-7xl px-4 py-28 md:py-32 lg:py-36">
          <div className="max-w-3xl">
            {eyebrow ? (
              <p className="mb-5 text-sm font-black uppercase tracking-[0.25em] text-blue-100">
                {eyebrow}
              </p>
            ) : null}

            <h1 className="text-5xl font-black leading-tight tracking-tight md:text-6xl">
              {title}
            </h1>

            {subtitle ? (
              <p className="mt-6 max-w-2xl text-lg leading-9 text-white/80">
                {subtitle}
              </p>
            ) : null}

            {ctaLabel && ctaLink ? (
              <Link
                href={ctaLink}
                className="mt-9 inline-flex h-14 items-center rounded-full bg-primary px-8 text-base font-bold text-white shadow-lg shadow-primary/30 transition hover:bg-primary/90"
              >
                {ctaLabel}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {body ? (
        <section className="py-16">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="whitespace-pre-line text-lg leading-9 text-muted-foreground">
              {body}
            </div>
          </div>
        </section>
      ) : null}

      {sections.length > 0 ? (
        sections.map((section, index) => renderSection(section, index))
      ) : body ? null : (
        <section className="py-20">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <p className="text-lg text-muted-foreground">
              More information will be available soon.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}