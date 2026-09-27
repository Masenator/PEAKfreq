import { NextResponse, type NextRequest } from "next/server";

/**
 * Newsletter sign-up. Set NEWSLETTER_WEBHOOK_URL to forward sign-ups to your
 * email platform or an automation (Klaviyo, Mailchimp, Make, Zapier).
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { email?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  const hook = process.env.NEWSLETTER_WEBHOOK_URL;
  if (hook) {
    try {
      const res = await fetch(hook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source: "website", at: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(`Webhook ${res.status}`);
    } catch (err) {
      console.error("Newsletter webhook failed", err);
      return NextResponse.json({ error: "Could not subscribe" }, { status: 502 });
    }
  }
  return NextResponse.json({ ok: true });
}
