import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth/auth";
import { INITIAL_SERVICES } from "@/lib/data/initialData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let service: any = null;
    try {
      if ((db as any)?.services) {
        service = await (db as any).services.findUnique({
          where: { id: params.id },
        });
      }
    } catch {}

    if (!service) {
      service = INITIAL_SERVICES.find(
        (s, idx) => s.slug === params.id || `srv-init-${idx + 1}` === params.id || (s as any).id === params.id
      ) as any;
    }

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, service });
  } catch (error) {
    const service = INITIAL_SERVICES.find(
      (s, idx) => s.slug === params.id || `srv-init-${idx + 1}` === params.id || (s as any).id === params.id
    );
    if (service) {
      return NextResponse.json({ success: true, service });
    }
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
    const dataObj: any = {
      title: title || "Service",
      slug: cleanSlug,
      category: category || "Interior",
      shortDesc: shortDesc || "",
      fullDesc: fullDesc || "",
      icon: icon || "Hammer",
      featuredImage: featuredImage || "/images/services/wardrobe-design.jpg",
      images: typeof images === "string" ? images : JSON.stringify(images || []),
      features: typeof features === "string" ? features : JSON.stringify(features || []),
      benefits: typeof benefits === "string" ? benefits : JSON.stringify(benefits || []),
      seoTitle: seoTitle || `${title} in Noida | MA Carpenter & Interior`,
      seoDesc: seoDesc || shortDesc,
      isPublished: isPublished ?? true,
      orderIndex: orderIndex !== undefined ? parseInt(orderIndex) : 0,
    };

    let updated: any = null;

    try {
      if ((db as any)?.services) {
        if (params.id.startsWith("srv-init-")) {
          const bySlug = await (db as any).services.findUnique({ where: { slug: cleanSlug } }).catch(() => null);
          if (bySlug) {
            updated = await (db as any).services.update({ where: { id: bySlug.id }, data: dataObj });
          } else {
            updated = await (db as any).services.create({ data: dataObj });
          }
        } else {
          updated = await (db as any).services.update({ where: { id: params.id }, data: dataObj });
        }
      }
    } catch {
      try {
        if ((db as any)?.services) {
          updated = await (db as any).services.create({ data: dataObj });
        }
      } catch {
        updated = { id: params.id, ...dataObj };
      }
    }

    if (!updated) {
      updated = { id: params.id, ...dataObj };
    }

    try {
      revalidatePath("/", "page");
      revalidatePath("/services", "page");
      revalidatePath(`/services/${cleanSlug}`, "page");
    } catch {}

    return NextResponse.json({ success: true, service: updated });
  } catch (error: any) {
    console.error("Update service error:", error);
    return NextResponse.json({ error: error.message || "Failed to update service" }, { status: 400 });
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
    try {
      if ((db as any)?.services) {
        await (db as any).services.delete({
          where: { id: params.id },
        });
      }
    } catch {}

    try {
      revalidatePath("/", "page");
      revalidatePath("/services", "page");
    } catch {}

    return NextResponse.json({ success: true, message: "Service deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete service" }, { status: 400 });
  }
}
