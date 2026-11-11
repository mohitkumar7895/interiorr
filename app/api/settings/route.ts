import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

let memorySettings: any = {
  id: "default",
  siteName: "MA Carpenter and Interior",
  brandName: "MA",
  tagline: "Designing Spaces, Defining Lifestyles",
  phone: process.env.NEXT_PUBLIC_PHONE || "8714114418",
  whatsappNumber: process.env.NEXT_PUBLIC_PHONE || "8714114418",
  email: process.env.NEXT_PUBLIC_EMAIL || "Monishpasha233@gmail.com",
  address: process.env.NEXT_PUBLIC_ADDRESS || "Shop No. 6, Sector 120, Noida, Uttar Pradesh - 201301",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Shop+No+6+Sector+120+Noida+Uttar+Pradesh+201301",
  openingHours: "Mon - Sun: 9:00 AM - 8:30 PM",
  footerText: "Crafting bespoke luxury living environments with master carpentry and architectural interior design.",
  logoUrl: "/logo/ma-logo.svg",
};

export async function GET(req: NextRequest) {
  try {
    let settings: any = null;
    try {
      if ((db as any)?.siteSettings) {
        settings = await (db as any).siteSettings.findUnique({
          where: { id: "default" },
        });
      }
    } catch (dbErr) {
      console.warn("DB settings fetch error:", dbErr);
    }

    if (!settings) {
      settings = memorySettings;
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: true, settings: memorySettings });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    let updated: any = null;
    try {
      if ((db as any)?.siteSettings) {
        updated = await (db as any).siteSettings.upsert({
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
          },
          create: {
            id: "default",
            siteName: body.siteName || memorySettings.siteName,
            brandName: body.brandName || "MA",
            tagline: body.tagline || memorySettings.tagline,
            phone: body.phone || memorySettings.phone,
            email: body.email || memorySettings.email,
            address: body.address || memorySettings.address,
            logoUrl: body.logoUrl || memorySettings.logoUrl,
            whatsappNumber: body.whatsappNumber || memorySettings.whatsappNumber,
            googleMapsUrl: body.googleMapsUrl || memorySettings.googleMapsUrl,
            openingHours: body.openingHours || memorySettings.openingHours,
            footerText: body.footerText || memorySettings.footerText,
          },
        });
      }
    } catch (dbErr) {
      console.warn("DB settings save error, saving in memory:", dbErr);
    }

    // Always update in-memory state
    memorySettings = {
      ...memorySettings,
      ...body,
    };

    if (!updated) {
      updated = memorySettings;
    }

    try {
      revalidatePath("/", "layout");
    } catch {}

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 400 });
  }
}
