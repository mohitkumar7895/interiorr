const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const DATA_DIR = path.join(__dirname, '..', 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

const code = fs.readFileSync(path.join(__dirname, '..', 'lib', 'data', 'initialData.ts'), 'utf8');
const js = ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const m = { exports: {} };
const fn = new Function('module', 'exports', 'require', js.outputText);
fn(m, m.exports, require);

const {
  INITIAL_SERVICES,
  INITIAL_PROJECTS,
  INITIAL_GALLERY_CATEGORIES,
  INITIAL_GALLERY_ITEMS,
  INITIAL_TESTIMONIALS,
  INITIAL_BLOGS,
  INITIAL_SEO_SETTINGS,
  INITIAL_ENQUIRIES,
} = m.exports;

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

const store = {
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
    id: s.id || `seo-init-${idx + 1}`,
  })),
  enquiries: INITIAL_ENQUIRIES.map((e, idx) => ({
    ...e,
    id: e.id || `enq-init-${idx + 1}`,
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

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
console.log('Successfully written data/store.json with:');
console.log('-', store.services.length, 'services');
console.log('-', store.projects.length, 'projects');
console.log('-', store.gallery.length, 'gallery items');
console.log('-', store.blogs.length, 'blogs');
console.log('-', store.testimonials.length, 'testimonials');

