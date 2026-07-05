
import { getSitePageBySlug } from "@/lib/firebase/firestore/getSitePageBySlug";
import { SitePageRenderer } from "@/components/site/SitePageRenderer";
import { NextPage } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Newspaper, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const newsAndStories = [
    {
        title: "DIBF and University of Toronto Partner to Launch Global Health Innovation Hub",
        date: "October 26, 2023",
        excerpt: "The DIBF Global Health Innovation Hub at the University of Toronto will bring together researchers, entrepreneurs, and community partners to develop and scale solutions to pressing global health challenges.",
        link: "/news-and-stories/global-health-innovation-hub-launch"
    },
    {
        title: "Youth-Led Mental Health Initiatives Receive Support from DIBF",
        date: "October 10, 2023",
        excerpt: "In recognition of World Mental Health Day, DIBF is proud to announce funding for five new youth-led projects focused on promoting mental wellbeing and resilience in their communities.",
        link: "/news-and-stories/youth-mental-health-initiative-funding"
    },
    {
        title: "Field Report: Reflections from the 2023 African Field School",
        date: "September 15, 2023",
        excerpt: "Students from the 2023 African Field School share their experiences and insights from their time in Ghana, where they worked alongside local partners on community health projects.",
        link: "/news-and-stories/field-report-african-field-school-2023"
    }
];

const NewsAndStoriesPage: NextPage = async () => {
  const page = await getSitePageBySlug("news-and-stories");

  if (page && page.status === "published") {
    return <SitePageRenderer page={page} />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Newspaper className="mx-auto h-12 w-12 text-primary" />
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-4">
          News & Stories
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
          Stay up-to-date on our latest work, get inspired by stories of impact, and learn more about the issues we are passionate about.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {newsAndStories.map(story => (
            <Card key={story.title} className="flex flex-col">
                <CardHeader>
                    <CardTitle>{story.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm text-slate-600 mb-2">{story.date}</p>
                    <p className="text-slate-700">{story.excerpt}</p>
                </CardContent>
                <CardFooter>
                    <Button asChild variant="link" className="px-0">
                        <Link href={story.link}>Read More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </CardFooter>
            </Card>
        ))}
      </div>

    </div>
  );
};

export default NewsAndStoriesPage;
