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

type NavChild = {
  href: string;
  label: string;
};

type NavSection = {
  heading: string;
  items: NavChild[];
};

type NavItem = {
  label: string;
  sections: NavSection[];
};

const NAV_ITEMS: NavItem[] = [
  {
    label: 'About',
    sections: [
      {
        heading: 'About DIBF',
        items: [
          { href: '/about', label: 'Who We Are' },
          { href: '/about/mission-vision', label: 'Mission & Vision' },
          { href: '/about/our-team', label: 'Our Team' },
          {
            href: '/about/leadership-governance',
            label: 'Leadership & Governance',
          },
        ],
      },
      {
        heading: 'Contact',
        items: [
          { href: '/contact', label: 'Contact Form' },
          {
            href: '/contact/partnership-inquiries',
            label: 'Partnership Inquiries',
          },
          {
            href: '/contact/volunteer-inquiries',
            label: 'Volunteer Inquiries',
          },
          { href: '/contact/media-requests', label: 'Media Requests' },
        ],
      },
    ],
  },
  {
    label: 'Our Work',
    sections: [
      {
        heading: 'What We Do',
        items: [
          {
            href: '/what-we-do/medical-outreach-community-health',
            label: 'Medical Outreach & Community Health',
          },
          {
            href: '/what-we-do/public-health-education',
            label: 'Public Health Education',
          },
          {
            href: '/what-we-do/youth-student-impact',
            label: 'Youth & Student Impact',
          },
          {
            href: '/what-we-do/mental-health-wellbeing',
            label: 'Mental Health & Wellbeing',
          },
          {
            href: '/what-we-do/sustainable-giving-initiatives',
            label: 'Sustainable Giving Initiatives',
          },
        ],
      },
      {
        heading: 'Our Initiatives',
        items: [
          {
            href: '/initiatives/tinewonsa-project',
            label: 'Tinewonsa Project',
          },
          {
            href: '/campaigns/dollar-a-day',
            label: 'Dollar-A-Day Campaign',
          },
          {
            href: '/initiatives/dib-african-field-school',
            label: 'DIB African Field School',
          },
          {
            href: '/impact-store',
            label: 'DIBF Impact Store',
          },
        ],
      },
    ],
  },
  {
    label: 'Impact',
    sections: [
      {
        heading: 'Impact',
        items: [
          { href: '/impact/stories', label: 'Stories of Impact' },
          { href: '/impact/outreach-reports', label: 'Outreach Reports' },
          {
            href: '/impact/community-highlights',
            label: 'Community Highlights',
          },
          { href: '/gallery', label: 'Photo & Video Gallery' },
        ],
      },
      {
        heading: 'News & Insights',
        items: [
          { href: '/news/articles', label: 'Articles' },
          { href: '/news/research', label: 'Research' },
          { href: '/publications', label: 'Publications' },
          { href: '/news/community-stories', label: 'Community Stories' },
        ],
      },
    ],
  },
  {
    label: 'Get Involved',
    sections: [
      {
        heading: 'Get Involved',
        items: [
          { href: '/get-involved/volunteer', label: 'Volunteer' },
          { href: '/give', label: 'Donate' },
          { href: '/get-involved/partner', label: 'Partner With Us' },
          {
            href: '/get-involved/team-or-institution',
            label: 'Bring a Team or Institution',
          },
          {
            href: '/get-involved/support-a-campaign',
            label: 'Support a Campaign',
          },
        ],
      },
      {
        heading: 'Partnerships',
        items: [
          {
            href: '/partnerships/corporate',
            label: 'Corporate Partnerships',
          },
          {
            href: '/partnerships/university-collaborations',
            label: 'University Collaborations',
          },
          {
            href: '/partnerships/development-research',
            label: 'Development & Research Partnerships',
          },
          {
            href: '/partnerships/csr-opportunities',
            label: 'CSR Opportunities',
          },
        ],
      },
    ],
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const cartCount = useCart((state) => state.totalItems());

  React.useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActiveLink = (href: string) => {
    const cleanHref = href.split('#')[0];

    if (cleanHref === '/') {
      return pathname === '/';
    }

    return pathname === cleanHref || pathname.startsWith(`${cleanHref}/`);
  };

  const isActiveGroup = (item: NavItem) => {
    return item.sections.some((section) =>
      section.items.some((child) => isActiveLink(child.href))
    );
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-white transition-all duration-300',
        isScrolled
          ? 'border-b border-slate-200 shadow-sm'
          : 'border-b border-transparent'
      )}
    >
      <div
        className={cn(
          'mx-auto flex w-full max-w-[1500px] items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 transition-all duration-300',
          isScrolled ? 'h-[68px]' : 'h-[76px]'
        )}
      >
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="Doctors in Business Foundation Home"
        >
          <Image
            src="/images/brand/dibf-logo-cropped.png"
            alt="Doctors in Business Foundation"
            width={280}
            height={90}
            priority
            className={cn(
              'w-auto object-contain transition-all duration-300',
              isScrolled ? 'h-11 xl:h-12' : 'h-12 xl:h-14'
            )}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-1 items-center justify-end gap-8">
          <div className="flex items-center justify-end gap-8">
            {NAV_ITEMS.map((item) => {
              const active = isActiveGroup(item);

              return (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger
                    className={cn(
                      'group flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold outline-none transition-colors',
                      active
                        ? 'text-primary'
                        : 'text-slate-800 hover:text-primary'
                    )}
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    sideOffset={18}
                    className="w-[620px] rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl"
                  >
                    <div className="grid grid-cols-2 gap-5">
                      {item.sections.map((section) => (
                        <div key={`${item.label}-${section.heading}`}>
                          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                            {section.heading}
                          </p>

                          <div className="space-y-1">
                            {section.items.map((child) => (
                              <DropdownMenuItem
                                key={`${section.heading}-${child.label}`}
                                asChild
                                className="p-0"
                              >
                                <Link
                                  href={child.href}
                                  className={cn(
                                    'block w-full rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition-colors hover:bg-slate-50 hover:text-primary',
                                    isActiveLink(child.href) &&
                                      'bg-primary/10 text-primary'
                                  )}
                                >
                                  {child.label}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            })}
          </div>

          <div className="flex items-center gap-4 pl-2">
            <CartDrawer>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-11 w-11 rounded-full text-slate-700 hover:bg-slate-100 hover:text-primary"
                aria-label="Open cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow">
                    {cartCount}
                  </span>
                )}
              </Button>
            </CartDrawer>

            <Button
              asChild
              className="h-12 rounded-full px-8 text-sm font-bold shadow-lg transition-transform hover:scale-[1.03]"
            >
              <Link href="/give" className="gap-2">
                <Heart className="h-4 w-4 fill-current" />
                Give
              </Link>
            </Button>
          </div>
        </nav>

        {/* Mobile / Tablet Navigation */}
        <div className="flex items-center gap-2 lg:hidden">
          <CartDrawer>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-full"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {mounted && cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[8px] font-bold text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Button>
          </CartDrawer>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[360px] overflow-y-auto">
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

              <nav className="mt-8 flex flex-col gap-7 pb-8">
                {NAV_ITEMS.map((item) => (
                  <div key={item.label} className="space-y-4">
                    <p className="text-base font-bold text-primary">
                      {item.label}
                    </p>

                    {item.sections.map((section) => (
                      <div
                        key={`${item.label}-${section.heading}`}
                        className="space-y-2"
                      >
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                          {section.heading}
                        </p>

                        <div className="flex flex-col gap-1 border-l border-slate-200 pl-4">
                          {section.items.map((child) => (
                            <Link
                              key={`${section.heading}-${child.label}`}
                              href={child.href}
                              className={cn(
                                'rounded-lg px-2 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-primary',
                                isActiveLink(child.href) &&
                                  'bg-primary/10 font-bold text-primary'
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                <Button asChild className="mt-2 h-12 rounded-full font-bold">
                  <Link href="/give" className="gap-2">
                    <Heart className="h-4 w-4 fill-current" />
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