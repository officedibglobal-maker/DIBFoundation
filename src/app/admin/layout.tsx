
import type { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className="w-64 shrink-0 bg-gray-900 text-white">
          <div className="p-5">
            <h2 className="text-2xl font-bold">Admin Hub</h2>
          </div>

          <nav className="space-y-1 px-3">
            <Link
              href="/admin"
              className="block rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/impact-stats"
              className="block rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Impact Stats
            </Link>

            <Link
              href="/admin/partners"
              className="block rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Partners
            </Link>

            <Link
              href="/admin/events"
              className="block rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Events
            </Link>

            <Link
              href="/admin/news"
              className="block rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              News
            </Link>

            <Link
              href="/admin/donations"
              className="block rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Donations
            </Link>

            <hr className="my-3 border-gray-600" />

            <Link
              href="/admin/settings"
              className="block rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Settings
            </Link>

            <Link
              href="/admin/system/data-seeder"
              className="block rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Data Seeder
            </Link>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 p-6">
          {process.env.NEXT_PUBLIC_DEV_ADMIN_BYPASS === "true" && (
            <div className="mb-6 rounded-lg border border-amber-400 bg-amber-50 p-4 text-amber-900">
              <p className="font-bold">Development Admin Access Enabled</p>
              <p className="text-sm">Authentication checks are currently bypassed for development.</p>
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}
