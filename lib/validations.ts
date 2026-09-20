import { z } from "zod";

export const newsSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(300),
  content: z.string().min(50, "Content must be at least 50 characters"),
  featuredImage: z.string().url("Must be a valid image URL"),
  categoryId: z.string().min(1, "Category is required"),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]),
  scheduledFor: z.string().optional().nullable(),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
  tagNames: z.array(z.string()).optional(),
});

export const serialSchema = z.object({
  name: z.string().min(2).max(150),
  poster: z.string().url("Poster must be a valid image URL"),
  banner: z.string().url("Banner must be a valid image URL"),
  description: z.string().min(20),
  channel: z.string().min(1),
  genre: z.string().min(1),
  cast: z.array(z.string()).min(1, "Add at least one cast member"),
  status: z.enum(["ONGOING", "UPCOMING", "ENDED"]),
  startDate: z.string().optional().nullable(),
  latestEpisode: z.string().optional().nullable(),
  upcomingEpisode: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  featured: z.boolean().optional(),
});

export const videoSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().optional().nullable(),
  youtubeUrl: z.string().url("Must be a valid YouTube URL"),
  duration: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  serialId: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
});

export const celebritySchema = z.object({
  name: z.string().min(2).max(150),
  profileImage: z.string().url(),
  coverImage: z.string().url().optional().nullable(),
  biography: z.string().min(20),
  profession: z.string().min(1),
  socialLinks: z
    .object({
      instagram: z.string().optional(),
      twitter: z.string().optional(),
      facebook: z.string().optional(),
    })
    .optional(),
  featured: z.boolean().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2).max(60),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

export const breakingNewsSchema = z.object({
  text: z.string().min(5).max(200),
  link: z.string().url().optional().or(z.literal("")).nullable(),
  isActive: z.boolean().optional(),
  order: z.number().int().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is too short").max(100),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(3, "Subject is too short").max(150),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
});

export const settingsSchema = z.object({
  siteName: z.string().min(2),
  logoUrl: z.string().optional().nullable(),
  faviconUrl: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  footerText: z.string().optional().nullable(),
  accentColor: z.string().optional(),
  socialLinks: z
    .object({
      instagram: z.string().optional(),
      twitter: z.string().optional(),
      facebook: z.string().optional(),
      youtube: z.string().optional(),
    })
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type NewsInput = z.infer<typeof newsSchema>;
export type SerialInput = z.infer<typeof serialSchema>;
export type VideoInput = z.infer<typeof videoSchema>;
export type CelebrityInput = z.infer<typeof celebritySchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type BreakingNewsInput = z.infer<typeof breakingNewsSchema>;
