
import type { ReactNode } from "react";
import { NewSidebar } from "@/components/admin/NewSidebar";
import { isAdminDevelopmentBypass } from "@/lib/auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Globe } from "lucide-react";
import Link from "next/link";

const sidebarNavItems = [
    { title: "Dashboard", href: "/admin", icon: Menu },
    // ... add all other nav items here for mobile view
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
                    <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                        <Globe className="h-6 w-6" />
                        <span className="sr-only">DIBF</span>
                    </Link>
                    {sidebarNavItems.map(item => (
                        <Link href={item.href} key={item.href} className="hover:text-foreground">
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
        <div className="flex flex-col flex-1">
          <header className="flex h-14 items-center gap-4 border-b bg-gray-900/95 px-6 text-white md:hidden">
            <AdminMobileNav />
            <h2 className="text-xl font-bold">DIBF Admin</h2>
          </header>
          <main className="min-w-0 flex-1 p-6 bg-gray-50 dark:bg-gray-900/90">
            {isAdminDevelopmentBypass && (
              <div className="mb-6 rounded-lg border border-amber-400 bg-amber-50 p-4 text-amber-900">
                <p className="font-bold">Development Admin Access Enabled</p>
                <p className="text-sm">Authentication checks are currently bypassed for development.</p>
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
