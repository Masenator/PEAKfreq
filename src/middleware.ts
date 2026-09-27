import { NextResponse, type NextRequest } from "next/server";

/**
 * Protects the ops console (/ops) and its exports with HTTP Basic auth.
 * Set OPS_PASSWORD in production. If unset, ops is dev-only.
 */
export const config = { matcher: ["/ops", "/ops/:path*", "/api/ops/:path*"] };

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function middleware(req: NextRequest) {
  const password = process.env.OPS_PASSWORD;
  if (!password) {
    return process.env.NODE_ENV === "production" ? new NextResponse("Not found", { status: 404 }) : NextResponse.next();
  }
  const header = req.headers.get("authorization") ?? "";
  if (header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      const pass = decoded.slice(decoded.indexOf(":") + 1);
      if (safeEqual(pass, password)) return NextResponse.next();
    } catch {
      /* malformed header */
    }
  }
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="ops", charset="UTF-8"' },
  });
}
