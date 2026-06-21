
import { FocusArea } from "@/types/firestore";
import { SectionHeader } from "./shared/SectionHeader";

interface WhatWeDoGridProps {
    focusAreas: FocusArea[];
}

export function WhatWeDoGrid({ focusAreas }: WhatWeDoGridProps) {
    return (
        <section className="py-24">
            <div className="container mx-auto px-4">
                <SectionHeader
                    title="What We Do"
                    subtitle="We focus on key areas to create a significant and lasting impact on communities."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {focusAreas.map((area) => (
                        <div key={area.id} className="text-center p-8 border rounded-lg hover:shadow-lg transition-shadow">
                            <img src={area.iconUrl} alt={area.title} className="h-16 w-16 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">{area.title}</h3>
                            <p className="text-muted-foreground">{area.summary}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
