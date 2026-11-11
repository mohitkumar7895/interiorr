import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";
import { INITIAL_TESTIMONIALS } from "@/lib/data/initialData";

export async function GET() {
  try {
    let testimonials = await db.testimonials.findMany({
      orderBy: { orderIndex: "asc" },
    });
    if (!testimonials || testimonials.length === 0) {
      testimonials = INITIAL_TESTIMONIALS.map((t, idx) => ({
        ...t,
        id: (t as any).id || `test-init-${idx + 1}`,
      }));
    }
    return NextResponse.json({ success: true, testimonials });
  } catch (error) {
    const testimonials = INITIAL_TESTIMONIALS.map((t, idx) => ({
      ...t,
      id: (t as any).id || `test-init-${idx + 1}`,
    }));
    return NextResponse.json({ success: true, testimonials });
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

    revalidatePath("/", "page");
    return NextResponse.json({ success: true, testimonial: test }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create testimonial" }, { status: 500 });
  }
}

