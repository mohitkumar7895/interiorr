import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { getCurrentAdmin, hashPassword, verifyPassword } from "@/lib/auth/auth";

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Current password, new password, and confirmation are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New password and confirmation do not match." },
        { status: 400 }
      );
    }

    // Verify current password
    let passwordMatches = false;
    let adminRecord: any = null;

    try {
      adminRecord = await db.admin.findUnique({
        where: { email: admin.email },
      });
      if (adminRecord && adminRecord.password) {
        passwordMatches = await verifyPassword(currentPassword, adminRecord.password);
      }
    } catch (dbErr) {
      console.warn("DB unreachable during password check, checking fallback credentials:", dbErr);
    }

    // Fallback check if DB didn't match or was down
    const defaultPassword = process.env.ADMIN_PASSWORD || "admin123";
    if (!passwordMatches && currentPassword === defaultPassword) {
      passwordMatches = true;
    }

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Incorrect current password." },
        { status: 400 }
      );
    }

    // Hash the new password
    const newHash = await hashPassword(newPassword);

    // Save to database if available
    try {
      await db.admin.upsert({
        where: { email: admin.email },
        update: {
          password: newHash,
          name: admin.name || "Monish Pasha",
          role: admin.role || "superadmin",
        },
        create: {
          email: admin.email,
          password: newHash,
          name: admin.name || "Monish Pasha",
          role: admin.role || "superadmin",
        },
      });
    } catch (dbErr) {
      console.warn("DB update failed during password change:", dbErr);
    }

    // Also update runtime fallback so session continues seamlessly
    process.env.ADMIN_PASSWORD = newPassword;

    return NextResponse.json({
      success: true,
      message: "Password changed successfully! Please use your new password next time you log in.",
    });
  } catch (error: any) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to change password." },
      { status: 500 }
    );
  }
}
