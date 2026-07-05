import { NextRequest, NextResponse } from "next/server";

import { createSitePage, getSitePages } from "@/lib/firebase/firestore";
import { SitePageSchema } from "@/lib/models/site-pages";

export async function GET(_req: NextRequest) {
  try {
    const sitePages = await getSitePages();

    return NextResponse.json(sitePages);
  } catch (error) {
    console.error("Failed to fetch site pages:", error);

    return NextResponse.json(
      { error: "Failed to fetch site pages" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = SitePageSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid site page data",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const sitePage = await createSitePage(parsed.data);

    return NextResponse.json(sitePage, { status: 201 });
  } catch (error) {
    console.error("Failed to create site page:", error);

    return NextResponse.json(
      { error: "Failed to create site page" },
      { status: 500 }
    );
  }
}