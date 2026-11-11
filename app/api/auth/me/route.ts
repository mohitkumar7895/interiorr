import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/auth";
import db from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    let adminData: any = null;
    try {
      adminData = await db.admin.findUnique({
        where: { id: session.id },
        select: { id: true, email: true, name: true, role: true, avatar: true },
      });
    } catch (dbErr) {
      console.warn("DB lookup error in /api/auth/me:", dbErr);
    }

    return NextResponse.json({
      authenticated: true,
      admin: adminData || {
        id: session.id,
        email: session.email,
        name: session.name,
        role: session.role,
        avatar: null,
      },
    });
  } catch (error) {
    return NextResponse.json({
      authenticated: true,
      admin: {
        id: session.id,
        email: session.email,
        name: session.name,
        role: session.role,
        avatar: null,
      },
    });
  }
}
