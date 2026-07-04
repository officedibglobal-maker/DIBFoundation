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
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
    });

    return () => controls.stop();
  }, [value]);

  const safePrefix = suffix === '$' ? '$' : prefix || '';
  const safeSuffix = suffix === '$' ? '+' : suffix || '';

  if (!mounted) {
    return (
      <span>
        {safePrefix}
        0
        {safeSuffix}
      </span>
    );
  }

  return (
    <span>
      {safePrefix}
      {formatCompactValue(displayValue)}
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
  { id: '4', label: 'Partners', value: 80, suffix: '+', order: 4 },
];

const statIcons: LucideIcon[] = [
  Users,
  HeartHandshake,
  BookOpen,
  Handshake,
];

function cleanStatLabel(label: string) {
  return label
    .replace('Community Clinics Supported', 'Community Clinics')
    .replace('Regional Projects Across Africa', 'Regional Projects')
    .replace('Partners & Collaborators', 'Partners')
    .replace('People Helped', 'People Helped')
    .replace('Clinics Built', 'Clinics Built')
    .replace('Workers Trained', 'Workers Trained')
    .replace('Funds Raised', 'Funds Raised');
}

function normalizeStat(stat: ImpactStatViewModel): ImpactStatViewModel {
  const label = stat.label || '';
  const lowerLabel = label.toLowerCase();

  if (lowerLabel.includes('fund')) {
    return {
      ...stat,
      prefix: stat.prefix || '$',
      suffix: stat.suffix === '$' ? '+' : stat.suffix || '+',
    };
  }

  return stat;
}

export function ImpactStats({ stats }: ImpactStatsProps) {
  const uniqueStats = stats.filter(
    (stat, index, self) => index === self.findIndex((s) => s.label === stat.label)
  );

  const data = (uniqueStats.length > 0 ? uniqueStats : defaultStats)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 4)
    .map(normalizeStat);

  return (
    <section className="relative z-30 -mt-28 bg-white pb-14 md:-mt-30 md:pb-16 lg:-mt-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-[1500px] overflow-hidden rounded-xl bg-[#062f63] shadow-2xl shadow-black/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {data.map((stat, index) => {
              const Icon = statIcons[index] || Users;

              return (
                <div
                  key={stat.id || stat.label}
                  className="flex min-h-[112px] items-center gap-5 border-b border-white/10 px-7 py-5 text-white sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0 xl:px-10"
                >
                  <div className="shrink-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0b68c7]/25 text-[#0b86ff] ring-1 ring-white/10">
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="whitespace-nowrap font-headline text-3xl font-extrabold leading-none tracking-tight text-white md:text-[2rem] xl:text-[2.2rem]">
                      <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                    </div>

                    <p className="mt-2 max-w-[170px] text-sm font-medium leading-snug text-white/90 md:text-[0.95rem]">
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