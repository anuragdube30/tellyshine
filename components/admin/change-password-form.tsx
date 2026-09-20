"use client";

import * as React from "react";
import { toast } from "sonner";

export function ChangePasswordForm() {
  const [saving, setSaving] = React.useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const currentPassword = String(form.get("currentPassword") || "");
    const newPassword = String(form.get("newPassword") || "");
    const confirmPassword = String(form.get("confirmPassword") || "");
    if (newPassword !== confirmPassword) return toast.error("New passwords do not match");
    setSaving(true);
    try {
      const response = await fetch("/api/admin/password", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword, newPassword }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      event.currentTarget.reset();
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Password change failed");
    } finally { setSaving(false); }
  }
  return <form onSubmit={submit} className="max-w-xl space-y-5 rounded-xl border border-border bg-card p-6">
    <PasswordField name="currentPassword" label="Current password" autoComplete="current-password" />
    <PasswordField name="newPassword" label="New password" autoComplete="new-password" minLength={12} />
    <PasswordField name="confirmPassword" label="Confirm new password" autoComplete="new-password" minLength={12} />
    <button disabled={saving} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{saving ? "Saving…" : "Change Password"}</button>
  </form>;
}

function PasswordField(props: { name: string; label: string; autoComplete: string; minLength?: number }) {
  return <label className="block text-sm font-medium">{props.label}<input {...props} type="password" required className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring" /></label>;
}
