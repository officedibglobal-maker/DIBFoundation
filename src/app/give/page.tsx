
"use client";

import { useFirestore } from '@/firebase/firestore/use-firestore';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Heart, ShieldCheck, Globe, Zap } from 'lucide-react';
import { ScrollReveal, RevealItem } from '@/components/shared/ScrollReveal';

const DonationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  donationType: z.string().min(1, "Required"),
  initiative: z.string().min(1, "Required"),
  amount: z.string().min(1, "Amount is required"),
  message: z.string().optional(),
  consent: z.boolean().refine(val => val === true, "Consent required")
});

export default function GivePage() {
  const { db, status, error } = useFirestore();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof DonationSchema>>({
    resolver: zodResolver(DonationSchema),
    defaultValues: { fullName: "", email: "", phone: "", amount: "", consent: false }
  });

  async function onSubmit(values: z.infer<typeof DonationSchema>) {
    if (status !== 'ready' || !db) {
        toast({ variant: "destructive", title: "Error", description: "Database not ready. Please try again." });
        return;
    };
    try {
      await addDoc(collection(db, 'donations'), {
        ...values,
        amount: parseFloat(values.amount),
        createdAt: serverTimestamp()
      });
      toast({ title: "Thank You!", description: "Your donation intent has been recorded. Our team will contact you." });
      form.reset();
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to record donation. Please try again." });
    }
  }

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'error') {
    return <p>Error: {error?.message}</p>;
  }

  return (
    <div className="min-h-screen">
      <section className="bg-secondary text-white py-24 text-center">
        <div className="container mx-auto px-4 max-w-3xl space-y-6">
          <span className="text-accent font-bold uppercase tracking-widest text-sm">Support Our Mission</span>
          <h1 className="text-4xl md:text-6xl font-bold">Purposeful Giving for Lasting Impact</h1>
          <p className="text-xl text-white/80 leading-relaxed">
            Your contributions fuel sustainable healthcare, education, and community development across Africa.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <SectionHeader 
                title="Choose Your Support Path" 
                subtitle="Select a giving level that resonates with your vision for global health equity."
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: ShieldCheck, title: "100% Transparency", text: "Rigorous reporting and direct allocation to project sites." },
                  { icon: Zap, title: "Immediate Impact", text: "Donations are deployed within 30 days to active outreach missions." },
                  { icon: Globe, title: "Sustainable Models", text: "Focus on building resilient systems that continue providing value." },
                  { icon: Heart, title: "Community Vetted", text: "Programs designed by medical professionals and community leaders." }
                ].map((item, i) => (
                  <Card key={i} className="border-none shadow-md">
                    <CardContent className="pt-6 space-y-3">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-secondary">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="shadow-2xl border-none">
              <CardHeader className="bg-muted/30 p-8">
                <CardTitle className="text-2xl font-bold text-secondary">Make a Contribution</CardTitle>
                <CardDescription>Fill out the form below to initiate your donation.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField control={form.control} name="fullName" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="john@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField control={form.control} name="donationType" render={({ field }) => (
                        <FormItem><FormLabel>Donation Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                          <SelectContent><SelectItem value="one-time">One-time Giving</SelectItem><SelectItem value="monthly">Monthly Giving</SelectItem><SelectItem value="corporate">Corporate Giving</SelectItem></SelectContent></Select>
                        <FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="initiative" render={({ field }) => (
                        <FormItem><FormLabel>Preferred Initiative</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select initiative" /></SelectTrigger></FormControl>
                          <SelectContent><SelectItem value="tinewonsa">The Tinewonsa Project</SelectItem><SelectItem value="dollar-day">Dollar-A-Day Campaign</SelectItem><SelectItem value="general">General Fund</SelectItem></SelectContent></Select>
                        <FormMessage /></FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="amount" render={({ field }) => (
                      <FormItem><FormLabel>Donation Amount (USD)</FormLabel><FormControl><Input type="number" placeholder="50.00" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />

                    <FormField control={form.control} name="consent" render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>I agree to the terms and privacy policy regarding donation recording.</FormLabel>
                        </div>
                      </FormItem>
                    )} />

                    <Button type="submit" className="w-full h-14 font-bold text-lg gap-2 shadow-lg" disabled={status !== 'ready'}>
                      <Heart className="w-5 h-5" />
                      Complete Donation
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
