'use client';

import { NextPage } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Rss, ArrowRight } from 'lucide-react';

const newsItems = [
    {
        title: "DIBF Launches New Youth Leadership Program in Partnership with Local Schools",
        date: "October 26, 2023",
        excerpt: "The new program aims to equip young people with the skills and confidence to become leaders in their communities.",
        link: "/news/dibf-launches-youth-leadership-program"
    },
    {
        title: "A New Beginning: Bringing Healthcare to Rural Communities",
        date: "October 15, 2023",
        excerpt: "Read about our recent medical outreach program in northern Ghana, where we provided essential health services to over 500 people.",
        link: "/news/community-stories/a-new-beginning"
    },
    {
        title: "DIBF and University of Toronto to Collaborate on Global Health Research",
        date: "September 28, 2023",
        excerpt: "The partnership will focus on developing innovative solutions to pressing health challenges in sub-Saharan Africa.",
        link: "/news/research/dibf-uoft-collaboration"
    }
]

const NewsPage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <Rss className="mx-auto h-12 w-12 text-primary"/>
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-4">
        News & Updates
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        Stay up-to-date with the latest news, stories, and announcements from the Doctors in Business Foundation.
      </p>
    </div>

    <div className="space-y-8 max-w-4xl mx-auto">
        {newsItems.map(item => (
            <div key={item.title} className="bg-white p-6 rounded-xl shadow-md">
                <p className="text-sm text-slate-500 mb-1">{item.date}</p>
                <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                <p className="text-slate-700 mb-4">{item.excerpt}</p>
                <Button variant="link" asChild className="px-0">
                    <Link href={item.link}>Read More <ArrowRight className="ml-2 h-4 w-4"/></Link>
                </Button>
            </div>
        ))}
    </div>

  </div>
);

export default NewsPage;
