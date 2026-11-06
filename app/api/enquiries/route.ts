import { NextRequest, NextResponse } from "next/server";
import db from '@/lib/db';
import { EnquirySchema } from "@/lib/validations";
import { getCurrentAdmin } from "@/lib/auth/auth";

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

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry submitted successfully.",
        enquiryId: enquiry.id,
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

    const enquiries = await db.enquiries.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const totalCount = await db.enquiries.count();
    const newCount = await db.enquiries.count({ where: { status: "New" } });

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
    return NextResponse.json(
      { error: "Failed to fetch enquiries." },
      { status: 500 }
    );
  }
}

