import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";
import { INITIAL_PROJECTS } from "@/lib/data/initialData";

export async function GET() {
  try {
    let projects = await db.projects.findMany({
      include: { images: true },
      orderBy: { orderIndex: "asc" },
    });
    if (!projects || projects.length === 0) {
      projects = INITIAL_PROJECTS.map((p, idx) => ({
        ...p,
        id: (p as any).id || `proj-init-${idx + 1}`,
        images: (p as any).galleryImages || [],
      }));
    }
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    const projects = INITIAL_PROJECTS.map((p, idx) => ({
      ...p,
      id: (p as any).id || `proj-init-${idx + 1}`,
      images: (p as any).galleryImages || [],
    }));
    return NextResponse.json({ success: true, projects });
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

    if (!title || !slug || !shortDesc || !description || !featuredImage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const project = await db.projects.create({
      data: {
        title,
        slug: slug.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category: category || "Living Room",
        client: client || "Private Client",
        location: location || "Noida, NCR",
        completedDate: completedDate || "2026",
        area: area || "1,850 sq.ft",
        shortDesc,
        description,
        featuredImage,
        beforeImage: beforeImage || null,
        afterImage: afterImage || null,
        isPublished: isPublished ?? true,
        isFeatured: isFeatured ?? false,
        orderIndex: orderIndex ? parseInt(orderIndex) : 0,
        images: {
          create: (galleryImages || []).map((img: any, idx: number) => ({
            imageUrl: typeof img === "string" ? img : img.imageUrl,
            caption: img.caption || null,
            orderIndex: idx,
          })),
        },
      },
      include: { images: true },
    });

    revalidatePath("/", "page");
    revalidatePath("/projects", "page");
    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error: any) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: error.message || "Failed to create project" }, { status: 500 });
  }
}

