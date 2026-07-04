'use client';

import { NextPage } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart } from 'lucide-react';

const GivePage: NextPage = () => (
  <div className="bg-slate-50">
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Heart className="mx-auto h-12 w-12 text-primary"/>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-4">
          Your Gift Makes a Difference
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
          Your generosity fuels our work and brings us closer to a world where everyone has access to the healthcare they need. Thank you for being a part of our community.
        </p>
      </div>

      <Tabs defaultValue="dollar-a-day" className="w-full max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dollar-a-day">Dollar-A-Day</TabsTrigger>
            <TabsTrigger value="one-time">Give Once</TabsTrigger>
        </TabsList>
        <TabsContent value="dollar-a-day">
            <Card>
                 <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Join the Dollar-A-Day Campaign</CardTitle>
                    <CardDescription>Become a sustaining partner in our mission. For just $1 a day, you can provide steady, reliable support for our long-term healthcare priorities.</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-5xl font-bold">$30</p>
                    <p className="text-slate-600">per month</p>
                </CardContent>
                <CardFooter className="flex-col space-y-4">
                    <Button size="lg" className="w-full" asChild><Link href="/campaigns/dollar-a-day">Give Monthly</Link></Button>
                    <Button variant="outline" className="w-full" asChild><Link href="/give">Give a Different Amount</Link></Button>
                </CardFooter>
            </Card>
        </TabsContent>
         <TabsContent value="one-time">
             <Card>
                 <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Make a One-Time Donation</CardTitle>
                    <CardDescription>Every gift, no matter the size, makes a difference. Make a one-time donation to support our most immediate needs.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center space-x-2">
                    <Button variant="outline" size="lg" asChild><Link href="/give">$50</Link></Button>
                    <Button variant="outline" size="lg" asChild><Link href="/give">$100</Link></Button>
                    <Button variant="outline" size="lg" asChild><Link href="/give">$250</Link></Button>
                    <Button variant="outline" size="lg" asChild><Link href="/give">$500</Link></Button>
                </CardContent>
                <CardFooter className="flex-col space-y-4">
                    <Button size="lg" className="w-full" asChild><Link href="/give">Donate Now</Link></Button>
                    <p className="text-sm text-slate-600">Or enter a custom amount</p>
                </CardFooter>
            </Card>
        </TabsContent>
      </Tabs>

    </div>
  </div>
);

export default GivePage;
