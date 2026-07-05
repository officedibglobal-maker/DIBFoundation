'use client';

import { motion, type Variants } from 'framer-motion';
import {
  Ambulance,
  Baby,
  Brain,
  Building2,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Lightbulb,
  ShieldPlus,
  Stethoscope,
  Users,
  Utensils,
} from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import type { HomepageSectionSettings } from '@/lib/firestore/homepage-settings';

type FocusArea = {
  id?: string;
  title?: string;
  name?: string;
  label?: string;
  description?: string;
};

interface CoreFocusAreasProps {
  focusAreas?: FocusArea[];
  settings?: HomepageSectionSettings;
}

const fallbackFocusAreas: FocusArea[] = [
  {
    id: 'healthcare-access',
    title: 'Healthcare Access',
    description:
      'Expanding access to essential healthcare services for underserved communities.',
  },
  {
    id: 'medical-training',
    title: 'Medical Training',
    description:
      'Equipping healthcare workers and volunteers with practical skills for better care.',
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure',
    description:
      'Supporting clinics, medical supplies, outreach systems, and community health facilities.',
  },
  {
    id: 'community-health',
    title: 'Community Health',
    description:
      'Promoting prevention, education, screenings, and healthier community lifestyles.',
  },
  {
    id: 'nutrition-programs',
    title: 'Nutrition Programs',
    description:
      'Supporting food security, family wellbeing, and nutrition awareness.',
  },
  {
    id: 'emergency-response',
    title: 'Emergency Response',
    description:
      'Mobilizing timely support during urgent health and humanitarian needs.',
  },
  {
    id: 'mental-health',
    title: 'Mental Health',
    description:
      'Reducing stigma and supporting emotional wellbeing through awareness and care.',
  },
  {
    id: 'youth-impact',
    title: 'Youth Empowerment',
    description:
      'Equipping young people with knowledge, confidence, and opportunity.',
  },
];

const iconPool = [
  HeartPulse,
  Stethoscope,
  Building2,
  Users,
  Utensils,
  Ambulance,
  Brain,
  GraduationCap,
  Baby,
  HandHeart,
  ShieldPlus,
  Lightbulb,
];

const colorPool = [
  {
    icon: 'bg-blue-500/20 text-blue-100',
    glow: 'from-blue-400/20 to-transparent',
  },
  {
    icon: 'bg-cyan-500/20 text-cyan-100',
    glow: 'from-cyan-400/20 to-transparent',
  },
  {
    icon: 'bg-amber-500/20 text-amber-100',
    glow: 'from-amber-400/20 to-transparent',
  },
  {
    icon: 'bg-emerald-500/20 text-emerald-100',
    glow: 'from-emerald-400/20 to-transparent',
  },
  {
    icon: 'bg-rose-500/20 text-rose-100',
    glow: 'from-rose-400/20 to-transparent',
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
      delay: index * 0.05,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function getLabel(area: FocusArea): string {
  return (area.title || area.name || area.label || '').trim();
}

function getDescription(area: FocusArea): string {
  return (area.description || '').trim();
}

function getUniqueAreas(focusAreas: FocusArea[]) {
  const seen = new Set<string>();
  const unique: FocusArea[] = [];

  for (const area of focusAreas) {
    const label = getLabel(area);

    if (!label) continue;

    const key = label.toLowerCase();

    if (seen.has(key)) continue;

    seen.add(key);
    unique.push(area);
  }

  return unique;
}

function getFallbackDescription(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes('healthcare')) {
    return 'Expanding access to essential healthcare services for underserved communities.';
  }

  if (normalized.includes('training')) {
    return 'Equipping healthcare workers and volunteers with practical skills for better care.';
  }

  if (normalized.includes('infrastructure')) {
    return 'Supporting clinics, medical supplies, outreach systems, and community health facilities.';
  }

  if (normalized.includes('community')) {
    return 'Promoting prevention, education, screenings, and healthier community lifestyles.';
  }

  if (normalized.includes('nutrition')) {
    return 'Supporting food security, family wellbeing, and nutrition awareness.';
  }

  if (normalized.includes('emergency')) {
    return 'Mobilizing timely support during urgent health and humanitarian needs.';
  }

  if (normalized.includes('mental')) {
    return 'Reducing stigma and supporting emotional wellbeing through awareness and care.';
  }

  if (normalized.includes('youth')) {
    return 'Equipping young people with knowledge, confidence, and opportunity.';
  }

  return 'Supporting communities through practical action, service, and sustainable development.';
}

export function CoreFocusAreas({
  focusAreas = [],
  settings,
}: CoreFocusAreasProps) {
  const sectionLabel = settings?.sectionLabel || 'Core Focus Areas';

  const sectionTitle =
    settings?.sectionTitle || 'Where DIBF Creates Meaningful Change';

  const sectionBody =
    settings?.sectionBody ||
    'Our work connects health, education, community development, giving, research, and partnerships into one shared impact platform.';

  const sectionImageUrl = settings?.imageUrl || '';

  const uniqueCmsAreas = getUniqueAreas(focusAreas);

  const displayAreas =
    uniqueCmsAreas.length > 0 ? uniqueCmsAreas.slice(0, 8) : fallbackFocusAreas;

  return (
    <section className="relative overflow-hidden bg-secondary py-20 text-white md:py-24 lg:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.16),transparent_30%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />

      <div className="container relative mx-auto max-w-7xl px-4">
        {sectionImageUrl ? (
          <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <SectionHeader
              align="left"
              eyebrow={sectionLabel}
              title={sectionTitle}
              subtitle={sectionBody}
              isDarkTheme
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.35 }}
              className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-2xl"
            >
              <img
                src={sectionImageUrl}
                alt={sectionTitle}
                className="h-[360px] w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-secondary/45 via-transparent to-transparent" />
            </motion.div>
          </div>
        ) : (
          <SectionHeader
            eyebrow={sectionLabel}
            title={sectionTitle}
            subtitle={sectionBody}
            isDarkTheme
          />
        )}

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {displayAreas.map((area, index) => {
            const label = getLabel(area);
            const description =
              getDescription(area) || getFallbackDescription(label);
            const Icon = iconPool[index % iconPool.length];
            const color = colorPool[index % colorPool.length];

            return (
              <motion.article
                key={area.id || `${label}-${index}`}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                custom={index}
                viewport={{ once: true, amount: 0.3 }}
                className="group relative min-h-[220px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.11]"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${color.glow} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div className="relative">
                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${color.icon}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="text-xl font-black leading-tight text-white">
                    {label}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-white/70">
                    {description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}