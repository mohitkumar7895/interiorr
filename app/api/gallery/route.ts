import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth/auth";
import { INITIAL_GALLERY_CATEGORIES, INITIAL_GALLERY_ITEMS } from "@/lib/data/initialData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

let memoryCategories = INITIAL_GALLERY_CATEGORIES.map((c, idx) => ({
  ...c,
  id: (c as any).id || `cat-init-${idx + 1}`,
}));

let memoryItems = INITIAL_GALLERY_ITEMS.map((item, idx) => {
  const cat = memoryCategories.find((c: any) => c.slug === item.categorySlug) || {
    id: `cat-${item.categorySlug}`,
    name: item.categorySlug,
    slug: item.categorySlug,
  };
  return {
    ...item,
    id: (item as any).id || `gal-init-${idx + 1}`,
    categoryId: cat.id,
    category: cat,
  };
});

export async function GET(req: NextRequest) {
  try {
    let items: any[] = [];
    let categories: any[] = [];

    try {
      if ((db as any)?.gallery) {
        items = await (db as any).gallery.findMany({
          include: { category: true },
          orderBy: { orderIndex: "asc" },
        });
      }
      if ((db as any)?.galleryCategories) {
        categories = await (db as any).galleryCategories.findMany({
          orderBy: { orderIndex: "asc" },
        });
      }
    } catch (dbErr) {
      console.warn("DB gallery fetch notice:", dbErr);
    }

    if (!categories || categories.length === 0) {
      categories = memoryCategories;
    }

    if (!items || items.length === 0) {
      items = memoryItems;
    }

    return NextResponse.json({ success: true, items, categories });
  } catch (error) {
    return NextResponse.json({ success: true, items: memoryItems, categories: memoryCategories });
  }
}

export async function POST(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, imageUrl, categoryId, orderIndex } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: "Title and Image URL are required" }, { status: 400 });
    }

    const newItem: any = {
      id: `gal-${Date.now()}`,
      title,
      description: description || null,
      imageUrl,
      categoryId: categoryId || memoryCategories[0]?.id || "default",
      orderIndex: orderIndex ? parseInt(orderIndex) : 0,
      createdAt: new Date().toISOString(),
    };

    let item = null;
    try {
      if ((db as any)?.gallery) {
        item = await (db as any).gallery.create({
          data: newItem,
          include: { category: true },
        });
      }
    } catch (dbErr) {
      console.warn("DB gallery create notice:", dbErr);
    }

    if (!item) {
      const cat = memoryCategories.find((c) => c.id === newItem.categoryId) || memoryCategories[0];
      item = { ...newItem, category: cat };
    }

    memoryItems.unshift(item);

    try {
      revalidatePath("/gallery", "page");
    } catch {}

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error: any) {
    console.error("Create gallery item error:", error);
    return NextResponse.json({ error: error.message || "Failed to create gallery item" }, { status: 400 });
  }
}
