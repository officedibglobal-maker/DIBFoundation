
import { db } from "@/lib/firebase";
import { PartnerSchema } from "@/lib/validation/partner";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "partners"));
    const partners = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(partners);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = PartnerSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(parsed.error, { status: 400 });
    }

    const docRef = await addDoc(collection(db, "partners"), {
      ...parsed.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json({ id: docRef.id, ...parsed.data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create partner" }, { status: 500 });
  }
}
