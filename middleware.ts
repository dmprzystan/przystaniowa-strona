import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  const path = request.nextUrl.pathname;

  if (!path.startsWith("/admin") && !path.startsWith("/api/admin")) {
    return;
  }

  const token = request.cookies.get("token")?.value; // Get the token from the cookies

  let loggedIn = false;

  if (token) {
    const res = await fetch("http://localhost:3000/api/auth/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (res.ok) {
      loggedIn = true;
    }
  }

  const api = path.startsWith("/api/admin");

  if (api) {
    if (!loggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else {
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
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
