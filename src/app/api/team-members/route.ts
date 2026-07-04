
import { db } from "@/lib/firebase";
import { TeamMemberSchema } from "@/lib/models/team-members";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "team-members"));
    const teamMembers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(teamMembers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = TeamMemberSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(parsed.error, { status: 400 });
    }

    const docRef = await addDoc(collection(db, "team-members"), parsed.data);
    return NextResponse.json({ id: docRef.id, ...parsed.data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create team member" }, { status: 500 });
  }
}
