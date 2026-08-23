import { ContactForm } from "@/components/shared/contact-form";

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="container py-16 max-w-2xl">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Contact Us</h1>
      <p className="text-muted-foreground mb-10">
        Have a story tip, feedback or a partnership query? Send us a message and the Telly Shine team will get back to you.
      </p>
      <ContactForm />
    </div>
  );
}
