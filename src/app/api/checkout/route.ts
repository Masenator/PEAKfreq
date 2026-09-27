import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { brand } from "@/data/brand";
import { isCurrency, priceCart, type CartLine } from "@/lib/pricing";

/**
 * Creates a Stripe Checkout session. Prices are always recalculated on the
 * server from the catalog; the client only sends product ids and quantities.
 * Uses inline price_data, so any product in the catalog is sellable without
 * creating it in Stripe first. Without STRIPE_SECRET_KEY it runs in demo mode.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { lines?: unknown; currency?: unknown } | null;
  if (!body || !Array.isArray(body.lines) || !isCurrency(body.currency)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const currency = body.currency;
  const lines: CartLine[] = body.lines.slice(0, 50).flatMap((l: unknown) => {
    if (!l || typeof l !== "object") return [];
    const o = l as Record<string, unknown>;
    if (typeof o.productId !== "string" || typeof o.variantId !== "string" || typeof o.qty !== "number") return [];
    return [
      {
        productId: o.productId,
        variantId: o.variantId,
        qty: o.qty,
        subscribe: o.subscribe === true,
        stackId: typeof o.stackId === "string" ? o.stackId : undefined,
      },
    ];
  });

  const cart = priceCart(lines, currency);
  if (cart.lines.length === 0) return NextResponse.json({ error: "Your bag is empty" }, { status: 400 });

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json({ url: `${origin}/checkout/success?demo=1`, demo: true });
  }

  const stripe = new Stripe(key);
  const hasSubscription = cart.lines.some((l) => l.subscribe);
  const cur = currency.toLowerCase();

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.lines.map((l) => {
    const details = [l.product.variants.length > 1 ? l.variant.label : l.product.size, l.discountLabel]
      .filter(Boolean)
      .join(" · ");
    return {
      quantity: l.qty,
      price_data: {
        currency: cur,
        unit_amount: l.unitAfterDiscount,
        product_data: {
          name: `${brand.name} ${l.product.name} · ${l.product.descriptor}`,
          ...(details ? { description: details } : {}),
          metadata: { productId: l.product.id, variantId: l.variant.id, sku: l.variant.sku },
        },
        ...(l.subscribe ? { recurring: { interval: "month" as const } } : {}),
      },
    };
  });

  // Checkout's shipping_options are payment-mode only; charge shipping as a line in subscription mode.
  if (hasSubscription && cart.shipping > 0) {
    line_items.push({
      quantity: 1,
      price_data: { currency: cur, unit_amount: cart.shipping, product_data: { name: "Standard shipping" } },
    });
  }

  const skus = cart.lines.map((l) => `${l.variant.sku}x${l.qty}${l.subscribe ? "S" : ""}`).join(",");

  try {
    const session = await stripe.checkout.sessions.create({
      mode: hasSubscription ? "subscription" : "payment",
      line_items,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: [...brand.shippingCountries] as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      ...(hasSubscription
        ? {}
        : {
            shipping_options: [
              {
                shipping_rate_data: {
                  type: "fixed_amount" as const,
                  display_name: cart.shipping === 0 ? "Free standard shipping" : "Standard shipping",
                  fixed_amount: { amount: cart.shipping, currency: cur },
                  delivery_estimate: {
                    minimum: { unit: "business_day" as const, value: 2 },
                    maximum: { unit: "business_day" as const, value: 7 },
                  },
                },
              },
            ],
          }),
      automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === "true" },
      metadata: { skus: skus.slice(0, 500), currency },
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error", err);
    return NextResponse.json({ error: "Payment provider error. Please try again." }, { status: 502 });
  }
}
