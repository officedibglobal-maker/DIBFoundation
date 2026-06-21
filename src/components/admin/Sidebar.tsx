
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Newspaper, FileText, Landmark, Handshake, Users, Calendar, BarChart, Settings, Mail, Bot } from "lucide-react";

const mainNavLinks = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/content/pages", label: "Pages", icon: FileText },
    { href: "/admin/content/navigation", label: "Navigation", icon: BarChart },
    { href: "/admin/content/hero-slides", label: "Hero Slides", icon: Landmark },
    { href: "/admin/content/focus-areas", label: "Focus Areas", icon: Handshake },
    { href: "/admin/content/initiatives", label: "Initiatives", icon: Users },
    { href: "/admin/content/impact-stories", label: "Impact Stories", icon: Newspaper },
    { href: "/admin/content/news", label: "News", icon: Newspaper },
    { href: "/admin/content/events", label: "Events", icon: Calendar },
    { href: "/admin/content/team-members", label: "Team Members", icon: Users },
    { href: "/admin/content/partners", label: "Partners", icon: Handshake },
];

const secondaryNavLinks = [
    { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
    { href: "/admin/system", label: "System", icon: Settings },
    { href: "/admin/system/data-seeder", label: "Data Seeder", icon: Bot },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-[60px] items-center border-b px-6">
                    <Link className="flex items-center gap-2 font-semibold" href="/admin">
                        <Landmark className="h-6 w-6" />
                        <span>DIB Foundation</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        {mainNavLinks.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={label}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${pathname === href ? "bg-gray-200/50 text-gray-900" : ""}`}
                                href={href}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </Link>
                        ))}
                    </nav>
                    <hr className="my-4" />
                    <nav className="grid items-start px-4 text-sm font-medium">
                        {secondaryNavLinks.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={label}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${pathname === href ? "bg-gray-200/50 text-gray-900" : ""}`}
                                href={href}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}
