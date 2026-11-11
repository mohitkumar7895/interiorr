import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  INITIAL_SERVICES,
  INITIAL_PROJECTS,
  INITIAL_GALLERY_CATEGORIES,
  INITIAL_GALLERY_ITEMS,
  INITIAL_TESTIMONIALS,
  INITIAL_BLOGS,
  INITIAL_SEO_SETTINGS,
  INITIAL_ENQUIRIES,
} from "@/lib/data/initialData";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");

export function generateId(): string {
  return crypto.randomUUID();
}

const DEFAULT_SETTINGS = {
  id: "default",
  siteName: "MA Carpenter and Interior",
  tagline: "Luxury Woodwork & Turnkey Interiors",
  phone: "8714114418",
  whatsapp: "8714114418",
  email: "Monishpasha233@gmail.com",
  address: "Shop No. 6, Sector 120, Noida, Uttar Pradesh - 201301",
  workingHours: "Mon - Sun: 9:00 AM - 8:30 PM",
  experienceYears: 15,
  completedProjects: 450,
  happyClients: 380,
  teamMembers: 25,
  heroTitle: "Luxury Woodwork & Turnkey Interiors",
  heroSubtitle: "Transforming residential and executive spaces into mastercrafted sanctuaries in Sector 120 Noida and Delhi NCR.",
  heroImages: JSON.stringify([
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1920&q=80",
  ]),
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  youtubeUrl: "https://youtube.com",
  pinterestUrl: "https://pinterest.com",
  googleMapsUrl: "https://maps.google.com/?q=Sector+120+Noida",
};

const DEFAULT_SECTIONS = [
  { id: "sec-hero", sectionKey: "hero", title: "Hero Section", isEnabled: true, orderIndex: 1 },
  { id: "sec-about", sectionKey: "about", title: "About Section", isEnabled: true, orderIndex: 2 },
  { id: "sec-services", sectionKey: "services", title: "Services Section", isEnabled: true, orderIndex: 3 },
  { id: "sec-projects", sectionKey: "projects", title: "Projects Section", isEnabled: true, orderIndex: 4 },
  { id: "sec-process", sectionKey: "process", title: "Process Section", isEnabled: true, orderIndex: 5 },
  { id: "sec-whyUs", sectionKey: "whyUs", title: "Why Choose Us", isEnabled: true, orderIndex: 6 },
  { id: "sec-testimonials", sectionKey: "testimonials", title: "Testimonials Section", isEnabled: true, orderIndex: 7 },
  { id: "sec-cta", sectionKey: "cta", title: "Call to Action", isEnabled: true, orderIndex: 8 },
  { id: "sec-blogs", sectionKey: "blogs", title: "Latest Articles", isEnabled: true, orderIndex: 9 },
  { id: "sec-contact", sectionKey: "contact", title: "Contact Section", isEnabled: true, orderIndex: 10 },
];

