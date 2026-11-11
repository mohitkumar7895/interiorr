import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/auth";
import db from "@/lib/db";

export async function GET() {
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
    } catch {}

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
