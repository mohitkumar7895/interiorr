import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";
import { INITIAL_TESTIMONIALS } from "@/lib/data/initialData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

let memoryTestimonials: any[] = INITIAL_TESTIMONIALS.map((t, idx) => ({
  ...t,
  id: (t as any).id || `test-init-${idx + 1}`,
  isPublished: true,
  orderIndex: idx,
  createdAt: new Date().toISOString(),
}));

export async function GET(req: NextRequest) {
  try {
    let testimonials: any[] = [];
    try {
      testimonials = await db.testimonials.findMany({
        orderBy: { orderIndex: "asc" },
      });
    } catch (dbErr) {
      console.warn("DB lookup error in /api/testimonials GET:", dbErr);
    }

    if (!testimonials || testimonials.length === 0) {
      testimonials = memoryTestimonials;
    }
    return NextResponse.json({ success: true, testimonials });
  } catch (error) {
    return NextResponse.json({ success: true, testimonials: memoryTestimonials });
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

    const testData = {
      id: `test-${Date.now()}`,
      clientName,
      clientRole: clientRole || "Homeowner",
      clientLocation: clientLocation || "Sector 120, Noida",
      rating: rating ? parseInt(rating) : 5,
      reviewText,
      isPublished: isPublished ?? true,
      orderIndex: orderIndex ? parseInt(orderIndex) : 0,
      createdAt: new Date().toISOString(),
    };

    let test = testData;
    try {
      test = await db.testimonials.create({
        data: {
          clientName: testData.clientName,
          clientRole: testData.clientRole,
          clientLocation: testData.clientLocation,
          rating: testData.rating,
          reviewText: testData.reviewText,
          isPublished: testData.isPublished,
          orderIndex: testData.orderIndex,
        },
      });
    } catch (dbErr) {
      console.warn("DB error creating testimonial, using memory store:", dbErr);
      memoryTestimonials.push(test);
    }

    try {
      revalidatePath("/", "page");
    } catch {}

    return NextResponse.json({ success: true, testimonial: test }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Invalid testimonial data" }, { status: 400 });
  }
}
