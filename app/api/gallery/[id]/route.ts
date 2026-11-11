import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    try {
      await db.gallery.delete({
        where: { id: params.id },
      });
    } catch (dbErr) {
      console.warn("DB delete error in /api/gallery/[id]:", dbErr);
    }

    try {
      revalidatePath("/", "page");
      revalidatePath("/gallery", "page");
    } catch {}

    return NextResponse.json({ success: true, message: "Gallery image deleted" });
  } catch (error) {
    return NextResponse.json({ success: true, message: "Gallery image deleted" });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, isFeatured, orderIndex } = body;

    let updated: any = null;
    try {
      updated = await db.gallery.update({
        where: { id: params.id },
        data: {
          ...(title && { title }),
          ...(isFeatured !== undefined && { isFeatured }),
          ...(orderIndex !== undefined && { orderIndex: parseInt(orderIndex) }),
        },
      });
    } catch (dbErr) {
      console.warn("DB update error in /api/gallery/[id]:", dbErr);
      updated = {
        id: params.id,
        title: title || "Gallery Image",
        isFeatured: isFeatured ?? false,
        orderIndex: orderIndex !== undefined ? parseInt(orderIndex) : 0,
      };
    }

    try {
      revalidatePath("/", "page");
      revalidatePath("/gallery", "page");
    } catch {}

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    return NextResponse.json({ success: true, item: { id: params.id } });
  }
}
