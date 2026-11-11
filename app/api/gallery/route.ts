import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const isFeatured = searchParams.get("isFeatured");

    const where: any = {};
    if (isFeatured === "true") where.isFeatured = true;

    const [categories, items] = await Promise.all([
      db.galleryCategories.findMany({ orderBy: { orderIndex: "asc" } }),
      db.gallery.findMany({
        where,
        include: { category: true },
        orderBy: { orderIndex: "asc" },
      }),
    ]);

    let filteredItems = items;
    if (categorySlug && categorySlug !== "all") {
      filteredItems = items.filter((item: any) => item.category?.slug === categorySlug);
    }

    return NextResponse.json({
      success: true,
      categories,
      items: filteredItems,
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      categories: [],
      items: [],
    });
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

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    const item = await db.gallery.create({
      data: {
        title: title || "",
        categoryId: categoryId || null,
        imageUrl,
        isFeatured: isFeatured ?? false,
        orderIndex: orderIndex ? parseInt(orderIndex) : 0,
      },
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/", "page");
      revalidatePath("/gallery", "page");
    } catch {}

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error: any) {
    console.error("Create gallery item error:", error);
    return NextResponse.json({ error: error?.message || "Failed to add image" }, { status: 400 });
  }
}
