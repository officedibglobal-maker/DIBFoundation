
"use client";

import * as React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Heart, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFirestore } from "@/firebase/firestore/use-firestore";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const foundationLinks = [
  { href: '/about', label: 'About DIBF' },
  { href: '/about/mission-vision', label: 'Mission & Vision' },
  { href: '/about/leadership-governance', label: 'Leadership & Governance' },
  { href: '/contact', label: 'Contact' },
];

const ourWorkLinks = [
  { href: '/what-we-do/medical-outreach-community-health', label: 'Medical Outreach' },
  { href: '/what-we-do/public-health-education', label: 'Public Health Education' },
  { href: '/what-we-do/youth-student-impact', label: 'Youth Impact' },
  { href: '/what-we-do/mental-health-wellbeing', label: 'Mental Health' },
  { href: '/what-we-do/sustainable-giving-initiatives', label: 'Sustainable Giving' },
];

const initiativesLinks = [
  { href: '/initiatives/tinewonsa-project', label: 'Tinewonsa Project' },
  { href: '/campaigns/dollar-a-day', label: 'Dollar-A-Day Campaign' },
  { href: '/initiatives/dib-african-field-school', label: 'DIB African Field School' },
  { href: '/impact-store', label: 'Impact Store' },
];

const getInvolvedLinks = [
  { href: '/get-involved/volunteer', label: 'Volunteer' },
  { href: '/give', label: 'Donate' },
  { href: '/get-involved/partner', label: 'Partner With Us' },
  { href: '/get-involved/support-a-campaign', label: 'Support a Campaign' },
];

const impactLinks = [
  { href: '/impact/stories', label: 'Stories' },
  { href: '/impact/outreach-reports', label: 'Reports' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/publications', label: 'Publications' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { db, status } = useFirestore();
  const { toast } = useToast();
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status !== 'ready' || !db || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'newsletterSubscriptions'), {
        email,
        subscribedAt: serverTimestamp(),
        status: 'active'
      });
      toast({
        title: "Subscribed!",
        description: "Thank you for joining our community. We'll keep you updated on our impact.",
      });
      setEmail('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Subscription failed",
        description: "We couldn't process your request. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const FooterLinkGroup = ({ title, links }: { title: string, links: { href: string, label: string }[] }) => (
    <div className='space-y-6'>
      <h3 className="font-bold text-lg border-l-4 border-primary pl-3">{title}</h3>
      <ul className="space-y-3 text-white/60 text-sm">
        {links.map(link => (
          <li key={link.href}><Link href={link.href} className="hover:text-accent transition-colors">{link.label}</Link></li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="bg-secondary text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Purpose */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg text-white font-bold text-xl">DIBF</div>
              <span className="font-bold text-xl">DIBF Global Impact</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Advancing Health, Human Dignity, and Sustainable Development Across Africa and the Global Community. 
              DIBF is the nonprofit arm of Doctors in Business Global.
            </p>
            <div className="flex gap-4">
              <Link href="https://www.facebook.com/DoctorsInBusiness" className="p-2 bg-white/5 rounded-full hover:bg-primary transition-colors"><Facebook className="w-4 h-4" /></Link>
              <Link href="https://www.twitter.com/DIBF" className="p-2 bg-white/5 rounded-full hover:bg-primary transition-colors"><Twitter className="w-4 h-4" /></Link>
              <Link href="https://www.instagram.com/dibfoundation" className="p-2 bg-white/5 rounded-full hover:bg-primary transition-colors"><Instagram className="w-4 h-4" /></Link>
              <Link href="https://www.linkedin.com/company/doctors-in-business-dib" className="p-2 bg-white/5 rounded-full hover:bg-primary transition-colors"><Linkedin className="w-4 h-4" /></Link>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="space-y-10 lg:pl-8">
            <FooterLinkGroup title="Foundation" links={foundationLinks} />
            <FooterLinkGroup title="Get Involved" links={getInvolvedLinks} />
          </div>

          {/* Links Column 2 */}
          <div className="space-y-10">
            <FooterLinkGroup title="Our Work" links={ourWorkLinks} />
            <FooterLinkGroup title="Impact" links={impactLinks} />
          </div>

          {/* Initiatives & Newsletter */}
          <div className="space-y-10">
            <FooterLinkGroup title="Initiatives" links={initiativesLinks} />
            <div className='space-y-6'>
              <h3 className="font-bold text-lg border-l-4 border-primary pl-3">Get Updates</h3>
              <p className="text-xs text-white/50 italic">Join our community for impact updates and news.</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address" 
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30" 
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={isSubmitting || status !== 'ready'}
                  className="shrink-0"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </form>
              <Button asChild className="w-full gap-2 font-bold" variant="default">
                <Link href="/give">
                  <Heart className="w-4 h-4 fill-current" />
                  Support Our Mission
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/40 text-xs">
          <p>© {currentYear} Doctors in Business Foundation (DIBF). All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-use" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
