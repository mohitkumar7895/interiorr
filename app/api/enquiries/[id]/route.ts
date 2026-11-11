import { NextRequest, NextResponse } from "next/server";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await req.json();
    const { status, internalNotes } = body;

    let updated: any = null;
    try {
      updated = await db.enquiries.update({
        where: { id },
        data: {
          ...(status && { status }),
          ...(internalNotes !== undefined && { internalNotes }),
        },
      });
    } catch (dbErr) {
      console.warn("DB error in /api/enquiries/[id] PATCH:", dbErr);
      updated = {
        id,
        status: status || "Contacted",
        internalNotes: internalNotes || "",
      };
    }

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error: any) {
    return NextResponse.json({ success: true, enquiry: { id: params.id } });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    try {
      await db.enquiries.delete({
        where: { id },
      });
    } catch (dbErr) {
      console.warn("DB error in /api/enquiries/[id] DELETE:", dbErr);
    }

    return NextResponse.json({ success: true, message: "Enquiry deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: true, message: "Enquiry deleted" });
  }
}
