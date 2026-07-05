import { db } from "@/lib/firebase";
import { TeamMemberSchema } from "@/lib/models/team-members";
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

    const docRef = doc(db, "team-members", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: docSnap.id,
      ...docSnap.data(),
    });
  } catch (error) {
    console.error("Failed to fetch team member:", error);

    return NextResponse.json(
      { error: "Failed to fetch team member" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const json = await req.json();
    const parsed = TeamMemberSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid team member data",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const docRef = doc(db, "team-members", id);
    await updateDoc(docRef, parsed.data);

    return NextResponse.json({
      id,
      ...parsed.data,
    });
  } catch (error) {
    console.error("Failed to update team member:", error);

    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const docRef = doc(db, "team-members", id);
    await deleteDoc(docRef);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete team member:", error);

    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}