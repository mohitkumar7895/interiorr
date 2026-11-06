import React from "react";
import db from "@/lib/db";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ServicesSection from "@/components/home/ServicesSection";
import FeaturedProjectsSection from "@/components/home/FeaturedProjectsSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import WorkingProcessSection from "@/components/home/WorkingProcessSection";
import HomeGallerySection from "@/components/home/HomeGallerySection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ConsultationSection from "@/components/home/ConsultationSection";
import LocationMapSection from "@/components/home/LocationMapSection";
import {
  INITIAL_SERVICES,
  INITIAL_PROJECTS,
  INITIAL_TESTIMONIALS,
} from "@/lib/data/initialData";

export const revalidate = 0; // Dynamic on every request to reflect Admin updates instantly

export default async function HomePage() {
  // Fetch SiteSettings
  let settings = null;
  let homeSections: any[] = [];
  let services: any[] = [];
  let projects: any[] = [];
  let galleryItems: any[] = [];
  let testimonials: any[] = [];

  try {
    settings = await db.siteSettings.findUnique({
      where: { id: "default" },
    });

    homeSections = await db.homeSections.findMany({
      orderBy: { orderIndex: "asc" },
    });

    services = await db.services.findMany({
      where: { isPublished: true },
      orderBy: { orderIndex: "asc" },
    });

    projects = await db.projects.findMany({
      where: { isPublished: true },
      orderBy: { orderIndex: "asc" },
      take: 6,
    });

    galleryItems = await db.gallery.findMany({
      where: { isFeatured: true },
      include: { category: true },
      orderBy: { orderIndex: "asc" },
      take: 9,
    });

    testimonials = await db.testimonials.findMany({
      where: { isPublished: true },
      orderBy: { orderIndex: "asc" },
    });
  } catch (error) {
    console.error("Database query fallback in HomePage:", error);
  }

  // Fallback to static initial dataset if db queries are empty
  const heroImages = settings?.heroImages
    ? JSON.parse(settings.heroImages)
    : [
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=85",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=85",
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1920&q=85",
      ];

  const displayServices =
    services.length > 0
      ? services
      : INITIAL_SERVICES.map((s, idx) => ({ ...s, id: `init-srv-${idx}` }));

  const displayProjects =
    projects.length > 0
      ? projects
      : INITIAL_PROJECTS.map((p, idx) => ({ ...p, id: `init-prj-${idx}` }));

  const displayTestimonials =
    testimonials.length > 0
      ? testimonials
      : INITIAL_TESTIMONIALS.map((t, idx) => ({ ...t, id: `init-test-${idx}` }));

  // Helper to check if section is enabled by admin
  const isSectionEnabled = (key: string) => {
    if (!homeSections || homeSections.length === 0) return true;
    const sec = homeSections.find((s) => s.sectionKey === key);
    return sec ? sec.isEnabled : true;
  };

  return (
    <div className="min-h-screen bg-brand-black text-brand-cream">
      <Navbar />

      <main>
        {/* 1. Hero Section */}
        {isSectionEnabled("hero") && (
          <HeroSection
            title={settings?.heroTitle || "Transform Your Home Into a Masterpiece"}
            subtitle={
              settings?.heroSubtitle ||
              "Discover premium interior design, modular kitchens, custom furniture, and complete home interior solutions with MA Carpenter and Interior."
            }
            ctaText={settings?.heroCtaText || "Explore Our Designs"}
            ctaLink={settings?.heroCtaLink || "/projects"}
            images={heroImages}
          />
        )}

        {/* 2. About Section */}
        {isSectionEnabled("about") && (
          <AboutSection
            title={settings?.aboutTitle}
            story={settings?.aboutStory}
            experienceYears={settings?.experienceYears || 12}
            projectsDone={settings?.projectsDone || 350}
            happyClients={settings?.happyClients || 320}
          />
        )}

        {/* 3. Services Section */}
        {isSectionEnabled("services") && (
          <ServicesSection services={displayServices} />
        )}

        {/* 4. Featured Projects Section */}
        {isSectionEnabled("projects") && (
          <FeaturedProjectsSection projects={displayProjects} />
        )}

        {/* 5. Why Choose Us Section */}
        {isSectionEnabled("whyUs") && <WhyChooseUsSection />}

        {/* 6. Working Process Section */}
        {isSectionEnabled("process") && <WorkingProcessSection />}

        {/* 7. Gallery Section */}
        {isSectionEnabled("gallery") && (
          <HomeGallerySection items={galleryItems} />
        )}

        {/* 8. Customer Testimonials Section */}
        {isSectionEnabled("testimonials") && (
          <TestimonialsSection testimonials={displayTestimonials} />
        )}

        {/* 9. Consultation & Free Estimate Form */}
        {isSectionEnabled("consultation") && <ConsultationSection />}

        {/* 10. Physical Location & Map */}
        <LocationMapSection />
      </main>

      <Footer />
    </div>
  );
}

