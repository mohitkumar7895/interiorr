import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/auth";
import db from '@/lib/db';

export async function GET() {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const admin = await db.admin.findUnique({
      where: { id: session.id },
      select: { id: true, email: true, name: true, role: true, avatar: true },
    });

    if (!admin) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, admin });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

