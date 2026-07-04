
import { db } from "@/lib/firebase";
import { TeamMemberSchema } from "@/lib/models/team-members";
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const docRef = doc(db, "team-members", params.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch team member" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const json = await req.json();
    const parsed = TeamMemberSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(parsed.error, { status: 400 });
    }

    const docRef = doc(db, "team-members", params.id);
    await updateDoc(docRef, parsed.data);
    return NextResponse.json({ id: params.id, ...parsed.data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const docRef = doc(db, "team-members", params.id);
    await deleteDoc(docRef);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 });
  }
}
