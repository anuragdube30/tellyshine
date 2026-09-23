import Link from "next/link";
import { parseSocialLinks } from "@/lib/utils";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Logo } from "./logo";
import { getSiteSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { NewsletterForm } from "@/components/shared/newsletter-form";

export async function Footer() {
  const settings = await getSiteSettings();
  let categories: { name: string; slug: string }[] = [];
  try {
    categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { name: true, slug: true },
      take: 6,
    });
  } catch {
    categories = [];
  }

  const social = parseSocialLinks(settings?.socialLinks);

  return (
    <footer className="border-t border-border bg-surface mt-20">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
            {settings?.description ||
              "Telly Shine is your daily source for TV serial news, entertainment updates, celebrity stories and trending videos."}
          </p>
          <div className="flex gap-3 mt-5">
            {social.facebook && (
              <SocialIcon href={social.facebook} icon={<Facebook className="h-4 w-4" />} />
            )}
            {social.instagram && (
              <SocialIcon href={social.instagram} icon={<Instagram className="h-4 w-4" />} />
            )}
            {social.twitter && (
              <SocialIcon href={social.twitter} icon={<Twitter className="h-4 w-4" />} />
            )}
            {social.youtube && (
              <SocialIcon href={social.youtube} icon={<Youtube className="h-4 w-4" />} />
            )}
          </div>
        </div>

        <FooterCol
          title="Quick Links"
          links={[
            { href: "/", label: "Home" },
            { href: "/tv-serials", label: "TV Serials" },
            { href: "/videos", label: "Videos" },
            { href: "/celebrities", label: "Celebrities" },
            { href: "/about", label: "About Us" },
            { href: "/contact", label: "Contact" },
          ]}
        />

        <div id="newsletter" className="scroll-mt-24">
          <h4 className="font-semibold text-sm mb-2">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-4">Get important TV and entertainment updates in your inbox.</p>
          <NewsletterForm />
        </div>

        <FooterCol
          title="Categories"
          links={
            categories.length
              ? categories.map((c) => ({ href: `/entertainment?category=${c.slug}`, label: c.name }))
              : [{ href: "/entertainment", label: "Entertainment" }]
          }
        />

        <FooterCol
          title="Legal"
          links={[
            { href: "/privacy-policy", label: "Privacy Policy" },
            { href: "/terms", label: "Terms of Service" },
            { href: "/disclaimer", label: "Disclaimer" },
          ]}
        />
      </div>

      <div className="border-t border-border">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>
            {settings?.footerText ||
              `© ${new Date().getFullYear()} Telly Shine. All rights reserved.`}
          </p>
          <p>
            Developed by{" "}
            <a
              href="https://wa.me/918369020464?text=Hi%20Anurag%2C%20I%20saw%20your%20work%20on%20Telly%20Shine%20Entertainment.%20I%20want%20a%20professional%20website%20for%20my%20business.%20Could%20you%20please%20share%20your%20services%2C%20pricing%20and%20project%20details%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold tracking-wide transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              aria-label="Contact Anurag Dubey on WhatsApp about website development (opens in a new tab)"
            >
              ANURAG DUBEY
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
    >
      {icon}
    </a>
  );
}
