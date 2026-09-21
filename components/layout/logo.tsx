import Link from "next/link";
import { Sparkle } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 shrink-0 group ${className}`}
      aria-label="Telly Shine Entertainment home"
    >
      <Sparkle className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:rotate-12" />
      <span className="flex flex-col">
        <span className="font-display text-xl md:text-2xl font-bold tracking-tight leading-tight">
          Telly <span className="text-gradient-gold">Shine</span>
        </span>
        <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] leading-tight text-primary">
          Entertainment
        </span>
      </span>
    </Link>
  );
}
