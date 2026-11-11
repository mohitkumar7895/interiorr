import { NextRequest, NextResponse } from "next/server";
import db from '@/lib/db';
import { getCurrentAdmin } from "@/lib/auth/auth";
import { INITIAL_ENQUIRIES } from "@/lib/data/initialData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    let enquiries: any[] = [];
    try {
      enquiries = await db.enquiries.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (dbErr) {
      console.warn("DB error in export enquiries, using fallback:", dbErr);
    }

    if (!enquiries || enquiries.length === 0) {
      enquiries = INITIAL_ENQUIRIES as any;
    }

    // Generate CSV content
    const headers = ["ID", "Name", "Phone", "Email", "Service", "Status", "Message", "Internal Notes", "Created Date"];
    const rows = enquiries.map((e) => [
      `"${e.id}"`,
      `"${(e.name || "").replace(/"/g, '""')}"`,
      `"${e.phone || ""}"`,
      `"${(e.email || "").replace(/"/g, '""')}"`,
      `"${(e.service || "").replace(/"/g, '""')}"`,
      `"${e.status || "New"}"`,
      `"${(e.message || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
      `"${(e.internalNotes || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
      `"${new Date(e.createdAt || Date.now()).toLocaleString("en-IN")}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="ma-interior-enquiries-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error("CSV Export error:", error);
    return new NextResponse("ID,Name,Phone,Email,Service,Status\n", {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="ma-interior-enquiries-${Date.now()}.csv"`,
      },
    });
  }
}
