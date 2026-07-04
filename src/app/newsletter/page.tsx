'use client';

import { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const NewsletterPage: NextPage = () => (
  <div className="bg-slate-50 py-16">
    <div className="container mx-auto px-4 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        Stay Connected
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        Subscribe to our newsletter for the latest updates on our projects, impact stories, and ways to get involved.
      </p>

      <form className="mt-8 mx-auto max-w-md">
        <div className="flex gap-4">
          <Input type="email" placeholder="Enter your email" className="flex-1" />
          <Button type="submit">Subscribe</Button>
        </div>
      </form>
    </div>
  </div>
);

export default NewsletterPage;
