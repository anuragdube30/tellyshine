"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { serialSchema, type SerialInput } from "@/lib/validations";
import { ImageUploadField } from "./image-upload-field";

type Category = { id: string; name: string };

export function SerialForm({
  categories,
  initialData,
  serialId,
}: {
  categories: Category[];
  initialData?: Partial<SerialInput>;
  serialId?: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [castInput, setCastInput] = React.useState("");
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SerialInput>({
    resolver: zodResolver(serialSchema),
    defaultValues: {
      status: "ONGOING",
      name: "",
      poster: "",
      banner: "",
      description: "",
      channel: "",
      genre: "",
      cast: [],
      featured: false,
      ...initialData,
    },
  });

  const cast = watch("cast") || [];

  function addCastMember() {
    const name = castInput.trim();
    if (!name) return;
    if (!cast.includes(name)) setValue("cast", [...cast, name]);
    setCastInput("");
  }

  function removeCastMember(name: string) {
    setValue("cast", cast.filter((c) => c !== name));
  }

  async function onSubmit(data: SerialInput) {
    setSubmitting(true);
    try {
      const res = await fetch(serialId ? `/api/serials/${serialId}` : "/api/serials", {
        method: serialId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success(serialId ? "Serial updated" : "Serial created");
      router.push("/admin/serials");
      router.refresh();
    } catch {
      toast.error("Failed to save serial");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Serial Name</label>
          <input {...register("name")} className="admin-input" placeholder="Serial name" />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Description</label>
          <textarea {...register("description")} rows={5} className="admin-input resize-none" placeholder="Synopsis / storyline" />
          {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={control}
            name="poster"
            render={({ field }) => <ImageUploadField label="Poster (portrait)" value={field.value} onChange={field.onChange} />}
          />
          <Controller
            control={control}
            name="banner"
            render={({ field }) => <ImageUploadField label="Banner (landscape)" value={field.value} onChange={field.onChange} />}
          />
        </div>
        {(errors.poster || errors.banner) && (
          <p className="text-xs text-destructive">{errors.poster?.message || errors.banner?.message}</p>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5">Cast</label>
          <div className="flex gap-2">
            <input
              value={castInput}
              onChange={(e) => setCastInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCastMember();
                }
              }}
              className="admin-input"
              placeholder="Actor name, press Enter to add"
            />
            <button type="button" onClick={addCastMember} className="shrink-0 rounded-xl border border-border px-4 text-sm hover:border-primary transition-colors">
              Add
            </button>
          </div>
          {errors.cast && <p className="text-xs text-destructive mt-1">{errors.cast.message}</p>}
          <div className="flex flex-wrap gap-2 mt-2">
            {cast.map((name) => (
              <span key={name} className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs">
                {name}
                <button type="button" onClick={() => removeCastMember(name)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Latest Episode</label>
            <input {...register("latestEpisode")} className="admin-input" placeholder="e.g. Episode 142" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Upcoming Episode</label>
            <input {...register("upcomingEpisode")} className="admin-input" placeholder="e.g. Episode 143 — airs Friday" />
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Channel</label>
            <input {...register("channel")} className="admin-input" placeholder="e.g. Star Plus" />
            {errors.channel && <p className="text-xs text-destructive mt-1">{errors.channel.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Genre</label>
            <input {...register("genre")} className="admin-input" placeholder="e.g. Drama, Family" />
            {errors.genre && <p className="text-xs text-destructive mt-1">{errors.genre.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Status</label>
            <select {...register("status")} className="admin-input">
              <option value="ONGOING">Ongoing</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="ENDED">Ended</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Start Date</label>
            <input type="date" {...register("startDate")} className="admin-input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <select {...register("categoryId")} className="admin-input">
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("featured")} className="rounded" />
            Feature on TV Serials page
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:scale-[1.02] transition-transform disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {serialId ? "Update Serial" : "Create Serial"}
          </button>
        </div>
      </div>
    </form>
  );
}
