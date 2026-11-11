import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const settings = await db.siteSettings.findUnique({
      where: { id: "default" },
    });
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: true, settings: null });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      siteName,
      tagline,
      phone,
      whatsapp,
      email,
      address,
      workingHours,
      experienceYears,
      completedProjects,
      happyClients,
      teamMembers,
      heroTitle,
      heroSubtitle,
      heroImages,
      facebookUrl,
      instagramUrl,
      youtubeUrl,
      pinterestUrl,
      googleMapsUrl,
    } = body;

    const dataObj = {
      ...(siteName && { siteName }),
      ...(tagline && { tagline }),
      ...(phone && { phone }),
      ...(whatsapp && { whatsapp }),
      ...(email && { email }),
      ...(address && { address }),
      ...(workingHours && { workingHours }),
      ...(experienceYears !== undefined && { experienceYears: parseInt(experienceYears) }),
      ...(completedProjects !== undefined && { completedProjects: parseInt(completedProjects) }),
      ...(happyClients !== undefined && { happyClients: parseInt(happyClients) }),
      ...(teamMembers !== undefined && { teamMembers: parseInt(teamMembers) }),
      ...(heroTitle && { heroTitle }),
      ...(heroSubtitle && { heroSubtitle }),
      ...(heroImages !== undefined && {
        heroImages: typeof heroImages === "string" ? heroImages : JSON.stringify(heroImages),
      }),
      ...(facebookUrl !== undefined && { facebookUrl }),
      ...(instagramUrl !== undefined && { instagramUrl }),
      ...(youtubeUrl !== undefined && { youtubeUrl }),
      ...(pinterestUrl !== undefined && { pinterestUrl }),
      ...(googleMapsUrl !== undefined && { googleMapsUrl }),
    };

    const updated = await db.siteSettings.upsert({
      where: { id: "default" },
      update: dataObj,
      create: { id: "default", ...dataObj },
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/", "page");
      revalidatePath("/about", "page");
      revalidatePath("/contact", "page");
    } catch {}

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update settings" }, { status: 400 });
  }
}
