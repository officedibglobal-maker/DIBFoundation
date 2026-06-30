
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileImage,
  Target,
  BarChart2,
  Rocket,
  Sparkles,
  Users,
  Calendar,
  Newspaper,
  Book,
  Store,
  ShoppingBag,
  ShoppingCart,
  Settings,
  Mail,
  UserCheck,
  Mails,
  Send,
  Heart,
  Settings2,
  Globe,
  Navigation,
  Footprints,
  Search,
  Library,
  Database,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface NavItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  children?: NavItem[];
}

const sidebarNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Website Content",
    icon: Globe,
    children: [
      { title: "Hero Slides", href: "/admin/hero-slides", icon: FileImage },
      { title: "Focus Areas", href: "/admin/focus-areas", icon: Target },
      { title: "Impact Statistics", href: "/admin/impact-stats", icon: BarChart2 },
      { title: "Initiatives", href: "/admin/initiatives", icon: Rocket },
      { title: "Impact Stories", href: "/admin/impact-stories", icon: Sparkles },
      { title: "Partners", href: "/admin/partners", icon: Users },
      { title: "Events", href: "/admin/events", icon: Calendar },
      { title: "News", href: "/admin/news", icon: Newspaper },
      { title: "Team Members", href: "/admin/team", icon: Users },
      { title: "Publications", href: "/admin/publications", icon: Book },
    ],
  },
  {
    title: "Impact Store",
    icon: Store,
    children: [
      { title: "Products", href: "/admin/impact-store/products", icon: ShoppingBag },
      { title: "Categories", href: "/admin/impact-store/categories", icon: ShoppingCart },
      { title: "Orders", href: "/admin/impact-store/orders", icon: ShoppingCart },
      { title: "Settings", href: "/admin/impact-store/settings", icon: Settings },
    ],
  },
    {
    title: "Engagement",
    icon: Mail,
    children: [
      { title: "Contact Messages", href: "/admin/contact-messages", icon: Mails },
      { title: "Volunteer Requests", href: "/admin/volunteer-requests", icon: UserCheck },
      {
        title: "Newsletter",
        icon: Send,
        children: [
          { title: "Subscribers", href: "/admin/newsletter/subscribers", icon: Users },
          { title: "Campaigns", href: "/admin/newsletter/campaigns", icon: Mails },
          { title: "Settings", href: "/admin/newsletter/settings", icon: Settings },
        ],
      },
    ],
  },
  {
    title: "Fundraising",
    icon: Heart,
    children: [
      { title: "Donations", href: "/admin/donations", icon: Heart },
      { title: "Settings", href: "/admin/donations/settings", icon: Settings },
    ],
  },
  {
    title: "Website Configuration",
    icon: Settings2,
    children: [
      { title: "General Settings", href: "/admin/settings", icon: Settings },
      { title: "Navigation", href: "/admin/navigation", icon: Navigation },
      { title: "Footer", href: "/admin/footer", icon: Footprints },
      { title: "SEO Settings", href: "/admin/seo", icon: Search },
      { title: "Media Library", href: "/admin/media", icon: Library },
    ],
  },
  {
    title: "System",
    icon: ShieldCheck,
    children: [
      { title: "Data Seeder", href: "/admin/system/data-seeder", icon: Database },
      { title: "Firebase Diagnostics", href: "/admin/system/diagnostics", icon: ShieldCheck },
    ],
  },
];

export function NewSidebar() {
  const pathname = usePathname();

  const renderNav = (items: NavItem[], level = 0) => {
    return items.map((item) => {
      const isActive = item.href ? pathname.startsWith(item.href) : false;
      const isParentActive = item.children && item.children.some(child => child.href && pathname.startsWith(child.href));

      if (item.children) {
        return (
          <Collapsible key={item.title} defaultOpen={isParentActive}>
            <CollapsibleTrigger className="w-full">
              <div className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 hover:text-white ${isParentActive ? "bg-gray-700 text-white" : "text-gray-300"}`}>
                <div className="flex items-center">
                  <item.icon className="mr-3 h-5 w-5" />
                  <span>{item.title}</span>
                </div>
                <ChevronRight className="h-5 w-5 transform transition-transform duration-200 group-data-[state=open]:rotate-90" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4">
              {renderNav(item.children, level + 1)}
            </CollapsibleContent>
          </Collapsible>
        );
      }

      return (
        <Link
          key={item.href}
          href={item.href!}
          className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 hover:text-white ${isActive ? "bg-gray-700 text-white" : "text-gray-300"}`}
        >
          {item.icon && <item.icon className="mr-3 h-5 w-5" />}
          <span>{item.title}</span>
        </Link>
      );
    });
  };

  return (
    <aside className="w-64 shrink-0 bg-gray-900 text-white hidden md:block">
      <div className="p-5">
        <h2 className="text-2xl font-bold">DIBF Admin</h2>
      </div>
      <nav className="space-y-1 px-3">
        {renderNav(sidebarNavItems)}
        <hr className="my-3 border-gray-600" />
        <Link href="/" target="_blank" className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
          <Globe className="mr-3 h-5 w-5" />
          View Website
        </Link>
      </nav>
    </aside>
  );
}
