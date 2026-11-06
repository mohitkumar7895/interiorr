import { z } from "zod";

export const EnquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid 10-digit phone number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

export type EnquiryInput = z.infer<typeof EnquirySchema>;

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const SiteSettingsSchema = z.object({
  siteName: z.string().min(2),
  brandName: z.string().min(1),
  tagline: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email(),
  address: z.string().min(5),
  heroTitle: z.string().min(5),
  heroSubtitle: z.string().min(5),
  heroCtaText: z.string().min(2),
  heroCtaLink: z.string().min(1),
  whatsappNumber: z.string().min(8),
  googleMapsUrl: z.string().url().or(z.string().min(1)),
  openingHours: z.string().min(3),
  footerText: z.string().min(5),
  aboutTitle: z.string().min(3),
  aboutStory: z.string().min(10),
  experienceYears: z.number().int().nonnegative(),
  projectsDone: z.number().int().nonnegative(),
  happyClients: z.number().int().nonnegative(),
});

export const ServiceFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug is required"),
  category: z.string().min(2, "Category is required"),
  shortDesc: z.string().min(10, "Short description is required"),
  fullDesc: z.string().min(20, "Detailed description is required"),
  icon: z.string().min(2, "Icon name is required"),
  featuredImage: z.string().min(5, "Featured image URL is required"),
  features: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  isPublished: z.boolean().default(true),
  orderIndex: z.number().default(0),
});

export const ProjectFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z.string().min(3, "Slug is required"),
  category: z.string().min(2, "Category is required"),
  client: z.string().optional(),
  location: z.string().default("Noida, NCR"),
  completedDate: z.string().optional(),
  area: z.string().default("1,850 sq.ft"),
  shortDesc: z.string().min(10, "Short description is required"),
  description: z.string().min(20, "Full description is required"),
  featuredImage: z.string().min(5, "Featured image URL is required"),
  beforeImage: z.string().optional(),
  afterImage: z.string().optional(),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  orderIndex: z.number().default(0),
});

export const TestimonialFormSchema = z.object({
  clientName: z.string().min(2, "Client name is required"),
  clientRole: z.string().min(2, "Role/Designation is required"),
  clientLocation: z.string().min(2, "Location is required"),
  rating: z.number().min(1).max(5).default(5),
  reviewText: z.string().min(10, "Review text is required"),
  isPublished: z.boolean().default(true),
  orderIndex: z.number().default(0),
});

