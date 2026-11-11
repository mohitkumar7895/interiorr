import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth/auth";
import { INITIAL_PROJECTS } from "@/lib/data/initialData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

let memoryProjects = INITIAL_PROJECTS.map((p, idx) => ({
  ...p,
  id: (p as any).id || `proj-init-${idx + 1}`,
  images: (p as any).galleryImages || [],
}));

export async function GET(req: NextRequest) {
  try {
    let projects: any[] = [];
    try {
      if ((db as any)?.projects) {
        projects = await (db as any).projects.findMany({
          include: { images: true },
          orderBy: { orderIndex: "asc" },
        });
      }
    } catch (dbErr) {
      console.warn("DB projects fetch notice:", dbErr);
    }

    if (!projects || projects.length === 0) {
      projects = memoryProjects;
    }

    return NextResponse.json({ success: true, projects });
  } catch (error) {
    return NextResponse.json({ success: true, projects: memoryProjects });
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
      galleryImages,
    } = body;

    if (!title || !shortDesc) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cleanSlug = (slug || title).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newProject: any = {
      id: `proj-${Date.now()}`,
      title,
      slug: cleanSlug,
      category: category || "Living Room",
      client: client || "Private Residence",
      location: location || "Sector 120, Noida",
      completedDate: completedDate || "2026",
      area: area || "1,850 sq.ft",
      shortDesc,
      description: description || shortDesc,
      featuredImage: featuredImage || "/images/gallery/rose-gold-wardrobe.jpg",
      beforeImage: beforeImage || null,
      afterImage: afterImage || null,
      isPublished: isPublished ?? true,
      isFeatured: isFeatured ?? false,
      orderIndex: orderIndex ? parseInt(orderIndex) : 0,
      images: (galleryImages || []).map((img: any, idx: number) => ({
        imageUrl: typeof img === "string" ? img : img.imageUrl,
        caption: img.caption || null,
        orderIndex: idx,
      })),
    };

    let project = null;
    try {
      if ((db as any)?.projects) {
        project = await (db as any).projects.create({
          data: {
            ...newProject,
            images: {
              create: newProject.images,
            },
          },
          include: { images: true },
        });
      }
    } catch (dbErr) {
      console.warn("DB project create fallback to memory:", dbErr);
    }

    if (!project) {
      project = newProject;
    }

    memoryProjects.unshift(project);

    try {
      revalidatePath("/", "page");
      revalidatePath("/projects", "page");
    } catch {}

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error: any) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: error.message || "Failed to create project" }, { status: 400 });
  }
}
