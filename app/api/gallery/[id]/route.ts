import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.gallery.delete({
      where: { id: params.id },
    });
    revalidatePath("/", "page");
    revalidatePath("/gallery", "page");
    return NextResponse.json({ success: true, message: "Gallery image deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
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

    const updated = await db.gallery.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(orderIndex !== undefined && { orderIndex: parseInt(orderIndex) }),
      },
    });

    revalidatePath("/", "page");
    revalidatePath("/gallery", "page");
    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

