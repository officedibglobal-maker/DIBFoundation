
import { sitePagesSeed } from "./site-pages.seed";
import type { SeedRegistryEntry } from "./seed-types";

function getSitePageSeedId(
  page: {
    id?: unknown;
    slug?: unknown;
    title?: unknown;
  },
  index: number
): string {
  if (typeof page.slug === "string" && page.slug.trim().length > 0) {
    return page.slug.trim();
  }

  if (typeof page.id === "string" && page.id.trim().length > 0) {
    return page.id.trim();
  }

  if (typeof page.title === "string" && page.title.trim().length > 0) {
    return page.title
      .trim()
      .toLowerCase()
      .replace(/^\/+|\/+$/g, "")
      .replace(/\//g, "-")
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  return `site-page-${index + 1}`;
}

export const SEED_REGISTRY: SeedRegistryEntry[] = [
  {
    key: "sitePages",
    collectionPath: "sitePages",
    category: "Content",
    label: "Site Pages",
    supportsContentSeed: true,
    supportsSchemaSeed: false,
    documents: sitePagesSeed.map((page, index) => {
      const id = getSitePageSeedId(page, index);

      return {
        ...page,
        slug: typeof page.slug === "string" && page.slug.trim().length > 0
          ? page.slug.trim()
          : id,
        _id: id,
      };
    }),
  },
  // Global Settings
  {
    key: "siteSettings",
    collectionPath: "siteSettings",
    category: "Global Settings",
    label: "Site Settings",
    supportsContentSeed: true,
    supportsSchemaSeed: false,
    documents: [
      {
        _id: "general",
        siteName: "DIB Foundation",
        siteDescription: "A non-profit dedicated to making a difference.",
      },
      {
        _id: "social",
        twitter: "https://twitter.com/dibfoundation",
        facebook: "https://facebook.com/dibfoundation",
      },
      { _id: "seo", titleTemplate: "%s | DIB Foundation" },
      {
        _id: "donations",
        defaultDonationAmount: 50,
        allowCustomDonationAmount: true,
      },
    ],
  },
  {
    key: "schemaRegistry",
    collectionPath: "schemaRegistry",
    category: "Global Settings",
    label: "Schema Registry",
    supportsContentSeed: true,
    supportsSchemaSeed: false,
    documents: [
      {
        _id: "all",
        description: "Schema for all collections",
        version: "1.0.0",
      },
    ],
  },
  {
    key: "announcements",
    collectionPath: "announcements",
    category: "Global Settings",
    label: "Announcements",
    supportsContentSeed: true,
    supportsSchemaSeed: false,
    documents: [
      { _id: "announcement-1", title: "Welcome to the new Admin Hub!", content: "<p>This is the central place to manage all your site content and operations.</p>", level: "info" },
    ],
  },

  // Pages and Navigation
  {
    key: "pages",
    collectionPath: "pages",
    category: "Pages and Navigation",
    label: "Pages",
    supportsContentSeed: true,
    supportsSchemaSeed: false,
    documents: [
      { _id: "home", title: "Home", path: "/" },
      { _id: "about", title: "About Us", path: "/about" },
      { _id: "initiatives", title: "Our Initiatives", path: "/initiatives" },
      { _id: "impact", title: "Our Impact", path: "/impact" },
      { _id: "partnerships", title: "Partnerships", path: "/partnerships" },
      { _id: "give", title: "Give", path: "/give" },
      { _id: "contact", title: "Contact Us", path: "/contact" },
      { _id: "impact-store", title: "Impact Store", path: "/impact-store" },
    ],
    subcollections: [
      {
        collectionPath: "sections",
        documents: (parent) => {
          switch (parent._id) {
            case "home":
              return [
                { _id: "hero", type: "hero" },
                { _id: "impact", type: "impact" },
                { _id: "featured-story", type: "featured-story" },
              ];
            case "about":
              return [
                { _id: "mission", type: "mission" },
                { _id: "team", type: "team" },
              ];
            default:
              return [{ _id: "main-content", type: "main-content" }];
          }
        },
      },
    ],
  },
  {
    key: "navigationItems",
    collectionPath: "navigationItems",
    category: "Pages and Navigation",
    label: "Navigation Items",
    supportsContentSeed: true,
    supportsSchemaSeed: false,
    documents: [
      { _id: "home", label: "Home", href: "/" },
      { _id: "about", label: "About", href: "/about" },
      { _id: "initiatives", label: "Initiatives", href: "/initiatives" },
      { _id: "impact", label: "Impact", href: "/impact" },
      { _id: "partnerships", label: "Partnerships", href: "/partnerships" },
      { _id: "give", label: "Give", href: "/give" },
      { _id: "contact", label: "Contact", href: "/contact" },
      {
        _id: "impact-store",
        label: "Impact Store",
        href: "/impact-store",
      },
    ],
  },

  // Programmes
  {
    key: "initiatives",
    collectionPath: "initiatives",
    category: "Programmes",
    label: "Initiatives",
    supportsContentSeed: true,
    supportsSchemaSeed: false,
    documents: [
        { _id: "initiative-1", title: "Mobile Clinic Outreach", summary: "Reaching the most isolated communities with essential healthcare services.", imageUrl: "/images/initiatives/1.jpg", order: 1, status: "published" },
        { _id: "initiative-2", title: "Healthcare Worker Training Program", summary: "Investing in the next generation of healthcare leaders.", imageUrl: "/images/initiatives/2.jpg", order: 2, status: "published" },
        { _id: "initiative-3", title: "Clean Water & Sanitation Project", summary: "Improving health outcomes by providing access to clean water.", imageUrl: "/images/initiatives/3.jpg", order: 3, status: "published" },
        { _id: "initiative-4", title: "Maternal Health Initiative", summary: "Ensuring safe pregnancies and healthy starts for mothers and babies.", imageUrl: "/images/initiatives/4.jpg", order: 4, status: "published" },
        { _id: "initiative-5", title: "Hospital Revitalization", summary: "Upgrading and equipping existing hospitals to modern standards.", imageUrl: "/images/initiatives/5.jpg", order: 5, status: "published" },
        { _id: "initiative-6", title: "Community Health Education", summary: "Empowering individuals with knowledge to lead healthier lives.", imageUrl: "/images/initiatives/6.jpg", order: 6, status: "published" },
    ],
    subcollections: [
      {
        collectionPath: "milestones",
        documents: (parent) => {
            const milestones = [
                { _id: "m-1-1", initiativeId: "initiative-1", title: "Phase 1 Launch", description: "Deployed first mobile clinic to the Northern region.", date: "2023-01-15" },
                { _id: "m-1-2", initiativeId: "initiative-1", title: "10,000 Patients Served", description: "Reached a major milestone in our outreach efforts.", date: "2023-08-20" },
            ];
            return milestones.filter((m) => m.initiativeId === parent._id)
        },
      },
      {
        collectionPath: "updates",
        documents: (_parent) => [],
      },
      {
        collectionPath: "gallery",
        documents: (_parent) => [],
      },
    ],
  },
  {
    key: "focusAreas",
    collectionPath: "focusAreas",
    category: "Programmes",
    label: "Focus Areas",
    supportsContentSeed: true,
    supportsSchemaSeed: false,
    documents: [
        { _id: "area-1", title: "Healthcare Access", summary: "Bringing clinics and medical professionals to remote areas.", iconUrl: "/icons/focus/healthcare.svg", order: 1 },
        { _id: "area-2", title: "Medical Training", summary: "Empowering local healthcare workers with the latest skills.", iconUrl: "/icons/focus/training.svg", order: 2 },
        { _id: "area-3", title: "Infrastructure", summary: "Building and equipping modern medical facilities.", iconUrl: "/icons/focus/infrastructure.svg", order: 3 },
        { _id: "area-4", title: "Community Health", summary: "Promoting wellness through education and preventative care.", iconUrl: "/icons/focus/community.svg", order: 4 },
        { _id: "area-5", title: "Nutrition Programs", summary: "Fighting malnutrition and ensuring healthy development.", iconUrl: "/icons/focus/nutrition.svg", order: 5 },
        { _id: "area-6", title: "Emergency Response", summary: "Providing immediate medical aid during crises.", iconUrl: "/icons/focus/emergency.svg", order: 6 },
    ],
  },

  // Impact
  {
    key: "impactStories",
    collectionPath: "impactStories",
    category: "Impact",
    label: "Impact Stories",
    supportsContentSeed: true,
    supportsSchemaSeed: false,
    documents: [
        { _id: "story-1", title: "A New Clinic Brings Hope to Rural Village", summary: "The opening of the new clinic in a remote village has brought access to quality healthcare for the first time.", content: "<p>The opening of the new clinic in a remote village has brought access to quality healthcare for the first time. The clinic is equipped with modern medical equipment and staffed by trained healthcare professionals. The clinic provides a range of services, including primary care, maternal and child health, and emergency care. The clinic has already made a significant impact on the health and well-being of the community.</p>", imageUrl: "/images/stories/1.jpg", featured: true, status: "published" },
        { _id: "story-2", title: "Life-Saving Skills for Local Midwives", summary: "A training program empowers midwives with the knowledge to handle birth complications.", content: "<p>A training program empowers midwives with the knowledge to handle birth complications, drastically reducing maternal and infant mortality rates in the region.</p>", imageUrl: "/images/stories/2.jpg", featured: false, status: "published" },
        { _id: "story-3", title: "Clean Water Transforms a Community", summary: "Access to clean, running water puts an end to waterborne diseases.", content: "<p>The installation of a new well and water purification system has had a dramatic effect on the community's health, particularly among children.</p>", imageUrl: "/images/stories/3.jpg", featured: false, status: "published" },
        { _id: "story-4", title: "Mobile Clinic Reaches the Unreachable", summary: "Our mobile health clinic brings vital medical services to remote and isolated populations.", content: "<p>For many, our mobile clinic is the only source of healthcare. We provide vaccinations, check-ups, and essential medicines to those who would otherwise go without.</p>", imageUrl: "/images/stories/4.jpg", featured: false, status: "published" },
    ],
    subcollections: [
      {
        collectionPath: "gallery",
        documents: (_parent) => [],
      },
    ],
  },
  {
    key: "impactStats",
    collectionPath: "impactStats",
    category: "Impact",
    label: "Impact Stats",
    supportsContentSeed: true,
    supportsSchemaSeed: false,
    documents: [
        { _id: "stat-1", value: 15000, label: "People Helped", suffix: "+", order: 1 },
        { _id: "stat-2", value: 25, label: "Clinics Built", suffix: "", order: 2 },
        { _id: "stat-3", value: 500, label: "Workers Trained", suffix: "+", order: 3 },
        { _id: "stat-4", value: 1000000, label: "Funds Raised", suffix: "$", order: 4 },
    ],
  },
  {
    key: "testimonials",
    collectionPath: "testimonials",
    category: "Impact",
    label: "Testimonials",
    supportsContentSeed: true,
    supportsSchemaSeed: false,
    documents: [
        { _id: "testimonial-1", name: "Aisha, Community Health Worker", text: "The training I received has empowered me to save lives in my village. I am forever grateful.", imageUrl: "/images/testimonials/1.jpg" },
        { _id: "testimonial-2", name: "John, Corporate Partner CEO", text: "Partnering with DIB Foundation has been a privilege. Their impact is real and measurable.", imageUrl: "/images/testimonials/2.jpg" },
        { _id: "testimonial-3", name: "Maria, Mother", text: "The new clinic meant I could deliver my baby safely. I cannot thank the foundation enough.", imageUrl: "/images/testimonials/3.jpg" },
    ],
  },

  // News and Media
  {
    key: "news",
    collectionPath: "news",
    category: "News and Media",
    label: "News",
    supportsContentSeed: true,
    supportsSchemaSeed: false,
    documents: [
        { _id: "news-1", title: "Foundation Awarded Grant for Expansion", summary: "Major grant will allow us to double our reach in the next two years.", date: "2023-10-26", status: "published" },
        { _id: "news-2", title: "Volunteer Spotlight: Dr. Jane Doe", summary: "Dr. Doe's tireless work has changed countless lives.", date: "2023-09-15", status: "published" },
        { _id: "news-3", title: "Annual Gala Raises Record-Breaking Sum", summary: "A night of generosity and celebration for our cause.", date: "2023-11-05", status: "published" },
        { _id: "news-4", title: "New Partnership with XYZ Corp", summary: "We are thrilled to announce a new corporate partnership to improve health outcomes.", date: "2023-07-01", status: "published" },
    ],
  },
  {
    key: "events",
    collectionPath: "events",
    category: "News and Media",
    label: "Events",
    supportsContentSeed: true,
    supportsSchemaSeed: false,
    documents: [
        { _id: "event-1", title: "Annual Charity Gala", date: "2024-03-15T18:00:00", location: "The Grand Ballroom", description: "Join us for a night of elegance, entertainment, and philanthropy.", status: "published" },
        { _id: "event-2", title: "Community Health Fair", date: "2024-05-20T10:00:00", location: "City Park", description: "Free health screenings, wellness workshops, and family activities.", status: "published" },
        { _id: "event-3", title: "Volunteer Orientation Day", date: "2024-01-30T09:00:00", location: "DIB Foundation HQ", description: "Learn how you can get involved and make a difference.", status: "published" },
    ],
    subcollections: [{ collectionPath: "registrations", documents: (_parent) => [] }],
  },
  {
    key: "publications",
    collectionPath: "publications",
    category: "News and Media",
    label: "Publications",
    supportsContentSeed: true,
    supportsSchemaSeed: false,
    documents: [
        { _id: "pub-1", title: "Annual Report 2023", fileUrl: "#", coverImageUrl: "/images/publications/1.jpg" },
        { _id: "pub-2", title: "Impact Study: Mobile Clinics", fileUrl: "#", coverImageUrl: "/images/publications/2.jpg" },
        { _id: "pub-3", title: "Healthcare Worker Training Manual", fileUrl: "#", coverImageUrl: "/images/publications/3.jpg" },
    ],
  },
  {
    key: "mediaLibrary",
    collectionPath: "mediaLibrary",
    category: "News and Media",
    label: "Media Library",
    supportsContentSeed: false,
    supportsSchemaSeed: true,
    documents: [],
  },

  // Organization
  {
    key: "teamMembers",
    collectionPath: "teamMembers",
    category: "Organization",
    label: "Team Members",
    supportsContentSeed: true,
    supportsSchemaSeed: false,
    documents: [
        { _id: "team-1", name: "Dr. Evelyn Reed", role: "Founder & CEO", imageUrl: "/images/team/1.jpg" },
        { _id: "team-2", name: "Marcus Chen", role: "Director of Operations", imageUrl: "/images/team/2.jpg" },
        { _id: "team-3", name: "Dr. Aisha Khan", role: "Medical Director", imageUrl: "/images/team/3.jpg" },
        { _id: "team-4", name: "Ben Carter", role: "Head of Fundraising", imageUrl: "/images/team/4.jpg" },
    ],
  },
  {
    key: "partners",
    collectionPath: "partners",
    category: "Organization",
    label: "Partners",
    supportsContentSeed: true,
    supportsSchemaSeed: false,
    documents: [
        { _id: "partner-1", name: "Global Health Corp", logoUrl: "/images/partners/1.png", website: "#" },
        { _id: "partner-2", name: "Action Med", logoUrl: "/images/partners/2.png", website: "#" },
        { _id: "partner-3", name: "United Care", logoUrl: "/images/partners/3.png", website: "#" },
        { _id: "partner-4", name: "Wellness Worldwide", logoUrl: "/images/partners/4.png", website: "#" },
        { _id: "partner-5", name: "Hope Brigade", logoUrl: "/images/partners/5.png", website: "#" },
        { _id: "partner-6", name: "Health for All Initiative", logoUrl: "/images/partners/6.png", website: "#" },
    ],
  },
  {
    key: "faqs",
    collectionPath: "faqs",
    category: "Organization",
    label: "FAQs",
    supportsContentSeed: true,
    supportsSchemaSeed: false,
    documents: [
        { _id: "faq-1", question: "How can I donate?", answer: "You can donate through our website's secure portal by clicking the 'Give' button.", category: "Donations" },
        { _id: "faq-2", question: "Are my donations tax-deductible?", answer: "Yes, we are a registered 501(c)(3) non-profit organization.", category: "Donations" },
        { _id: "faq-3", question: "How can I volunteer?", answer: "Visit our 'Get Involved' page for current volunteer opportunities.", category: "Volunteering" },
        { _id: "faq-4", question: "Where do you operate?", answer: "We currently have operations in three countries, with plans to expand.", category: "General" },
        { _id: "faq-5", question: "How are you funded?", answer: "We are funded by individual donors, grants, and corporate sponsorships.", category: "General" },
        { _id: "faq-6", question: "Can I direct my donation to a specific project?", answer: "Yes, you can choose a specific initiative to support during the donation process.", category: "Donations" },
        { _id: "faq-7", question: "What percentage of my donation goes to programs?", answer: "85% of every dollar donated goes directly to our life-saving programs.", category: "Donations" },
        { _id: "faq-8", question: "How do you measure your impact?", answer: "We use a variety of metrics, including patient encounters, community health indicators, and long-term studies. See our 'Impact' page for details.", category: "General" },
    ],
  },

  // Impact Store
  {
    key: "impactStore",
    collectionPath: "impactStore",
    category: "Impact Store",
    label: "Impact Store Products",
    supportsContentSeed: true,
    supportsSchemaSeed: false,
    documents: [
        { _id: "item-1", name: "Clean Water Kit", price: 25, category: "cat-4" },
        { _id: "item-2", name: "Midwife Training", price: 100, category: "cat-2" },
        { _id: "item-3", name: "Vaccination Package", price: 50, category: "cat-1" },
        { _id: "item-4", name: "Newborn Care Kit", price: 30, category: "cat-5" },
        { _id: "item-5", name: "Community Health Workshop", price: 200, category: "cat-3" },
        { _id: "item-6", name: "Emergency Medical Supplies", price: 75, category: "cat-6" },
        { _id: "item-7", name: "Nutrition Pack for a Child", price: 15, category: "cat-7" },
        { _id: "item-8", name: "General Support Fund", price: 10, category: "cat-8" },
        { _id: "item-9", name: "Stethoscope", price: 40, category: "cat-1" },
        { _id: "item-10", name: "Blood Pressure Monitor", price: 60, category: "cat-1" },
        { _id: "item-11", name: "Surgical Gloves (Box of 100)", price: 20, category: "cat-1" },
        { _id: "item-12", name: "Basic First Aid Kit", price: 15, category: "cat-1" },
    ],
    subcollections: [{ collectionPath: "variants", documents: (_parent) => [] }],
  },
  {
    key: "impactStoreCategories",
    collectionPath: "impactStoreCategories",
    category: "Impact Store",
    label: "Impact Store Categories",
    supportsContentSeed: true,
    supportsSchemaSeed: false,
    documents: [
        { _id: "cat-1", name: "Medical Supplies", description: "Provide essential medical supplies."}, 
        { _id: "cat-2", name: "Training Materials", description: "Fund training for a healthcare worker."},
        { _id: "cat-3", name: "Community Health", description: "Support a community health outreach program."},
        { _id: "cat-4", name: "Infrastructure", description: "Help build a clinic or clean water well."},
        { _id: "cat-5", name: "Maternal & Child Health", description: "Support a mother and child through pregnancy and birth."},
        { _id: "cat-6", name: "Emergency Response", description: "Provide aid during a crisis."},
        { _id: "cat-7", name: "Nutrition", description: "Fight malnutrition and ensure healthy development."},
        { _id: "cat-8", name: "General Donation", description: "Support our general fund."},
    ],
  },
  {
    key: "impactStoreOrders",
    collectionPath: "impactStoreOrders",
    category: "Impact Store",
    label: "Impact Store Orders",
    supportsContentSeed: false,
    supportsSchemaSeed: true,
    documents: [],
    subcollections: [
      { collectionPath: "items", documents: (_parent) => [] },
      { collectionPath: "statusHistory", documents: (_parent) => [] },
    ],
  },
  {
    key: "carts",
    collectionPath: "carts",
    category: "Impact Store",
    label: "Carts",
    supportsContentSeed: false,
    supportsSchemaSeed: true,
    documents: [],
    subcollections: [{ collectionPath: "items", documents: (_parent) => [] }],
  },
  {
    key: "wishlists",
    collectionPath: "wishlists",
    category: "Impact Store",
    label: "Wishlists",
    supportsContentSeed: false,
    supportsSchemaSeed: true,
    documents: [],
    subcollections: [{ collectionPath: "items", documents: (_parent) => [] }],
  },

  // Fundraising
  {
    key: "donationCampaigns",
    collectionPath: "donationCampaigns",
    category: "Fundraising",
    label: "Donation Campaigns",
    supportsContentSeed: true,
    supportsSchemaSeed: false,
    documents: [
        { _id: "campaign-1", title: "Winter Relief Fund", goal: 50000, description: "Help us provide warm clothing, blankets, and medical care during the harsh winter months.", status: "active" },
        { _id: "campaign-2", title: "Build a Clinic", goal: 250000, description: "Contribute to the construction of a new permanent health clinic in a remote region.", status: "active" },
        { _id: "campaign-3", title: "Maternal Health Matters", goal: 100000, description: "Support our initiative to provide safe births and essential care for mothers and newborns.", status: "completed" },
    ],
  },
  {
    key: "donations",
    collectionPath: "donations",
    category: "Fundraising",
    label: "Donations",
    supportsContentSeed: false,
    supportsSchemaSeed: true,
    documents: [],
  },

  // Newsletter
  {
    key: "newsletterCampaigns",
    collectionPath: "newsletterCampaigns",
    category: "Newsletter",
    label: "Newsletter Campaigns",
    supportsContentSeed: false,
    supportsSchemaSeed: true,
    documents: [],
    subcollections: [{ collectionPath: "deliveries", documents: (_parent) => [] }],
  },
  {
    key: "newsletterTemplates",
    collectionPath: "newsletterTemplates",
    category: "Newsletter",
    label: "Newsletter Templates",
    supportsContentSeed: true,
    supportsSchemaSeed: false,
    documents: [
        { _id: "template-1", name: "Monthly Update", subject: "DIB Foundation: Your Impact This Month", content: "<p>Hello {{name}}, here is your monthly update...</p>" },
        { _id: "template-2", name: "Emergency Appeal", subject: "URGENT: Your Help is Needed Now", content: "<p>Dear supporter, a crisis has developed and we need your immediate help...</p>" },
    ],
  },
  {
    key: "newsletterSettings",
    collectionPath: "newsletterSettings",
    category: "Newsletter",
    label: "Newsletter Settings",
    supportsContentSeed: true,
    supportsSchemaSeed: false,
    documents: [{ _id: "general", fromName: "DIB Foundation" }],
  },
  {
    key: "newsletterSubscribers",
    collectionPath: "newsletterSubscribers",
    category: "Newsletter",
    label: "Newsletter Subscribers",
    supportsContentSeed: false,
    supportsSchemaSeed: true,
    documents: [],
  },

  // Engagement
  {
    key: "contactMessages",
    collectionPath: "contactMessages",
    category: "Engagement",
    label: "Contact Messages",
    supportsContentSeed: false,
    supportsSchemaSeed: true,
    documents: [],
    subcollections: [{ collectionPath: "notes", documents: (_parent) => [] }],
  },
  {
    key: "partnershipRequests",
    collectionPath: "partnershipRequests",
    category: "Engagement",
    label: "Partnership Requests",
    supportsContentSeed: false,
    supportsSchemaSeed: true,
    documents: [],
    subcollections: [{ collectionPath: "notes", documents: (_parent) => [] }],
  },
  {
    key: "volunteerRequests",
    collectionPath: "volunteerRequests",
    category: "Engagement",
    label: "Volunteer Requests",
    supportsContentSeed: false,
    supportsSchemaSeed: true,
    documents: [],
    subcollections: [{ collectionPath: "notes", documents: (_parent) => [] }],
  },

  // Users and System
  {
    key: "users",
    collectionPath: "users",
    category: "Users and System",
    label: "Users",
    supportsContentSeed: false,
    supportsSchemaSeed: true,
    documents: [],
  },
  {
    key: "auditLogs",
    collectionPath: "auditLogs",
    category: "Users and System",
    label: "Audit Logs",
    supportsContentSeed: false,
    supportsSchemaSeed: true,
    documents: [],
  },
  {
    key: "seedRuns",
    collectionPath: "seedRuns",
    category: "Users and System",
    label: "Seed Runs",
    supportsContentSeed: false,
    supportsSchemaSeed: true,
    documents: [],
  },
  {
    key: "heroSlides",
    collectionPath: "heroSlides",
    category: "Content",
    label: "Hero Slides",
    supportsContentSeed: true,
    supportsSchemaSeed: false,
    documents: [
        { _id: "slide-1", title: "Empowering Health, Transforming Lives", subtitle: "Join us in our mission to bring quality healthcare to underserved communities.", ctaText: "Learn More", ctaUrl: "/about-us", imageUrl: "/images/hero/1.jpg", status: "published", order: 1 },
        { _id: "slide-2", title: "Building a Healthier Future, Together", subtitle: "Your support helps us build clinics, train healthcare workers, and provide essential medical supplies.", ctaText: "Donate Now", ctaUrl: "/give", imageUrl: "/images/hero/2.jpg", status: "published", order: 2 },
        { _id: "slide-3", title: "Every Child Deserves a Healthy Start", subtitle: "We are dedicated to improving maternal and child health in vulnerable populations.", ctaText: "Our Impact", ctaUrl: "/impact", imageUrl: "/images/hero/3.jpg", status: "published", order: 3 },
    ],
  },
];
