import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const isFeatured = searchParams.get("isFeatured");

    const where: any = {};
    if (category && category !== "All") where.category = category;
    if (isFeatured === "true") where.isFeatured = true;

    const projects = await db.projects.findMany({
      where,
      orderBy: { orderIndex: "asc" },
      include: { images: true },
    });

    return NextResponse.json({ success: true, projects });
  } catch (error) {
    return NextResponse.json({ success: true, projects: [] });
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
      images,
    } = body;

    if (!title) {
      return NextResponse.json({ error: "Project Title is required" }, { status: 400 });
    }

    const cleanSlug = (slug || title).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const project = await db.projects.create({
      data: {
        title,
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
        images: images || [],
      },
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/", "page");
      revalidatePath("/projects", "page");
      revalidatePath(`/projects/${cleanSlug}`, "page");
    } catch {}

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error: any) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: error?.message || "Failed to create project" }, { status: 400 });
  }
}
