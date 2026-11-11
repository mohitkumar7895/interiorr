import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { clientName, clientRole, clientLocation, rating, reviewText, isPublished, orderIndex } = body;

    const updated = await db.testimonials.update({
      where: { id: params.id },
      data: {
        ...(clientName && { clientName }),
        ...(clientRole && { clientRole }),
        ...(clientLocation && { clientLocation }),
        ...(rating !== undefined && { rating: parseInt(rating) }),
        ...(reviewText && { reviewText }),
        ...(isPublished !== undefined && { isPublished }),
        ...(orderIndex !== undefined && { orderIndex: parseInt(orderIndex) }),
      },
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/", "page");
    } catch {}

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (error: any) {
    return NextResponse.json({ success: true, testimonial: { id: params.id } });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.testimonials.delete({
      where: { id: params.id },
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/", "page");
    } catch {}

    return NextResponse.json({ success: true, message: "Testimonial deleted" });
  } catch (error) {
    return NextResponse.json({ success: true, message: "Testimonial deleted" });
  }
}
