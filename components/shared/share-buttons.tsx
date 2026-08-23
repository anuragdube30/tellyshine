"use client";

import { Facebook, Twitter, Link2, Send } from "lucide-react";
import { toast } from "sonner";

export function ShareButtons({ title }: { title: string }) {
  function share(platform: "facebook" | "twitter" | "whatsapp") {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const encoded = encodeURIComponent(url);
    const text = encodeURIComponent(title);
    const links = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      twitter: `https://twitter.com/intent/tweet?url=${encoded}&text=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${encoded}`,
    };
    window.open(links[platform], "_blank", "noopener,noreferrer");
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  }

  return (
    <div className="flex items-center gap-2 mt-8 pt-6 border-t border-border">
      <span className="text-sm text-muted-foreground mr-2">Share:</span>
      {[
        { icon: Facebook, action: () => share("facebook"), label: "Share on Facebook" },
        { icon: Twitter, action: () => share("twitter"), label: "Share on Twitter" },
        { icon: Send, action: () => share("whatsapp"), label: "Share on WhatsApp" },
        { icon: Link2, action: copyLink, label: "Copy link" },
      ].map(({ icon: Icon, action, label }, i) => (
        <button
          key={i}
          onClick={action}
          aria-label={label}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
