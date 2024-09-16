import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  const path = request.nextUrl.pathname;
  const url = request.nextUrl.origin;

  if (path.startsWith("/gazetka")) {
    const url = path.split("/").slice(2).join("/");

    console.log(`${process.env.NEWSPAPER_ENDPOINT}/gazetki/${url}`);
    return NextResponse.rewrite(
      `${process.env.NEWSPAPER_ENDPOINT}/gazetki/${url}`
    );
  }

  if (path.startsWith("/wyjazdy")) {
    const url = path.split("/").slice(2).join("/");
    return NextResponse.rewrite(`${process.env.TRIPS_ENDPOINT}/${url}`);
  }

  if (path.startsWith("/galeria/img")) {
    const url = path.split("/").slice(3).join("/");
    return NextResponse.rewrite(
      `${process.env.GALLERY_ENDPOINT}/gallery/${url}`
    );
  }

  const token = request.cookies.get("token")?.value;

  let loggedIn = false;

  if (token) {
    console.log("Has token");
    console.log("Fetching url: ", `${url}/api/auth/verify`);

    const res = await fetch(`${url}/api/auth/verify`, {
      method: "POST",
      body: JSON.stringify({ token }),
    });

    console.log("Fetch done, status: ", res.status);
    console.log("Response: ", res);

    if (res.ok) {
      loggedIn = true;
    } else {
      console.log("Something went wrong");
      console.log(await res.text());
    }
  } else {
    console.log("No token - weird");
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
  matcher: [
    "/(admin.*)",
    "/(api/admin.*)",
    "/(gazetka/.*)",
    "/(wyjazdy/.*)",
    "/(galeria/img/.*)",
  ],
};
