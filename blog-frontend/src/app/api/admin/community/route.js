import { checkAdminAuth, errorResponse } from "@/lib/auth";
import { backendAdminFetch } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET(req) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;
  try {
    const [subs, contacts, analytics] = await Promise.all([
      backendAdminFetch("/subscribe"),
      backendAdminFetch("/contact"),
      backendAdminFetch("/analytics"),
    ]);
    return NextResponse.json({
      success: true,
      subscribers: subs.data ?? [],
      contacts: contacts.data ?? [],
      analytics,
    });
  } catch (error) {
    return errorResponse(error, 502);
  }
}
