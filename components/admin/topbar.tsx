"use client";

import * as React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Menu, ExternalLink } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "./sidebar";

export function AdminTopbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-6 bg-background sticky top-0 z-30">
        <button
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full border border-border"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <Link
          href="/"
          target="_blank"
          className="hidden md:inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          View Site <ExternalLink className="h-3.5 w-3.5" />
        </Link>

        <div className="flex items-center gap-3 ml-auto">
          <ThemeToggle />
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-sm font-medium">{session?.user?.name}</span>
            <span className="text-xs text-muted-foreground">{session?.user?.role}</span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            aria-label="Sign out"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-opacity",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
        <div
          className={cn(
            "absolute left-0 top-0 h-full transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <AdminSidebar className="sticky top-0" />
        </div>
      </div>
    </>
  );
}
