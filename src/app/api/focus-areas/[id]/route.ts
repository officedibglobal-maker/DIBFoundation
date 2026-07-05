import { db } from "@/lib/firebase";
import { FocusAreaSchema } from "@/lib/models/focus-areas";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const docRef = doc(db, "focus-areas", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: "Focus area not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: docSnap.id,
      ...docSnap.data(),
    });
  } catch (error) {
    console.error("Failed to fetch focus area:", error);

    return NextResponse.json(
      { error: "Failed to fetch focus area" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const json = await req.json();
    const parsed = FocusAreaSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid focus area data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const docRef = doc(db, "focus-areas", id);
    await updateDoc(docRef, parsed.data);

    return NextResponse.json({
      id,
      ...parsed.data,
    });
  } catch (error) {
    console.error("Failed to update focus area:", error);

    return NextResponse.json(
      { error: "Failed to update focus area" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const docRef = doc(db, "focus-areas", id);
    await deleteDoc(docRef);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete focus area:", error);

    return NextResponse.json(
      { error: "Failed to delete focus area" },
      { status: 500 }
    );
  }
}