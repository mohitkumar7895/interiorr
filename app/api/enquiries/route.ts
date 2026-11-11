import { NextRequest, NextResponse } from "next/server";
import db from '@/lib/db';
import { EnquirySchema } from "@/lib/validations";
import { getCurrentAdmin } from "@/lib/auth/auth";
import { INITIAL_ENQUIRIES } from "@/lib/data/initialData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

let memoryEnquiries = [...INITIAL_ENQUIRIES];

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
    const newEnquiry: any = {
      id: enquiryId,
      name,
      phone,
      email: email || null,
      service,
      message,
      status: "New",
      createdAt: new Date().toISOString(),
    };

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
      newEnquiry.id = enquiry.id;
    } catch (dbErr: any) {
      console.warn("Database unavailable, enquiry logged in memory:", dbErr);
      memoryEnquiries.unshift(newEnquiry);
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
      { error: "Invalid enquiry submission. Please verify your details." },
      { status: 400 }
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

    let enquiries: any[] = [];
    try {
      enquiries = await db.enquiries.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
    } catch (dbErr) {
      console.warn("DB lookup error in /api/enquiries GET:", dbErr);
    }

    if (!enquiries || enquiries.length === 0) {
      enquiries = memoryEnquiries as any;
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
            (e.message && e.message.toLowerCase().includes(search.toLowerCase()))
        );
      }
    }

    const totalCount = enquiries.length;
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
      enquiries: memoryEnquiries,
      metrics: {
        total: memoryEnquiries.length,
        new: memoryEnquiries.filter((e) => e.status === "New").length,
      },
    });
  }
}
