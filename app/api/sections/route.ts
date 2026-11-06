import { NextRequest, NextResponse } from "next/server";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";

export async function GET() {
  try {
    const sections = await db.homeSections.findMany({
      orderBy: { orderIndex: "asc" },
    });
    return NextResponse.json({ success: true, sections });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch home sections" }, { status: 500 });
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

    return NextResponse.json({ success: true, section: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update section" }, { status: 500 });
  }
}

