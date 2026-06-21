
import { ImpactStory } from "@/types/firestore";
import { Button } from "./ui/button";

interface FeaturedStoryProps {
    story: ImpactStory;
}

export function FeaturedStory({ story }: FeaturedStoryProps) {
    if (!story) return null;

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                        <img src={story.imageUrl} alt={story.title} className="object-cover w-full h-full" />
                    </div>
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <span className="text-accent font-bold uppercase tracking-widest text-xs">Featured Story</span>
                            <h2 className="text-3xl md:text-5xl font-bold text-secondary font-headline leading-tight">
                                {story.title}
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                                {story.summary}
                            </p>
                        </div>
                        <Button asChild size="lg" className="h-14 px-10 font-bold bg-primary rounded-full">
                            <a href={`/impact-stories/${story.id}`}>Read Full Story</a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
