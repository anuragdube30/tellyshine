export const metadata = { title: "Disclaimer" };

export default function DisclaimerPage() {
  return (
    <div className="container py-16 max-w-3xl prose prose-neutral dark:prose-invert">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-6 not-prose">Disclaimer</h1>
      <p className="text-muted-foreground">
        Telly Shine publishes entertainment news, TV serial updates, and celebrity coverage for
        informational purposes only. While we strive for accuracy, entertainment news can change
        quickly and some details (such as episode air dates or casting) may be updated after
        publishing. Telly Shine is not officially affiliated with any TV channel, production house,
        or celebrity mentioned unless explicitly stated. All trademarks and images belong to their
        respective owners.
      </p>
    </div>
  );
}
