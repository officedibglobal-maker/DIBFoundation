'use client';

import * as React from 'react';
import { animate } from 'framer-motion';
import {
  Users,
  HeartHandshake,
  BookOpen,
  Handshake,
  LucideIcon,
} from 'lucide-react';
import type { ImpactStatViewModel } from '@/types/view-models';

interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
}

function formatCompactValue(value: number) {
  if (value >= 1_000_000) {
    const formatted = value / 1_000_000;
    return `${Number.isInteger(formatted) ? formatted.toFixed(0) : formatted.toFixed(1)}M`;
  }

  if (value >= 1_000) {
    const formatted = value / 1_000;
    return `${Number.isInteger(formatted) ? formatted.toFixed(0) : formatted.toFixed(1)}K`;
  }

  return value.toLocaleString();
}

function Counter({ value, prefix, suffix }: CounterProps) {
  const [displayValue, setDisplayValue] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    const controls = animate(0, value, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
    });

    return () => controls.stop();
  }, [value]);

  const safePrefix = suffix === '$' ? '$' : prefix || '';
  const safeSuffix = suffix === '$' ? '' : suffix || '';

  return (
    <span>
      {safePrefix}
      {mounted ? formatCompactValue(displayValue) : 0}
      {safeSuffix}
    </span>
  );
}

interface ImpactStatsProps {
  stats: ImpactStatViewModel[];
}

const defaultStats: ImpactStatViewModel[] = [
  { id: '1', label: 'Lives Impacted', value: 15000, suffix: '+', order: 1 },
  { id: '2', label: 'Community Clinics', value: 45, suffix: '+', order: 2 },
  { id: '3', label: 'Regional Projects', value: 12, suffix: '+', order: 3 },
  { id: '4', label: 'Partners & Collaborators', value: 80, suffix: '+', order: 4 },
];

const fallbackIcons: LucideIcon[] = [
  Users,
  HeartHandshake,
  BookOpen,
  Handshake,
];

function cleanStatLabel(label: string) {
  return label
    .replace('Community Clinics Supported', 'Community Clinics')
    .replace('Regional Projects Across Africa', 'Regional Projects')
    .replace('Partners & Collaborators', 'Partners');
}

function getIcon(stat: ImpactStatViewModel, index: number) {
  const label = stat.label?.toLowerCase() || '';
  const iconName = stat.iconName?.toLowerCase() || '';

  if (iconName.includes('clinic') || label.includes('clinic')) {
    return HeartHandshake;
  }

  if (
    iconName.includes('book') ||
    iconName.includes('education') ||
    label.includes('project') ||
    label.includes('trained')
  ) {
    return BookOpen;
  }

  if (
    iconName.includes('partner') ||
    iconName.includes('handshake') ||
    label.includes('partner') ||
    label.includes('collaborator')
  ) {
    return Handshake;
  }

  return fallbackIcons[index] || Users;
}

export function ImpactStats({ stats }: ImpactStatsProps) {
  const uniqueStats = stats.filter(
    (stat, index, self) =>
      index === self.findIndex((s) => s.label === stat.label),
  );

  const data = (uniqueStats.length > 0 ? uniqueStats : defaultStats)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 4);

  return (
    <section className="relative z-20 bg-white py-10 sm:py-12 lg:py-14">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-secondary shadow-[0_24px_70px_rgba(5,35,70,0.14)]">
          <div className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {data.map((stat, index) => {
              const Icon = getIcon(stat, index);

              return (
                <div
                  key={stat.id || stat.label}
                  className="flex min-h-[128px] items-center gap-5 px-6 py-6 text-white sm:px-8 lg:min-h-[144px] lg:px-10"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
                    <Icon className="h-7 w-7 stroke-[1.9]" />
                  </div>

                  <div className="min-w-0">
                    <div className="whitespace-nowrap font-headline text-4xl font-extrabold leading-none tracking-tight text-white md:text-[2.55rem]">
                      <Counter
                        value={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                      />
                    </div>

                    <p className="mt-3 max-w-[190px] text-sm font-medium leading-snug text-white/85 md:text-[0.95rem]">
                      {cleanStatLabel(stat.label)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}