import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";
import { INITIAL_SEO_SETTINGS as INITIAL_SEO } from "@/lib/data/initialData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    let seoList: any[] = [];
    try {
      seoList = await db.sEOSettings.findMany({
        orderBy: { pageRoute: "asc" },
      });
    } catch (dbErr) {
      console.warn("DB lookup error in /api/seo GET:", dbErr);
    }

    if (!seoList || seoList.length === 0) {
      seoList = INITIAL_SEO.map((s, idx) => ({
        ...s,
        id: (s as any).id || `seo-init-${idx + 1}`,
      }));
    }
    return NextResponse.json({ success: true, seoList });
  } catch (error) {
    const seoList = INITIAL_SEO.map((s, idx) => ({
      ...s,
      id: (s as any).id || `seo-init-${idx + 1}`,
    }));
    return NextResponse.json({ success: true, seoList });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { pageRoute, metaTitle, metaDesc, keywords, canonicalUrl, ogTitle, ogDesc } = body;

    if (!pageRoute || !metaTitle) {
      return NextResponse.json({ error: "Page route and meta title are required" }, { status: 400 });
    }

    const updated = await db.sEOSettings.upsert({
      where: { pageRoute },
      update: {
        metaTitle,
        metaDesc: metaDesc || "",
        keywords: keywords || "",
        canonicalUrl: canonicalUrl || null,
        ogTitle: ogTitle || metaTitle,
        ogDesc: ogDesc || metaDesc || "",
      },
      create: {
        pageRoute,
        metaTitle,
        metaDesc: metaDesc || "",
        keywords: keywords || "",
        canonicalUrl: canonicalUrl || null,
        ogTitle: ogTitle || metaTitle,
        ogDesc: ogDesc || metaDesc || "",
      },
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/", "page");
      if (pageRoute && pageRoute !== "/") {
        revalidatePath(pageRoute, "page");
      }
    } catch {}

    return NextResponse.json({ success: true, seo: updated });
  } catch (error: any) {
    console.error("Update SEO error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update SEO" }, { status: 400 });
  }
}
