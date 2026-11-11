import React from "react";
import Link from "next/link";
import db from "@/lib/db";
import {
  MessageSquare,
  Sparkles,
  FolderGit2,
  Hammer,
  Image as ImageIcon,
  Quote,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Eye,
  CheckCircle2,
  BookOpen,
  Phone,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import {
  INITIAL_SERVICES,
  INITIAL_PROJECTS,
  INITIAL_GALLERY_ITEMS,
  INITIAL_TESTIMONIALS,
  INITIAL_BLOGS,
  INITIAL_ENQUIRIES,
  INITIAL_ACTIVITY_LOGS,
} from "@/lib/data/initialData";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  let stats = {
    totalEnquiries: INITIAL_ENQUIRIES.length,
    newEnquiries: INITIAL_ENQUIRIES.filter((e) => e.status === "New").length,
    totalProjects: INITIAL_PROJECTS.length,
    totalServices: INITIAL_SERVICES.length,
    totalGallery: INITIAL_GALLERY_ITEMS.length,
    totalTestimonials: INITIAL_TESTIMONIALS.length,
    totalBlogs: INITIAL_BLOGS.length,
  };

  let recentEnquiries: any[] = INITIAL_ENQUIRIES;
  let recentLogs: any[] = INITIAL_ACTIVITY_LOGS;

  try {
    const results = await Promise.allSettled([
      db.enquiries.count(),
      db.enquiries.count({ where: { status: "New" } }),
      db.projects.count(),
      db.services.count(),
      db.gallery.count(),
      db.testimonials.count(),
      db.enquiries.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      db.activityLogs.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    const [
      enquiriesCountRes,
      newEnquiriesRes,
      projectsCountRes,
      servicesCountRes,
      galleryCountRes,
      testimonialsCountRes,
      enquiriesListRes,
      activityListRes,
    ] = results;

    const dbTotalEnquiries = enquiriesCountRes.status === "fulfilled" ? enquiriesCountRes.value : 0;
    const dbNewEnquiries = newEnquiriesRes.status === "fulfilled" ? newEnquiriesRes.value : 0;
    const dbProjects = projectsCountRes.status === "fulfilled" ? projectsCountRes.value : 0;
    const dbServices = servicesCountRes.status === "fulfilled" ? servicesCountRes.value : 0;
    const dbGallery = galleryCountRes.status === "fulfilled" ? galleryCountRes.value : 0;
    const dbTestimonials = testimonialsCountRes.status === "fulfilled" ? testimonialsCountRes.value : 0;

    stats = {
      totalEnquiries: Math.max(dbTotalEnquiries, INITIAL_ENQUIRIES.length),
      newEnquiries: Math.max(dbNewEnquiries, INITIAL_ENQUIRIES.filter((e) => e.status === "New").length),
      totalProjects: Math.max(dbProjects, INITIAL_PROJECTS.length),
      totalServices: Math.max(dbServices, INITIAL_SERVICES.length),
      totalGallery: Math.max(dbGallery, INITIAL_GALLERY_ITEMS.length),
      totalTestimonials: Math.max(dbTestimonials, INITIAL_TESTIMONIALS.length),
      totalBlogs: INITIAL_BLOGS.length,
    };

    if (enquiriesListRes.status === "fulfilled" && enquiriesListRes.value && enquiriesListRes.value.length > 0) {
      recentEnquiries = enquiriesListRes.value;
    }

    if (activityListRes.status === "fulfilled" && activityListRes.value && activityListRes.value.length > 0) {
      recentLogs = activityListRes.value;
    }
  } catch (err) {
    console.error("Dashboard metrics check:", err);
  }

  const kpis = [
    {
      label: "Customer Enquiries",
      value: stats.totalEnquiries,
      badge: `${stats.newEnquiries} Action Required`,
      icon: <MessageSquare size={20} className="text-brand-gold" />,
      href: "/admin/enquiries",
      highlight: stats.newEnquiries > 0,
    },
    {
      label: "Portfolio Projects",
      value: stats.totalProjects,
      badge: "Before/After",
      icon: <FolderGit2 size={20} className="text-brand-gold" />,
      href: "/admin/projects",
    },
    {
      label: "Interior Services",
      value: stats.totalServices,
      badge: "12 Solutions",
      icon: <Hammer size={20} className="text-brand-gold" />,
      href: "/admin/services",
    },
    {
      label: "Gallery Photos",
      value: stats.totalGallery,
      badge: "HD Showcase",
      icon: <ImageIcon size={20} className="text-brand-gold" />,
      href: "/admin/gallery",
    },
    {
      label: "Design Journal",
      value: stats.totalBlogs,
      badge: "Published",
      icon: <BookOpen size={20} className="text-brand-gold" />,
      href: "/admin/blogs",
    },
    {
      label: "Client Reviews",
      value: stats.totalTestimonials,
      badge: "5.0 Rating",
      icon: <Quote size={20} className="text-brand-gold" />,
      href: "/admin/testimonials",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner Greeting */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-charcoal via-brand-surface to-brand-charcoal border border-brand-gold/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={12} />
            <span>MA Studio Command Center</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Welcome to MA Carpenter &amp; Interior
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
            Monitor homeowner consultation leads, manage modular kitchen portfolios, edit customer reviews, upload project imagery, and control website content in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/enquiries"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-goldDark text-brand-black text-xs font-bold uppercase tracking-wider shadow-gold-sm hover:shadow-gold-md hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <MessageSquare size={14} />
            <span>Review Leads ({stats.newEnquiries} New)</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid (6 Logical Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => (
          <Link
            key={idx}
            href={kpi.href}
            className={`p-5 rounded-2xl bg-brand-charcoal/90 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between ${
              kpi.highlight
                ? "border-brand-gold shadow-gold-sm bg-gradient-to-b from-brand-surface to-brand-charcoal"
                : "border-brand-gold/20 hover:border-brand-gold/50"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 flex-shrink-0">
                  {kpi.icon}
                </span>
                <span className="text-[9px] uppercase font-bold text-brand-gold px-2 py-0.5 rounded-full bg-brand-gold/10 border border-brand-gold/25 truncate max-w-[90px]">
                  {kpi.badge}
                </span>
              </div>
              <span className="text-xs text-gray-400 block font-medium">
                {kpi.label}
              </span>
            </div>

            <span className="font-serif font-black text-2xl sm:text-3xl text-white mt-2 block">
              {kpi.value}
            </span>
          </Link>
        ))}
      </div>

      {/* Two Column Section: Recent Leads & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Enquiries (8 Cols) */}
        <div className="lg:col-span-8 bg-brand-charcoal/80 border border-brand-gold/25 rounded-3xl p-6 sm:p-7 shadow-xl">
          <div className="flex items-center justify-between border-b border-brand-gold/20 pb-4 mb-6">
            <div>
              <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare size={18} className="text-brand-gold" />
                <span>Recent Homeowner Enquiries</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Direct site consultation requests from Sector 120 Noida and NCR residents.
              </p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-brand-gold hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <span>View All ({stats.totalEnquiries})</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-brand-gold/15">
            {recentEnquiries.map((enq) => (
              <div key={enq.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-white">
                      {enq.name}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        enq.status === "New"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : enq.status === "In Progress"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 mt-1">
                    <a href={`tel:${enq.phone}`} className="hover:text-brand-gold font-medium">
                      +91 {enq.phone}
                    </a>
                    <span>•</span>
                    <span className="text-brand-gold font-semibold">{enq.service}</span>
                    <span>•</span>
                    <span className="text-[11px] text-gray-500">
                      {new Date(enq.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 mt-1.5 line-clamp-1 italic">
                    &ldquo;{enq.message}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={`tel:${enq.phone}`}
                    className="px-3.5 py-2 rounded-xl bg-brand-surface hover:bg-brand-gold hover:text-brand-black border border-brand-gold/30 text-brand-gold text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                  >
                    <Phone size={12} />
                    <span>Call Client</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Shortcut Navigation (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-brand-charcoal/80 border border-brand-gold/25 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-serif text-base font-bold text-white border-b border-brand-gold/20 pb-3">
              Direct Management Tools
            </h3>

            <div className="space-y-2">
              <Link
                href="/admin/services"
                className="flex items-center justify-between p-3 rounded-xl bg-brand-surface/70 hover:bg-brand-surface border border-brand-gold/15 text-xs text-white hover:text-brand-gold transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Hammer size={15} className="text-brand-gold" />
                  <span>Manage 12 Services &amp; Pricing</span>
                </div>
                <ArrowRight size={14} className="text-brand-gold" />
              </Link>

              <Link
                href="/admin/projects"
                className="flex items-center justify-between p-3 rounded-xl bg-brand-surface/70 hover:bg-brand-surface border border-brand-gold/15 text-xs text-white hover:text-brand-gold transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FolderGit2 size={15} className="text-brand-gold" />
                  <span>7 Projects &amp; Before/After Photos</span>
                </div>
                <ArrowRight size={14} className="text-brand-gold" />
              </Link>

              <Link
                href="/admin/gallery"
                className="flex items-center justify-between p-3 rounded-xl bg-brand-surface/70 hover:bg-brand-surface border border-brand-gold/15 text-xs text-white hover:text-brand-gold transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ImageIcon size={15} className="text-brand-gold" />
                  <span>12 Gallery Images &amp; Upload</span>
                </div>
                <ArrowRight size={14} className="text-brand-gold" />
              </Link>

              <Link
                href="/admin/blogs"
                className="flex items-center justify-between p-3 rounded-xl bg-brand-surface/70 hover:bg-brand-surface border border-brand-gold/15 text-xs text-white hover:text-brand-gold transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen size={15} className="text-brand-gold" />
                  <span>Write &amp; Edit Blog Journal</span>
                </div>
                <ArrowRight size={14} className="text-brand-gold" />
              </Link>

              <Link
                href="/admin/seo"
                className="flex items-center justify-between p-3 rounded-xl bg-brand-surface/70 hover:bg-brand-surface border border-brand-gold/15 text-xs text-white hover:text-brand-gold transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp size={15} className="text-brand-gold" />
                  <span>Update Google SEO &amp; Meta Titles</span>
                </div>
                <ArrowRight size={14} className="text-brand-gold" />
              </Link>

              <Link
                href="/admin/settings"
                className="flex items-center justify-between p-3 rounded-xl bg-brand-surface/70 hover:bg-brand-surface border border-brand-gold/15 text-xs text-white hover:text-brand-gold transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={15} className="text-brand-gold" />
                  <span>Change Admin Password &amp; Phone</span>
                </div>
                <ArrowRight size={14} className="text-brand-gold" />
              </Link>
            </div>
          </div>

          {/* System & Studio Verification Status */}
          <div className="bg-brand-surface/60 border border-brand-gold/25 rounded-2xl p-4 text-xs space-y-2.5 text-gray-300">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">System Status:</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live &amp; Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Workshop &amp; Studio:</span>
              <span className="text-white font-medium">Shop No. 6, Sector 120, Noida</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Master Craftsman:</span>
              <span className="text-brand-gold font-semibold">Monish Pasha</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Contact Number:</span>
              <span className="text-white font-mono">+91 8714114418</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
