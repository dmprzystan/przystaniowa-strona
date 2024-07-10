import { NextRequest, NextResponse } from "next/server";

const url = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const middleware = async (request: NextRequest) => {
  console.log(url);
  const path = request.nextUrl.pathname;

  const token = request.cookies.get("token")?.value; // Get the token from the cookies

  let loggedIn = false;

  if (token) {
    const res = await fetch(`${url}/api/auth/verify`, {
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
      const url = new URL("/admin", request.url);
      return NextResponse.redirect(url, { status: 302 });
    }

    if (!loggedIn && path !== "/admin/login") {
      const url = new URL("/admin/login", request.url);
      return NextResponse.redirect(url, { status: 302 });
    }
  }
};

export const config = {
  matcher: ["/(admin.*)", "/(api/admin.*)"],
};
