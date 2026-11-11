import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const testimonials = await db.testimonials.findMany({
      orderBy: { orderIndex: "asc" },
    });
    return NextResponse.json({ success: true, testimonials });
  } catch (error) {
    return NextResponse.json({ success: true, testimonials: [] });
  }
}

export async function POST(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { clientName, clientRole, clientLocation, rating, reviewText, isPublished, orderIndex } = body;

    if (!clientName || !reviewText) {
      return NextResponse.json({ error: "Client name and review are required" }, { status: 400 });
    }

    const test = await db.testimonials.create({
      data: {
        clientName,
        clientRole: clientRole || "Homeowner",
        clientLocation: clientLocation || "Sector 120, Noida",
        rating: rating ? parseInt(rating) : 5,
        reviewText,
        isPublished: isPublished ?? true,
        orderIndex: orderIndex ? parseInt(orderIndex) : 0,
      },
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/", "page");
    } catch {}

    return NextResponse.json({ success: true, testimonial: test }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Invalid testimonial data" }, { status: 400 });
  }
}
