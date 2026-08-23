export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="container py-16 max-w-3xl">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-6">About Telly Shine</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed space-y-4 text-muted-foreground">
        <p>
          Telly Shine is a modern entertainment media platform bringing you the latest TV serial
          updates, entertainment news, celebrity stories and trending videos — all in one premium,
          easy-to-browse destination.
        </p>
        <p>
          Our editorial team tracks the world of television and entertainment daily so you never
          miss a plot twist, a cast announcement, or a trending moment. Whether you follow daily
          soaps, reality shows, or Bollywood buzz, Telly Shine keeps you in the loop.
        </p>
        <p>
          Telly Shine is built as an independent entertainment news platform and is not affiliated
          with any broadcaster or production house unless explicitly stated in an article.
        </p>
      </div>
    </div>
  );
}
