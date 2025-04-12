import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  const path = request.nextUrl.pathname;
  const origin = request.nextUrl.origin;

  if (path.startsWith("/public")) {
    const downloadUrl = path.replace("/public/", "");

    const response = await fetch(`${origin}/api/download?path=${downloadUrl}`, {
      method: "GET",
      headers: {
        Authorization: process.env.B2_DOWNLOAD_SECRET || "",
      },
    });

    if (response.ok) {
      const { url, authorization } = (await response.json()) as {
        url: string;
        authorization: string;
      };
      const encodedUrl = encodeURI(url.normalize("NFD"));

      const headers = new Headers();
      headers.set("Authorization", authorization);

      return NextResponse.rewrite(encodedUrl, {
        request: {
          headers,
        },
      });
    }

    return NextResponse.error();
  }

  const token = request.cookies.get("token")?.value;

  let loggedIn =
    false ||
    request.headers.get("x-authorization") === process.env.ADMIN_SECRET;

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

// https://api003.backblazeb2.com/file/przystaniowa-strona/gazetki/Gazetka+19tka+nr.+136+(Kwiecien%CC%81+2013).pdf
// https://f003.backblazeb2.com/file/przystaniowa-strona/gazetki/Gazetka+19tka+nr.+136+(Kwiecien%CC%81+2013).pdf
