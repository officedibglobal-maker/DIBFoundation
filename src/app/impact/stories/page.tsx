'use client';

import { NextPage } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight } from 'lucide-react';

const stories = [
    {
        title: "A New Beginning: Bringing Healthcare to Rural Communities",
        description: "Read about our recent medical outreach program in northern Ghana, where we provided essential health services to over 500 people.",
        link: "/news/community-stories/a-new-beginning"
    },
    {
        title: "Empowering Youth: The Story of the DIBF Leadership Workshop",
        description: "Discover how our youth empowerment workshop is helping to shape the next generation of community leaders.",
        link: "/news/community-stories/empowering-youth"
    },
    {
        title: "From Knowledge to Action: A Researcher's Journey with DIBF",
        description: "Learn how one researcher's work with DIBF is contributing to new insights in public health.",
        link: "/news/research/knowledge-to-action"
    }
]

const StoriesPage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <BookOpen className="mx-auto h-12 w-12 text-primary"/>
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-4">
        Impact Stories
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        DIBF recognizes the power of knowledge, research, storytelling, and shared experiences to inform, inspire, and drive meaningful change. Here, we share stories from the communities we serve and the partners we work with.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
        {stories.map(story => (
            <div key={story.title} className="bg-white p-6 rounded-xl shadow-md flex flex-col">
                <h2 className="text-xl font-bold mb-2">{story.title}</h2>
                <p className="text-slate-700 flex-grow">{story.description}</p>
                <Button variant="link" asChild className="mt-4 self-start px-0">
                    <Link href={story.link}>Read Story <ArrowRight className="ml-2 h-4 w-4"/></Link>
                </Button>
            </div>
        ))}
    </div>

     <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Share Your Story</h2>
        <p className="text-slate-700 max-w-3xl mx-auto mb-6">
            Do you have a story about how DIBF has impacted your life or community? We would love to hear from you.
        </p>
        <Button asChild>
            <Link href="/contact">Contact Us</Link>
        </Button>
    </div>
  </div>
);

export default StoriesPage;
