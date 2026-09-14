import { NextResponse } from "next/server";

export function checkAdminAuth(req) {
  if (process.env.NODE_ENV !== "development") {
    // If we're not in development, require a secret token
    const authHeader = req.headers.get("Authorization");
    const secret = process.env.ADMIN_SECRET;
    
    if (!secret || authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized. Admin secret required." }, { status: 403 });
    }
  }
  return null; // Authorized
}
