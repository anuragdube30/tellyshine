"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, Link2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ImageUploadField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
}) {
  const [mode, setMode] = React.useState<"upload" | "url">(value ? "url" : "upload");
  const [uploading, setUploading] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, alt: file.name }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      onChange(data.url);
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed — check your Cloudinary env vars, or paste a URL instead.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>

      {value ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border">
          <Image src={value} alt="" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div>
          <div className="flex gap-2 mb-2">
            <TabButton active={mode === "upload"} onClick={() => setMode("upload")} icon={<Upload className="h-3.5 w-3.5" />} label="Upload" />
            <TabButton active={mode === "url"} onClick={() => setMode("url")} icon={<Link2 className="h-3.5 w-3.5" />} label="Paste URL" />
          </div>

          {mode === "upload" ? (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex w-full aspect-video items-center justify-center rounded-xl border-2 border-dashed border-border hover:border-primary transition-colors"
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <div className="text-center text-muted-foreground text-sm">
                  <Upload className="h-6 w-6 mx-auto mb-1" />
                  Click to upload an image
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </button>
          ) : (
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              onChange={(e) => onChange(e.target.value)}
              className="w-full rounded-xl border border-border bg-secondary/60 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          )}
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-colors",
        active ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"
      )}
    >
      {icon} {label}
    </button>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
