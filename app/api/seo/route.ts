import { NextRequest, NextResponse } from "next/server";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";

export async function GET() {
  try {
    const seoList = await db.sEOSettings.findMany({
      orderBy: { pageRoute: "asc" },
    });
    return NextResponse.json({ success: true, seoList });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch SEO settings" }, { status: 500 });
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

    const updated = await db.sEOSettings.upsert({
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

    return NextResponse.json({ success: true, seo: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update SEO" }, { status: 500 });
  }
}

