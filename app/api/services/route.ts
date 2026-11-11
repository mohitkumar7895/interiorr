import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";
import { INITIAL_SERVICES } from "@/lib/data/initialData";

export async function GET() {
  try {
    let services = await db.services.findMany({
      orderBy: { orderIndex: "asc" },
    });
    if (!services || services.length === 0) {
      services = INITIAL_SERVICES.map((s, idx) => ({
        ...s,
        id: (s as any).id || `srv-init-${idx + 1}`,
      }));
    }
    return NextResponse.json({ success: true, services });
  } catch (error) {
    const services = INITIAL_SERVICES.map((s, idx) => ({
      ...s,
      id: (s as any).id || `srv-init-${idx + 1}`,
    }));
    return NextResponse.json({ success: true, services });
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

    if (!title || !slug || !shortDesc || !fullDesc || !featuredImage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const service = await db.services.create({
      data: {
        title,
        slug: slug.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category: category || "Interior",
        shortDesc,
        fullDesc,
        icon: icon || "Sparkles",
        featuredImage,
        images: typeof images === "string" ? images : JSON.stringify(images || []),
        features: typeof features === "string" ? features : JSON.stringify(features || []),
        benefits: typeof benefits === "string" ? benefits : JSON.stringify(benefits || []),
        seoTitle: seoTitle || `${title} in Noida | MA Carpenter & Interior`,
        seoDesc: seoDesc || shortDesc,
        isPublished: isPublished ?? true,
        orderIndex: orderIndex ? parseInt(orderIndex) : 0,
      },
    });

    revalidatePath("/", "page");
    revalidatePath("/services", "page");
    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error: any) {
    console.error("Create service error:", error);
    return NextResponse.json({ error: error.message || "Failed to create service" }, { status: 500 });
  }
}

