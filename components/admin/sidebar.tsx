"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Tv,
  Video,
  Users,
  FolderTree,
  Radio,
  Mail,
  Image as ImageIcon,
  Settings,
  ShieldCheck,
  Sparkle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/serials", label: "TV Serials", icon: Tv },
  { href: "/admin/videos", label: "Videos", icon: Video },
  { href: "/admin/celebrities", label: "Celebrities", icon: Users },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/breaking-news", label: "Breaking News", icon: Radio },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/security", label: "Security", icon: ShieldCheck },
];

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={cn("w-64 shrink-0 border-r border-border bg-card flex flex-col h-screen sticky top-0", className)}>
      <div className="h-16 flex items-center gap-2 px-6 border-b border-border">
        <Sparkle className="h-5 w-5 text-primary" />
        <span className="font-display font-bold text-lg">
          Telly<span className="text-gradient-gold">Shine</span>
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname?.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