function createInitialStore() {
  return {
    services: INITIAL_SERVICES.map((s, idx) => ({
      ...s,
      id: `srv-init-${idx + 1}`,
      isPublished: true,
      orderIndex: s.orderIndex !== undefined ? s.orderIndex : idx,
      images: typeof s.images === "string" ? s.images : JSON.stringify(s.images || []),
      features: typeof s.features === "string" ? s.features : JSON.stringify(s.features || []),
      benefits: typeof s.benefits === "string" ? s.benefits : JSON.stringify(s.benefits || []),
    })),
    projects: INITIAL_PROJECTS.map((p, idx) => ({
      ...p,
      id: `proj-init-${idx + 1}`,
      isPublished: true,
      isFeatured: p.isFeatured ?? true,
      orderIndex: p.orderIndex !== undefined ? p.orderIndex : idx,
      images: (p.galleryImages || []).map((img, imgIdx) => ({
        id: `img-${idx + 1}-${imgIdx + 1}`,
        projectId: `proj-init-${idx + 1}`,
        imageUrl: img.imageUrl,
        caption: img.caption || "",
        orderIndex: imgIdx,
      })),
    })),
    galleryCategories: INITIAL_GALLERY_CATEGORIES.map((c, idx) => ({
      ...c,
      id: `cat-init-${idx + 1}`,
    })),
    gallery: INITIAL_GALLERY_ITEMS.map((g, idx) => {
      const cat = INITIAL_GALLERY_CATEGORIES.find((c) => c.slug === g.categorySlug);
      return {
        ...g,
        id: `gal-init-${idx + 1}`,
        categoryId: cat ? `cat-init-${INITIAL_GALLERY_CATEGORIES.indexOf(cat) + 1}` : "cat-init-1",
        category: cat ? { id: `cat-init-${INITIAL_GALLERY_CATEGORIES.indexOf(cat) + 1}`, name: cat.name, slug: cat.slug } : null,
      };
    }),
    testimonials: INITIAL_TESTIMONIALS.map((t, idx) => ({
      ...t,
      id: `test-init-${idx + 1}`,
      isPublished: true,
      orderIndex: t.orderIndex !== undefined ? t.orderIndex : idx,
    })),
    blogs: INITIAL_BLOGS.map((b) => ({ ...b })),
    siteSettings: { ...DEFAULT_SETTINGS },
    homeSections: [...DEFAULT_SECTIONS],
    sEOSettings: INITIAL_SEO_SETTINGS.map((s, idx) => ({
      ...s,
      id: (s as any).id || `seo-init-${idx + 1}`,
    })),
    enquiries: INITIAL_ENQUIRIES.map((e, idx) => ({
      ...e,
      id: (e as any).id || `enq-init-${idx + 1}`,
    })),
    admin: [
      {
        id: "admin-master",
        email: "admin@mainterior.com",
        name: "Monish Pasha",
        role: "superadmin",
        password: "$2a$10$wN16D8eW5vBf4X3Rj5eG0O.wXnB1H8aB6x5J3M7K8Y9Q1Z5X6Y7Z8",
      },
    ],
    activityLogs: [],
  };
}

let memoryStoreCache: any = null;

export function getJsonStore(): any {
  if (memoryStoreCache) {
    return memoryStoreCache;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, "utf-8");
      if (content && content.trim().length > 0) {
        const parsed = JSON.parse(content);
        // Ensure all required collections exist
        const initial = createInitialStore();
        memoryStoreCache = {
          ...initial,
          ...parsed,
          services: Array.isArray(parsed.services) && parsed.services.length > 0 ? parsed.services : initial.services,
          projects: Array.isArray(parsed.projects) && parsed.projects.length > 0 ? parsed.projects : initial.projects,
          gallery: Array.isArray(parsed.gallery) && parsed.gallery.length > 0 ? parsed.gallery : initial.gallery,
          galleryCategories: Array.isArray(parsed.galleryCategories) && parsed.galleryCategories.length > 0 ? parsed.galleryCategories : initial.galleryCategories,
          testimonials: Array.isArray(parsed.testimonials) && parsed.testimonials.length > 0 ? parsed.testimonials : initial.testimonials,
          blogs: Array.isArray(parsed.blogs) && parsed.blogs.length > 0 ? parsed.blogs : initial.blogs,
          siteSettings: parsed.siteSettings || initial.siteSettings,
          homeSections: Array.isArray(parsed.homeSections) && parsed.homeSections.length > 0 ? parsed.homeSections : initial.homeSections,
          sEOSettings: Array.isArray(parsed.sEOSettings) && parsed.sEOSettings.length > 0 ? parsed.sEOSettings : initial.sEOSettings,
          enquiries: Array.isArray(parsed.enquiries) ? parsed.enquiries : initial.enquiries,
          admin: Array.isArray(parsed.admin) ? parsed.admin : initial.admin,
          activityLogs: Array.isArray(parsed.activityLogs) ? parsed.activityLogs : [],
        };
        return memoryStoreCache;
      }
    }
  } catch (err) {
    console.warn("Error reading store.json, initializing fresh store:", err);
  }

  memoryStoreCache = createInitialStore();
  saveJsonStore(memoryStoreCache);
  return memoryStoreCache;
}

export function saveJsonStore(store: any): void {
  memoryStoreCache = store;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving store.json:", err);
  }
}

