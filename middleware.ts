import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  const path = request.nextUrl.pathname;
  const origin = request.nextUrl.origin;

  if (path.startsWith("/public")) {
    const downloadUrl = path.replace("/public/", "");
    console.log(downloadUrl);

    const response = await fetch(`${origin}/api/download?path=${downloadUrl}`, {
      method: "GET",
      headers: {
        Authorization: process.env.B2_DOWNLOAD_SECRET || "",
      },
    });

    if (response.ok) {
      const { url, authorization } = await response.json();
      return NextResponse.rewrite(url, {
        headers: {
          Authorization: authorization,
        },
      });
    }

    return NextResponse.error();
  }

  const token = request.cookies.get("token")?.value;

  let loggedIn = false;

  if (token) {
    const res = await fetch(`${origin}/api/auth/verify`, {
      method: "POST",
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
  matcher: ["/(admin.*)", "/(api/admin.*)", "/(public/.*)"],
};
