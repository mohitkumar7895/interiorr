import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";

export async function GET() {
  try {
    const items = await db.gallery.findMany({
      include: { category: true },
      orderBy: { orderIndex: "asc" },
    });
    const categories = await db.galleryCategories.findMany({
      orderBy: { orderIndex: "asc" },
    });
    return NextResponse.json({ success: true, items, categories });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, categoryId, imageUrl, isFeatured, orderIndex } = body;

    if (!title || !categoryId || !imageUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const item = await db.gallery.create({
      data: {
        title,
        categoryId,
        imageUrl,
        isFeatured: isFeatured ?? false,
        orderIndex: orderIndex ? parseInt(orderIndex) : 0,
      },
      include: { category: true },
    });

    revalidatePath("/", "page");
    revalidatePath("/gallery", "page");
    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add image" }, { status: 500 });
  }
}

