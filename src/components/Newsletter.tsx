"use client";

import { useState } from "react";
import { ArrowRight, Check } from "./icons";

/**
 * Newsletter capture. Posts to /api/subscribe, which you can connect to your
 * email platform (Klaviyo, Mailchimp, etc.).
 */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="row h3" role="status">
        <Check size={20} /> You&apos;re in. First notes land soon.
      </p>
    );
  }

  return (
    <div className="stack-v" style={{ "--gap": "10px" } as React.CSSProperties}>
      <form onSubmit={submit}>
        <label htmlFor="nl-email" className="sr-only">
          Email address
        </label>
        <input
          id="nl-email"
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <button className="btn btn--light btn--sm" disabled={state === "busy"} type="submit">
          Join <ArrowRight />
        </button>
      </form>
      <small className="muted">
        {state === "error" ? "Something went wrong. Please try again." : "Unsubscribe any time. We never sell your data."}
      </small>
    </div>
  );
}
