import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";
import { HomepageSettingsSchema } from "@/lib/validation/homepage-settings";

const HOMEPAGE_SETTINGS_DOC_PATH = "siteSettings/homepage";

const defaultHomepageSettings = {
  partnershipLabel: "PARTNERSHIPS",
  partnershipTitle: "Stronger Together. Greater Impact.",
  partnershipBody:
    "We believe meaningful change happens through collaboration. Partner with us to build healthier, more resilient communities across the globe.",
  partnershipImageUrl: "",
  partnershipCtaLabel: "Partner With Us",
  partnershipCtaLink: "/get-involved/partner",

  impactStoreLabel: "IMPACT STORE",
  impactStoreTitle: "Shop With Purpose.",
  impactStoreBody:
    "Every purchase helps support health outreach, community programs, and sustainable impact initiatives.",
  impactStoreImageUrl: "",
  impactStoreCtaLabel: "Visit Impact Store",
  impactStoreCtaLink: "/impact-store",

  finalCtaTitle: "Make an Impact Today",
  finalCtaBody:
    "Your support helps us reach more communities with healthcare, education, and opportunity.",
  finalCtaBackgroundImageUrl: "",
  finalCtaPrimaryLabel: "Donate Now",
  finalCtaPrimaryLink: "/give",
  finalCtaSecondaryLabel: "Get Involved",
  finalCtaSecondaryLink: "/get-involved",
};

export async function GET() {
  try {
    const docRef = db.doc(HOMEPAGE_SETTINGS_DOC_PATH);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(defaultHomepageSettings);
    }

    return NextResponse.json({
      ...defaultHomepageSettings,
      ...docSnap.data(),
    });
  } catch (error) {
    console.error("Error fetching homepage settings:", error);

    return NextResponse.json(
      { error: "Failed to fetch homepage settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = HomepageSettingsSchema.parse(body);

    const docRef = db.doc(HOMEPAGE_SETTINGS_DOC_PATH);

    await docRef.set(
      {
        ...validatedData,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return NextResponse.json({
      message: "Homepage settings saved successfully",
    });
  } catch (error) {
    console.error("Error saving homepage settings:", error);

    return NextResponse.json(
      { error: "Failed to save homepage settings" },
      { status: 500 }
    );
  }
}