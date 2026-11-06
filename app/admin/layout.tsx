"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Hammer,
  FolderGit2,
  Image as ImageIcon,
  Quote,
  Search,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldAlert,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on the login page, render children directly without dashboard sidebar shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
    { label: "Enquiries", href: "/admin/enquiries", icon: <MessageSquare size={18} /> },
    { label: "Hero & Content", href: "/admin/content", icon: <FileText size={18} /> },
    { label: "Services", href: "/admin/services", icon: <Hammer size={18} /> },
    { label: "Projects", href: "/admin/projects", icon: <FolderGit2 size={18} /> },
    { label: "Gallery", href: "/admin/gallery", icon: <ImageIcon size={18} /> },
    { label: "Testimonials", href: "/admin/testimonials", icon: <Quote size={18} /> },
    { label: "SEO Management", href: "/admin/seo", icon: <Search size={18} /> },
    { label: "Business Settings", href: "/admin/settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-brand-black text-brand-cream flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-brand-charcoal border-r border-brand-gold/20 flex-shrink-0 justify-between">
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-brand-gold/20 flex items-center gap-3">
            <div className="w-10 h-10 relative flex-shrink-0">
              <Image
                src="/logo/ma-emblem.svg"
                alt="MA Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-serif font-black text-sm text-brand-gold block tracking-wider leading-none">
                MA CARPENTER
              </span>
              <span className="text-[10px] text-gray-400 tracking-widest uppercase">
                Admin Control
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-brand-surface text-brand-gold border border-brand-gold/40 shadow-sm"
                      : "text-gray-400 hover:text-white hover:bg-brand-surface/50"
                  }`}
                >
                  <span className={isActive ? "text-brand-gold" : "text-gray-400"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom: User & Logout */}
        <div className="p-4 border-t border-brand-gold/20 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between p-2.5 rounded-xl bg-brand-surface/60 hover:bg-brand-surface border border-brand-gold/20 text-xs text-brand-gold transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles size={14} />
              <span>Live Website</span>
            </span>
            <ExternalLink size={13} />
          </Link>

          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center font-bold text-brand-gold text-xs">
                M
              </div>
              <div className="text-left">
                <span className="text-xs font-semibold text-white block leading-none">
                  Monish Pasha
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">
                  Superadmin
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 bg-brand-charcoal/80 backdrop-blur-md border-b border-brand-gold/20 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-300 hover:text-brand-gold border border-brand-gold/20 rounded-lg lg:hidden"
            >
              <Menu size={20} />
            </button>

            <span className="font-serif font-bold text-sm sm:text-base text-white">
              {navItems.find((n) => n.href === pathname)?.label || "Control Panel"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-gold/30 text-brand-gold hover:bg-brand-surface text-xs font-semibold transition-colors"
            >
              <span>View Site</span>
              <ExternalLink size={12} />
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-brand-gold/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-gray-300 font-medium hidden sm:inline">
                MySQL Connected
              </span>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 lg:hidden flex">
            <div className="w-64 bg-brand-charcoal border-r border-brand-gold/30 h-full p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-brand-gold/20">
                  <span className="font-serif font-bold text-brand-gold text-sm">
                    MA Control
                  </span>
                  <button onClick={() => setSidebarOpen(false)} className="text-gray-400">
                    <X size={18} />
                  </button>
                </div>

                <nav className="mt-4 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                        pathname === item.href
                          ? "bg-brand-surface text-brand-gold border border-brand-gold/40"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs text-red-400 p-2 rounded-lg hover:bg-brand-surface"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
            <div className="flex-1" onClick={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* Page Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}

