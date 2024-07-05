import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  const path = request.nextUrl.pathname;

  if (!path.startsWith("/admin")) {
    return;
  }

  const loggedIn = false; // Check if the user is logged in

  if (loggedIn && path === "/admin/login") {
    // @ts-ignore
    const url = new URL("/admin", request.nextUrl);
    return NextResponse.redirect(url);
  }

  if (!loggedIn && path !== "/admin/login") {
    // @ts-ignore
    const url = new URL("/admin/login", request.nextUrl);
    return NextResponse.redirect(url);
  }
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
