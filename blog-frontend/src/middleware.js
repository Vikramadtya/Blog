import { NextResponse } from "next/server";

// The admin UI and its APIs edit files on disk; they only exist in local development.
export function middleware() {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/create-post"],
};
