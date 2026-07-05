import type { ReactNode } from "react";
import Link from "next/link";
import { Menu, Globe } from "lucide-react";

import { NewSidebar } from "@/components/admin/NewSidebar";
import { isAdminDevelopmentBypass } from "@/lib/auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const sidebarNavItems = [
  { title: "Dashboard", href: "/admin", icon: Menu },
  { title: "Site Pages", href: "/admin/site-pages", icon: Menu },
  { title: "Focus Areas", href: "/admin/focus-areas", icon: Menu },
  { title: "Team Members", href: "/admin/team-members", icon: Menu },
  { title: "Events", href: "/admin/events", icon: Menu },
  { title: "Newsletter", href: "/admin/newsletter", icon: Menu },
  { title: "Data Seeder", href: "/admin/system/data-seeder", icon: Menu },
];

function AdminMobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Globe className="h-6 w-6" />
            <span>DIBF Admin</span>
          </Link>

          {sidebarNavItems.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full">
      <div className="flex min-h-screen">
        <NewSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-gray-900/95 px-6 text-white md:hidden">
            <AdminMobileNav />
            <h2 className="text-xl font-bold">DIBF Admin</h2>
          </header>

          <main className="min-w-0 flex-1 bg-gray-50 p-6 dark:bg-gray-900/90">
            {isAdminDevelopmentBypass && (
              <div className="mb-6 rounded-lg border border-amber-400 bg-amber-50 p-4 text-amber-900">
                <p className="font-bold">Development Admin Access Enabled</p>
                <p className="text-sm">
                  Authentication checks are currently bypassed for development.
                </p>
              </div>
            )}

            {children}
          </main>
        </div>
      </div>
    </div>
  );
}