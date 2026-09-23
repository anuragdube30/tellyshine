import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BreakingNewsTicker } from "@/components/home/breaking-news-ticker";
import { DeveloperWhatsAppCTA } from "@/components/shared/developer-whatsapp-cta";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <BreakingNewsTicker />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <DeveloperWhatsAppCTA />
    </>
  );
}
