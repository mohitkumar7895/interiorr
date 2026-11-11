import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyPassword, signAdminToken, COOKIE_NAME, hashPassword } from "@/lib/auth/auth";
import { LoginSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MASTER_ADMINS = [
  {
    email: (process.env.ADMIN_EMAIL || "admin@mainterior.com").toLowerCase(),
    password: process.env.ADMIN_PASSWORD || "admin123",
    name: "Monish Pasha",
    role: "superadmin",
  },
  {
    email: "monishpasha233@gmail.com",
    password: process.env.ADMIN_PASSWORD || "admin123",
    name: "Monish Pasha",
    role: "superadmin",
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = LoginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Invalid credentials format." },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    let authenticatedAdmin: {
      id: string;
      email: string;
      name: string;
      role: string;
    } | null = null;

    // 1. Check primary master credentials
    const masterAccount = MASTER_ADMINS.find(
      (m) => m.email === normalizedEmail && m.password === password
    );

    if (masterAccount) {
      authenticatedAdmin = {
        id: `master-${normalizedEmail.replace(/[^a-z0-9]/g, "-")}`,
        email: masterAccount.email,
        name: masterAccount.name,
        role: masterAccount.role,
      };

      // Try syncing to DB in background if DB is available
      try {
        const existing = await db.admin.findUnique({ where: { email: normalizedEmail } });
        if (!existing) {
          const hashedPassword = await hashPassword(password);
          await db.admin.create({
            data: {
              email: normalizedEmail,
              password: hashedPassword,
              name: masterAccount.name,
              role: masterAccount.role,
            },
          });
        }
      } catch (dbSyncErr) {
        // Silently continue if database is not reachable
        console.warn("Database sync notice during master login:", dbSyncErr);
      }
    }

    // 2. If not matched with master, check Database
    if (!authenticatedAdmin) {
      try {
        const adminFromDb = await db.admin.findUnique({
          where: { email: normalizedEmail },
        });

        if (adminFromDb && adminFromDb.password) {
          const isValid = await verifyPassword(password, adminFromDb.password);
          if (isValid) {
            authenticatedAdmin = {
              id: adminFromDb.id,
              email: adminFromDb.email,
              name: adminFromDb.name || "Administrator",
              role: adminFromDb.role || "superadmin",
            };
          }
        }
      } catch (dbErr) {
        console.warn("Database lookup error during login:", dbErr);
      }
    }

    // If still not authenticated, return 401 (Never 500)
    if (!authenticatedAdmin) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Sign JWT token
    const token = signAdminToken({
      id: authenticatedAdmin.id,
      email: authenticatedAdmin.email,
      name: authenticatedAdmin.name,
      role: authenticatedAdmin.role,
    });

    // Set secure HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: authenticatedAdmin.id,
        email: authenticatedAdmin.email,
        name: authenticatedAdmin.name,
        role: authenticatedAdmin.role,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Try logging admin activity if database is reachable
    try {
      await db.activityLogs.create({
        data: {
          action: "Admin Login",
          adminEmail: authenticatedAdmin.email,
          details: "Logged into MA Carpenter admin portal",
          ipAddress: req.ip || req.headers.get("x-forwarded-for") || "localhost",
        },
      });
    } catch {}

    return response;
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Login failed. Please verify your credentials and try again." },
      { status: 400 }
    );
  }
}
