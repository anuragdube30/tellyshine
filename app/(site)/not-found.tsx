import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <p className="font-display text-8xl font-bold text-gradient-gold">404</p>
      <h1 className="mt-4 text-2xl font-bold">This page went off-air</h1>
      <p className="mt-2 text-muted-foreground max-w-md">
        The page you're looking for doesn't exist or may have been moved. Let's get you back to the good stuff.
      </p>
      <div className="flex gap-3 mt-8">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:scale-105 transition-transform">
          <Home className="h-4 w-4" /> Back Home
        </Link>
        <Link href="/search" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:border-primary hover:text-primary transition-colors">
          <Search className="h-4 w-4" /> Search
        </Link>
      </div>
    </div>
  );
}
