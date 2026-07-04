
import { db } from "@/lib/firebase";
import { FocusAreaSchema } from "@/lib/models/focus-areas";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "focus-areas"));
    const focusAreas = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(focusAreas);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch focus areas" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = FocusAreaSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(parsed.error, { status: 400 });
    }

    const docRef = await addDoc(collection(db, "focus-areas"), parsed.data);
    return NextResponse.json({ id: docRef.id, ...parsed.data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create focus area" }, { status: 500 });
  }
}
