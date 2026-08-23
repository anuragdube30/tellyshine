"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { videoSchema, type VideoInput } from "@/lib/validations";
import { youtubeThumbnail } from "@/lib/utils";

type Option = { id: string; name: string };

export function VideoForm({
  categories,
  serials,
  initialData,
  videoId,
}: {
  categories: Option[];
  serials: Option[];
  initialData?: Partial<VideoInput>;
  videoId?: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VideoInput>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      youtubeUrl: "",
      isPublished: true,
      ...initialData,
    },
  });

  const youtubeUrl = watch("youtubeUrl");
  const previewThumb = youtubeUrl ? youtubeThumbnail(youtubeUrl) : null;

  async function onSubmit(data: VideoInput) {
    setSubmitting(true);
    try {
      const res = await fetch(videoId ? `/api/videos/${videoId}` : "/api/videos", {
        method: videoId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success(videoId ? "Video updated" : "Video created");
      router.push("/admin/videos");
      router.refresh();
    } catch {
      toast.error("Failed to save video");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Title</label>
          <input {...register("title")} className="admin-input" placeholder="Video title" />
          {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">YouTube URL</label>
          <input {...register("youtubeUrl")} className="admin-input" placeholder="https://www.youtube.com/watch?v=…" />
          {errors.youtubeUrl && <p className="text-xs text-destructive mt-1">{errors.youtubeUrl.message}</p>}
          {previewThumb && (
            <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden border border-border mt-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewThumb} alt="Thumbnail preview" className="h-full w-full object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Description</label>
          <textarea {...register("description")} rows={4} className="admin-input resize-none" placeholder="Video description" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Duration</label>
          <input {...register("duration")} className="admin-input" placeholder="e.g. 4:32" />
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <select {...register("categoryId")} className="admin-input">
              <option value="">None</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Related Serial</label>
            <select {...register("serialId")} className="admin-input">
              <option value="">None</option>
              {serials.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("isPublished")} className="rounded" />
            Published
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:scale-[1.02] transition-transform disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {videoId ? "Update Video" : "Add Video"}
          </button>
        </div>
      </div>
    </form>
  );
}
