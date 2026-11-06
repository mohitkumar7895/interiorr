import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";

export async function GET() {
  try {
    const settings = await db.siteSettings.findUnique({
      where: { id: "default" },
    });
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const updated = await db.siteSettings.upsert({
      where: { id: "default" },
      update: {
        ...(body.siteName && { siteName: body.siteName }),
        ...(body.brandName && { brandName: body.brandName }),
        ...(body.tagline && { tagline: body.tagline }),
        ...(body.phone && { phone: body.phone }),
        ...(body.email && { email: body.email }),
        ...(body.address && { address: body.address }),
        ...(body.logoUrl && { logoUrl: body.logoUrl }),
        ...(body.heroTitle && { heroTitle: body.heroTitle }),
        ...(body.heroSubtitle && { heroSubtitle: body.heroSubtitle }),
        ...(body.heroCtaText && { heroCtaText: body.heroCtaText }),
        ...(body.heroCtaLink && { heroCtaLink: body.heroCtaLink }),
        ...(body.heroImages && {
          heroImages:
            typeof body.heroImages === "string"
              ? body.heroImages
              : JSON.stringify(body.heroImages),
        }),
        ...(body.whatsappNumber && { whatsappNumber: body.whatsappNumber }),
        ...(body.googleMapsUrl && { googleMapsUrl: body.googleMapsUrl }),
        ...(body.openingHours && { openingHours: body.openingHours }),
        ...(body.footerText && { footerText: body.footerText }),
        ...(body.aboutTitle && { aboutTitle: body.aboutTitle }),
        ...(body.aboutStory && { aboutStory: body.aboutStory }),
        ...(body.experienceYears !== undefined && {
          experienceYears: parseInt(body.experienceYears),
        }),
        ...(body.projectsDone !== undefined && {
          projectsDone: parseInt(body.projectsDone),
        }),
        ...(body.happyClients !== undefined && {
          happyClients: parseInt(body.happyClients),
        }),
      },
      create: {
        id: "default",
        ...body,
      },
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 500 });
  }
}

