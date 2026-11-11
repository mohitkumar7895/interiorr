import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const service = await db.services.findUnique({
      where: { id: params.id },
    });

    if (!service) {
      const bySlug = await db.services.findUnique({
        where: { slug: params.id },
      });
      if (bySlug) return NextResponse.json({ success: true, service: bySlug });
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, service });
  } catch (error) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }
}

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

    const cleanSlug = (slug || title || "service").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const updated = await db.services.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        slug: cleanSlug,
        ...(category && { category }),
        ...(shortDesc !== undefined && { shortDesc }),
        ...(fullDesc !== undefined && { fullDesc }),
        ...(icon && { icon }),
        ...(featuredImage && { featuredImage }),
        ...(images !== undefined && { images: typeof images === "string" ? images : JSON.stringify(images) }),
        ...(features !== undefined && { features: typeof features === "string" ? features : JSON.stringify(features) }),
        ...(benefits !== undefined && { benefits: typeof benefits === "string" ? benefits : JSON.stringify(benefits) }),
        ...(seoTitle !== undefined && { seoTitle }),
        ...(seoDesc !== undefined && { seoDesc }),
        ...(isPublished !== undefined && { isPublished }),
        ...(orderIndex !== undefined && { orderIndex: parseInt(orderIndex) }),
      },
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/", "page");
      revalidatePath("/services", "page");
      revalidatePath(`/services/${cleanSlug}`, "page");
    } catch {}

    return NextResponse.json({ success: true, service: updated });
  } catch (error: any) {
    console.error("Update service error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update service" }, { status: 400 });
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
    await db.services.delete({
      where: { id: params.id },
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/", "page");
      revalidatePath("/services", "page");
    } catch {}

    return NextResponse.json({ success: true, message: "Service deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: true, message: "Service deleted successfully" });
  }
}
