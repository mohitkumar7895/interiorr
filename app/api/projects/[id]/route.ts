import { NextRequest, NextResponse } from "next/server";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await db.projects.findUnique({
      where: { id: params.id },
      include: { images: true },
    });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, project });
  } catch (error) {
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

    const updated = await db.projects.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(slug && { slug: slug.toLowerCase().replace(/[^a-z0-9]+/g, "-") }),
        ...(category && { category }),
        ...(client !== undefined && { client }),
        ...(location !== undefined && { location }),
        ...(completedDate !== undefined && { completedDate }),
        ...(area !== undefined && { area }),
        ...(shortDesc && { shortDesc }),
        ...(description && { description }),
        ...(featuredImage && { featuredImage }),
        ...(beforeImage !== undefined && { beforeImage }),
        ...(afterImage !== undefined && { afterImage }),
        ...(isPublished !== undefined && { isPublished }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(orderIndex !== undefined && { orderIndex: parseInt(orderIndex) }),
      },
      include: { images: true },
    });

    return NextResponse.json({ success: true, project: updated });
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
    });
    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}

