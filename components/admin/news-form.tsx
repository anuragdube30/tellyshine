"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { newsSchema, type NewsInput } from "@/lib/validations";
import { RichTextEditor } from "./rich-text-editor";
import { ImageUploadField } from "./image-upload-field";

type Category = { id: string; name: string };

export function NewsForm({
  categories,
  initialData,
  newsId,
}: {
  categories: Category[];
  initialData?: Partial<NewsInput>;
  newsId?: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<NewsInput>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      status: "DRAFT",
      title: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      categoryId: "",
      ...initialData,
    },
  });

  const status = watch("status");

  async function onSubmit(data: NewsInput) {
    setSubmitting(true);
    try {
      const res = await fetch(newsId ? `/api/news/${newsId}` : "/api/news", {
        method: newsId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success(newsId ? "Article updated" : "Article created");
      router.push("/admin/news");
      router.refresh();
    } catch {
      toast.error("Failed to save article");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Title</label>
          <input {...register("title")} className="admin-input" placeholder="Article title" />
          {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Excerpt</label>
          <textarea {...register("excerpt")} rows={2} className="admin-input resize-none" placeholder="Short summary shown on cards" />
          {errors.excerpt && <p className="text-xs text-destructive mt-1">{errors.excerpt.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Content</label>
          <Controller
            control={control}
            name="content"
            render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} />}
          />
          {errors.content && <p className="text-xs text-destructive mt-1">{errors.content.message}</p>}
        </div>

        <Controller
          control={control}
          name="featuredImage"
          render={({ field }) => (
            <ImageUploadField label="Featured Image" value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.featuredImage && <p className="text-xs text-destructive mt-1">{errors.featuredImage.message}</p>}

        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3">SEO</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">SEO Title</label>
              <input {...register("seoTitle")} className="admin-input" placeholder="Defaults to article title" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">SEO Description</label>
              <textarea {...register("seoDescription")} rows={2} className="admin-input resize-none" placeholder="Defaults to excerpt" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Status</label>
            <select {...register("status")} className="admin-input">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="SCHEDULED">Scheduled</option>
            </select>
          </div>

          {status === "SCHEDULED" && (
            <div>
              <label className="block text-sm font-medium mb-1.5">Schedule For</label>
              <input type="datetime-local" {...register("scheduledFor")} className="admin-input" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <select {...register("categoryId")} className="admin-input">
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-destructive mt-1">{errors.categoryId.message}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:scale-[1.02] transition-transform disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {newsId ? "Update Article" : "Create Article"}
          </button>
        </div>
      </div>
    </form>
  );
}
