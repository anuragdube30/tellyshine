export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="container py-16 max-w-3xl prose prose-neutral dark:prose-invert">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-6 not-prose">Terms of Service</h1>
      <p className="text-muted-foreground">
        By accessing Telly Shine, you agree to use the site for lawful, personal, non-commercial
        purposes. Content on this site — articles, images, and videos — is owned by Telly Shine or
        its respective rights holders and may not be reproduced without permission. Embedded videos
        are hosted on third-party platforms (such as YouTube) and are subject to those platforms&apos;
        own terms. Telly Shine reserves the right to update these terms at any time.
      </p>
    </div>
  );
}