// Helpers for Services
export const jsonServices = {
  findMany(options?: { where?: any; orderBy?: any; take?: number }) {
    const store = getJsonStore();
    let list = [...store.services];
    if (options?.where?.isPublished !== undefined) {
      list = list.filter((s) => s.isPublished === options.where.isPublished);
    }
    list.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    if (options?.take) {
      list = list.slice(0, options.take);
    }
    return list;
  },
  findUnique({ where }: { where: { slug?: string; id?: string } }) {
    const store = getJsonStore();
    return store.services.find((s: any) => (where.slug && s.slug === where.slug) || (where.id && s.id === where.id)) || null;
  },
  create({ data }: { data: any }) {
    const store = getJsonStore();
    const id = data.id || `srv-${Date.now()}`;
    const cleanSlug = (data.slug || data.title || "service").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newService = {
      ...data,
      id,
      slug: cleanSlug,
      orderIndex: data.orderIndex !== undefined ? parseInt(data.orderIndex) : store.services.length + 1,
      isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
      images: typeof data.images === "string" ? data.images : JSON.stringify(data.images || []),
      features: typeof data.features === "string" ? data.features : JSON.stringify(data.features || []),
      benefits: typeof data.benefits === "string" ? data.benefits : JSON.stringify(data.benefits || []),
    };
    store.services.push(newService);
    saveJsonStore(store);
    return newService;
  },
  update({ where, data }: { where: { id: string }; data: any }) {
    const store = getJsonStore();
    const idx = store.services.findIndex((s: any) => s.id === where.id || s.slug === where.id);
    if (idx !== -1) {
      const updated = {
        ...store.services[idx],
        ...data,
        id: store.services[idx].id,
        ...(data.orderIndex !== undefined && { orderIndex: parseInt(data.orderIndex) }),
        ...(data.isPublished !== undefined && { isPublished: Boolean(data.isPublished) }),
        ...(data.images !== undefined && { images: typeof data.images === "string" ? data.images : JSON.stringify(data.images || []) }),
        ...(data.features !== undefined && { features: typeof data.features === "string" ? data.features : JSON.stringify(data.features || []) }),
        ...(data.benefits !== undefined && { benefits: typeof data.benefits === "string" ? data.benefits : JSON.stringify(data.benefits || []) }),
      };
      store.services[idx] = updated;
      saveJsonStore(store);
      return updated;
    }
    return null;
  },
  delete({ where }: { where: { id: string } }) {
    const store = getJsonStore();
    store.services = store.services.filter((s: any) => s.id !== where.id && s.slug !== where.id);
    saveJsonStore(store);
    return { id: where.id };
  },
  count() {
    const store = getJsonStore();
    return store.services.length;
  },
};

// Helpers for Projects
export const jsonProjects = {
  findMany(options?: { where?: any; orderBy?: any; take?: number; include?: any }) {
    const store = getJsonStore();
    let list = [...store.projects];
    if (options?.where?.isPublished !== undefined) {
      list = list.filter((p) => p.isPublished === options.where.isPublished);
    }
    list.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    if (options?.take) {
      list = list.slice(0, options.take);
    }
    return list;
  },
  findUnique({ where }: { where: { slug?: string; id?: string } }) {
    const store = getJsonStore();
    return store.projects.find((p: any) => (where.slug && p.slug === where.slug) || (where.id && p.id === where.id)) || null;
  },
  create({ data }: { data: any }) {
    const store = getJsonStore();
    const id = data.id || `proj-${Date.now()}`;
    const cleanSlug = (data.slug || data.title || "project").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newProject = {
      ...data,
      id,
      slug: cleanSlug,
      isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
      isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : false,
      orderIndex: data.orderIndex !== undefined ? parseInt(data.orderIndex) : store.projects.length + 1,
      images: data.images || [],
    };
    store.projects.push(newProject);
    saveJsonStore(store);
    return newProject;
  },
  update({ where, data }: { where: { id: string }; data: any }) {
    const store = getJsonStore();
    const idx = store.projects.findIndex((p: any) => p.id === where.id || p.slug === where.id);
    if (idx !== -1) {
      const updated = {
        ...store.projects[idx],
        ...data,
        id: store.projects[idx].id,
      };
      store.projects[idx] = updated;
      saveJsonStore(store);
      return updated;
    }
    return null;
  },
  delete({ where }: { where: { id: string } }) {
    const store = getJsonStore();
    store.projects = store.projects.filter((p: any) => p.id !== where.id && p.slug !== where.id);
    saveJsonStore(store);
    return { id: where.id };
  },
  count() {
    const store = getJsonStore();
    return store.projects.length;
  },
};

