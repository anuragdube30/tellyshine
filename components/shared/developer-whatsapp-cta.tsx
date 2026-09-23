import { MessageCircle } from "lucide-react";

const MESSAGE =
  "Hello Anurag, I came across the Telly Shine Entertainment website and I'm interested in getting a website designed/developed for my business or project. Please share the details, process and pricing. Thank you.";

export function DeveloperWhatsAppCTA() {
  const href = `https://wa.me/918369020464?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Anurag Dubey on WhatsApp"
        className="fixed bottom-5 right-5 z-40 hidden sm:flex items-center gap-2 rounded-full border border-border bg-background/95 px-3 py-2 text-xs font-medium text-foreground shadow-lg backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
      >
        <MessageCircle className="h-4 w-4" />
        <span>Need a website like this? Let's talk on WhatsApp.</span>
      </a>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp: contact Anurag Dubey for website development"
        className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-105 sm:hidden"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </>
  );
}
