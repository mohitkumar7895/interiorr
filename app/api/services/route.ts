import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const services = await db.services.findMany({
      orderBy: { orderIndex: "asc" },
    });
    return NextResponse.json({ success: true, services });
  } catch (error) {
    console.warn("Fallback in /api/services GET:", error);
    return NextResponse.json({ success: true, services: [] });
  }
}

export async function POST(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      slug,
      category,
      shortDesc,
      fullDesc,
      icon,
      featuredImage,
      images,
      features,
      benefits,
      seoTitle,
      seoDesc,
      isPublished,
      orderIndex,
    } = body;

    if (!title || !shortDesc) {
      return NextResponse.json({ error: "Title and Short Description are required" }, { status: 400 });
    }

    const cleanSlug = (slug || title).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const service = await db.services.create({
      data: {
        title,
        slug: cleanSlug,
        category: category || "Interior",
        shortDesc,
        fullDesc: fullDesc || shortDesc,
        icon: icon || "Sparkles",
        featuredImage: featuredImage || "/images/services/wardrobe-design.jpg",
        images: typeof images === "string" ? images : JSON.stringify(images || []),
        features: typeof features === "string" ? features : JSON.stringify(features || []),
        benefits: typeof benefits === "string" ? benefits : JSON.stringify(benefits || []),
        seoTitle: seoTitle || `${title} in Noida | MA Carpenter & Interior`,
        seoDesc: seoDesc || shortDesc,
        isPublished: isPublished ?? true,
        orderIndex: orderIndex !== undefined ? parseInt(orderIndex) : 0,
      },
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/", "page");
      revalidatePath("/services", "page");
      revalidatePath(`/services/${cleanSlug}`, "page");
    } catch {}

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error: any) {
    console.error("Create service error:", error);
    return NextResponse.json({ error: error?.message || "Failed to create service" }, { status: 400 });
  }
}
