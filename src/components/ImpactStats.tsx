
"use client"

import { Stat } from "@/types/firestore";
import CountUp from 'react-countup';

interface ImpactStatsProps {
    stats: Stat[];
}

export function ImpactStats({ stats }: ImpactStatsProps) {
    return (
        <section className="bg-primary py-20 text-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat) => (
                        <div key={stat.id}>
                            <h3 className="text-4xl md:text-6xl font-bold">
                                <CountUp end={stat.value} duration={5} />{stat.suffix}
                            </h3>
                            <p className="text-lg mt-2">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
