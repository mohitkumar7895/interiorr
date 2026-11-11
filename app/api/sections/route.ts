import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_SECTIONS = [
  { id: "sec-hero", sectionKey: "hero", title: "Hero Section", isEnabled: true, orderIndex: 1 },
  { id: "sec-about", sectionKey: "about", title: "About Section", isEnabled: true, orderIndex: 2 },
  { id: "sec-services", sectionKey: "services", title: "Services Section", isEnabled: true, orderIndex: 3 },
  { id: "sec-projects", sectionKey: "projects", title: "Projects Section", isEnabled: true, orderIndex: 4 },
  { id: "sec-process", sectionKey: "process", title: "Process Section", isEnabled: true, orderIndex: 5 },
  { id: "sec-whyUs", sectionKey: "whyUs", title: "Why Choose Us", isEnabled: true, orderIndex: 6 },
  { id: "sec-testimonials", sectionKey: "testimonials", title: "Testimonials Section", isEnabled: true, orderIndex: 7 },
  { id: "sec-cta", sectionKey: "cta", title: "Call to Action", isEnabled: true, orderIndex: 8 },
  { id: "sec-blogs", sectionKey: "blogs", title: "Latest Articles", isEnabled: true, orderIndex: 9 },
  { id: "sec-contact", sectionKey: "contact", title: "Contact Section", isEnabled: true, orderIndex: 10 },
];

let memorySections = [...DEFAULT_SECTIONS];

export async function GET(req: NextRequest) {
  try {
    let sections: any[] = [];
    try {
      sections = await db.homeSections.findMany({
        orderBy: { orderIndex: "asc" },
      });
    } catch (dbErr) {
      console.warn("DB lookup error in /api/sections GET:", dbErr);
    }

    if (!sections || sections.length === 0) {
      sections = memorySections;
    }

    return NextResponse.json({ success: true, sections });
  } catch (error) {
    return NextResponse.json({ success: true, sections: memorySections });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { sectionKey, isEnabled, orderIndex, title } = body;

    let updated: any = null;
    try {
      updated = await db.homeSections.update({
        where: { sectionKey },
        data: {
          ...(isEnabled !== undefined && { isEnabled }),
          ...(orderIndex !== undefined && { orderIndex: parseInt(orderIndex) }),
          ...(title !== undefined && { title }),
        },
      });
    } catch (dbErr) {
      console.warn("DB error in /api/sections PUT, updating memory store:", dbErr);
      const idx = memorySections.findIndex((s) => s.sectionKey === sectionKey);
      if (idx !== -1) {
        memorySections[idx] = {
          ...memorySections[idx],
          ...(isEnabled !== undefined && { isEnabled }),
          ...(orderIndex !== undefined && { orderIndex: parseInt(orderIndex) }),
          ...(title !== undefined && { title }),
        };
        updated = memorySections[idx];
      } else {
        updated = {
          id: `sec-${sectionKey}`,
          sectionKey,
          title: title || sectionKey,
          isEnabled: isEnabled ?? true,
          orderIndex: orderIndex !== undefined ? parseInt(orderIndex) : memorySections.length + 1,
        };
        memorySections.push(updated);
      }
    }

    try {
      revalidatePath("/", "page");
    } catch {}

    return NextResponse.json({ success: true, section: updated });
  } catch (error: any) {
    return NextResponse.json({ success: true, section: {} });
  }
}
