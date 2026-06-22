
"use client";

import * as React from 'react';
import { motion, animate } from 'framer-motion';
import type { ImpactStatViewModel } from "@/types/view-models";

interface CounterProps {
  value: number;
  suffix?: string;
}

function Counter({ value, suffix }: CounterProps) {
  const [displayValue, setDisplayValue] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const controls = animate(0, value, {
      duration: 2,
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
      ease: "easeOut"
    });
    return () => controls.stop();
  }, [value]);

  if (!mounted) return <span>0{suffix}</span>;

  return (
    <span>
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

interface ImpactStatsProps {
  stats: ImpactStatViewModel[];
}

export function ImpactStats({ stats }: ImpactStatsProps) {
  const defaultStats: ImpactStatViewModel[] = [
    { id: "1", label: "Lives Impacted", value: 50000, suffix: "+", order: 1 },
    { id: "2", label: "Communities Reached", value: 100, suffix: "+", order: 2 },
    { id: "3", label: "Partners & Collaborators", value: 200, suffix: "+", order: 3 },
    { id: "4", label: "Youth Empowered", value: 5000, suffix: "+", order: 4 }
  ];

  const data = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <section className="py-20 bg-secondary text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center items-center">
          {data.map((stat) => (
            <div key={stat.id} className="space-y-4">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-accent font-headline">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="w-12 h-1 bg-accent/30 mx-auto rounded-full" />
              <p className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white/70">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
