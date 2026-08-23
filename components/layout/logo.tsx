import Link from "next/link";
import { Sparkle } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-1.5 shrink-0 group ${className}`}
      aria-label="Telly Shine home"
    >
      <Sparkle className="h-5 w-5 text-primary transition-transform group-hover:rotate-12" />
      <span className="font-display text-xl md:text-2xl font-bold tracking-tight">
        Telly<span className="text-gradient-gold">Shine</span>
      </span>
    </Link>
  );
}
