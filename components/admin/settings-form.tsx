"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { settingsSchema } from "@/lib/validations";
import { z } from "zod";

type SettingsInput = z.infer<typeof settingsSchema>;

export function SettingsForm({ initialData }: { initialData: SettingsInput }) {
  const [submitting, setSubmitting] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsInput>({ resolver: zodResolver(settingsSchema), defaultValues: initialData });

  async function onSubmit(data: SettingsInput) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Settings saved. Changes are live on the public site.");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      <Section title="General">
        <Field label="Website Name" error={errors.siteName?.message}>
          <input {...register("siteName")} className="admin-input" />
        </Field>
        <Field label="Description">
          <textarea {...register("description")} rows={3} className="admin-input resize-none" />
        </Field>
        <Field label="Logo URL">
          <input {...register("logoUrl")} className="admin-input" placeholder="https://…" />
        </Field>
        <Field label="Favicon URL">
          <input {...register("faviconUrl")} className="admin-input" placeholder="https://…" />
        </Field>
        <Field label="Contact Email">
          <input {...register("contactEmail")} type="email" className="admin-input" />
        </Field>
        <Field label="Accent Color">
          <input {...register("accentColor")} type="text" className="admin-input" placeholder="#f2a71b" />
        </Field>
      </Section>

      <Section title="Social Links">
        <Field label="Instagram">
          <input {...register("socialLinks.instagram")} className="admin-input" />
        </Field>
        <Field label="Twitter / X">
          <input {...register("socialLinks.twitter")} className="admin-input" />
        </Field>
        <Field label="Facebook">
          <input {...register("socialLinks.facebook")} className="admin-input" />
        </Field>
        <Field label="YouTube">
          <input {...register("socialLinks.youtube")} className="admin-input" />
        </Field>
      </Section>

      <Section title="Footer">
        <Field label="Footer Text">
          <input {...register("footerText")} className="admin-input" placeholder="© 2026 Telly Shine. All rights reserved." />
        </Field>
      </Section>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:scale-105 transition-transform disabled:opacity-60"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Settings
      </button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
