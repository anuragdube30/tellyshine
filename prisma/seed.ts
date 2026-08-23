import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const prisma = new PrismaClient();

function slug(s: string) {
  return slugify(s, { lower: true, strict: true });
}

const IMG = {
  news: (seed: string) => `https://picsum.photos/seed/${seed}/1200/675`,
  poster: (seed: string) => `https://picsum.photos/seed/${seed}-poster/500/750`,
  banner: (seed: string) => `https://picsum.photos/seed/${seed}-banner/1400/600`,
  profile: (seed: string) => `https://picsum.photos/seed/${seed}-face/400/400`,
};

async function main() {
  console.log("Seeding Telly Shine demo data…");

  // ---------- Admin user ----------
  const passwordHash = await bcrypt.hash("TellyShine@123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@tellyshine.com" },
    update: {
      name: "Telly Shine Desk",
      passwordHash,
      role: "SUPER_ADMIN",
    },
    create: {
      name: "Telly Shine Desk",
      email: "admin@tellyshine.com",
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  // ---------- Categories ----------
  const categoryNames = ["Bollywood", "Television", "Celebrities", "Web Series", "Music", "Lifestyle"];
  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.upsert({
        where: { slug: slug(name) },
        update: {},
        create: { name, slug: slug(name), description: `${name} news and updates`, isActive: true },
      })
    )
  );
  const catByName = Object.fromEntries(categories.map((c) => [c.name, c]));

  // ---------- Site settings ----------
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteName: "Telly Shine",
      description: "Telly Shine is your daily source for TV serial news, entertainment updates, celebrity stories and trending videos.",
      contactEmail: "hello@tellyshine.com",
      footerText: `© ${new Date().getFullYear()} Telly Shine. All rights reserved.`,
      accentColor: "#f2a71b",
      socialLinks: JSON.stringify({
        instagram: "https://instagram.com/tellyshine",
        twitter: "https://twitter.com/tellyshine",
        facebook: "https://facebook.com/tellyshine",
        youtube: "https://youtube.com/@tellyshine",
      }),
      seoDefaultTitle: "Telly Shine — TV Serials, Entertainment & Celebrity News",
      seoDefaultDesc: "Telly Shine brings you the latest TV serial updates, entertainment news, celebrity stories and trending videos.",
    },
  });

  // ---------- Celebrities ----------
  const celebrityData = [
    { name: "Ananya Kapoor", profession: "Actor" },
    { name: "Rohan Malhotra", profession: "Actor" },
    { name: "Simran Chaudhary", profession: "Television Host" },
    { name: "Aditya Bhargava", profession: "Actor" },
    { name: "Meera Iyer", profession: "Singer" },
    { name: "Kabir Sethi", profession: "Actor" },
    { name: "Priya Nair", profession: "Actor" },
    { name: "Vivaan Oberoi", profession: "Director" },
    { name: "Ishita Rathore", profession: "Actor" },
    { name: "Arjun Vashisht", profession: "Reality Show Host" },
  ];
  const celebrities = [];
  for (const c of celebrityData) {
    const s = slug(c.name);
    const celeb = await prisma.celebrity.upsert({
      where: { slug: s },
      update: {},
      create: {
        name: c.name,
        slug: s,
        profileImage: IMG.profile(s),
        coverImage: IMG.banner(s),
        biography: `${c.name} is a popular figure in Indian television and entertainment, known for captivating performances and a growing fan following across the country. With a career spanning several acclaimed projects, ${c.name.split(" ")[0]} continues to be one of the most talked-about names in the industry.`,
        profession: c.profession,
        socialLinks: JSON.stringify({ instagram: `https://instagram.com/${s}`, twitter: `https://twitter.com/${s}` }),
        featured: Math.random() > 0.5,
      },
    });
    celebrities.push(celeb);
  }

  // ---------- TV Serials ----------
  const serialData = [
    { name: "Ghar Ki Roshni", channel: "Star Plus", genre: "Drama, Family", status: "ONGOING" as const },
    { name: "Rishton Ka Safar", channel: "Zee TV", genre: "Romance, Drama", status: "ONGOING" as const },
    { name: "Naye Sapne", channel: "Colors TV", genre: "Drama", status: "ONGOING" as const },
    { name: "Ek Nayi Subah", channel: "Sony TV", genre: "Family, Drama", status: "UPCOMING" as const },
    { name: "Dil Ki Baatein", channel: "Star Bharat", genre: "Romance", status: "ONGOING" as const },
    { name: "Shaan-e-Punjab", channel: "Zee TV", genre: "Drama, Regional", status: "ENDED" as const },
    { name: "Bandhan Anjana", channel: "Colors TV", genre: "Drama, Mystery", status: "ONGOING" as const },
    { name: "Zindagi Ke Rang", channel: "Sony SAB", genre: "Comedy, Family", status: "ONGOING" as const },
  ];
  const serials = [];
  await prisma.episode.deleteMany();
  for (let i = 0; i < serialData.length; i++) {
    const s = serialData[i];
    const slugStr = slug(s.name);
    const cast = celebrities.slice(i, i + 3).map((c) => c.name);
    const serial = await prisma.serial.upsert({
      where: { slug: slugStr },
      update: {},
      create: {
        name: s.name,
        slug: slugStr,
        poster: IMG.poster(slugStr),
        banner: IMG.banner(slugStr),
        description: `${s.name} follows the emotional journey of a family navigating love, ambition and tradition. With gripping storylines and powerful performances, it has become a fan favourite on ${s.channel}.`,
        channel: s.channel,
        genre: s.genre,
        cast: JSON.stringify(cast),
        status: s.status,
        startDate: new Date(2023, i % 12, 1),
        latestEpisode: s.status !== "UPCOMING" ? `Episode ${100 + i * 7}` : null,
        upcomingEpisode: `Episode ${101 + i * 7} — airs this Friday`,
        categoryId: catByName["Television"].id,
        featured: i === 0,
        views: Math.floor(Math.random() * 50000),
      },
    });
    serials.push(serial);

    // Link cast celebrities
    for (const name of cast) {
      const celeb = celebrities.find((c) => c.name === name);
      if (celeb) {
        await prisma.celebrityOnSerial.upsert({
          where: { celebrityId_serialId: { celebrityId: celeb.id, serialId: serial.id } },
          update: {},
          create: { celebrityId: celeb.id, serialId: serial.id, role: "Lead" },
        });
      }
    }

    // A couple of episodes
    for (let e = 1; e <= 3; e++) {
      await prisma.episode.create({
        data: {
          serialId: serial.id,
          title: `${s.name} - Episode ${100 + i * 7 + e}`,
          episodeNo: 100 + i * 7 + e,
          airDate: new Date(2026, 7, e),
          description: "A dramatic new turn unfolds as relationships are tested.",
          thumbnail: IMG.news(`${slugStr}-ep${e}`),
        },
      });
    }
  }

  // ---------- Breaking News ----------
  await prisma.breakingNews.deleteMany();

  // ---------- News Articles ----------
  const newsTopics = [
    "makes a stunning comeback with a new project",
    "opens up about the biggest challenge of their career",
    "spotted at a star-studded event in Mumbai",
    "shares an emotional note for fans on social media",
    "set to headline an upcoming web series",
    "reveals behind-the-scenes secrets from the latest shoot",
    "wins hearts with a heartfelt performance",
    "announces exciting new collaboration",
    "opens up about work-life balance in the industry",
    "celebrates a major career milestone",
    "reacts to viral moment from recent episode",
    "talks about upcoming plans for the new year",
    "shares first look from much-awaited show",
    "gets candid about personal life in new interview",
    "surprises fans with unexpected announcement",
    "receives praise from industry veterans",
  ];

  const newsArticles = [];
  for (let i = 0; i < newsTopics.length; i++) {
    const celeb = celebrities[i % celebrities.length];
    const title = `${celeb.name} ${newsTopics[i]}`;
    const s = slug(title);
    const categoryPool = categories;
    const category = categoryPool[i % categoryPool.length];

    const article = await prisma.news.upsert({
      where: { slug: s },
      update: {},
      create: {
        title,
        slug: s,
        excerpt: `${celeb.name} has once again captured attention with the latest update, leaving fans excited for what's next.`,
        content: `<p>${celeb.name} continues to be a major talking point in the entertainment world this week. Sources close to the star confirm exciting developments that fans have been eagerly waiting for.</p><p>In a recent conversation, ${celeb.name.split(" ")[0]} shared insights into their journey, the challenges faced along the way, and what keeps them motivated. The response from fans and industry peers alike has been overwhelmingly positive.</p><p>Stay tuned to Telly Shine for more updates on this developing story.</p>`,
        featuredImage: IMG.news(s),
        status: "PUBLISHED",
        publishedAt: new Date(Date.now() - i * 1000 * 60 * 60 * 6),
        categoryId: category.id,
        authorId: admin.id,
        views: Math.floor(Math.random() * 80000),
        seoTitle: title,
        seoDescription: `Read the latest on ${celeb.name}: ${newsTopics[i]}.`,
      },
    });
    newsArticles.push(article);

    await prisma.celebrityOnNews.upsert({
      where: { celebrityId_newsId: { celebrityId: celeb.id, newsId: article.id } },
      update: {},
      create: { celebrityId: celeb.id, newsId: article.id },
    });

    // Occasionally link to a serial too
    if (i % 3 === 0) {
      const serial = serials[i % serials.length];
      await prisma.serialOnNews.upsert({
        where: { serialId_newsId: { serialId: serial.id, newsId: article.id } },
        update: {},
        create: { serialId: serial.id, newsId: article.id },
      });
    }
  }

  // ---------- Videos ----------
  const videoTitles = [
    "Exclusive Interview: Behind the Scenes",
    "Top 5 Dramatic Moments This Week",
    "Fan Reactions to the Latest Twist",
    "Cast Reveals Favourite On-Set Memory",
    "First Look: Upcoming Episode Promo",
    "Red Carpet Highlights",
    "Rapid Fire Round with the Cast",
    "Emotional Scene Breakdown",
    "Behind the Music: Title Track Making",
    "Fan Q&A Special",
  ];
  const sampleYoutubeIds = [
    "dQw4w9WgXcQ", "9bZkp7q19f0", "3JZ_D3ELwOQ", "eY52Zsg-KVI", "L_jWHffIx5E",
    "60ItHLz5WEA", "fJ9rUzIMcZQ", "2Vv-BfVoq4g", "hT_nvWreIhg", "OPf0YbXqDm0",
  ];
  for (let i = 0; i < videoTitles.length; i++) {
    const s = slug(videoTitles[i]);
    const serial = serials[i % serials.length];
    await prisma.video.upsert({
      where: { slug: s },
      update: {},
      create: {
        title: videoTitles[i],
        slug: s,
        description: `Watch this exclusive clip from ${serial.name}, packed with drama, emotion and unforgettable moments.`,
        youtubeUrl: `https://www.youtube.com/watch?v=${sampleYoutubeIds[i]}`,
        thumbnail: `https://i.ytimg.com/vi/${sampleYoutubeIds[i]}/hqdefault.jpg`,
        duration: `${Math.floor(Math.random() * 8) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
        categoryId: catByName["Television"].id,
        serialId: serial.id,
        isPublished: true,
        views: Math.floor(Math.random() * 40000),
      },
    });
  }

  // ---------- Breaking News ----------
  const breakingItems = [
    "Ananya Kapoor to make her digital debut this festive season",
    "Ghar Ki Roshni crosses 500 episodes — special celebration episode tonight",
    "Rohan Malhotra confirms exit from popular show, fans react",
    "Award season buzz: Telly Shine's top nominees revealed",
  ];
  for (let i = 0; i < breakingItems.length; i++) {
    const existing = await prisma.breakingNews.findFirst({ where: { text: breakingItems[i] } });
    if (!existing) {
      await prisma.breakingNews.create({
        data: { text: breakingItems[i], isActive: true, order: i },
      });
    }
  }

  console.log("✅ Seed complete.");
  console.log("   Admin login: admin@tellyshine.com / TellyShine@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
