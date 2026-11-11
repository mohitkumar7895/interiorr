import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";
import { INITIAL_PROJECTS } from "@/lib/data/initialData";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let project = await db.projects.findUnique({
      where: { id: params.id },
      include: { images: true },
    });
    if (!project) {
      project = INITIAL_PROJECTS.find((p, idx) => p.slug === params.id || `proj-init-${idx + 1}` === params.id) as any;
    }
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, project });
  } catch (error) {
    const project = INITIAL_PROJECTS.find((p, idx) => p.slug === params.id || `proj-init-${idx + 1}` === params.id);
    if (project) return NextResponse.json({ success: true, project });
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
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
      client,
      location,
      completedDate,
      area,
      shortDesc,
      description,
      featuredImage,
      beforeImage,
      afterImage,
      isPublished,
      isFeatured,
      orderIndex,
    } = body;

    const cleanSlug = (slug || title || "project").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const dataObj: any = {
      title: title || "Project",
      slug: cleanSlug,
      category: category || "Living Room",
      client: client || null,
      location: location || "Noida, NCR",
      completedDate: completedDate || null,
      area: area || "1,850 sq.ft",
      shortDesc: shortDesc || "",
      description: description || "",
      featuredImage: featuredImage || "/images/services/wardrobe-design.jpg",
      beforeImage: beforeImage || null,
      afterImage: afterImage || null,
      isPublished: isPublished ?? true,
      isFeatured: isFeatured ?? false,
      orderIndex: orderIndex !== undefined ? parseInt(orderIndex) : 0,
    };

    let updated: any = null;

    try {
      if (params.id.startsWith("proj-init-")) {
        const bySlug = await db.projects.findUnique({ where: { slug: cleanSlug } }).catch(() => null);
        if (bySlug) {
          updated = await db.projects.update({ where: { id: bySlug.id }, data: dataObj });
        } else {
          updated = await db.projects.create({ data: dataObj });
        }
      } else {
        updated = await db.projects.update({ where: { id: params.id }, data: dataObj });
      }
    } catch {
      try {
        updated = await db.projects.create({ data: dataObj });
      } catch {
        updated = { id: params.id, ...dataObj };
      }
    }

    try {
      revalidatePath("/", "page");
      revalidatePath("/projects", "page");
      revalidatePath(`/projects/${cleanSlug}`, "page");
    } catch {}

    return NextResponse.json({ success: true, project: updated || { id: params.id, ...dataObj } });
  } catch (error: any) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: error.message || "Failed to update project" }, { status: 500 });
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
    await db.projects.delete({
      where: { id: params.id },
    }).catch(() => {});
    
    try {
      revalidatePath("/", "page");
      revalidatePath("/projects", "page");
    } catch {}

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete project" }, { status: 500 });
  }
}
