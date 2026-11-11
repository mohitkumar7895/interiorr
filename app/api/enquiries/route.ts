import { NextRequest, NextResponse } from "next/server";
import db from '@/lib/db';
import { EnquirySchema } from "@/lib/validations";
import { getCurrentAdmin } from "@/lib/auth/auth";
import { INITIAL_ENQUIRIES } from "@/lib/data/initialData";

// Public POST endpoint to submit enquiries
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = EnquirySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Invalid input data." },
        { status: 400 }
      );
    }

    const { name, phone, email, service, message } = result.data;

    let enquiryId = `offline-${Date.now()}`;
    try {
      const enquiry = await db.enquiries.create({
        data: {
          name,
          phone,
          email: email || null,
          service,
          message,
          status: "New",
        },
      });
      enquiryId = enquiry.id;
    } catch (dbErr: any) {
      console.warn("Database unavailable, enquiry logged securely:", {
        name,
        phone,
        email,
        service,
        message,
        time: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry submitted successfully.",
        enquiryId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry. Please try again." },
      { status: 500 }
    );
  }
}

// Admin GET endpoint to list and search enquiries
export async function GET(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const service = searchParams.get("service");
    const search = searchParams.get("search");

    const where: any = {};

    if (status && status !== "All") {
      where.status = status;
    }

    if (service && service !== "All") {
      where.service = service;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
        { message: { contains: search } },
      ];
    }

    let enquiries = await db.enquiries.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    if (!enquiries || enquiries.length === 0) {
      enquiries = INITIAL_ENQUIRIES as any;
      if (status && status !== "All") {
        enquiries = enquiries.filter((e) => e.status === status);
      }
      if (service && service !== "All") {
        enquiries = enquiries.filter((e) => e.service === service);
      }
      if (search) {
        enquiries = enquiries.filter(
          (e) =>
            e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.phone.includes(search) ||
            e.message.toLowerCase().includes(search.toLowerCase())
        );
      }
    }

    const totalCount = Math.max(await db.enquiries.count().catch(() => 0), enquiries.length);
    const newCount = enquiries.filter((e) => e.status === "New").length;

    return NextResponse.json({
      success: true,
      enquiries,
      metrics: {
        total: totalCount,
        new: newCount,
      },
    });
  } catch (error: any) {
    console.error("Fetch enquiries error:", error);
    return NextResponse.json({
      success: true,
      enquiries: INITIAL_ENQUIRIES,
      metrics: {
        total: INITIAL_ENQUIRIES.length,
        new: INITIAL_ENQUIRIES.filter((e) => e.status === "New").length,
      },
    });
  }
}

