
"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, MapPin, Send, MessageCircle, Handshake, Users, Info, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { addDoc, collection, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { useFirestore } from '@/firebase/firestore/use-firestore';

const ContactSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  organization: z.string().optional(),
  inquiryType: z.string().min(1, "Please select an inquiry type"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const NewsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

function NewsletterSubscriptionForm() {
  const { toast } = useToast();
  const { db, status } = useFirestore();

  const form = useForm<z.infer<typeof NewsletterSchema>>({
    resolver: zodResolver(NewsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof NewsletterSchema>) {
    if (status !== 'ready' || !db) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Database not ready, please try again."
        });
        return;
    };
    try {
      // Check for existing subscriber
      const q = query(collection(db, "newsletterSubscribers"), where("email", "==", data.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast({
          variant: "default",
          title: "Already Subscribed",
          description: "This email is already on our mailing list.",
        });
        return;
      }
      
      await addDoc(collection(db, "newsletterSubscribers"), {
        email: data.email,
        status: "active",
        source: "Website Contact Form",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({
        title: "Subscription Successful!",
        description: "Thank you for subscribing to DIB Foundation updates.",
      });
      form.reset();
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to subscribe. Please try again.",
      });
    }
  }

  return (
    <div className="container mx-auto px-4 mt-12">
        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-2xl font-headline font-bold text-secondary">Subscribe to Our Newsletter</CardTitle>
            <CardDescription>Get the latest updates from the DIB Foundation directly in your inbox.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="font-bold" disabled={status !== 'ready'}>
                  Subscribe
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
  );
}

function ContactForm() {
  const { toast } = useToast();
  const { db, status } = useFirestore();
  const searchParams = useSearchParams();
  const { items, clearCart, totalPrice } = useCart();
  const isStoreInquiry = searchParams.get('type') === 'store-inquiry';

  const form = useForm<z.infer<typeof ContactSchema>>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      organization: "",
      inquiryType: isStoreInquiry ? "store-inquiry" : "",
      message: isStoreInquiry 
        ? `I am interested in inquiring about the following items from the DIBF Impact Store: \n${items.map(i => `- ${i.name} (x${i.quantity})`).join('\n')}\n\nTotal Estimated Contribution: $${totalPrice().toFixed(2)}`
        : "",
    },
  });

  async function onSubmit(data: z.infer<typeof ContactSchema>) {
    if (status !== 'ready' || !db) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Database not ready, please try again."
        });
        return;
    };
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...data,
        cartItems: isStoreInquiry ? items : null,
        createdAt: serverTimestamp(),
      });
      toast({
        title: "Inquiry Sent!",
        description: "We've received your message and will get back to you within 48 hours.",
      });
      if (isStoreInquiry) clearCart();
      form.reset();
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to send message. Please try again." });
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <section className="bg-secondary text-white py-24 text-center">
        <div className="container mx-auto px-4 max-w-3xl space-y-6">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">
            {isStoreInquiry ? "Impact Store Inquiry" : "Connect With Us"}
          </h1>
          <p className="text-xl text-white/70 leading-relaxed">
            {isStoreInquiry 
              ? "Tell us more about your interest in our purpose-driven products. Our team will coordinate delivery and impact tracking with you."
              : "Whether you are looking to partner, volunteer, or simply learn more about our work, our team is here to help."}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {isStoreInquiry && items.length > 0 && (
              <Card className="shadow-lg border-primary/20 overflow-hidden">
                <CardHeader className="bg-primary text-white">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Your Inquiry Cart
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3 text-sm">
                      <div className="w-12 h-12 relative rounded border shrink-0">
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover rounded" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-bold text-secondary">
                    <span>Est. Total</span>
                    <span>${totalPrice().toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-lg border-none">
              <CardContent className="p-8 space-y-8 text-sm">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary">Email Support</h4>
                    <p className="text-muted-foreground">info@dibf.org</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary">Phone</h4>
                    <p className="text-muted-foreground">+233 54 123 4567</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="lg:col-span-2 shadow-xl border-none">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-2xl font-headline font-bold text-secondary">Send a Message</CardTitle>
              <CardDescription>We typically respond within 48 hours to all inquiries.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="john@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  
                  <FormField name="inquiryType" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inquiry Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select interest" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="store-inquiry">Impact Store Inquiry</SelectItem>
                          <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                          <SelectItem value="volunteer">Volunteer Application</SelectItem>
                          <SelectItem value="general">General Information</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Message</FormLabel>
                      <FormControl><Textarea placeholder="How can we help?" className="min-h-[150px]" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button type="submit" className="w-full h-14 font-bold text-lg gap-2" disabled={status !== 'ready'}>
                    <Send className="w-5 h-5" />
                    Submit Inquiry
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


export default function ContactPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ContactForm />
      <NewsletterSubscriptionForm />
    </React.Suspense>
  )
}