// Helpers for Gallery
export const jsonGallery = {
  findMany(options?: { where?: any; orderBy?: any; take?: number; include?: any }) {
    const store = getJsonStore();
    let list = [...store.gallery];
    if (options?.where?.isFeatured !== undefined) {
      list = list.filter((g) => g.isFeatured === options.where.isFeatured);
    }
    list.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    if (options?.take) {
      list = list.slice(0, options.take);
    }
    return list;
  },
  findUnique({ where }: { where: { id: string } }) {
    const store = getJsonStore();
    return store.gallery.find((g: any) => g.id === where.id) || null;
  },
  create({ data }: { data: any }) {
    const store = getJsonStore();
    const id = data.id || `gal-${Date.now()}`;
    const newItem = {
      ...data,
      id,
      isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : false,
      orderIndex: data.orderIndex !== undefined ? parseInt(data.orderIndex) : store.gallery.length + 1,
    };
    store.gallery.push(newItem);
    saveJsonStore(store);
    return newItem;
  },
  update({ where, data }: { where: { id: string }; data: any }) {
    const store = getJsonStore();
    const idx = store.gallery.findIndex((g: any) => g.id === where.id);
    if (idx !== -1) {
      const updated = {
        ...store.gallery[idx],
        ...data,
        id: store.gallery[idx].id,
      };
      store.gallery[idx] = updated;
      saveJsonStore(store);
      return updated;
    }
    return null;
  },
  delete({ where }: { where: { id: string } }) {
    const store = getJsonStore();
    store.gallery = store.gallery.filter((g: any) => g.id !== where.id);
    saveJsonStore(store);
    return { id: where.id };
  },
  count() {
    const store = getJsonStore();
    return store.gallery.length;
  },
};

// Helpers for Gallery Categories
export const jsonGalleryCategories = {
  findMany() {
    const store = getJsonStore();
    return [...store.galleryCategories].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  },
  findUnique({ where }: { where: { slug?: string; id?: string } }) {
    const store = getJsonStore();
    return store.galleryCategories.find((c: any) => (where.slug && c.slug === where.slug) || (where.id && c.id === where.id)) || null;
  },
  create({ data }: { data: any }) {
    const store = getJsonStore();
    const id = data.id || `cat-${Date.now()}`;
    const newCat = { ...data, id };
    store.galleryCategories.push(newCat);
    saveJsonStore(store);
    return newCat;
  },
};

// Helpers for Testimonials
export const jsonTestimonials = {
  findMany(options?: { where?: any; orderBy?: any; take?: number }) {
    const store = getJsonStore();
    let list = [...store.testimonials];
    if (options?.where?.isPublished !== undefined) {
      list = list.filter((t) => t.isPublished === options.where.isPublished);
    }
    list.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    if (options?.take) {
      list = list.slice(0, options.take);
    }
    return list;
  },
  findUnique({ where }: { where: { id: string } }) {
    const store = getJsonStore();
    return store.testimonials.find((t: any) => t.id === where.id) || null;
  },
  create({ data }: { data: any }) {
    const store = getJsonStore();
    const id = data.id || `test-${Date.now()}`;
    const newTest = {
      ...data,
      id,
      rating: data.rating !== undefined ? parseInt(data.rating) : 5,
      isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
      orderIndex: data.orderIndex !== undefined ? parseInt(data.orderIndex) : store.testimonials.length + 1,
      createdAt: new Date().toISOString(),
    };
    store.testimonials.push(newTest);
    saveJsonStore(store);
    return newTest;
  },
  update({ where, data }: { where: { id: string }; data: any }) {
    const store = getJsonStore();
    const idx = store.testimonials.findIndex((t: any) => t.id === where.id);
    if (idx !== -1) {
      const updated = {
        ...store.testimonials[idx],
        ...data,
        id: store.testimonials[idx].id,
      };
      store.testimonials[idx] = updated;
      saveJsonStore(store);
      return updated;
    }
    return null;
  },
  delete({ where }: { where: { id: string } }) {
    const store = getJsonStore();
    store.testimonials = store.testimonials.filter((t: any) => t.id !== where.id);
    saveJsonStore(store);
    return { id: where.id };
  },
  count() {
    const store = getJsonStore();
    return store.testimonials.length;
  },
};

