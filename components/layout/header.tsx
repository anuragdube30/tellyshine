"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tv-serials", label: "TV Serials" },
  { href: "/trending", label: "Trending" },
  { href: "/videos", label: "Videos" },
  { href: "/entertainment", label: "Entertainment" },
  { href: "/celebrities", label: "Celebrities" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div className="sticky top-0 z-50">
      <header
        className={cn(
          "transition-all duration-300 border-b",
          scrolled
            ? "glass border-border/60 shadow-sm"
            : "bg-background border-transparent"
        )}
      >
        <div className="container flex h-16 items-center justify-between gap-4">
          <Logo />

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors hover:text-primary hover:bg-secondary/60",
                  pathname === link.href ? "text-primary" : "text-foreground/80"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:block relative">
              {searchOpen ? (
                <form onSubmit={submitSearch} className="flex items-center">
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onBlur={() => !query && setSearchOpen(false)}
                    placeholder="Search news, serials, celebrities…"
                    className="w-64 rounded-full border border-border bg-secondary/60 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </form>
              ) : (
                <button
                  aria-label="Open search"
                  onClick={() => setSearchOpen(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-secondary/60 hover:bg-secondary hover:text-primary transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              )}
            </div>

            <Link
              href="/search"
              aria-label="Search"
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-border bg-secondary/60"
            >
              <Search className="h-4 w-4" />
            </Link>

            <ThemeToggle />

            <Link
              href="/admin"
              className="hidden lg:inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              Subscribe
            </Link>

            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full border border-border bg-secondary/60"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile slide-out nav */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 border-t border-border/60",
            mobileOpen ? "max-h-96" : "max-h-0"
          )}
        >
          <nav className="flex flex-col p-4 gap-1 bg-background">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-secondary/60"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Subscribe
            </Link>
          </nav>
        </div>
      </header>
    </div>
  );
}
