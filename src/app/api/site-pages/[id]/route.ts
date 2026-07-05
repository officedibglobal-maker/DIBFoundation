import { NextRequest, NextResponse } from "next/server";

import {
  deleteSitePage,
  getSitePageById,
  updateSitePage,
} from "@/lib/firebase/firestore";
import { SitePageSchema } from "@/lib/models/site-pages";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const sitePage = await getSitePageById(id);

    if (!sitePage) {
      return NextResponse.json(
        { error: "Site page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(sitePage);
  } catch (error) {
    console.error("Failed to fetch site page:", error);

    return NextResponse.json(
      { error: "Failed to fetch site page" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

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

    const updatedSitePage = await updateSitePage(id, parsed.data);

    return NextResponse.json(updatedSitePage);
  } catch (error) {
    console.error("Failed to update site page:", error);

    return NextResponse.json(
      { error: "Failed to update site page" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    await deleteSitePage(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete site page:", error);

    return NextResponse.json(
      { error: "Failed to delete site page" },
      { status: 500 }
    );
  }
}