"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { celebritySchema, type CelebrityInput } from "@/lib/validations";
import { ImageUploadField } from "./image-upload-field";

export function CelebrityForm({
  initialData,
  celebrityId,
}: {
  initialData?: Partial<CelebrityInput>;
  celebrityId?: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CelebrityInput>({
    resolver: zodResolver(celebritySchema),
    defaultValues: {
      name: "",
      profileImage: "",
      biography: "",
      profession: "",
      featured: false,
      socialLinks: { instagram: "", twitter: "", facebook: "" },
      ...initialData,
    },
  });

  async function onSubmit(data: CelebrityInput) {
    setSubmitting(true);
    try {
      const res = await fetch(celebrityId ? `/api/celebrities/${celebrityId}` : "/api/celebrities", {
        method: celebrityId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success(celebrityId ? "Profile updated" : "Celebrity added");
      router.push("/admin/celebrities");
      router.refresh();
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Name</label>
          <input {...register("name")} className="admin-input" placeholder="Celebrity name" />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Profession</label>
          <input {...register("profession")} className="admin-input" placeholder="e.g. Actor, Host, Singer" />
          {errors.profession && <p className="text-xs text-destructive mt-1">{errors.profession.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Biography</label>
          <textarea {...register("biography")} rows={6} className="admin-input resize-none" placeholder="Short biography" />
          {errors.biography && <p className="text-xs text-destructive mt-1">{errors.biography.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller control={control} name="profileImage" render={({ field }) => <ImageUploadField label="Profile Image" value={field.value} onChange={field.onChange} />} />
          <Controller control={control} name="coverImage" render={({ field }) => <ImageUploadField label="Cover Image (optional)" value={field.value || ""} onChange={field.onChange} />} />
        </div>
        {errors.profileImage && <p className="text-xs text-destructive">{errors.profileImage.message}</p>}
      </div>

      <div className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
          <h3 className="text-sm font-semibold">Social Links</h3>
          <input {...register("socialLinks.instagram")} className="admin-input" placeholder="Instagram URL" />
          <input {...register("socialLinks.twitter")} className="admin-input" placeholder="Twitter / X URL" />
          <input {...register("socialLinks.facebook")} className="admin-input" placeholder="Facebook URL" />

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("featured")} className="rounded" />
            Feature on Celebrities page
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:scale-[1.02] transition-transform disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {celebrityId ? "Update Profile" : "Add Celebrity"}
          </button>
        </div>
      </div>
    </form>
  );
}
