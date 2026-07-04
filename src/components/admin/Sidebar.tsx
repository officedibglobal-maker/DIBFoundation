
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Newspaper,
    FileText,
    Landmark,
    Handshake,
    Users,
    Calendar,
    BarChart,
    Settings,
    Mail,
    Bot,
    ShoppingBag,
    Heart,
    Folder,
    Monitor,
    Shield,
    Image,
    ChevronDown,
    Globe
} from "lucide-react";
import { useState } from "react";

const navGroups = [
    {
        title: "Website Content",
        links: [
            { href: "/admin/hero-slides", label: "Hero Slides", icon: Landmark },
            { href: "/admin/focus-areas", label: "Focus Areas", icon: Handshake },
            { href: "/admin/impact-stories", label: "Impact Stories", icon: Newspaper },
            { href: "/admin/initiatives", label: "Initiatives", icon: Users },
            { href: "/admin/impact-stats", label: "Impact Statistics", icon: BarChart },
            { href: "/admin/partners", label: "Partners", icon: Handshake },
            { href: "/admin/events", label: "Events", icon: Calendar },
            { href: "/admin/team", label: "Team Members", icon: Users },
            { href: "/admin/publications", label: "Publications", icon: FileText },
        ]
    },
    {
        title: "Impact Store",
        links: [
            { href: "/admin/store/products", label: "Products", icon: ShoppingBag },
            { href: "/admin/store/categories", label: "Product Categories", icon: Folder },
            { href: "/admin/store/orders", label: "Orders", icon: Monitor },
            { href: "/admin/store/settings", label: "Store Settings", icon: Settings },
        ]
    },
    {
        title: "Engagement",
        links: [
            { href: "/admin/contact-messages", label: "Contact Messages", icon: Mail },
            { href: "/admin/volunteer-requests", label: "Volunteer Requests", icon: Heart },
            { href: "/admin/newsletter/subscribers", label: "Newsletter Subscribers", icon: Users },
            { href: "/admin/newsletter/settings", label: "Newsletter Settings", icon: Settings },
        ]
    },
    {
        title: "Fundraising",
        links: [
            { href: "/admin/donations", label: "Donations", icon: Heart },
            { href: "/admin/donations/settings", label: "Donation Settings", icon: Settings },
        ]
    },
    {
        title: "Website Management",
        links: [
            { href: "/admin/navigation", label: "Navigation", icon: BarChart },
            { href: "/admin/footer", label: "Footer", icon: Shield },
            { href: "/admin/settings", label: "General Settings", icon: Settings },
            { href: "/admin/seo", label: "SEO Settings", icon: Globe },
            { href: "/admin/media", label: "Media Library", icon: Image },
        ]
    },
    {
        title: "Developer Tools",
        links: [
            { href: "/admin/seed", label: "Data Seeder", icon: Bot },
            { href: "/admin/diagnostics", label: "Firestore Diagnostics", icon: Monitor },
        ]
    }
];

export function Sidebar() {
    const pathname = usePathname();
    const [openGroups, setOpenGroups] = useState<string[]>([]);

    const toggleGroup = (title: string) => {
        setOpenGroups(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]);
    }

    const isDevelopment = process.env.NODE_ENV === 'development';

    return (
        <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-[60px] items-center border-b px-6">
                    <Link className="flex items-center gap-2 font-semibold" href="/admin">
                        <Landmark className="h-6 w-6" />
                        <span>DIB Foundation</span>
                    </Link>
                </div>

                {isDevelopment && (
                    <div className="px-4 py-2">
                        <div className="rounded-lg bg-yellow-100 p-2 text-center text-xs font-semibold text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
                            Development Admin Access Enabled
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        <Link
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${pathname === "/admin" ? "bg-gray-200/50 text-gray-900" : ""}`}
                            href="/admin"
                        >
                            <Home className="h-4 w-4" />
                            Dashboard
                        </Link>

                        {navGroups.map(({ title, links }) => (
                            <div key={title} className="py-2">
                                <button
                                    onClick={() => toggleGroup(title)}
                                    className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                                >
                                    <span className="font-semibold">{title}</span>
                                    <ChevronDown className={`h-4 w-4 transform transition-transform ${openGroups.includes(title) ? 'rotate-180' : ''}`} />
                                </button>
                                {openGroups.includes(title) && (
                                    <div className="pt-2 pl-4">
                                        {links.map(({ href, label, icon: Icon }) => (
                                            <Link
                                                key={label}
                                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${pathname === href ? "bg-gray-200/50 text-gray-900" : ""}`}
                                                href={href}
                                            >
                                                <Icon className="h-4 w-4" />
                                                {label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}
