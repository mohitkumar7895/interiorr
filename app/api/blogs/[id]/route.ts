import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let blog = await db.blogs.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
    });

    if (!blog) {
      blog = await db.blogs.findUnique({
        where: { slug: params.id },
      });
    }

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      category,
      author,
      readTime,
      tags,
      isPublished,
    } = body;

    const cleanSlug = (slug || title || "article").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const updated = await db.blogs.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        slug: cleanSlug,
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(featuredImage !== undefined && { featuredImage }),
        ...(category !== undefined && { category }),
        ...(author !== undefined && { author }),
        ...(readTime !== undefined && { readTime }),
        ...(tags !== undefined && { tags: Array.isArray(tags) ? tags : (tags || "").split(",").map((t: string) => t.trim()).filter(Boolean) }),
        ...(isPublished !== undefined && { isPublished }),
      },
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/", "page");
      revalidatePath("/blogs", "page");
      revalidatePath(`/blogs/${cleanSlug}`, "page");
    } catch {}

    return NextResponse.json({ success: true, blog: updated });
  } catch (error: any) {
    console.error("Update blog error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update blog post" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    await db.blogs.delete({
      where: { id: params.id },
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/", "page");
      revalidatePath("/blogs", "page");
    } catch {}

    return NextResponse.json({ success: true, message: "Blog deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete blog post" },
      { status: 400 }
    );
  }
}
