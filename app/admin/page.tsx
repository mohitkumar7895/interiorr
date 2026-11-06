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
  CheckCircle2
} from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  let stats = {
    totalEnquiries: 0,
    newEnquiries: 0,
    totalProjects: 0,
    totalServices: 0,
    totalGallery: 0,
    totalTestimonials: 0,
  };

  let recentEnquiries: any[] = [];
  let recentLogs: any[] = [];

  try {
    const [
      totalEnquiries,
      newEnquiries,
      totalProjects,
      totalServices,
      totalGallery,
      totalTestimonials,
      enquiriesList,
      activityList,
    ] = await Promise.all([
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

    stats = {
      totalEnquiries,
      newEnquiries,
      totalProjects,
      totalServices,
      totalGallery,
      totalTestimonials,
    };

    recentEnquiries = enquiriesList;
    recentLogs = activityList;
  } catch (err) {
    console.error("Dashboard metrics error:", err);
  }

  const kpis = [
    {
      label: "Total Enquiries",
      value: stats.totalEnquiries,
      badge: `${stats.newEnquiries} New`,
      icon: <MessageSquare size={20} className="text-brand-gold" />,
      href: "/admin/enquiries",
      highlight: stats.newEnquiries > 0,
    },
    {
      label: "Portfolio Projects",
      value: stats.totalProjects,
      badge: "Active",
      icon: <FolderGit2 size={20} className="text-brand-gold" />,
      href: "/admin/projects",
    },
    {
      label: "Services Offered",
      value: stats.totalServices,
      badge: "Published",
      icon: <Hammer size={20} className="text-brand-gold" />,
      href: "/admin/services",
    },
    {
      label: "Gallery Images",
      value: stats.totalGallery,
      badge: "HD Photos",
      icon: <ImageIcon size={20} className="text-brand-gold" />,
      href: "/admin/gallery",
    },
    {
      label: "Customer Reviews",
      value: stats.totalTestimonials,
      badge: "5-Star Rated",
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
            <span>MA Control Center</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Welcome to MA Carpenter & Interior Dashboard
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Monitor client leads, update website content, manage modular kitchen portfolios, and edit SEO parameters in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/enquiries"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-black text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-gold-sm transition-all"
          >
            Review Enquiries ({stats.newEnquiries})
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => (
          <Link
            key={idx}
            href={kpi.href}
            className={`p-5 rounded-2xl bg-brand-charcoal/90 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
              kpi.highlight
                ? "border-brand-gold shadow-gold-sm"
                : "border-brand-gold/20 hover:border-brand-gold/50"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20">
                {kpi.icon}
              </span>
              <span className="text-[10px] uppercase font-bold text-brand-gold px-2 py-0.5 rounded-full bg-brand-gold/10 border border-brand-gold/25">
                {kpi.badge}
              </span>
            </div>
            <span className="text-xs text-gray-400 block font-medium">
              {kpi.label}
            </span>
            <span className="font-serif font-black text-2xl sm:text-3xl text-white mt-1 block">
              {kpi.value}
            </span>
          </Link>
        ))}
      </div>

      {/* Two Column Section: Recent Enquiries & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Enquiries (8 Cols) */}
        <div className="lg:col-span-8 bg-brand-charcoal/80 border border-brand-gold/25 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-brand-gold/20 pb-4 mb-6">
            <div>
              <h2 className="font-serif text-lg font-bold text-white">
                Recent Customer Enquiries
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Latest quote requests submitted from the website.
              </p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-brand-gold hover:underline inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-400">
              No customer enquiries recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-brand-gold/15">
              {recentEnquiries.map((enq) => (
                <div key={enq.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {enq.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
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

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mt-1">
                      <span>{enq.phone}</span>
                      <span>•</span>
                      <span className="text-brand-gold font-medium">{enq.service}</span>
                      <span>•</span>
                      <span className="text-[11px] text-gray-500">
                        {new Date(enq.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 mt-1.5 line-clamp-1 italic">
                      &ldquo;{enq.message}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${enq.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-brand-surface hover:bg-brand-surface/80 border border-brand-gold/30 text-brand-gold text-xs font-semibold"
                    >
                      Call Client
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Shortcut Navigation (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-brand-charcoal/80 border border-brand-gold/25 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-serif text-base font-bold text-white border-b border-brand-gold/20 pb-3">
              Quick Content Management
            </h3>

            <div className="space-y-2">
              <Link
                href="/admin/content"
                className="flex items-center justify-between p-3 rounded-xl bg-brand-surface/70 hover:bg-brand-surface border border-brand-gold/15 text-xs text-white hover:text-brand-gold transition-colors"
              >
                <span>Edit Hero Title & Tagline</span>
                <ArrowRight size={14} className="text-brand-gold" />
              </Link>

              <Link
                href="/admin/services"
                className="flex items-center justify-between p-3 rounded-xl bg-brand-surface/70 hover:bg-brand-surface border border-brand-gold/15 text-xs text-white hover:text-brand-gold transition-colors"
              >
                <span>Manage 12 Services & Pricing</span>
                <ArrowRight size={14} className="text-brand-gold" />
              </Link>

              <Link
                href="/admin/projects"
                className="flex items-center justify-between p-3 rounded-xl bg-brand-surface/70 hover:bg-brand-surface border border-brand-gold/15 text-xs text-white hover:text-brand-gold transition-colors"
              >
                <span>Add / Edit Projects & Before/After</span>
                <ArrowRight size={14} className="text-brand-gold" />
              </Link>

              <Link
                href="/admin/seo"
                className="flex items-center justify-between p-3 rounded-xl bg-brand-surface/70 hover:bg-brand-surface border border-brand-gold/15 text-xs text-white hover:text-brand-gold transition-colors"
              >
                <span>Update Meta Titles & Keywords</span>
                <ArrowRight size={14} className="text-brand-gold" />
              </Link>

              <Link
                href="/admin/settings"
                className="flex items-center justify-between p-3 rounded-xl bg-brand-surface/70 hover:bg-brand-surface border border-brand-gold/15 text-xs text-white hover:text-brand-gold transition-colors"
              >
                <span>Phone, Email & Noida Address</span>
                <ArrowRight size={14} className="text-brand-gold" />
              </Link>
            </div>
          </div>

          {/* System Environment Status */}
          <div className="bg-brand-surface/50 border border-brand-gold/20 rounded-2xl p-4 text-xs space-y-2 text-gray-400">
            <div className="flex items-center justify-between">
              <span>Database Engine:</span>
              <span className="text-white font-semibold">MySQL / MariaDB</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Database Name:</span>
              <span className="text-brand-gold font-mono">interior</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Studio Address:</span>
              <span className="text-white font-medium">Shop No. 6, Sector 120, Noida</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

