# MA CARPENTER AND INTERIOR
### Premium Dynamic Interior Design & Carpenter Website

> **Designing Spaces, Defining Lifestyles**  
> Luxury Interior Architecture, Ergonomic Modular Kitchens, Turnkey Home Renovations & Master Handcrafted Furniture.

---

## 1. Project Overview & Brand Identity

**MA Carpenter and Interior** is a production-ready, dynamic luxury interior design and master carpentry web application. Designed and architected around the authentic black and golden brand aesthetic extracted directly from the reference branding card.

- **Business Name**: MA Carpenter and Interior
- **Brand Monogram**: MA
- **Tagline**: Designing Spaces, Defining Lifestyles
- **Phone**: `8714114418`
- **Email**: `Monishpasha233@gmail.com`
- **Studio & Workshop Address**: Shop No. 6, Sector 120, Noida, Uttar Pradesh - 201301
- **Color Palette**:
  - Primary: Luxury Deep Black (`#080808`)
  - Secondary: Premium Gold (`#D9A441`)
  - Accent: Champagne Gold (`#F5D58A`)
  - Background: Warm Cream & Charcoal Dark (`#F7F0E5`, `#161616`)
  - Text: Pure White, Soft Cream, and Warm Gray

---

## 2. Technology Stack

- **Framework**: Next.js 14 (App Router, Server Components & Server Actions)
- **Language**: TypeScript & Node.js
- **Styling**: Tailwind CSS with custom luxury gold gradients, shadows, and Cinzel/Playfair Display typography
- **Database**: MySQL / MariaDB (Database name: `interior`)
- **Database Driver**: Pure Native MySQL (`mysql2/promise`) with Connection Pooling & Relational Repositories (100% Prisma-free)
- **Authentication**: Secure bcrypt password hashing and HTTP-Only JWT session cookies
- **Validation**: Zod & React Hook Form
- **Icons**: Lucide React
- **Notifications**: Sonner Toast notifications
- **Excel/CSV Export**: Client lead spreadsheet generator

---

## 3. Database Architecture (`interior`)

The application is connected to MySQL using pure native MySQL (`mysql2/promise`) connection pooling with relational repositories:

1. `Admin`: Email, bcrypt-hashed password, name, role (`superadmin`, `editor`).
2. `SiteSettings`: Full website configuration (Hero title, subtitle, CTA, tagline, phone, email, address, logo, metrics).
3. `HomeSections`: Dynamic section visibility toggling and order indexes.
4. `Services`: 12 signature interior and carpentry services with features, benefits, HD image galleries, and SEO metadata.
5. `Projects`: Real portfolio case studies with before/after comparisons, client names, Noida locations, and area specs.
6. `ProjectImages`: Relational gallery images for individual projects.
7. `GalleryCategories` & `Gallery`: Categorized high-resolution masonry photography.
8. `Enquiries`: Client leads with workflow statuses (`New`, `Contacted`, `In Progress`, `Completed`, `Cancelled`) and internal notes.
9. `Testimonials`: Verified client reviews and star ratings.
10. `SEOSettings`: Dynamic meta titles, descriptions, keywords, and OpenGraph tags per page.
11. `ActivityLogs`: Security audit trail for admin actions.

---

## 4. Default Admin Credentials

- **Admin Login URL**: `/admin/login`
- **Admin Dashboard**: `/admin`
- **Email**: `admin@mainterior.com` *(or `Monishpasha233@gmail.com`)*
- **Password**: `admin123`

---

## 5. Getting Started & Installation

### Prerequisites
- Node.js v18+ (Node v20 or v24 recommended)
- MySQL / MariaDB running on port 3306 (via XAMPP, Docker, or native Windows service)

### 1. Configure Environment
Copy `.env.example` to `.env`:
```env
DATABASE_URL="mysql://root:@localhost:3306/interior"
JWT_SECRET="ma_carpenter_interior_secure_jwt_token_2026_prod"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_BUSINESS_NAME="MA Carpenter and Interior"
NEXT_PUBLIC_PHONE="8714114418"
NEXT_PUBLIC_WHATSAPP="8714114418"
NEXT_PUBLIC_EMAIL="Monishpasha233@gmail.com"
NEXT_PUBLIC_ADDRESS="Shop No. 6, Sector 120, Noida, Uttar Pradesh - 201301"
```

### 2. Push Database Schema & Seed Data
```bash
# Push schema into MySQL database 'interior'
npx prisma db push

# Populate initial admin, 12 services, portfolio projects, testimonials & SEO
node prisma/seed.js
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 6. Website Pages & Routes

- `/` — Homepage with Hero Slideshow, About Us, 12 Services, Featured Projects with Before/After toggles, Why Choose Us, 5-Step Working Process, Gallery, Testimonials, Free Consultation form, and Noida Google Map.
- `/about` — Complete Brand Heritage, Noida workshop overview, core principles, and metrics.
- `/services` — All 12 interior architecture and master carpentry services with category filtering.
- `/services/[slug]` — Individual service detail page with specifications, features, benefits, and quote form.
- `/projects` — Real portfolio showcase with Before & After comparisons and Noida location tags.
- `/projects/[slug]` — Deep project case study with image lightbox.
- `/gallery` — Masonry photography showcase with category tabs and full-screen lightbox preview.
- `/contact` — Contact page with inquiry submission form, WhatsApp trigger, and Google Map.
- `/sitemap.xml` & `/robots.txt` — Dynamic SEO endpoints.
- `/admin` — Full dynamic control panel to manage enquiries, content, services, projects, gallery, testimonials, and SEO.

---

&copy; 2026 MA Carpenter and Interior. All Rights Reserved.  
Shop No. 6, Sector 120, Noida, Uttar Pradesh - 201301.

