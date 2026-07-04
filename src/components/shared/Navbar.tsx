'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Heart, ShoppingCart, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { CartDrawer } from '@/components/store/CartDrawer';
import { useCart } from '@/hooks/use-cart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type NavItem = {
  label: string;
  href?: string;
  items?: {
    href: string;
    label: string;
    description?: string;
  }[];
};

const NAV_ITEMS: NavItem[] = [
  {
    label: 'About',
    items: [
      { href: '/about', label: 'Who We Are' },
      { href: '/about#mission', label: 'Mission & Vision' },
      { href: '/about#leadership', label: 'Leadership & Governance' },
    ],
  },
  {
    label: 'What We Do',
    items: [
      { href: '/what-we-do', label: 'Our Programs' },
      { href: '/what-we-do#medical-outreach', label: 'Medical Outreach' },
      { href: '/what-we-do#public-health', label: 'Public Health Education' },
      { href: '/what-we-do#youth-impact', label: 'Youth & Student Impact' },
      { href: '/what-we-do#mental-health', label: 'Mental Health & Wellbeing' },
      { href: '/what-we-do#sustainable-giving', label: 'Sustainable Giving' },
    ],
  },
  {
    label: 'Initiatives',
    items: [
      { href: '/initiatives', label: 'All Initiatives' },
      { href: '/initiatives#tinewonsa', label: 'The Tinewonsa Project' },
      { href: '/initiatives#dollar-a-day', label: 'Dollar-A-Day Campaign' },
      { href: '/initiatives#field-school', label: 'African Field School' },
      { href: '/impact-store', label: 'DIBF Impact Store' },
    ],
  },
  {
    label: 'Impact',
    items: [
      { href: '/impact', label: 'Impact Overview' },
      { href: '/impact#stories', label: 'Stories of Impact' },
      { href: '/impact#reports', label: 'Outreach Reports' },
      { href: '/impact#gallery', label: 'Photo & Video Gallery' },
    ],
  },
  {
    label: 'Partnerships',
    items: [
      { href: '/partnerships', label: 'Partner With Us' },
      { href: '/partnerships#corporate', label: 'Corporate Partnerships' },
      { href: '/partnerships#universities', label: 'University Collaborations' },
      { href: '/partnerships#csr', label: 'CSR Opportunities' },
    ],
  },
  {
    label: 'Get Involved',
    items: [
      { href: '/get-involved', label: 'Ways to Get Involved' },
      { href: '/get-involved#volunteer', label: 'Volunteer' },
      { href: '/get-involved#bring-a-team', label: 'Bring a Team' },
      { href: '/get-involved#campaigns', label: 'Support a Campaign' },
      { href: '/give', label: 'Donate' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { href: '/news', label: 'News & Articles' },
      { href: '/publications', label: 'Publications' },
      { href: '/impact#stories', label: 'Community Stories' },
      { href: '/impact#reports', label: 'Reports' },
    ],
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const cartCount = useCart((state) => state.totalItems());

  React.useEffect(() => {
    setMounted(true);

    const handleScroll = () => setIsScrolled(window.scrollY > 20);

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActiveLink = (href?: string) => {
    if (!href) return false;

    const cleanHref = href.split('#')[0];

    if (cleanHref === '/') {
      return pathname === '/';
    }

    return pathname === cleanHref || pathname.startsWith(`${cleanHref}/`);
  };

  const isActiveGroup = (item: NavItem) => {
    if (item.href && isActiveLink(item.href)) return true;
    return item.items?.some((child) => isActiveLink(child.href)) ?? false;
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white py-3'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center shrink-0" aria-label="Doctors in Business Foundation Home">
          <Image
            src="/images/brand/dibf-logo-cropped.png"
            alt="Doctors in Business Foundation"
            width={280}
            height={90}
            priority
            className={cn(
              'w-auto object-contain transition-all duration-300',
              isScrolled ? 'h-12' : 'h-14'
            )}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center justify-end gap-5">
          {NAV_ITEMS.map((item) => {
            const active = isActiveGroup(item);

            if (item.items) {
              return (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger
                    className={cn(
                      'flex items-center gap-1 text-sm font-semibold outline-none transition-colors hover:text-primary',
                      active ? 'text-primary' : 'text-secondary/80'
                    )}
                  >
                    {item.label}
                    <ChevronDown className="w-4 h-4 opacity-60" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    className="w-64 p-2 rounded-xl shadow-2xl border-muted"
                  >
                    {item.items.map((child) => (
                      <DropdownMenuItem key={`${item.label}-${child.label}`} asChild>
                        <Link
                          href={child.href}
                          className={cn(
                            'w-full cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted',
                            isActiveLink(child.href) && 'bg-muted text-primary'
                          )}
                        >
                          {child.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href || '/'}
                className={cn(
                  'text-sm font-semibold transition-colors hover:text-primary',
                  active ? 'text-primary' : 'text-secondary/80'
                )}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="flex items-center gap-3 ml-2">
            <CartDrawer>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 hover:bg-muted rounded-full"
                aria-label="Open cart"
              >
                <ShoppingCart className="w-5 h-5 text-secondary" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50">
                    {cartCount}
                  </span>
                )}
              </Button>
            </CartDrawer>

            <Button
              asChild
              className="gap-2 px-7 h-11 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
            >
              <Link href="/give">
                <Heart className="w-4 h-4 fill-current" />
                Give
              </Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Nav */}
        <div className="xl:hidden flex items-center gap-3">
          <CartDrawer>
            <Button variant="ghost" size="icon" className="relative h-9 w-9" aria-label="Open cart">
              <ShoppingCart className="w-4 h-4" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Button>
          </CartDrawer>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[320px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Image
                    src="/images/brand/dibf-logo-cropped.png"
                    alt="Doctors in Business Foundation"
                    width={230}
                    height={80}
                    priority
                    className="h-14 w-auto object-contain"
                  />
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-5 mt-8">
                {NAV_ITEMS.map((item) => (
                  <div key={item.label} className="space-y-3">
                    {item.href && !item.items ? (
                      <Link
                        href={item.href}
                        className={cn(
                          'block text-sm font-bold uppercase tracking-widest transition-colors hover:text-primary',
                          isActiveLink(item.href) ? 'text-primary' : 'text-secondary'
                        )}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                          {item.label}
                        </p>

                        <div className="flex flex-col gap-2 pl-2">
                          {item.items?.map((child) => (
                            <Link
                              key={`${item.label}-${child.label}`}
                              href={child.href}
                              className={cn(
                                'text-sm font-medium text-secondary/80 hover:text-primary transition-colors',
                                isActiveLink(child.href) && 'text-primary font-bold'
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}

                <Button asChild className="mt-2 gap-2 rounded-full font-bold">
                  <Link href="/give">
                    <Heart className="w-4 h-4 fill-current" />
                    Give
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}