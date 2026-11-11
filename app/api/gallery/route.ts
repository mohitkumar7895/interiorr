import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";
import { INITIAL_GALLERY_CATEGORIES, INITIAL_GALLERY_ITEMS } from "@/lib/data/initialData";

export async function GET() {
  try {
    let items = await db.gallery.findMany({
      include: { category: true },
      orderBy: { orderIndex: "asc" },
    });
    let categories = await db.galleryCategories.findMany({
      orderBy: { orderIndex: "asc" },
    });

    if (!categories || categories.length === 0) {
      categories = INITIAL_GALLERY_CATEGORIES.map((c, idx) => ({
        ...c,
        id: (c as any).id || `cat-init-${idx + 1}`,
      }));
    }

    if (!items || items.length === 0) {
      items = INITIAL_GALLERY_ITEMS.map((item, idx) => {
        const cat = categories.find((c: any) => c.slug === item.categorySlug) || {
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
    }

    return NextResponse.json({ success: true, items, categories });
  } catch (error) {
    const categories = INITIAL_GALLERY_CATEGORIES.map((c, idx) => ({
      ...c,
      id: (c as any).id || `cat-init-${idx + 1}`,
    }));
    const items = INITIAL_GALLERY_ITEMS.map((item, idx) => {
      const cat = categories.find((c: any) => c.slug === item.categorySlug) || {
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
    return NextResponse.json({ success: true, items, categories });
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

