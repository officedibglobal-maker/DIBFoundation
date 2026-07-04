import Link from 'next/link';

const adminSections = [
  {
    title: 'Website Content',
    description: 'Manage the main public website content.',
    links: [
      {
        title: 'Hero Slides',
        href: '/admin/hero-slides',
        description: 'Edit homepage banner slides, images, texts, and CTA links.',
      },
      {
        title: 'Focus Areas',
        href: '/admin/focus-areas',
        description: 'Manage DIBF focus areas and what-we-do content.',
      },
      {
        title: 'Initiatives',
        href: '/admin/initiatives',
        description: 'Manage foundation initiatives and programmes.',
      },
      {
        title: 'Impact Stories',
        href: '/admin/impact-stories',
        description: 'Manage featured stories and impact narratives.',
      },
      {
        title: 'Impact Stats',
        href: '/admin/impact-stats',
        description: 'Update homepage statistics and impact numbers.',
      },
      {
        title: 'Partners',
        href: '/admin/partners',
        description: 'Manage partner and sponsor information.',
      },
    ],
  },
  {
    title: 'Operations',
    description: 'Manage donations, events, store, and communications.',
    links: [
      {
        title: 'Donations',
        href: '/admin/donations',
        description: 'View and manage donation-related records.',
      },
      {
        title: 'Events',
        href: '/admin/events',
        description: 'Create and manage DIBF events.',
      },
      {
        title: 'News',
        href: '/admin/news',
        description: 'Manage news, updates, and announcements.',
      },
      {
        title: 'Impact Store',
        href: '/admin/impact-store',
        description: 'Manage impact store products and categories.',
      },
      {
        title: 'Store',
        href: '/admin/store',
        description: 'Manage general store items if enabled.',
      },
    ],
  },
  {
    title: 'Newsletter',
    description: 'Manage subscribers, campaigns, and newsletter settings.',
    links: [
      {
        title: 'Newsletter Dashboard',
        href: '/admin/newsletter',
        description: 'Open the newsletter management area.',
      },
      {
        title: 'Campaigns',
        href: '/admin/newsletter/campaigns',
        description: 'Create, edit, and send newsletter campaigns.',
      },
      {
        title: 'Newsletter Settings',
        href: '/admin/newsletter/settings',
        description: 'Manage sender details and newsletter configuration.',
      },
      {
        title: 'Subscribers',
        href: '/admin/newsletter/subscribers',
        description: 'View and manage newsletter subscribers.',
      },
    ],
  },
  {
    title: 'System',
    description: 'Admin tools, setup, and database utilities.',
    links: [
      {
        title: 'Data Seeder',
        href: '/admin/system/data-seeder',
        description: 'Seed Firestore collections with website data.',
      },
      {
        title: 'Settings',
        href: '/admin/settings',
        description: 'Manage global website settings.',
      },
    ],
  },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
            DIBF Admin Hub
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Manage website content, impact data, newsletters, store items, events,
            partners, and system tools from one place.
          </p>
        </div>

        <div className="space-y-8">
          {adminSections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6"
            >
              <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-950">
                  {section.title}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {section.description}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {section.links.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-950 group-hover:text-blue-700">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {item.description}
                        </p>
                      </div>

                      <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-blue-600 ring-1 ring-slate-200 group-hover:bg-blue-600 group-hover:text-white">
                        Open
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}