// Helpers for Blogs
export const jsonBlogs = {
  findMany(options?: { where?: any; orderBy?: any; take?: number }) {
    const store = getJsonStore();
    let list = [...store.blogs];
    if (options?.where?.isPublished !== undefined) {
      list = list.filter((b) => b.isPublished === options.where.isPublished);
    }
    list.sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());
    if (options?.take) {
      list = list.slice(0, options.take);
    }
    return list;
  },
  findFirst({ where }: { where: { OR?: Array<{ id?: string; slug?: string }> } }) {
    const store = getJsonStore();
    if (where.OR) {
      for (const cond of where.OR) {
        const found = store.blogs.find((b: any) => (cond.id && b.id === cond.id) || (cond.slug && b.slug === cond.slug));
        if (found) return found;
      }
    }
    return null;
  },
  findUnique({ where }: { where: { slug?: string; id?: string } }) {
    const store = getJsonStore();
    return store.blogs.find((b: any) => (where.slug && b.slug === where.slug) || (where.id && b.id === where.id)) || null;
  },
  create({ data }: { data: any }) {
    const store = getJsonStore();
    const id = data.id || `blog-${Date.now()}`;
    const cleanSlug = (data.slug || data.title || "article").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newBlog = {
      ...data,
      id,
      slug: cleanSlug,
      isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
      publishedAt: data.publishedAt || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    };
    store.blogs.unshift(newBlog);
    saveJsonStore(store);
    return newBlog;
  },
  update({ where, data }: { where: { id: string }; data: any }) {
    const store = getJsonStore();
    const idx = store.blogs.findIndex((b: any) => b.id === where.id || b.slug === where.id);
    if (idx !== -1) {
      const updated = {
        ...store.blogs[idx],
        ...data,
        id: store.blogs[idx].id,
      };
      store.blogs[idx] = updated;
      saveJsonStore(store);
      return updated;
    }
    return null;
  },
  delete({ where }: { where: { id: string } }) {
    const store = getJsonStore();
    store.blogs = store.blogs.filter((b: any) => b.id !== where.id && b.slug !== where.id);
    saveJsonStore(store);
    return { id: where.id };
  },
  count() {
    const store = getJsonStore();
    return store.blogs.length;
  },
};

// Helpers for SiteSettings
export const jsonSiteSettings = {
  findUnique({ where }: { where: { id: string } }) {
    const store = getJsonStore();
    return store.siteSettings;
  },
  upsert({ where, update, create }: { where: { id: string }; update: any; create: any }) {
    const store = getJsonStore();
    store.siteSettings = {
      ...store.siteSettings,
      ...create,
      ...update,
      id: "default",
    };
    saveJsonStore(store);
    return store.siteSettings;
  },
  update({ where, data }: { where: { id: string }; data: any }) {
    const store = getJsonStore();
    store.siteSettings = {
      ...store.siteSettings,
      ...data,
      id: "default",
    };
    saveJsonStore(store);
    return store.siteSettings;
  },
};

// Helpers for HomeSections
export const jsonHomeSections = {
  findMany() {
    const store = getJsonStore();
    return [...store.homeSections].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  },
  update({ where, data }: { where: { sectionKey: string }; data: any }) {
    const store = getJsonStore();
    const idx = store.homeSections.findIndex((s: any) => s.sectionKey === where.sectionKey);
    if (idx !== -1) {
      const updated = {
        ...store.homeSections[idx],
        ...data,
        sectionKey: where.sectionKey,
      };
      store.homeSections[idx] = updated;
      saveJsonStore(store);
      return updated;
    }
    return null;
  },
};

// Helpers for SEO
export const jsonSEO = {
  findMany() {
    const store = getJsonStore();
    return [...store.sEOSettings];
  },
  findUnique({ where }: { where: { pageRoute?: string; id?: string } }) {
    const store = getJsonStore();
    return store.sEOSettings.find((s: any) => (where.pageRoute && s.pageRoute === where.pageRoute) || (where.id && s.id === where.id)) || null;
  },
  upsert({ where, update, create }: { where: { pageRoute: string }; update: any; create: any }) {
    const store = getJsonStore();
    const idx = store.sEOSettings.findIndex((s: any) => s.pageRoute === where.pageRoute);
    if (idx !== -1) {
      const updated = { ...store.sEOSettings[idx], ...update };
      store.sEOSettings[idx] = updated;
      saveJsonStore(store);
      return updated;
    } else {
      const newSeo = { ...create, id: `seo-${where.pageRoute.replace(/\//g, "-") || "home"}` };
      store.sEOSettings.push(newSeo);
      saveJsonStore(store);
      return newSeo;
    }
  },
};

