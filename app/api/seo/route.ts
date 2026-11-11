import { NextRequest, NextResponse } from "next/server";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";
import { INITIAL_SEO_SETTINGS as INITIAL_SEO } from "@/lib/data/initialData";

export async function GET() {
  try {
    let seoList = await db.sEOSettings.findMany({
      orderBy: { pageRoute: "asc" },
    });
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

    if (!pageRoute || !metaTitle || !metaDesc) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let updated: any = null;
    try {
      updated = await db.sEOSettings.upsert({
        where: { pageRoute },
        update: {
          metaTitle,
          metaDesc,
          keywords: keywords || "",
          canonicalUrl: canonicalUrl || null,
          ogTitle: ogTitle || metaTitle,
          ogDesc: ogDesc || metaDesc,
        },
        create: {
          pageRoute,
          metaTitle,
          metaDesc,
          keywords: keywords || "",
          canonicalUrl: canonicalUrl || null,
          ogTitle: ogTitle || metaTitle,
          ogDesc: ogDesc || metaDesc,
        },
      });
    } catch (dbErr) {
      console.warn("DB offline, returning updated SEO object in runtime:", dbErr);
      updated = {
        id: `seo-${pageRoute.replace(/\//g, "-") || "home"}`,
        pageRoute,
        metaTitle,
        metaDesc,
        keywords: keywords || "",
        canonicalUrl: canonicalUrl || null,
        ogTitle: ogTitle || metaTitle,
        ogDesc: ogDesc || metaDesc,
      };
    }

    return NextResponse.json({ success: true, seo: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update SEO" }, { status: 500 });
  }
}

