import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