// Helpers for Enquiries
export const jsonEnquiries = {
  findMany(options?: { where?: any; orderBy?: any }) {
    const store = getJsonStore();
    let list = [...store.enquiries];
    if (options?.where?.status) {
      list = list.filter((e) => e.status === options.where.status);
    }
    if (options?.where?.service) {
      list = list.filter((e) => e.service === options.where.service);
    }
    return list;
  },
  findUnique({ where }: { where: { id: string } }) {
    const store = getJsonStore();
    return store.enquiries.find((e: any) => e.id === where.id) || null;
  },
  create({ data }: { data: any }) {
    const store = getJsonStore();
    const id = data.id || `enq-${Date.now()}`;
    const newEnq = {
      ...data,
      id,
      status: data.status || "New",
      createdAt: new Date().toISOString(),
    };
    store.enquiries.unshift(newEnq);
    saveJsonStore(store);
    return newEnq;
  },
  update({ where, data }: { where: { id: string }; data: any }) {
    const store = getJsonStore();
    const idx = store.enquiries.findIndex((e: any) => e.id === where.id);
    if (idx !== -1) {
      const updated = { ...store.enquiries[idx], ...data };
      store.enquiries[idx] = updated;
      saveJsonStore(store);
      return updated;
    }
    return null;
  },
  delete({ where }: { where: { id: string } }) {
    const store = getJsonStore();
    store.enquiries = store.enquiries.filter((e: any) => e.id !== where.id);
    saveJsonStore(store);
    return { id: where.id };
  },
  count(options?: { where?: any }) {
    const store = getJsonStore();
    if (options?.where?.status) {
      return store.enquiries.filter((e: any) => e.status === options.where.status).length;
    }
    return store.enquiries.length;
  },
};

// Helpers for Admin
export const jsonAdmin = {
  findUnique({ where }: { where: { email?: string; id?: string } }) {
    const store = getJsonStore();
    if (where.email) {
      return store.admin.find((a: any) => a.email.toLowerCase() === where.email?.toLowerCase()) || null;
    }
    if (where.id) {
      return store.admin.find((a: any) => a.id === where.id) || null;
    }
    return null;
  },
  create({ data }: { data: any }) {
    const store = getJsonStore();
    const id = data.id || `adm-${Date.now()}`;
    const newAdmin = { ...data, id };
    store.admin.push(newAdmin);
    saveJsonStore(store);
    return newAdmin;
  },
  upsert({ where, update, create }: { where: { email: string }; update: any; create: any }) {
    const store = getJsonStore();
    const idx = store.admin.findIndex((a: any) => a.email.toLowerCase() === where.email.toLowerCase());
    if (idx !== -1) {
      const updated = { ...store.admin[idx], ...update };
      store.admin[idx] = updated;
      saveJsonStore(store);
      return updated;
    } else {
      const newAdmin = { ...create, id: `adm-${Date.now()}` };
      store.admin.push(newAdmin);
      saveJsonStore(store);
      return newAdmin;
    }
  },
};

// Helpers for ActivityLogs
export const jsonActivityLogs = {
  findMany(options?: { take?: number }) {
    const store = getJsonStore();
    let list = [...(store.activityLogs || [])];
    if (options?.take) {
      list = list.slice(0, options.take);
    }
    return list;
  },
  create({ data }: { data: any }) {
    const store = getJsonStore();
    const id = data.id || `log-${Date.now()}`;
    const newLog = {
      ...data,
      id,
      timestamp: new Date().toISOString(),
    };
    if (!store.activityLogs) store.activityLogs = [];
    store.activityLogs.unshift(newLog);
    if (store.activityLogs.length > 100) store.activityLogs = store.activityLogs.slice(0, 100);
    saveJsonStore(store);
    return newLog;
  },
};

