import Link from "next/link";
import { LogIn } from "lucide-react";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <div className="container py-24 flex flex-col items-center text-center">
      <LogIn className="h-10 w-10 text-primary mb-4" />
      <h1 className="font-display text-2xl font-bold">Reader accounts coming soon</h1>
      <p className="text-muted-foreground mt-2 max-w-md">
        Personalized reader accounts aren&apos;t live yet. If you&apos;re part of the Telly Shine team, use the admin login instead.
      </p>
      <Link href="/admin/login" className="mt-6 inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:scale-105 transition-transform">
        Go to Admin Login
      </Link>
    </div>
  );
}
