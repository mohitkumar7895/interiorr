import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const sections = await db.homeSections.findMany({
      orderBy: { orderIndex: "asc" },
    });
    return NextResponse.json({ success: true, sections });
  } catch (error) {
    return NextResponse.json({ success: true, sections: [] });
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

    const updated = await db.homeSections.update({
      where: { sectionKey },
      data: {
        ...(isEnabled !== undefined && { isEnabled }),
        ...(orderIndex !== undefined && { orderIndex: parseInt(orderIndex) }),
        ...(title !== undefined && { title }),
      },
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/", "page");
    } catch {}

    return NextResponse.json({ success: true, section: updated });
  } catch (error: any) {
    return NextResponse.json({ success: true, section: {} });
  }
}
