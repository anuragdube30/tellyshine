"use client";

import * as React from "react";
import { toast } from "sonner";

export function NewsletterForm() {
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function subscribe(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setEmail("");
      toast.success("You are subscribed to Telly Shine updates.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Subscription failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={subscribe} className="flex gap-2" aria-label="Newsletter subscription">
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <input
        id="newsletter-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
        required
        className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {submitting ? "Joining…" : "Join"}
      </button>
    </form>
  );
}
